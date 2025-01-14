import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { IPayment, Payment, PaymentStatus } from "../database";
import { ApiError } from "../utils";
import config from "../config";
import { rabbitMQService } from "../services/RabbitMQService";
import { processPayment } from "../services/PaymentGateway";

const createPayment = async (req: Request, res: Response) => {
  const { orderId, userId, email, amount, cardNumber, expiryDate, cvv } = req.body;

  try {
    const payment = new Payment({
      orderId,
      userId,
      amount,
    });

    await payment.save();

    const paymentResult = await processPayment({
      cardNumber,
      expiryDate,
      cvv,
      amount,
    });

    if (paymentResult) {
      payment.status = PaymentStatus.SUCCESS;
      await payment.save();

      const channel = rabbitMQService.getChannel();
      channel.sendToQueue(
        rabbitMQService.paymentUpdateQueue,
        Buffer.from(
          JSON.stringify({
            orderId,
            status: payment.status,
            amount: payment.amount,
          })
        )
      );
      const emailData = {
        to: email,
        subject: "Thank you for your order",
        text: `Your payment for order ${orderId} was successful`,
        html: `<p>Your payment for order ${orderId} was successful</p>`,
      };
  
      channel.sendToQueue("EMAIL_QUEUE", Buffer.from(JSON.stringify(emailData)));
      res.status(201).json({ message: "Payment created" });
    } else {
      payment.status = PaymentStatus.FAILED;
      await payment.save();
      res.status(400).json({ message: "Payment failed" });
    }
    // send email to user
  } catch (e: any) {
    console.error("Error creating payment: ", e);
    res.status(500).json({ message: "Error creating payment" });
  }
};

export default {
  createPayment,
};
