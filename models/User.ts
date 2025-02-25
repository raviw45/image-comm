import mongoose, { Schema, model, models } from "mongoose";

export interface IUser {
  email: string;
  password: string;
  role: string;
  _id?: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true, enum: ["user", "admin"] },
  },
  { timestamps: true }
);

const User = models.User || model<IUser>("User", userSchema);
export default User;
