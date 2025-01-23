import express, { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { IProduct, Product} from '../database';
import { ApiError } from "../utils"
import config from '../config';
import { rabbitMQService } from '../services/RabbitMQService';
import ProductService from '../services/ProductService';

const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await ProductService.getProducts();
    res.status(200).json(products);
  } catch (error: any) {
    next(new ApiError(500, error.message))
  }
}

const getSingleProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const product = await ProductService.getProductById(id)
    if (!product) {
      next(new ApiError(404, "Product not found"));
      return;
    }

    res.status(200).json(product);
  } catch (error: any) {
    next(new ApiError(500, error.message as string))
  }
}

const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, price, stock, description, image } = req.body;

    const newProduct = new Product({
      name,
      price,
      stock,
      description,
      image,
    });

    await ProductService.createProduct(newProduct);

    res.status(201).json(newProduct);
  } catch (e: any) {
    next(new ApiError(500, e.message))
  }
}

export default {
  getProducts,
  getSingleProduct,
  createProduct,
}