import { ImageVariant, IVoucher } from "@/types/product.types";
import Image from "next/image";
import React, { useState } from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useVerifyVoucher } from "@/features/useOrder";
import Spinner from "../Spinner";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { addOrder } from "@/services/orderApi";

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
  const [coupon, setCoupon] = useState("");
  const { data: session } = useSession();
  const [discount, setDiscount] = useState(0);
  const [finalAmount, setFinalAmount] = useState(variant?.price || 0);
  const [error, setError] = useState("");
  const { verifyVoucher, isVerifyingVoucherPending } = useVerifyVoucher();
  const [voucher, setVoucher] = useState<IVoucher>();

  const applyCoupon = () => {
    setError("");
    verifyVoucher(coupon, {
      onSuccess: ({ voucher }: { voucher: IVoucher }) => {
        if (!voucher) {
          setError("Invalid coupon code.");
          return;
        }

        // Check if discount can be applied
        const discountValue = voucher.discountAmount || 0;
        if (discountValue >= (variant?.price || 0)) {
          setError(
            `Product price must needs to be greater than ₹${discountValue}`
          );
          setDiscount(0);
          setFinalAmount(variant?.price || 0);
          return;
        }

        // Apply discount
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
      toast.error("Please login!!");
    }
    try {
      const data = await addOrder({
        productId: product?._id,
        variant: variant && variant,
        voucherAmount: discount,
        voucherId: voucher?._id?.toString()!,
      });
      const { orderId } = data;
      const rzp = new (window as any).Razorpay({
        key: process.env.RAZORPAY_KEY,
        amount: finalAmount,
        currency: "INR",
        name: "mediastock",
        description: `${product?.name} - ${variant?.type} Version`,
        order_id: orderId,
        handler: () => {
          toast.success("Payment successful!");
        },
        prefill: { email: session?.user.email },
      });
      rzp.open();
    } catch (error) {
      console.error("Purchase failed:", error);
      toast.error("Purchase failed. Please try again.");
    }
  };
  return (
    <section className="flex flex-col gap-6 p-6 border rounded-lg shadow-md bg-white w-full mx-auto">
      <div className="flex items-center gap-6">
        <div className={`relative w-36 ${getAspectRatioClass(variant?.type!)}`}>
          <Image
            src={product?.image}
            alt={product?.name}
            fill
            className="object-cover rounded-lg shadow-sm"
          />
        </div>
        <div className="flex flex-col gap-1">
          <h2 className="font-semibold text-lg text-gray-800">
            {product.name}
          </h2>
          <span className="text-md text-gray-600 flex items-center gap-2">
            Type: <Badge>{variant?.type}</Badge>
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex gap-3 items-center">
          <Input
            type="text"
            placeholder="Enter coupon code"
            value={coupon}
            onChange={(e) => setCoupon(e.target.value)}
            className="flex-1 border-gray-300 shadow-sm"
          />
          <Button onClick={applyCoupon} className="text-white">
            {isVerifyingVoucherPending ? <Spinner /> : "Apply"}
          </Button>
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {discount > 0 && (
          <p className="text-green-600 text-sm">Coupon applied successfully!</p>
        )}
      </div>

      <div className="bg-gray-100 border p-4 rounded-lg shadow-sm">
        <div className="flex justify-between text-gray-700 font-medium">
          <span>Total Price:</span>
          <span className="text-gray-900">&#8377;{variant?.price}</span>
        </div>
        <div className="flex justify-between text-gray-700 font-medium mt-1">
          <span>Discount:</span>
          <span className="text-green-600">- &#8377;{discount.toFixed(2)}</span>
        </div>
        <hr className="my-2 border-gray-300" />
        <div className="flex justify-between text-md font-semibold text-gray-900">
          <span>Final Amount:</span>
          <span className="text-blue-600">&#8377;{finalAmount.toFixed(2)}</span>
        </div>
      </div>

      <Button onClick={handlePurchase} className="w-full text-white">
        Proceed To Pay
      </Button>
    </section>
  );
};

export default OrderSummary;
