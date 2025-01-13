import amqp, { Channel, Connection } from "amqplib";
import config from "../config";
import { emailService } from "./EmailService";

class RabbitMQService {
  private emailQueue = "EMAIL_QUEUE";
  private connection!: Connection;
  private channel!: Channel;

  constructor() {
    this.init();
  }

  async init() {
    this.connection = await amqp.connect(config.msgBrokerUri!);
    this.channel = await this.connection.createChannel();

    await this.channel.assertQueue(this.emailQueue);
    this.listenForRequests();
  }

  private async listenForRequests() {
    this.channel.consume(this.emailQueue, async (msg) => {
      if (msg && msg.content) {
        const { to, subject, text, html} = JSON.parse(msg.content.toString());
        console.log("Received email request: ", { to, subject });
        await emailService.sendEmail(to, subject, text, html);

        this.channel.ack(msg);
      }
    })
  }

  getChannel() {
    if (!this.channel) {
      throw new Error("RabbitMQ channel not initialized");
    }

    return this.channel;
  }
}

export const rabbitMQService = new RabbitMQService();