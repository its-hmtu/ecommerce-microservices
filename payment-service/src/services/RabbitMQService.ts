import amqp, { Channel, Connection } from "amqplib";
import config from "../config";
import { IPayment, Payment, PaymentStatus } from "../database";
import { ApiError } from "../utils";
import { processPayment } from "./PaymentGateway";

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
    await this.channel.assertQueue(this.paymentUpdateQueue, { durable: true });
  }

  getChannel() {
    return this.channel;
  }

  // async listenForPaymentRequests() {
  //   this.channel.consume(this.paymentQueue, async (msg) => {
  //     if (msg && msg.content) {
  //       // send request to payment controller
  //       const { orderId, userId, email, amount, cardNumber, expiryDate, cvv } =
  //         JSON.parse(msg.content.toString());
  //       console.log("Received payment request: ", {
  //         orderId,
  //         userId,
  //         email,
  //         amount,
  //       });

  //       // create payment
  //       const payment = new Payment({
  //         orderId,
  //         userId,
  //         amount,
  //       });

  //       await payment.save();

  //       const paymentResult = await processPayment({
  //         cardNumber,
  //         expiryDate,
  //         cvv,
  //         amount,
  //       });

  //       if (paymentResult) {
  //         payment.status = PaymentStatus.SUCCESS;
  //         await payment.save();

  //         this.channel.sendToQueue(
  //           rabbitMQService.paymentUpdateQueue,
  //           Buffer.from(
  //             JSON.stringify({
  //               orderId,
  //               status: payment.status,
  //               amount: payment.amount,
  //             })
  //           )
  //         );
  //         const emailData = {
  //           to: email,
  //           subject: "Thank you for your order",
  //           text: `Your payment for order ${orderId} was successful`,
  //           html: `<p>Your payment for order ${orderId} was successful</p>`,
  //         };

  //         this.channel.sendToQueue(
  //           "EMAIL_QUEUE",
  //           Buffer.from(JSON.stringify(emailData))
  //         );
  //       } else {
  //         payment.status = PaymentStatus.FAILED;
  //         await payment.save();

  //         this.channel.sendToQueue(
  //           rabbitMQService.paymentUpdateQueue,
  //           Buffer.from(
  //             JSON.stringify({
  //               orderId,
  //               status: payment.status,
  //               amount: payment.amount,
  //             })
  //           )
  //         );
  //       }
  //       // process payment
  //       // send email to user

  //       this.channel.ack(msg);
  //     }
  //   });
  // }
}

export const rabbitMQService = new RabbitMQService();
