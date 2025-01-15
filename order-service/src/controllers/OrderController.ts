import express, { Request, Response } from "express";
import { IOrder, Order } from "../database";
import { ApiError } from "../utils";
import config from "../config";
import axios from "axios";
import { redisCacheService } from "../services/RedisCacheService";
import { rabbitMQService } from "../services/RabbitMQService";
import emailQueue from "../services/EmailQueue";

export const createOrder = async (req: Request, res: Response) => {
  const {cartId, userId, email, address, postal_code, cardNumber, expiryDate, cvv } = req.body;
  try {
    const channel = rabbitMQService.getChannel();
    channel.sendToQueue(
      "CART_GET_REQUEST",
      Buffer.from(JSON.stringify({ userId }))
    );

    const cartResponse = await new Promise((resolve) => {
      channel.consume("CART_GET_RESPONSE", (msg) => {
        if (msg && msg.content) {
          const cart = JSON.parse(msg.content.toString());
          resolve(cart);
          console.log("Cart received", cart);
          channel.ack(msg)
        }
      });
    });

    if (!cartResponse) {
      throw new ApiError(404, "Cart not found");
    }
   
    const cartItems = (cartResponse as any).items;

    const totalAmount = cartItems.reduce((acc: number, item: any) => {
      return acc + item.quantity * item.price;
    }, 0);

    const order = new Order({
      userId,
      items: cartItems.map((item: any) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      })),
      address,
      postal_code,
      totalAmount,
    });

    await order.save();

    // send payment request using api gateway
    const paymentData = {
      orderId: order._id,
      userId,
      email,
      amount: cartItems.reduce((acc: number, item: any) => {
        return acc + item.quantity;
      }, 0),
      cardNumber,
      expiryDate,
      cvv,
    };

    await axios.post("http://localhost:8080/api/payment", paymentData);

    const emailData = {
      to: email,
      subject: "Order Confirmation",
      text: `Your order has been placed successfully. Total amount: ${totalAmount}`,
      html: `<p>Your order has been placed successfully. Total amount: ${totalAmount}</p>`,
    };

    // channel.sendToQueue("EMAIL_QUEUE", Buffer.from(JSON.stringify(emailData)));
    await emailQueue.add(emailData);

    res.status(201).json(order);
  } catch (e: any) {
    console.error(e);
    res.status(500).json({ message: e.message });
  }
};

export const getOrders = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const orders = await Order.find({ userId });
    if (!orders || orders.length === 0) {
      throw new ApiError(404, "No orders found");
    }

    res.status(200).json(orders);
  } catch (e: any) {
    console.error(e);
    res.status(500).json({ message: e.message });
  }
};

export default {
  createOrder,
  getOrders,
};
