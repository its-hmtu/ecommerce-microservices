import mongoose, {Schema, Document} from "mongoose";
export enum PaymentStatus {
  PENDING = "PENDING",
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
}

export interface IPayment extends Document {
  orderId: string;
  userId: string;
  amount: number;
  status: PaymentStatus;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema: Schema = new Schema({
  orderId: { type: String, required: true },
  userId: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: Object.values(PaymentStatus), default: PaymentStatus.PENDING },
}, { timestamps: true });

const Payment = mongoose.model<IPayment>("Payment", PaymentSchema);
export default Payment;