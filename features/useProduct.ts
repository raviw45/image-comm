import { addProduct } from "@/services/productApi";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useAddProduct = () => {
  const { mutate, isPending, isError } = useMutation({
    mutationFn: (values: FormData) => addProduct(values),
    onSuccess: () => toast.success("Product added successfully!"),
    onError: (error: any) =>
      toast.error(
        error?.response?.data?.error ||
          "Failed to create product. Please try again."
      ),
  });
  return {
    addProduct: mutate,
    addProductPending: isPending,
    addProductError: isError,
  };
};
