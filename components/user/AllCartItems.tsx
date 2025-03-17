"use client";

import { useDeleteCartItem, useGetCartItems } from "@/features/useCart";
import React, { useState } from "react";
import Loader from "../ui/loader";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FaShippingFast, FaTrash } from "react-icons/fa";
import Link from "next/link";
import Spinner from "../Spinner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { ImageVariant, IProduct } from "@/types/product.types";
import OrderSummary from "./OrderSummary";
import { useGetOrders } from "@/features/useOrder";
import { IoCloudDownloadSharp } from "react-icons/io5";

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

const AllCartItems = () => {
  const { cartItems, isCartItemsLoading } = useGetCartItems();
  const { deleteCartItem, isDeletingCartItemPending } = useDeleteCartItem();
  const [selectedItemId, setSelectedItemId] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isBuyNowModalOpen, setIsBuyNowModalOpen] = useState<boolean>(false);
  const [variantProp, setVariantProp] = useState<ImageVariant | null>(null);
  const [product, setProduct] = useState<IProduct>();
  const { orders } = useGetOrders();

  if (isCartItemsLoading) {
    return <Loader />;
  }

  const handleDeleteClick = (itemId: string) => {
    setSelectedItemId(itemId);
    setIsDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedItemId) {
      deleteCartItem(selectedItemId, {
        onSuccess: () => {
          setIsDialogOpen(false);
        },
      });
    }
  };

  return (
    <section className="max-w-6xl mx-auto md:p-6 p-2 flex flex-col lg:flex-row gap-6 overflow-hidden">
      {/* Cart Items (Scrollable) */}
      <div className="flex-1 md:overflow-y-auto md:h-[75vh] h-auto md:p-4 space-y-4">
        {cartItems.map((item: any, index: number) => {
          const isOrdered = orders?.some(
            (order: any) =>
              order.productId._id === item.productId._id &&
              order.variant._id === item.variant._id
          );

          return (
            <div
              key={index}
              className="flex md:flex-row flex-col items-center gap-4 border-b pb-4"
            >
              {/* Product Image */}
              <div
                className={`relative w-32 ${getAspectRatioClass(
                  item?.variant.type
                )}`}
              >
                <Image
                  src={item?.productId?.image}
                  alt={item?.productId?.name}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>

              {/* Product Details */}
              <div className="flex-1">
                <Link href={`/product/${item?.productId?._id}`}>
                  <h3 className="text-lg font-semibold hover:text-blue-600 transition">
                    {item?.productId?.name}
                  </h3>
                </Link>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {item?.productId?.description}
                </p>
                <div className="mt-2 flex items-center gap-3">
                  <Badge variant="outline" className="text-xs px-3 py-1">
                    {item?.variant?.type}
                  </Badge>
                  <p className="text-lg font-medium text-gray-900">
                    ₹{item?.variant?.price}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="md:space-x-4 space-x-2 space-y-4">
                {isOrdered ? (
                  <Link href="/orders">
                    <Button className="bg-green-600 hover:bg-green-700">
                      <IoCloudDownloadSharp />
                      Go to Orders
                    </Button>
                  </Link>
                ) : (
                  <Button
                    onClick={() => {
                      setIsBuyNowModalOpen(true);
                      setVariantProp(item?.variant);
                      setProduct(item?.productId);
                    }}
                    className="bg-orange-600 hover:shadow-lg hover:bg-orange-600/85 duration-200 ease-in-out"
                  >
                    <FaShippingFast size={20} />
                    Buy Now
                  </Button>
                )}

                <Button
                  variant="destructive"
                  onClick={() => handleDeleteClick(item._id)}
                >
                  <FaTrash className="text-white" />
                  Remove from Cart
                </Button>
              </div>
            </div>
          );
        })}
      </div>
      <Dialog
        open={isBuyNowModalOpen}
        onOpenChange={() => setIsBuyNowModalOpen(!isBuyNowModalOpen)}
      >
        <DialogContent className="w-[90%] rounded-lg max-w-full sm:max-w-lg p-4 sm:p-6">
          <DialogTitle className="text-lg sm:text-xl font-semibold hidden">
            Place Order
          </DialogTitle>
          <OrderSummary
            product={product}
            variant={variantProp && variantProp}
          />
        </DialogContent>
      </Dialog>
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Product</DialogTitle>
            <p>Are you sure you want to remove this product from the cart?</p>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              {isDeletingCartItemPending ? <Spinner /> : "Remove"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default AllCartItems;
