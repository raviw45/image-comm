import { AddVoucherFormData, IVoucher } from "@/types/product.types";
import axios from "axios";

export const addVoucher = async (values: AddVoucherFormData) => {
  const response = await axios.post("/api/voucher", values);
  return response.data;
};

export const getVouchers = async () => {
  const response = await axios.get("/api/voucher");
  return response.data;
};

export const deleteVoucher = async (id: string) => {
  const response = await axios.delete(`/api/voucher?id=${id}`);
  return response.data;
};

export const updateVoucher = async (values: IVoucher) => {
  const response = await axios.put(`/api/voucher?id=${values?._id}`, values);
  return response.data;
};
