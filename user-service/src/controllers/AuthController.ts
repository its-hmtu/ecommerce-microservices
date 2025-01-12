import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { IUser, User } from '../database';
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

const createSendToken = async (user: IUser, res: Response) => {
  const {name, email, id} = user;
  const token = jwt.sign({name, email, id}, jwtSecret, {
    expiresIn: '1d'
  })

  if (config.env === 'production') cookieOptions.secure = true;
  res.cookie('jwt', token, cookieOptions);

  return token;
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

    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
    }

    res.json({
      status: 200,
      message: "User registered successfully",
      data: userData
    })
  } catch (e: any) {
    res.json({
      status: 500,
      message: e.message
    })
  }
}

const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({email}).select("+password")
    if (!user || !await isPasswordMatch(password, user.password)) {
      throw new ApiError(400, 'Invalid credentials');
    }

    const token = await createSendToken(user!, res);

    res.json({
      status: 200,
      message: "User logged in successfully",
      token
    })
  } catch (e: any) {
    res.json({
      status: 500,
      message: e.message
    })
  }
}

export default {
  register,
  login
}