import { ImageVariant, ProductFormData } from "@/types/product.types";
import cloudinaryUpload from "@/utils/cloudinaryUpload";
import { fileToBase64 } from "@/utils/quicker";
import axios from "axios";

export const addProduct = async (values: ProductFormData) => {
  const url = await cloudinaryUpload(
    await fileToBase64(values?.image as File),
    "image-comm"
  );
  const response = await axios.post("/api/product", {
    ...values,
    image: url?.secure_url,
  });
  return response.data;
};

export const getProducts = async () => {
  const response = await axios.get("/api/product");
  return response.data;
};

export const deleteProductById = async (id: string) => {
  const response = await axios.delete(`/api/product?id=${id}`);
  return response.data;
};

export const getProductById = async (id: string) => {
  const response = await axios.get(`/api/product?id=${id}`);
  return response.data;
};

export const deleteProductVariant = async (
  id: string,
  variants: ImageVariant[]
) => {
  const response = await axios.put(`/api/product?id=${id}`, { variants });
  return response.data;
};
