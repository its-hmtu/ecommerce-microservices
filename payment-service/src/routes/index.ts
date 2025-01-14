import { Router } from "express"
import { authMiddleware } from "../middlewares"
import PaymentController from "../controllers/PaymentController"
const paymentRouter = Router();

paymentRouter.post("/", authMiddleware, PaymentController.createPayment)

export default paymentRouter;