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

const ProductDetails = () => {
  const { id } = useParams();
  const { data: session } = useSession();
  const router = useRouter();
  const { product, isProductLoading } = useGetProductById(id as string);
  const [selectedIndex, setSelectedIndex] = useState<Number>();
  const { addToCart, isAddingToCartPending } = useAddToCart();
  const { cartItems } = useGetCartItems();
  const { deleteVariant, deleteVariantPending } = useDeleteVariant(
    id as string
  );

  if (isProductLoading) return <Loader />;

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
    if (cartItems.length >= 30) {
      toast.error("Cart Full!!");
    } else {
      addToCart(product);
    }
  };

  return (
    <section className="p-6 mx-auto">
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
      <div className="relative w-full  mx-auto mt-4 overflow-hidden flex justify-between gap-4 ">
        <Image
          src={product?.image}
          alt={product?.name}
          width={300}
          height={300}
          className="object-cover rounded-lg shadow-lg"
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
            {product?.variants?.map((variant: any, index: number) => {
              const isInCart = cartItems?.some(
                (item: any) =>
                  item?.productId?._id === id &&
                  item?.variant?.type === variant.type
              );
              return (
                <div
                  key={index}
                  className="flex items-center gap-4 bg-gray-100 p-4 rounded-lg shadow-md"
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
                    <div className="flex gap-4">
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
                      <Button className="bg-orange-600 hover:shadow-lg hover:bg-orange-600/85 duration-200 ease-in-out">
                        <FaShippingFast size={20} />
                        Buy Now
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
};

export default ProductDetails;
