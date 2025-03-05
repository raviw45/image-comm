import { ProductFormData } from "@/components/admin/CreateProductForm";
import {
  addProduct,
  deleteProductById,
  deleteProductVariant,
  getProductById,
  getProducts,
} from "@/services/productApi";
import { ImageVariant } from "@/types/product.types";
import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useAddProduct = () => {
  const queryClient = useQueryClient();
  const { mutate, isPending, isError } = useMutation({
    mutationFn: (values: ProductFormData) => addProduct(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product added successfully!");
    },
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

export const useGetProducts = () => {
  const { data, isPending } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });
  return {
    products: data,
    isProductsLoading: isPending,
  };
};

export const useGetProductById = (id: string) => {
  const { data, isPending } = useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(id),
  });
  return {
    product: data,
    isProductLoading: isPending,
  };
};

export const useDeleteVariant = (id: string) => {
  const queryClient = useQueryClient();
  const { mutate, isPending, isError } = useMutation({
    mutationFn: (variants: ImageVariant[]) =>
      deleteProductVariant(id, variants),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product", id] });
      toast.success("Product variant deleted successfully!");
    },
    onError: (error: any) =>
      toast.error(
        error?.response?.data?.error ||
          "Failed to create product. Please try again."
      ),
  });
  return {
    deleteVariant: mutate,
    deleteVariantPending: isPending,
    deleteVariantError: isError,
  };
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  const { mutate, isPending, isError } = useMutation({
    mutationFn: (id: string) => deleteProductById(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product deleted successfully!");
    },
    onError: (error: any) =>
      toast.error(
        error?.response?.data?.error ||
          "Failed to create product. Please try again."
      ),
  });
  return {
    deleteProduct: mutate,
    deleteProductPending: isPending,
    deleteProductError: isError,
  };
};
