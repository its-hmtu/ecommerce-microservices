import express, { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { IUser, User } from "../database";
import { ApiError, encryptPassword, isPasswordMatch } from "../utils";
import config from "../config";
import { validationResult } from "express-validator";
import UserService from "../services/UserService";
import RedisService from "../services/RedisService";

const userCacheKey = "user";

const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password } = req.body;

    if (!validationResult(req).isEmpty()) {
      next(new ApiError(400, "Invalid input"));
      return;
    }

    const userExist = await UserService.getUserByEmail(email, {
      selectPassword: false,
    });
    if (userExist) {
      next(new ApiError(400, "User already exists!"));
      return;
    }

    const user = new User({
      name,
      email,
      password: await encryptPassword(password),
    });

    await UserService.createUser(user);

    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
    };

    res.status(201).json({
      message: "User registered successfully",
      data: userData,
    });
  } catch (e: any) {
    next(new ApiError(500, e.message));
  }
};

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    if (!validationResult(req).isEmpty()) {
      next(new ApiError(400, "Invalid input"));
      return;
    }

    const user = await UserService.getUserByEmail(email, {
      selectPassword: true,
    });

    console.log(user);
    if (!user || !(await user.isPasswordMatch(password))) {
      // throw new ApiError(400, 'Invalid credentials');
      next(new ApiError(400, "Invalid credentials"));
      return;
    }

    const token = await UserService.createToken(user, res);

    await RedisService.setCache(`${userCacheKey}:${user._id}`, user, 3600);

    res.status(200).json({
      message: "User logged in successfully",
      token,
      user: {
        id: user?._id,
        name: user?.name,
        email: user?.email,
      },
    });
  } catch (e: any) {
    next(new ApiError(500, e.message));
  }
};

const getUserDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const cacheUser = await RedisService.getCache(`${userCacheKey}:${id}`);
    if (cacheUser) {
      console.log("Cache hit");
      res.status(200).json({
        message: "User details",
        user: cacheUser,
      });
      return;
    }

    const user = await UserService.getUserById(id);

    if (!user) {
      next(new ApiError(404, "User not found"));
      return;
    }

    res.status(200).json({
      message: "User details",
      user,
    });
  } catch (e: any) {
    next(new ApiError(500, e.message));
  }
};

const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await RedisService.clearCache(`${userCacheKey}:${id}`);

    // clear cookie
    res.clearCookie("jwt");

    res.status(200).json({
      message: "User logged out successfully",
    });
  } catch (e: any) {
    next(new ApiError(500, e.message));
  }
}

export default {
  register,
  login,
  getUserDetails,
  logout,
};
