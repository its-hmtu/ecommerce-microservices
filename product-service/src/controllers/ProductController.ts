import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { IProduct, Product} from '../database';
import { ApiError } from "../utils"
import config from '../config';
import { rabbitMQService } from '../services/RabbitMQService';

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
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

const getSingleProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    res.status(200).json(product);
  } catch (error: any) {
    res.status(500).json({
      message: error.message
    })
  }
}

const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, price, stock, description, image } = req.body;

    const newProduct = new Product({
      name,
      price,
      stock,
      description,
      image,
    });

    await newProduct.save();
    await rabbitMQService.sendProductCreated(newProduct)

    res.status(201).json(newProduct);
  } catch (e: any) {
    res.status(500).json({ message: e.message });
  }
}

export default {
  getProducts,
  getSingleProduct,
  createProduct,
}