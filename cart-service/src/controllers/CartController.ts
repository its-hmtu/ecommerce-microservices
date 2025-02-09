import express, { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { ICart, Cart } from "../database";
import { ApiError } from "../utils";
import config from "../config";
import RedisService from "../services/RedisService";
import CartService from "../services/CartService";

const cartCacheKey = "cart";

const getCart = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;
  // await RedisService.clearCache(`${cartCacheKey}:${userId}`);
  try {
    // const cacheCart = await RedisService.getCache(`${cartCacheKey}:${userId}`);
    // if (cacheCart) {
    //   res.status(200).json(cacheCart);
    //   return;
    // }

    const cart = await CartService.getUserCart(userId);
    if (!cart) {
      next(new ApiError(404, "Cart not found"));
    }
    const totalItems = cart!.items.reduce(
      (acc, item) => acc + item.quantity,
      0
    );
    // await RedisService.setCache(
    //   `${cartCacheKey}:${userId}`,
    //   {
    //     cart,
    //     totalItems,
    //   },
    //   3600
    // );
    res.status(200).json({
      cart,
      totalItems,
    });
  } catch (e: any) {
    res.status(500).json({ message: e.message });
  }
};

const updateCart = async (req: Request, res: Response) => {
  const { cart } = req.body;
  const { userId } = req.params;
  console.log(cart)

  try {
    let userCart = await CartService.getUserCart(userId);

    if (!userCart) {
      userCart = new Cart({
        userId,
        items: [],
      });
    }
    userCart.items = cart;

    await CartService.updateUserCart(userId, userCart);

    res.status(200).json(userCart);
  } catch (e: any) {
    res.status(500).json({ message: e.message });
  }
};

const emptyCart = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;

  try {
    const cart = await CartService.getUserCart(userId);
    if (!cart) {
      next(new ApiError(404, "Cart not found"));
    }

    await CartService.updateUserCart(
      userId,
      new Cart({
        userId,
        items: [],
      })
    );

    // await RedisService.setCache(`${cartCacheKey}:${userId}`, cart, 3600);

    res.status(200).json(cart);
  } catch (e: any) {
    res.status(500).json({ message: e.message });
  }
};

export default {
  getCart,
  emptyCart,
  updateCart,
};
