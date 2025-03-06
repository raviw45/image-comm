"use client";

import { useDeleteCartItem, useGetCartItems } from "@/features/useCart";
import React, { useState } from "react";
import Loader from "../ui/loader";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FaTrash } from "react-icons/fa";
import Link from "next/link";
import Spinner from "../Spinner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";

const AllCartItems = () => {
  const { cartItems, isCartItemsLoading } = useGetCartItems();
  const { deleteCartItem, isDeletingCartItemPending } = useDeleteCartItem();
  const [selectedItemId, setSelectedItemId] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  if (isCartItemsLoading) {
    return <Loader />;
  }

  const totalAmount = cartItems.reduce(
    (acc: number, item: any) => acc + item.variant.price,
    0
  );

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
    <section className="max-w-6xl mx-auto p-6 flex flex-col lg:flex-row gap-6 overflow-hidden">
      {/* Cart Items (Scrollable) */}
      <div className="flex-1 overflow-y-auto h-[75vh] p-4 space-y-4">
        {cartItems.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">
            Your cart is empty.
          </p>
        ) : (
          cartItems.map((item: any, index: number) => (
            <div key={index} className="flex items-center gap-4 border-b pb-4">
              {/* Product Image */}
              <Image
                src={item?.productId?.image}
                alt={item?.productId?.name}
                width={100}
                height={100}
                quality={100}
                className="rounded-lg object-cover"
              />

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

              {/* Remove Button */}
              <Button
                variant="destructive"
                size="icon"
                onClick={() => handleDeleteClick(item._id)}
              >
                <FaTrash className="text-white" />
              </Button>
            </div>
          ))
        )}
      </div>

      {/* Order Summary (Fixed) */}
      <div className="w-full lg:w-1/3 p-6 self-start sticky top-6">
        <h2 className="text-lg font-semibold text-gray-800">Order Summary</h2>
        <div className="mt-2 space-y-2">
          <div className="flex justify-between text-md font-medium">
            <span>Total</span>
            <span>₹{totalAmount}</span>
          </div>
        </div>
        <Button className="mt-2 text-white">Pay Now</Button>
      </div>

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
