"use client";

import { useDeleteProduct, useGetProducts } from "@/features/useProduct";
import Loader from "@/components/ui/loader";
import Image from "next/image";
import React from "react";
import { BiTrash } from "react-icons/bi";
import Spinner from "@/components/Spinner";
import Link from "next/link";

const Page = () => {
  const { products, isProductsLoading } = useGetProducts();
  const { deleteProduct, deleteProductPending } = useDeleteProduct();
  if (isProductsLoading) return <Loader />;

  const handleDelete = async (id: string) => {
    deleteProduct(id);
  };
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-4">
      {products.map((product: any, index: number) => (
        <div
          key={index}
          className="relative group overflow-hidden rounded-lg shadow-md border border-gray-200 bg-white hover:shadow-xl transition-all duration-300"
        >
          {/* Image Section */}
          <Link href={`/admin/product/${product?._id}`}>
            <div className="relative h-48 sm:h-56 md:h-60 w-full">
              <Image
                src={product?.image}
                alt={product?.name}
                layout="fill"
                objectFit="cover"
                className="group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          </Link>

          {/* Overlay on Hover */}
          <div className="absolute bottom-0 left-0 w-full bg-black/60 text-white p-3 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <h2 className="text-sm font-medium truncate">{product?.name}</h2>
            <button
              onClick={() => handleDelete(product?._id)}
              className="p-1 rounded-full hover:bg-red-500 transition duration-300"
            >
              {deleteProductPending ? (
                <Spinner />
              ) : (
                <BiTrash size={22} className="text-white" />
              )}
            </button>
          </div>
        </div>
      ))}
    </section>
  );
};

export default Page;
