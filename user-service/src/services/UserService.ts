import { Response } from "express";
import { User, IUser } from "../database";
import jwt from "jsonwebtoken";
import config from "../config";

class UserService {
  jwtSecret = config.JWT_SECRET as string;
  COOKIE_EXP = 90;
  experation = new Date(Date.now() + this.COOKIE_EXP * 24 * 60 * 60 * 1000);
  cookieOptions = {
    expires: this.experation,
    secure: false,
    httpOnly: false,
  };

  async createUser(user: IUser): Promise<IUser> {
    return User.create(user);
  }

  async getUserById(id: string): Promise<IUser | null> {
    return User.findById(id).select("-password");
  }

  async getUserByEmail(
    email: string,
    options?: {
      selectPassword?: boolean;
    }
  ): Promise<IUser | null> {
    return User.findOne({ email }).select(
      options?.selectPassword ? "+password" : "-password"
    );
  }

  async createToken(user: IUser, res: Response) {
    const { name } = user;

    console.log(name);

    const token = jwt.sign({ name }, this.jwtSecret, {
      expiresIn: "1d",
    });

    if (config.env === "production") this.cookieOptions.secure = true;
    res.cookie("jwt", token, this.cookieOptions);

    return token;
  }
}

export default new UserService();
