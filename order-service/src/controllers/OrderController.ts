import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { IOrder, Order } from "../database";
import { ApiError } from "../utils";
import config from "../config";
// import { rabbitMQService } from '../services/RabbitMQService';
import axios from "axios";
import { redisCacheService } from "../services/RedisCacheService";
import { rabbitMQService } from "../services/RabbitMQService";
import { resolve } from "path";

const jwtSecret = config.JWT_SECRET as string;
const COOKIE_EXP = 90;
const experation = new Date(Date.now() + COOKIE_EXP * 24 * 60 * 60 * 1000);
const cookieOptions = {
  expires: experation,
  secure: false,
  httpOnly: true,
};

export const createOrder = async (req: Request, res: Response) => {
  const { userId, email } = req.body;
  console.log("userId", userId);

  try {
    const channel = rabbitMQService.getChannel();
    channel.sendToQueue(
      "CART_GET_REQUEST",
      Buffer.from(JSON.stringify({ userId }))
    );
    await channel.assertQueue("CART_GET_REQUEST", { durable: true });
    await channel.assertQueue("CART_GET_RESPONSE", { durable: true });

    const cartResponse = await new Promise((resolve) => {
      channel.consume("CART_GET_RESPONSE", (msg) => {
        if (msg && msg.content) {
          const cart = JSON.parse(msg.content.toString());
          resolve(cart);
          console.log("Cart received", cart);
          channel.ack(msg)
        }
      }, {
        noAck: false
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
      totalAmount,
    });

    await order.save();

    const emailData = {
      to: email,
      subject: "Order Confirmation",
      text: `Your order has been placed successfully. Total amount: ${totalAmount}`,
      html: `<p>Your order has been placed successfully. Total amount: ${totalAmount}</p>`,
    };

    channel.sendToQueue("EMAIL_QUEUE", Buffer.from(JSON.stringify(emailData)));

    res.status(201).json(order);
  } catch (e: any) {
    console.error(e);
    res.status(500).json({ message: e.message });
  }
};

export const getOrders = async (req: Request, res: Response) => {
  const { userId } = req.query;

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
