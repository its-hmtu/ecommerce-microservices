import mongoose, {Schema, Document} from "mongoose";
export interface IProduct extends Document {
  name: string;
  price: number;
  stock: number;
  description: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, "Name must be provided"],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, "Price must be provided"],
  },
  stock: {
    type: Number,
    required: [true, "Stock must be provided"],
  },
  description: {
    type: String,
    required: [true, "Description must be provided"],
    trim: true,
  },
  image: {
    type: String,
    required: [true, "Image must be provided"],
  },
}, {
  timestamps: true,
})

const Product = mongoose.model<IProduct>("Product", ProductSchema);
export default Product;