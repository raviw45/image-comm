import mongoose, { Schema, model, models } from "mongoose";
import { ImageVariant, ImageVariantType } from "./Product";

interface PopulatedUser {
  _id: mongoose.Types.ObjectId;
  email: string;
}

interface PopulatedProduct {
  _id: mongoose.Types.ObjectId;
  name: string;
  imageUrl: string;
}

export interface IOrder {
  _id?: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId | PopulatedUser;
  productId: mongoose.Types.ObjectId | PopulatedProduct;
  variant: ImageVariant;
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  status: "pending" | "completed" | "cancelled";
  amount: number;
  downloadUrl?: string;
  previewUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const orderSchema = new Schema<IOrder>(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "User",
    },
    productId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Product",
    },
    variant: {
      type: {
        type: String,
        required: true,
        enum: ["SQUARE", "WIDE", "PORTRAIT"] as ImageVariantType[],
        set: (v: string) => v.toUpperCase(),
      },
      price: { type: Number, required: true },
      license: {
        type: String,
        required: true,
        enum: ["personal", "commercial"],
      },
    },
    razorpayOrderId: {
      type: String,
      required: true,
    },
    razorpayPaymentId: {
      type: String,
    },
    status: {
      type: String,
      required: true,
      enum: ["pending", "completed", "cancelled"],
      default: "pending",
    },
    amount: {
      type: Number,
      required: true,
    },
    downloadUrl: {
      type: String,
    },
    previewUrl: {
      type: String,
    },
  },
  { timestamps: true }
);

const Order = models?.Order || model<IOrder>("Order", orderSchema);

export default Order;
