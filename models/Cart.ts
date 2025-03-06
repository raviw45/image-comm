import { ICart, ImageVariantType } from "@/types/product.types";
import mongoose, { model, models, Schema } from "mongoose";
const cartSchema = new Schema<ICart>({
  userId: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  productId: { type: mongoose.Types.ObjectId, ref: "Product", required: true },
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
});

const Cart = models?.Cart || model<ICart>("Cart", cartSchema);

export default Cart;
