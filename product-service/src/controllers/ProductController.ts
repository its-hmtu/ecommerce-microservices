import express, { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { IProduct, Product} from '../database';
import { ApiError } from "../utils"
import config from '../config';
import { rabbitMQService } from '../services/RabbitMQService';
import ProductService from '../services/ProductService';
import RedisService from '../services/RedisService';

const productsCacheKey = 'products';
const singleProductCacheKey = 'product';

const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cacheProducts = await RedisService.getCache(productsCacheKey);
    if (cacheProducts) {
      console.log('Cache hit');
      res.status(200).json(cacheProducts);
      return;
    }

    const products = await ProductService.getProducts();

    await RedisService.setCache(productsCacheKey, products, 3600);

    res.status(200).json(products);
  } catch (error: any) {
    next(new ApiError(500, error.message))
  }
}

const getSingleProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const cacheProduct = await RedisService.getCache(`${singleProductCacheKey}:${id}`);
    if (cacheProduct) {
      console.log('Cache hit');
      res.status(200).json(cacheProduct);
      return;
    }

    const product = await ProductService.getProductById(id)
    if (!product) {
      next(new ApiError(404, "Product not found"));
      return;
    }

    await RedisService.setCache(`${singleProductCacheKey}:${id}`, product, 3600);

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
    await RedisService.clearCache(productsCacheKey)
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