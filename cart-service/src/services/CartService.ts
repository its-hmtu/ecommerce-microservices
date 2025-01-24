import { Cart, ICart } from "../database";

class CartService {
  /**
   * Create a cart
   * @param {ICart} cart - Cart object
   * @returns {ICart} - The created cart
   */
  async createCart(cart: ICart): Promise<ICart> {
    return Cart.create(cart);
  }

  /**
   * Get user cart
   * @param {string} userId - The user id
   * @returns {ICart | null} - The user cart or null
   */
  async getUserCart(userId: string): Promise<ICart | null> {
    return Cart.findOne({ userId });
  }

  /**
   * Update user cart
   * @param {string} userId - The user id
   * @param {ICart} cart - The updated cart
   * @returns {ICart | null} - The updated cart or null
   */
  async updateUserCart(userId: string, cart: ICart): Promise<ICart | null> {
    return Cart.findOneAndUpdate({ userId }, cart, { new: true });
  }

  /**
   * Clear user cart
   * @param {string} userId - The user id
   * @returns {void}
   */
  async clearUserCart(userId: string): Promise<void> {
    await Cart.deleteOne({ userId });
  }
}

export default new CartService();