import amqp, { Channel, Connection } from "amqplib";
import config from "../config";
import { IPayment, Payment } from "../database";
import { ApiError } from "../utils";

class RabbitMQService {
  private paymentQueue = "PAYMENT";
  paymentUpdateQueue = "PAYMENT_UPDATE";
  emailQueue = "EMAIL_QUEUE";
  private connection!: Connection;
  private channel!: Channel;

  constructor() {
    this.init();
  }

  async init() {
    this.connection = await amqp.connect(config.msgBrokerUri!);
    this.channel = await this.connection.createChannel();
    await this.channel.assertQueue(this.paymentUpdateQueue, { durable: true});
  }

  getChannel() {
    return this.channel;
  }
}

export const rabbitMQService = new RabbitMQService();
