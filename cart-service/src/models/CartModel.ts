import mongoose, { Schema, Document } from "mongoose";

export interface ICart extends Document {
  userId: string;
  items: {
    productId: string;
    quantity: number;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const CartSchema: Schema = new Schema({
  userId: {
    type: String,
    required: [true, "User ID must be provided"],
  },
  items: [
    {
      productId: {
        type: String,
        required: [true, "Product ID must be provided"],
      },
      quantity: {
        type: Number,
        required: [true, "Quantity must be provided"],
      },
    },
  ],
});

const Cart = mongoose.model<ICart>("Cart", CartSchema);
export default Cart;
