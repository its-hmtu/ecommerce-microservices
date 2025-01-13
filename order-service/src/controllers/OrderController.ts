import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { IOrder, Order } from '../database';
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

export default {
  
}
