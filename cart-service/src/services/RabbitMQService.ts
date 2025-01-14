import amqp, { Channel, Connection } from "amqplib";
import config from "../config";
import { ICart, Cart } from "../database";
import { ApiError } from "../utils";

class RabbitMQService {
  private cartQueue = "CART_UPDATED";
  private cartGetRequestQueue = "CART_GET_REQUEST";
  private cartGetResponseQueue = "CART_GET_RESPONSE";
  private connection!: Connection;
  private channel!: Channel;

  constructor() {
    this.init();
  }

  async init() {
    this.connection = await amqp.connect(config.msgBrokerUri!);
    this.channel = await this.connection.createChannel();
    await this.channel.assertQueue(this.cartQueue, { durable: true });
    await this.channel.assertQueue(this.cartGetRequestQueue, { durable: true });
    await this.channel.assertQueue(this.cartGetResponseQueue, { durable: true });
    this.listenForRequests();
  }

  async sendCartUpdated(cart: ICart) {
    const message = JSON.stringify(cart);
    this.channel.sendToQueue(this.cartQueue, Buffer.from(message));
    console.log("Cart updated message sent", message);
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
}

export const rabbitMQService = new RabbitMQService();
