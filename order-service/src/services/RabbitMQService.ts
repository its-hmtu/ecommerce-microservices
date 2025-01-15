import amqp, { Channel, Connection } from "amqplib";
import config from "../config";
import { IOrder, Order, OrderStatus } from "../database";
import { ApiError } from "../utils";

class RabbitMQService {
  private orderCreateQueue = "ORDER_CREATED";
  private payemntUpdateQueue = "PAYMENT_UPDATE";
  private updateCartQueue = "CART_UPDATE";
  private productQueue = "PRODUCT_CREATED";
  paymentQueue = "PAYMENT";
  private connection!: Connection;
  private channel!: Channel;

  constructor() {
    this.init();
  }

  async init() {
    this.connection = await amqp.connect(config.msgBrokerUri!);
    this.channel = await this.connection.createChannel();
    await this.channel.assertQueue(this.orderCreateQueue);
    await this.channel.assertQueue(this.paymentQueue);
    await this.channel.assertQueue(this.payemntUpdateQueue);
    await this.channel.assertQueue(this.updateCartQueue);
    this.listenForPaymentRequests();
  }

  getChannel() {
    return this.channel;
  }

  async listenForPaymentRequests() {
    this.channel.consume(this.payemntUpdateQueue, async (msg) => {
      if (msg && msg.content) {
        const { orderId, userId, status, amount } = JSON.parse(msg.content.toString());
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

        if (status === "SUCCESS") {
          this.channel.sendToQueue(this.updateCartQueue, Buffer.from(JSON.stringify({ userId, orderId })))
          this.channel.sendToQueue(this.productQueue, Buffer.from(JSON.stringify({stock: amount})))
        } else {
          console.log("Payment failed for order: ", orderId );
        }

        this.channel.ack(msg);
      }
    });
  }
}

export const rabbitMQService = new RabbitMQService();
