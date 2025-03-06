import { addToCart, deleteFromCart, getCartItems } from "@/services/cartApi";
import { CartData } from "@/types/product.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useAddToCart = () => {
  const queryClient = useQueryClient();
  const { mutate, isPending, isError } = useMutation({
    mutationFn: (product: CartData) => addToCart(product),
    onSuccess: () => {
      toast.success("Product added to cart!");
      queryClient.invalidateQueries({
        queryKey: ["cartItems"],
      });
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.error ||
          "Failed to create product. Please try again."
      );
    },
  });
  return {
    addToCart: mutate,
    isAddingToCartPending: isPending,
    isAddingToCartError: isError,
  };
};

export const useGetCartItems = () => {
  const { data, isPending } = useQuery({
    queryKey: ["cartItems"],
    queryFn: getCartItems,
  });
  return {
    cartItems: data,
    isCartItemsLoading: isPending,
  };
};

export const useDeleteCartItem = () => {
  const queryClient = useQueryClient();
  const { mutate, isPending, isError } = useMutation({
    mutationFn: (id: string) => deleteFromCart(id),
    onSuccess: () => {
      toast.success("Product removed from cart!");
      queryClient.invalidateQueries({
        queryKey: ["cartItems"],
      });
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.error ||
          "Failed to remove product. Please try again."
      );
    },
  });
  return {
    deleteCartItem: mutate,
    isDeletingCartItemPending: isPending,
    isDeletingCartItemError: isError,
  };
};
