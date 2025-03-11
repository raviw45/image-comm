import {
  addToCartSchema,
  addVoucherFormSchema,
  productSchema,
} from "@/schema/product.schema";
import mongoose from "mongoose";
import { z } from "zod";
export const IMAGE_VARIANTS = {
  SQUARE: {
    type: "SQUARE",
    dimensions: { width: 1200, height: 1200 },
    label: "Square(1:1)",
    aspectRatio: "1:1",
  },
  WIDE: {
    type: "WIDE",
    dimensions: { width: 1920, height: 1080 },
    label: "Widescreen(16:9)",
    aspectRatio: "16:9",
  },
  PORTRAIT: {
    type: "PORTRAIT",
    dimensions: { width: 1080, height: 1440 },
    label: "Portrait(3:4)",
    aspectRatio: "3:4",
  },
} as const;

export type ImageVariantType = keyof typeof IMAGE_VARIANTS;

export interface ImageVariant {
  type: ImageVariantType;
  price: number;
  license: "personal" | "commercial";
}

export interface IProduct {
  _id?: mongoose.Types.ObjectId;
  name: string;
  description: string;
  image: string | File;
  variants: ImageVariant[];
}
export type ProductFormData = z.infer<typeof productSchema>;
// order types
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

export interface IVoucher {
  _id?: mongoose.Types.ObjectId;
  name: string;
  voucherCount: number;
  code: string;
  discountAmount: number;
  expiryDate: Date;
  isActive?: boolean;
}

export type AddVoucherFormData = z.infer<typeof addVoucherFormSchema>;

// cart types
export interface ICart {
  _id?: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId | PopulatedUser;
  productId: mongoose.Types.ObjectId | PopulatedProduct;
  variant: ImageVariant;
}

export type CartData = z.infer<typeof addToCartSchema>;
