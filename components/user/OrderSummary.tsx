/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { ImageVariant, IVoucher } from "@/types/product.types";
import Image from "next/image";
import React, { useState } from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useDeleteOrder, useVerifyVoucher } from "@/features/useOrder";
import Spinner from "../Spinner";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { addOrder } from "@/services/orderApi";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

const getAspectRatioClass = (type: string) => {
  switch (type) {
    case "SQUARE":
      return "aspect-[1/1]";
    case "PORTRAIT":
      return "aspect-[3/4]";
    case "WIDE":
      return "aspect-[16/9]";
    default:
      return "aspect-[4/3]";
  }
};

const OrderSummary = ({
  product,
  variant,
}: {
  product: any;
  variant: ImageVariant | null;
}) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [coupon, setCoupon] = useState("");
  const { data: session } = useSession();
  const [discount, setDiscount] = useState(0);
  const [finalAmount, setFinalAmount] = useState(variant?.price || 0);
  const [error, setError] = useState("");
  const { deleteOrder } = useDeleteOrder();
  const { verifyVoucher, isVerifyingVoucherPending } = useVerifyVoucher();
  const [voucher, setVoucher] = useState<IVoucher>();
  const [isProcessing, setIsProcessing] = useState(false);

  const applyCoupon = () => {
    setError("");
    verifyVoucher(coupon, {
      onSuccess: ({ voucher }: { voucher: IVoucher }) => {
        if (!voucher) {
          setError("Invalid coupon code.");
          return;
        }

        const discountValue = voucher.discountAmount || 0;
        if (discountValue >= (variant?.price || 0)) {
          setError(`Product price must be greater than ₹${discountValue}`);
          setDiscount(0);
          setFinalAmount(variant?.price || 0);
          return;
        }
        setVoucher(voucher);
        setDiscount(discountValue);
        setFinalAmount((variant?.price || 0) - discountValue);
      },
      onError: (error: any) => {
        setError(error?.response?.data?.error || "Something went wrong");
        setDiscount(0);
        setFinalAmount(variant?.price || 0);
      },
    });
  };

  const handlePurchase = async () => {
    if (!session) {
      toast.error("Please login!");
      return;
    }

    setIsProcessing(true);

    try {
      const data = await addOrder({
        productId: product?._id,
        variant: variant && variant,
        voucherAmount: discount,
        voucherId: voucher?._id?.toString()!,
      });

      const { orderId, finalPrice, dbOrderId } = data;
      const rzp = new (window as any).Razorpay({
        key: process.env.RAZORPAY_KEY,
        amount: finalPrice * 100,
        currency: "INR",
        name: "mediastock",
        description: `${product?.name} - ${variant?.type} Version`,
        order_id: orderId,
        handler: () => {
          queryClient.invalidateQueries({
            queryKey: ["product", product?._id as string],
          });
          toast.success("Payment successful!");
          setIsProcessing(false);
          router.push("/orders");
        },
        prefill: { email: session?.user.email },
        modal: {
          ondismiss: () => {
            toast.error("Payment window closed.");
            deleteOrder(dbOrderId);
            setIsProcessing(false);
          },
        },
      });

      rzp.open();
    } catch (error) {
      console.log(error);
      toast.error("Purchase failed. Please try again.");
      setIsProcessing(false);
    }
  };

  return (
    <section className="flex flex-col md:gap-6 gap-2 md:p-6 p-2 w-full">
      <div className="flex md:flex-row flex-col items-center md:gap-6 gap-2">
        <div className={`relative w-36 ${getAspectRatioClass(variant?.type!)}`}>
          <Image
            src={product?.image}
            alt={product?.name}
            fill
            className="object-cover rounded-lg shadow-sm"
          />
        </div>
        <div className="flex flex-col gap-1">
          <h2 className="font-semibold md:text-lg text-md text-gray-800">
            {product.name}
          </h2>
          <span className="md:text-md text-xs text-gray-600 flex items-center gap-2">
            Type: <Badge>{variant?.type}</Badge>
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex md:flex-row flex-col gap-3 items-center">
          <Input
            type="text"
            placeholder="Enter coupon code"
            value={coupon}
            onChange={(e) => setCoupon(e.target.value)}
            className="flex-1 md:text-md text-sm border-gray-300 shadow-sm"
          />
          <Button
            onClick={applyCoupon}
            className="text-white md:text-md text-sm w-full md:w-auto"
          >
            {isVerifyingVoucherPending ? <Spinner /> : "Apply"}
          </Button>
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {discount > 0 && (
          <p className="text-green-600 text-sm">Coupon applied successfully!</p>
        )}
      </div>

      <div className="md:p-4 p-2">
        <div className="flex justify-between md:text-md text-sm text-gray-700 md:font-medium font-normal">
          <span>Total Price:</span>
          <span className="text-gray-900">&#8377;{variant?.price}</span>
        </div>
        <div className="flex justify-between md:text-md text-sm text-gray-700 md:font-medium font-normal mt-1">
          <span>Discount:</span>
          <span className="text-green-600">- &#8377;{discount.toFixed(2)}</span>
        </div>
        <hr className="my-2 border-gray-300" />
        <div className="flex justify-between md:text-md text-sm font-semibold text-gray-900">
          <span>Final Amount:</span>
          <span className="text-blue-600">&#8377;{finalAmount.toFixed(2)}</span>
        </div>
      </div>

      <Button
        onClick={handlePurchase}
        className="w-full md:text-md text-sm text-white"
        disabled={isProcessing}
      >
        {isProcessing ? <Spinner /> : "Proceed To Pay"}
      </Button>
    </section>
  );
};

export default OrderSummary;
