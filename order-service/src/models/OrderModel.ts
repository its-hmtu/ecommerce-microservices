import mongoose, { Schema, Document } from "mongoose";

export enum OrderStatus {
  Pending = "pending",
  Completed = "completed",
  Cancelled = "cancelled",
}

export interface IOrder extends Document {
  userId: string;
  items: {
    productId: string;
    quantity: number;
  },
  totalAmount: number;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema: Schema = new Schema({
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
  totalAmount: {
    type: Number,
    required: [true, "Total amount must be provided"],
  },
  status: {
    type: String,
    enum: Object.values(OrderStatus),
    default: OrderStatus.Pending,
  },
}, {
  timestamps: true
});

const Order = mongoose.model<IOrder>("Order", OrderSchema);
export default Order;
