import { Router } from "express";
import AuthController from "../controllers/AuthController";

const userRouter = Router();

userRouter.get("/", (req, res) => {
  res.status(200).json({message: "User service is running"});
})
userRouter.post('/register', AuthController.register);
userRouter.post('/login', AuthController.login);

export default userRouter;