import mongoose, { Schema, model, models } from "mongoose";

export interface IUser {
  username: string;
  email: string;
  role: string;
  password: string;
  _id?: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema = new Schema<IUser>(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    password: { type: String },
  },
  { timestamps: true }
);

const User = models.User || model<IUser>("User", userSchema);
export default User;
