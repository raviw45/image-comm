import { IUser } from "@/models/User";
import axios from "axios";
export const registerApi = async (data: IUser) => {
  const response = await axios.post("/api/auth/register", data);
  return response.data;
};
