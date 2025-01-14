import amqp, { Channel, Connection } from "amqplib";
import config from "../config";
import { IOrder, Order, OrderStatus } from "../database";
import { ApiError } from "../utils";

class RabbitMQService {
  private orderCreateQueue = "ORDER_CREATED";
  private payemntUpdateQueue = "PAYMENT_UPDATE";
  private connection!: Connection;
  private channel!: Channel;

  constructor() {
    this.init();
  }

  async init() {
    this.connection = await amqp.connect(config.msgBrokerUri!);
    this.channel = await this.connection.createChannel();
    await this.channel.assertQueue(this.orderCreateQueue);
    this.listenForPaymentRequests();
  }

  getChannel() {
    return this.channel;
  }

  async listenForPaymentRequests() {
    this.channel.consume(this.payemntUpdateQueue, async (msg) => {
      if (msg && msg.content) {
        const { orderId, status, amount } = JSON.parse(msg.content.toString());
        console.log("Received payment update: ", { orderId, status, amount });

        const order = await Order.findById(orderId);
        if (order) {
          order.status =
            status === "SUCCESS"
              ? OrderStatus.Completed
              : OrderStatus.Cancelled;
          await order.save();
          console.log(`Order ${orderId} updated successfully`);
        } else {
          console.error(`Order ${orderId} not found`);
        }

        this.channel.ack(msg);
      }
    });
  }
}

export const rabbitMQService = new RabbitMQService();
