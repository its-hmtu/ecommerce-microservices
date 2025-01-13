import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { ICart, Cart} from '../database';
import { ApiError } from "../utils"
import config from '../config';
// import { rabbitMQService } from '../services/RabbitMQService';
import { redisCacheService } from '../services/RedisCacheService';

const jwtSecret = config.JWT_SECRET as string;
const COOKIE_EXP = 90;
const experation = new Date(Date.now() + COOKIE_EXP * 24 * 60 * 60 * 1000);
const cookieOptions = {
  expires: experation,
  secure: false,
  httpOnly: true,
}

const getCart = async (req: Request, res: Response) => {
  const userId = req.params.userId;

  try {
    const cacheCart = await redisCacheService.getCache(userId);
    if (cacheCart) {
      res.status(200).json(cacheCart);

    }

    const cart = await Cart.findOne({userId})
    if (!cart) {
      throw new ApiError(404, "Cart not found");
    }

    await redisCacheService.setCache(userId, cart);
    res.status(200).json(cart);
  } catch (e: any) {
    res.status(500).json({message: e.message});
  }
}

const updateCart = async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const { productId, quantity } = req.body;

  try {
    let cart = await Cart.findOne({
      userId
    })

    if (!cart) {
      cart = new Cart({
        userId,
        items: []
      })
    }

    const existingItem = cart.items.find(item => item.productId === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        productId,
        quantity
      })
    }

    await cart.save();

    await redisCacheService.clearCache(userId);

    res.status(200).json(cart);
  } catch (e: any) {
    res.status(500).json({message: e.message});
  }
}

export default {
  getCart,
  updateCart,
}
