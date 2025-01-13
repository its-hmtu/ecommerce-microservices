import { Router } from "express"
import { authMiddleware } from "../middlewares"
import ProductController from "../controllers/ProductController"

const productRouter = Router();

productRouter.get('/', ProductController.getProducts);
productRouter.get('/:id', ProductController.getSingleProduct);
productRouter.post('/', authMiddleware, ProductController.createProduct);


export default productRouter;