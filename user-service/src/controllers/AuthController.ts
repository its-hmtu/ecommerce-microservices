import express, { NextFunction, Request, Response } from 'express';
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

const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {name, email, password} = req.body;
    const userExist = await User.findOne({email})
    if (userExist) {
      next(new ApiError(400, 'User already exists!'))
      return;
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

    res.status(201).json({
      message: "User registered successfully",
      data: userData
    })
  } catch (e: any) {
    next(new ApiError(500, e.message));
  }
}

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({email}).select("-password")
    if (!user || !await isPasswordMatch(password, user.password)) {
      // throw new ApiError(400, 'Invalid credentials');
      next(new ApiError(400, 'Invalid credentials'));
      return;
    }

    const token = await createSendToken(user!, res);

    res.status(200).json({
      message: "User logged in successfully",
      token,
      user,
    })
  } catch (e: any) {
    next(new ApiError(500, e.message));
  }
}

const getUserDetails = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("-password -__v");

    if (!user) {
      next(new ApiError(404, 'User not found'));
      return;
    }

    res.status(200).json({
      message: "User details",
      user,
    })

  } catch (e: any) {
    next(new ApiError(500, e.message));
  }
}

export default {
  register,
  login,
  getUserDetails,
}