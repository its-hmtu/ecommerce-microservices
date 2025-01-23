import amqp, { Channel, Connection } from "amqplib";
import config from "../config";
import { IProduct, Product } from "../database";
import { ApiError } from "../utils";
import ProductService from "./ProductService";

class RabbitMQService {
  private productDetailsRequest = "PRODUCT_DETAILS_REQUEST";
  private productDetailsResponse = "PRODUCT_DETAILS_RESPONSE";
  private connection!: Connection;
  private channel!: Channel;

  constructor() {
    this.init();
  }

  async init() {
    this.connection = await amqp.connect(config.msgBrokerUri!);
    this.channel = await this.connection.createChannel();
    await this.channel.assertQueue(this.productDetailsRequest, {
      durable: true,
    });
    await this.channel.assertQueue(this.productDetailsResponse, {
      durable: true,
    });

    this.listenForRequests();
  }

  async listenForRequests() {
    this.channel.consume(this.productDetailsRequest, async (msg) => {
      if (msg && msg.content) {
        const { productId } = JSON.parse(msg.content.toString());
        const productDetails = await ProductService.getProductById(productId);

        this.channel.sendToQueue(
          this.productDetailsResponse,
          Buffer.from(JSON.stringify(productDetails)),
          {
            correlationId: msg.properties.correlationId,
          }
        );

        this.channel.ack(msg);
        console.log("Product details sent to response queue")
      }
    });
  }
}

export const rabbitMQService = new RabbitMQService();
