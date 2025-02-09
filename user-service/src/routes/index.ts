import { Router } from "express";
import AuthController from "../controllers/AuthController";
import { body } from "express-validator";
const userRouter = Router();
const validateRegister = [
  body('name').isString().notEmpty({
    ignore_whitespace: true,
    
  }),
  body('email').isEmail().notEmpty(),
  body('password').isString().notEmpty(),
]

const validateLogin = [
  body('email').isEmail().notEmpty(),
  body('password').isString().notEmpty(),
]

userRouter.post('/register', validateRegister, AuthController.register);
userRouter.post('/login', validateLogin, AuthController.login);
userRouter.get('/users/:id', AuthController.getUserDetails);
userRouter.post('/logout', AuthController.logout)
export default userRouter;