import { Product, IProduct } from "../database";

class ProductService {
  async createProduct(product: IProduct): Promise<IProduct> {
    return Product.create(product);
  }

  async getProducts(): Promise<IProduct[]> {
    return Product.find();
  }

  async getProductById(id: string): Promise<IProduct | null> {
    return Product.findById(id);
  }
}

export default new ProductService();
