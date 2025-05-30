/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Loader from "@/components/ui/loader";
import { useDeleteVariant, useGetProductById } from "@/features/useProduct";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { BsCart3 } from "react-icons/bs";
import { FaShippingFast } from "react-icons/fa";
import { useAddToCart, useGetCartItems } from "@/features/useCart";
import { ImageVariant } from "@/types/product.types";
import Spinner from "./Spinner";
import toast from "react-hot-toast";
import Link from "next/link";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import OrderSummary from "./user/OrderSummary";
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

const ProductDetails = () => {
  const { id } = useParams();
  const { data: session } = useSession();
  const router = useRouter();
  const { product, isProductLoading } = useGetProductById(id as string);

  const [selectedIndex, setSelectedIndex] = useState<number>();
  const { addToCart, isAddingToCartPending } = useAddToCart();
  const [isBuyNowModalOpen, setIsBuyNowModalOpen] = useState<boolean>(false);
  const [variantProp, setVariantProp] = useState<ImageVariant | null>(null);
  const { cartItems } = useGetCartItems();
  const { orders } = useGetOrders();
  const { deleteVariant, deleteVariantPending } = useDeleteVariant(
    id as string
  );

  if (isProductLoading) return <Loader />;

  const handleDeleteVariant = (indexToRemove: number) => {
    console.log(`Delete variant at index: ${indexToRemove}`);
    const variants = product.variants.filter(
      (_: unknown, index: number) => index !== indexToRemove
    );
    setSelectedIndex(indexToRemove);
    deleteVariant(variants);
  };

  const handleAddToCart = (index: number, variant: ImageVariant) => {
    setSelectedIndex(index);
    const product = {
      productId: id as string | "",
      variant: variant,
    };

    // Check if the user is logged in
    if (!session) {
      router.push("/login"); // Redirect to login page if not logged in
      return;
    }

    if (cartItems.length >= 30) {
      toast.error("Cart Full!!");
    } else {
      addToCart(product);
    }
  };

  const handleBuyNow = (variant: ImageVariant) => {
    if (!session) {
      router.push("/login"); // Redirect to login page if not logged in
      return;
    }

    setIsBuyNowModalOpen(!isBuyNowModalOpen);
    setVariantProp(variant);
  };

  return (
    <section className="md:p-6 p-2 mx-auto">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="cursor-pointer duration-200 hover:scale-105 active:scale-100"
        title="Go Back"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="35px"
          height="35px"
          viewBox="0 0 24 24"
          className="stroke-[#d64e9d]"
        >
          <path
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeWidth="1.5"
            d="M11 6L5 12M5 12L11 18M5 12H19"
          ></path>
        </svg>
      </button>
      {/* Main Product Image */}
      <div className="relative w-full  mx-auto mt-4 overflow-hidden flex md:flex-row flex-col justify-between gap-4 ">
        <Image
          src={product?.image}
          alt={product?.name}
          width={300}
          height={300}
          className="object-cover border rounded-lg shadow-lg"
        />
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{product?.name}</h1>
          <p className="text-gray-500 ">{product?.description}</p>
        </div>
      </div>

      {/* Variants */}
      {product?.variants && product?.variants?.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-3">Available Variants</h2>
          <div className="space-y-4">
            {product?.variants?.map((variant: ImageVariant, index: number) => {
              const isInCart = cartItems?.some(
                (item: any) =>
                  item?.productId?._id === id &&
                  item?.variant?.type === variant.type
              );
              const isOrdered = orders?.some(
                (order: any) =>
                  order.productId._id === product._id &&
                  order.variant.type === variant.type
              );
              return (
                <div
                  key={index}
                  className="flex md:flex-row flex-col items-center gap-4 bg-gray-100 md:p-4 p-2 rounded-lg shadow-md"
                >
                  <div
                    className={`relative w-32 ${getAspectRatioClass(
                      variant.type
                    )}`}
                  >
                    <Image
                      src={product?.image}
                      alt={product?.name}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>

                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      {variant.type} - &#8377;{variant.price}
                    </p>
                    <p className="text-xs text-gray-500">
                      License: {variant?.license}
                    </p>
                  </div>

                  {session?.user?.role === "admin" ? (
                    <Button
                      className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition-all"
                      onClick={() => handleDeleteVariant(index)}
                    >
                      {deleteVariantPending && index === selectedIndex
                        ? "Deleting..."
                        : "Delete"}
                    </Button>
                  ) : (
                    <div className="flex flex-wrap justify-center gap-4">
                      {isInCart ? (
                        <Link href="/cart">
                          <Button className="bg-orange-400 hover:shadow-lg hover:bg-orange-400/85 duration-200 ease-in-out">
                            <BsCart3 size={22} />
                            Go to Cart
                          </Button>
                        </Link>
                      ) : (
                        <Button
                          onClick={() => handleAddToCart(index, variant)}
                          className="bg-orange-400 hover:shadow-lg hover:bg-orange-400/85 duration-200 ease-in-out"
                        >
                          <BsCart3 size={20} />
                          {isAddingToCartPending && index === selectedIndex ? (
                            <Spinner />
                          ) : (
                            "Add to Cart"
                          )}
                        </Button>
                      )}
                      {isOrdered ? (
                        <Link href="/orders">
                          <Button className="bg-green-600 hover:bg-green-700">
                            <IoCloudDownloadSharp />
                            Go to Orders
                          </Button>
                        </Link>
                      ) : (
                        <Button
                          onClick={() => handleBuyNow(variant)}
                          className="bg-orange-600 hover:shadow-lg hover:bg-orange-600/85 duration-200 ease-in-out"
                        >
                          <FaShippingFast size={20} />
                          Buy Now
                        </Button>
                      )}
                    </div>
                  )}
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
        </div>
      )}
    </section>
  );
};

export default ProductDetails;
