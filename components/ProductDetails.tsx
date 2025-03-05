"use client";
import Loader from "@/components/ui/loader";
import { useDeleteVariant, useGetProductById } from "@/features/useProduct";
import { useParams } from "next/navigation";
import Image from "next/image";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";

const ProductDetails = () => {
  const { id } = useParams();
  const { product, isProductLoading } = useGetProductById(id as string);
  const [selectedIndex, setSelectedIndex] = useState<Number>();
  const { deleteVariant, deleteVariantPending } = useDeleteVariant(
    id as string
  );

  if (isProductLoading) return <Loader />;
  if (!product) return <p>Product not found</p>;

  // Aspect ratio classes based on the `imageVariant` type
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

  return (
    <section className="p-6 max-w-4xl mx-auto">
      {/* Main Product Image */}
      <div className="relative w-full  mx-auto mt-4 overflow-hidden flex justify-between gap-4 ">
        <Image
          src={product.image}
          alt={product.name}
          width={300}
          height={300}
          className="object-cover rounded-lg shadow-lg"
        />
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <p className="text-gray-500 ">{product.description}</p>
        </div>
      </div>

      {/* Variants */}
      {product.variants && product.variants.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-3">Available Variants</h2>
          <div className="space-y-4">
            {product.variants.map((variant: any, index: number) => (
              <div
                key={index}
                className="flex items-center gap-4 bg-gray-100 p-4 rounded-lg shadow-md"
              >
                {/* Image */}
                <div
                  className={`relative w-32 ${getAspectRatioClass(
                    variant.type
                  )}`}
                >
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>

                {/* Variant Info */}
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    {variant.type} - &#8377;{variant.price}
                  </p>
                  <p className="text-xs text-gray-500">
                    License: {variant.license}
                  </p>
                </div>

                {/* Delete Button */}
                <Button
                  className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition-all"
                  onClick={() => handleDeleteVariant(index)}
                >
                  {deleteVariantPending && index === selectedIndex
                    ? "Deleting..."
                    : "Delete"}
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default ProductDetails;
