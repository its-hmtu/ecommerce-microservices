import amqp, { Channel, Connection } from "amqplib";
import config from "../config";
import { IOrder, Order } from "../database";
import { ApiError } from "../utils";

class RabbitMQService {
  private orderCreateQueue = "ORDER_CREATED"
  private connection!: Connection;
  private channel!: Channel;

  constructor() {
    this.init();
  }

  async init() {
    this.connection = await amqp.connect(config.msgBrokerUri!);
    this.channel = await this.connection.createChannel();
    await this.channel.assertQueue(this.orderCreateQueue);
    // this.listenForRequests();
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
