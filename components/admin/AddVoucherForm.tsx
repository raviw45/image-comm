"use client";
import { addVoucherFormSchema } from "@/schema/product.schema";
import { AddVoucherFormData, IVoucher } from "@/types/product.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Germania_One } from "next/font/google";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useAddVoucher, useUpdateVoucher } from "@/features/useOrder";
import Spinner from "../Spinner";
import { useEffect } from "react";
import { Switch } from "../ui/switch";

const germania = Germania_One({
  weight: "400",
  subsets: ["latin"],
});
interface AddVoucherFormProps {
  voucher: IVoucher | null;
  onClose: () => void;
}
const AddVoucherForm: React.FC<AddVoucherFormProps> = ({
  voucher,
  onClose,
}) => {
  const { addVoucher, isAddingVoucherPending } = useAddVoucher();
  const { updateVoucher, isUpdatingVoucherPending } = useUpdateVoucher();
  const form = useForm<AddVoucherFormData>({
    resolver: zodResolver(addVoucherFormSchema),
    defaultValues: {
      name: "",
      code: "",
      discountAmount: undefined,
      expiryDate: undefined,
      voucherCount: undefined,
      isActive: true,
    },
  });

  useEffect(() => {
    if (voucher) {
      form.reset({
        name: voucher.name,
        code: voucher.code,
        discountAmount: voucher.discountAmount,
        expiryDate: new Date(voucher.expiryDate),
        voucherCount: voucher.voucherCount,
        isActive: voucher.isActive,
      });
    }
  }, [voucher, form]);

  const onSubmit = (values: AddVoucherFormData) => {
    if (voucher) {
      voucher.name = values.name;
      voucher.code = values.code;
      voucher.discountAmount = values.discountAmount;
      voucher.expiryDate = values.expiryDate;
      voucher.voucherCount = values.voucherCount;
      voucher.isActive = values.isActive;
      updateVoucher(voucher, {
        onSuccess: () => {
          form.reset();
          onClose();
        },
      });
    } else {
      addVoucher(values, {
        onSuccess: () => {
          form.reset();
          onClose();
        },
      });
    }
  };

  return (
    <div className="w-full  flex justify-center items-center flex-col md:p-2 md:space-y-4 space-y-0 rounded-md bg-white">
      <h2
        className={`md:text-[38px] text-center text-[16px] text-[#d64e9d] font-bold ${germania.className}`}
      >
        {voucher ? "Edit Voucher/Coupon" : "Add New Voucher/Coupon"}
      </h2>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="md:space-y-6 space-y-2"
        >
          <div className=" w-full flex md:flex-row flex-col md:gap-4 gap-2">
            {/* Voucher Name */}
            <div className="flex-1">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="md:text-md text-xs">
                      Voucher Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter Voucher name"
                        className="w-full md:text-md text-xs"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Voucher Code */}
            <div className="flex-1">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="md:text-md text-xs">
                      Voucher Code
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter Voucher Code"
                        className="w-full md:text-md text-xs"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="flex md:flex-row flex-col md:gap-4 gap-2">
            {/* Discount Amount */}
            <div className="flex-1">
              <FormField
                control={form.control}
                name="discountAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="md:text-md text-xs">
                      Discount Amount
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === ""
                              ? undefined
                              : Number(e.target.value)
                          )
                        }
                        placeholder="Enter Discount Amount"
                        className="w-full no-arrows md:text-md text-xs"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Expiry Date */}
            <div className="flex-1">
              <FormField
                control={form.control}
                name="expiryDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="md:text-md text-xs">
                      Expiry Date
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        value={
                          field.value
                            ? new Date(field.value).toISOString().split("T")[0]
                            : ""
                        }
                        onChange={(e) =>
                          field.onChange(
                            e.target.value
                              ? new Date(e.target.value)
                              : undefined
                          )
                        }
                        placeholder="Select Expiry Date"
                        className="w-full no-arrows md:text-md text-xs"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="flex-1 ">
            <FormField
              control={form.control}
              name="voucherCount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="md:text-md text-xs">
                    Number of Vouchers
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === ""
                            ? undefined
                            : Number(e.target.value)
                        )
                      }
                      placeholder="Enter Number of vouchers"
                      className="w-full no-arrows md:text-md text-xs"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {voucher && (
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex gap-2 items-end mt-2">
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={(checked) => field.onChange(checked)}
                      />
                    </FormControl>
                    <FormLabel className="md:text-md text-xs">
                      Activate Voucher
                    </FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>

          <div className="flex justify-center items-center">
            <Button type="submit">
              {isAddingVoucherPending || isUpdatingVoucherPending ? (
                <Spinner />
              ) : voucher ? (
                "Update Voucher"
              ) : (
                "Add Voucher"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AddVoucherForm;
