import {
  addVoucher,
  deleteOrder,
  deleteVoucher,
  getAllOrders,
  getOrders,
  getVouchers,
  updateVoucher,
  verifyVoucher,
} from "@/services/orderApi";
import { AddVoucherFormData, IVoucher } from "@/types/product.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useAddVoucher = () => {
  const queryClient = useQueryClient();
  const { mutate, isPending, isError } = useMutation({
    mutationFn: (values: AddVoucherFormData) => addVoucher(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vouchers"] });
      toast.success("Voucher added successfully!");
    },
    onError: (error: any) =>
      toast.error(
        error?.response?.data?.error ||
          "Failed to create product. Please try again."
      ),
  });
  return {
    addVoucher: mutate,
    isAddingVoucherPending: isPending,
    isAddingVoucherError: isError,
  };
};

export const useGetVouchers = () => {
  const { data, isPending } = useQuery({
    queryKey: ["vouchers"],
    queryFn: getVouchers,
  });
  return {
    vouchers: data,
    isVouchersLoading: isPending,
  };
};

export const useDeleteVoucher = () => {
  const queryClient = useQueryClient();
  const { mutate, isPending, isError } = useMutation({
    mutationFn: (id: string) => deleteVoucher(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vouchers"] });
      toast.success("Voucher deleted successfully!");
    },
    onError: (error: any) =>
      toast.error(
        error?.response?.data?.error ||
          "Failed to delete voucher. Please try again."
      ),
  });
  return {
    deleteVoucher: mutate,
    isDeletingVoucherPending: isPending,
    isDeletingVoucherError: isError,
  };
};

export const useUpdateVoucher = () => {
  const queryClient = useQueryClient();
  const { mutate, isPending, isError } = useMutation({
    mutationFn: (values: IVoucher) => updateVoucher(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vouchers"] });
      toast.success("Voucher updated successfully!");
    },
    onError: (error: any) =>
      toast.error(
        error?.response?.data?.error ||
          "Failed to update voucher. Please try again."
      ),
  });
  return {
    updateVoucher: mutate,
    isUpdatingVoucherPending: isPending,
    isUpdatingVoucherError: isError,
  };
};

export const useVerifyVoucher = () => {
  const { mutate, isPending } = useMutation({
    mutationFn: (code: string) => verifyVoucher(code),
    onSuccess: () => {
      toast.success("Voucher code verified successfully!");
    },
    onError: (error: any) =>
      toast.error(
        error?.response?.data?.error || "Failed to verify voucher code"
      ),
  });

  return {
    verifyVoucher: mutate,
    isVerifyingVoucherPending: isPending,
  };
};

export const useGetOrders = () => {
  const { data, isPending } = useQuery({
    queryKey: ["orders"],
    queryFn: getOrders,
  });
  return {
    orders: data,
    isOrdersLoading: isPending,
  };
};

export const useGetAllOrders = () => {
  const { data, isPending } = useQuery({
    queryKey: ["orders"],
    queryFn: getAllOrders,
  });
  return {
    orders: data,
    isOrdersLoading: isPending,
  };
};

export const useDeleteOrder = () => {
  const queryClient = useQueryClient();
  const { mutate, isPending, isError } = useMutation({
    mutationFn: (id: string) => deleteOrder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Order Cancelled!");
    },
    onError: (error: any) =>
      toast.error(
        error?.response?.data?.error ||
          "Failed to delete order. Please try again."
      ),
  });
  return {
    deleteOrder: mutate,
    isDeletingOrderPending: isPending,
    isDeletingOrderError: isError,
  };
};
