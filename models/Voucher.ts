import { IVoucher } from "@/types/product.types";
import { Schema, models, model } from "mongoose";

const voucherSchema = new Schema<IVoucher>({
  name: { type: String, required: true },
  voucherCount: { type: Number, required: true },
  code: { type: String, required: true, unique: true },
  discountAmount: { type: Number, required: true },
  expiryDate: { type: Date, required: true },
  isActive: { type: Boolean, default: true },
});

const Voucher = models?.Voucher || model<IVoucher>("Voucher", voucherSchema);

export default Voucher;
