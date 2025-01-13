import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { IProduct, Product} from '../database';
import { ApiError, encryptPassword, isPasswordMatch} from "../utils"
import config from '../config';

const jwtSecret = config.JWT_SECRET as string;
const COOKIE_EXP = 90;
const experation = new Date(Date.now() + COOKIE_EXP * 24 * 60 * 60 * 1000);
const cookieOptions = {
  expires: experation,
  secure: false,
  httpOnly: true,
}

const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

export default {
  getProducts
}