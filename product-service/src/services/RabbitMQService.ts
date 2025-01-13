import amqp, { Channel, Connection } from "amqplib";
import config from "../config";
import { IProduct, Product } from "../database";
import { ApiError } from "../utils";

class RabbitMQService {
  private productQueue = "PRODUCT_CREATED";
  private connection!: Connection;
  private channel!: Channel;

  constructor() {
    this.init();
  }

  async init() {
    this.connection = await amqp.connect(config.msgBrokerUri!);
    this.channel = await this.connection.createChannel();
    await this.channel.assertQueue(this.productQueue, { durable: true});

    this.listenForRequests();
  }

  async sendProductCreated(product: IProduct) {
    const message = JSON.stringify(product);
    this.channel.sendToQueue(this.productQueue, Buffer.from(message));
    console.log("Product created message sent", message);
  }

  async listenForRequests() {
    this.channel.consume(this.productQueue, async (msg) => {
      if (msg && msg.content) {
        const productData = JSON.parse(msg.content.toString());
        console.log("Product created message received", productData);

        await Product.findByIdAndUpdate(productData._id, productData);

        this.channel.ack(msg)
      }
    }) 
  }
}

export const rabbitMQService = new RabbitMQService();
