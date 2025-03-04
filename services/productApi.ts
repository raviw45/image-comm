import axios from "axios";

export const addProduct = async (values: FormData) => {
  const response = await axios.post("/api/product", values);
  return response.data;
};
