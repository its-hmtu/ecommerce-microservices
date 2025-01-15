import mongoose, { Schema, Document } from "mongoose";

export interface ICart extends Document {
  userId: string;
  items: {
    productId: string;
    name: string;
    image: string;
    quantity: number;
    price: number;
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
        type: String
      },
      name: {
        type: String
      },
      image: {
        type: String
      },
      quantity: {
        type: Number
      },
      price: {
        type: Number
      },
    },
  ],
});

const Cart = mongoose.model<ICart>("Cart", CartSchema);
export default Cart;
