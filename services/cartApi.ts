import { CartData } from "@/types/product.types";
import axios from "axios";

export const addToCart = async (product: CartData) => {
  const response = await axios.post("/api/cart", product);
  return response.data;
};

export const getCartItems = async () => {
  const response = await axios.get("/api/cart");
  return response.data;
};

export const getCartItemForCount = async () => {
  const response = await axios.get("/api/cartItems");
  return response.data;
};

export const deleteFromCart = async (id: string) => {
  const response = await axios.delete(`/api/cart?id=${id}`);
  return response.data;
};
