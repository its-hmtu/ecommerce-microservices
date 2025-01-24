import amqp, { Channel, Connection } from "amqplib";
import config from "../config";
import { ICart, Cart } from "../database";
import { ApiError } from "../utils";
import RedisService from "./RedisService";
class RabbitMQService {
  private cartGetRequestQueue = "CART_GET_REQUEST";
  private cartGetResponseQueue = "CART_GET_RESPONSE";
  private cartUpdateQueue = "CART_UPDATE";
  private connection!: Connection;
  private channel!: Channel;

  constructor() {
    this.init();
  }

  async init() {
    this.connection = await amqp.connect(config.msgBrokerUri!);
    this.channel = await this.connection.createChannel();
    await this.channel.assertQueue(this.cartGetRequestQueue, { durable: true });
    await this.channel.assertQueue(this.cartGetResponseQueue, { durable: true });
    await this.channel.assertQueue(this.cartUpdateQueue, { durable: true });
    this.listenForRequests();
    this.listenForUpdates();
  }

  async listenForRequests() {
    this.channel.consume(this.cartGetRequestQueue, async (msg) => {
      if (msg && msg.content) {
        const { userId } = JSON.parse(msg.content.toString());
        console.log("Received request for cart", userId);
        const cart = await Cart.findOne({ userId });
        const message = JSON.stringify(cart);
        this.channel.sendToQueue(this.cartGetResponseQueue, Buffer.from(message));

        console.log("Cart sent", message);
        this.channel.ack(msg);
      }
    }) 
  }

  async listenForUpdates() {
    this.channel.consume(this.cartUpdateQueue, async (msg) => {
      if (msg && msg.content) {
        const { orderId, userId } = JSON.parse(msg.content.toString());
        console.log("Received update for cart", orderId);
        const cart = await Cart.findOne({ userId });

        if (!cart) {
          throw new ApiError(404, "Cart not found");
        }

        cart.items = [];

        await cart.save();

        // await redisCacheService.clearCache(userId as string) ;
        
        const message = JSON.stringify(cart);
        this.channel.sendToQueue(this.cartGetResponseQueue, Buffer.from(message));

        console.log("Cart updated", message);
        this.channel.ack(msg);
      }
    }) 
  }
}

export const rabbitMQService = new RabbitMQService();
