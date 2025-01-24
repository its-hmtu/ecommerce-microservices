import { Order, IOrder } from "../database";

class OrderSerivce {
  /**
   * Create an order
   * @param {IOrder} order - Order object
   * @returns {IOrder} - The created order
   */

  async createOrder(order: IOrder): Promise<IOrder> {
    return Order.create(order)
  }

  /**
   * Get all orders for a user
   * @param {string} userId - The user id
   * @returns {IOrder[]} - The orders
   */

  async getOrders(userId: string): Promise<IOrder[]> {
    return Order.find({ userId });
  }
}

export default new OrderSerivce();