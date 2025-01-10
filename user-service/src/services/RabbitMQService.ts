import amqp, { Channel, Connection } from "amqplib";
import config from "../config";
import { User } from "../database";
import { ApiError } from "../utils";

class RabbitMQService {
  private requestQueue = "USER_DETAILS_REQUEST";
  private responseQueue = "USER_DETAILS_RESPONSE";
  private connection!: Connection;
  private channel!: Channel;

  constructor() {
    this.init();
  }

  async init() {
    this.connection = await amqp.connect(config.msgBrokerUri!);
    this.channel = await this.connection.createChannel();

    await this.channel.assertQueue(this.requestQueue);
    await this.channel.assertQueue(this.responseQueue);

    this.listenForRequests();
  }

  private async listenForRequests() {
    this.channel.consume(this.requestQueue, async (msg) => {
      if (msg && msg.content) {
        const { userId } = JSON.parse(msg.content.toString());
        const userDetails = await getUserDetails(userId);

        this.channel.sendToQueue(
          this.requestQueue,
          Buffer.from(JSON.stringify(userDetails)),
          { correlationId: msg.properties.correlationId }
        );

        this.channel.ack(msg);
      }
    });
  }
}

const getUserDetails = async (userId: string) => {
  const userDetails = await User.findById(userId).select("-password");
  if (!userDetails) {
    throw new ApiError(404, "User not found!");
  }

  return userDetails;
};

export const rabbitMQService = new RabbitMQService();
