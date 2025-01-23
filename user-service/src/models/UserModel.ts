import mongoose, { Schema, Document } from "mongoose";
import validator, { trim } from "validator";
import bcrypt from "bcryptjs"

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  isPasswordMatch: (password: string) => Promise<boolean>;
}

const UserSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name must be provided"],
      minlength: 3,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: [validator.isEmail, "Invalid Email"],
    },
    password: {
      type: String,
      required: [true, "Password must be provided"],
      trim: false,
      minlength: 8,
    },
  },
  {
    timestamps: true,
  }
);

// add check password method
UserSchema.methods.isPasswordMatch = async function (password: string) {
  const user = this as IUser;
  console.log(user.password)
  return await bcrypt.compare(password, user.password)
}

const User = mongoose.model<IUser>("User", UserSchema);
export default User;
