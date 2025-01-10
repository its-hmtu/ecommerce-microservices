import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../database';
import { ApiError, encryptPassword, isPasswordMatch} from "../utils"
import config from '../config';

const jwtSecret = config.JWT_SECRET;
const COOKIE_EXP = 1000 * 60 * 60 * 24 * 7; // 7 days
const experation = new Date(Date.now() + COOKIE_EXP * 24 * 60 * 60 * 1000);
const cookieOptions = {
  expires: experation,
  secure: false,
  httpOnly: true,
}

const register = async (req: Request, res: Response) => {
  try {
    const {name, email, password} = req.body;
    const userExist = await User.findOne({email})
    if (userExist) {
      throw new ApiError(400, 'User already exists!');
    }

    const user = await User.create({
      name,
      email,
      password: await encryptPassword(password)
    })

    // const 
  } catch (e) {
    
  }
}