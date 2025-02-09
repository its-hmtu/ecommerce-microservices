import amqp, { Channel, Connection } from "amqplib";
import config from "../config";
import { emailService } from "./EmailService";
import emailQueue from "./EmailQueue";

class RabbitMQService {
  private emailRequest = "EMAIL_REQUEST";
  private emailResponse = "EMAIL_RESPONSE";
  private connection!: Connection;
  private channel!: Channel;

  constructor() {
    this.init();
  }

  async init() {
    this.connection = await amqp.connect(config.msgBrokerUri!);
    this.channel = await this.connection.createChannel();

    await this.channel.assertQueue(this.emailRequest, { durable: true });
    await this.channel.assertQueue(this.emailResponse, { durable: true });
    this.listenForRequests();
  }

  private async listenForRequests() {
    this.channel.consume(this.emailRequest, async (msg) => {
      if (msg && msg.content) {
        const { to, subject, text } = JSON.parse(msg.content.toString());
        console.log("Received email request: ", { to, subject });

        await emailQueue.add({ to, subject, text});

        this.channel.sendToQueue(
          this.emailResponse,
          Buffer.from(
            JSON.stringify({
              message: `Email sent to ${to}`,
            })
          )
        );

        this.channel.ack(msg);
      }
    });
  }

  getChannel() {
    if (!this.channel) {
      throw new Error("RabbitMQ channel not initialized");
    }

    return this.channel;
  }
}

export const rabbitMQService = new RabbitMQService();
