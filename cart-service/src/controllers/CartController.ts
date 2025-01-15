import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { ICart, Cart} from '../database';
import { ApiError } from "../utils"
import config from '../config';
// import { rabbitMQService } from '../services/RabbitMQService';
import { redisCacheService } from '../services/RedisCacheService';

const getCart = async (req: Request, res: Response) => {
  const {userId} = req.params;

  try {
    // await redisCacheService.clearCache(userId as string);
    const cacheCart = await redisCacheService.getCache(userId as string);
    if (cacheCart) {
      res.status(200).json(cacheCart);
      return;
    }

    const cart = await Cart.findOne({userId})
    if (!cart) {
      throw new ApiError(404, "Cart not found");
    }

    await redisCacheService.setCache(userId as string, cart);
    res.status(200).json({
      cart,
      totalItems: cart.items.reduce((acc, item) => acc + item.quantity, 0)
    });
  } catch (e: any) {
    res.status(500).json({message: e.message});
  }
}

const updateCart = async (req: Request, res: Response) => {
  const { productId, userId, quantity, price, name, image } = req.body;

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
        name,
        image,
        quantity,
        price
      })
    }

    await cart.save();

    await redisCacheService.clearCache(userId as string) ;

    res.status(200).json(cart);
  } catch (e: any) {
    res.status(500).json({message: e.message});
  }
}

const emptyCart = async (req: Request, res: Response) => { 
  const { userId } = req.params;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      throw new ApiError(404, "Cart not found");
    }

    cart.items = [];

    await cart.save();

    await redisCacheService.clearCache(userId as string) ;

    res.status(200).json(cart);

  } catch (e: any) {
    res.status(500).json({message: e.message});
  }
}

export default {
  getCart,
  updateCart,
  emptyCart
}
