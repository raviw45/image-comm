import { ImageVariant, IProduct } from "@/types/product.types";
import { Schema, model, models } from "mongoose";

const imageVariantSchema = new Schema<ImageVariant>(
  {
    type: {
      type: String,
      required: true,
      enum: ["SQUARE", "PORTRAIT", "WIDE"],
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    license: {
      type: String,
      required: true,
      enum: ["personal", "commercial"],
    },
  },
  { _id: false }
);

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    variants: [imageVariantSchema],
  },
  { timestamps: true }
);

const Product = models?.Product || model<IProduct>("Product", productSchema);

export default Product;
