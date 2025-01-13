import amqp, { Channel, Connection } from "amqplib";
import config from "../config";
import { ICart, Cart } from "../database";
import { ApiError } from "../utils";

class RabbitMQService {
  private cartQueue = "CART_UPDATED";
  private connection!: Connection;
  private channel!: Channel;

  constructor() {
    this.init();
  }

  async init() {
    this.connection = await amqp.connect(config.msgBrokerUri!);
    this.channel = await this.connection.createChannel();
    await this.channel.assertQueue(this.cartQueue, { durable: true });
    // this.listenForRequests();
  }

  async sendCartUpdated(cart: ICart) {
    const message = JSON.stringify(cart);
    this.channel.sendToQueue(this.cartQueue, Buffer.from(message));
    console.log("Cart updated message sent", message);
  }

  // async listenForRequests() {
  //   this.channel.consume(this.cartQueue, async (msg) => {
  //     if (msg && msg.content) {
  //       const cartData = JSON.parse(msg.content.toString());
  //       console.log("Cart updated message received", cartData);

  //       // await Product.findByIdAndUpdate(productData._id, productData);

  //       this.channel.ack(msg)
  //     }
  //   }) 
  // }
}

export const rabbitMQService = new RabbitMQService();
