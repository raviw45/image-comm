/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useDeleteProduct, useGetProducts } from "@/features/useProduct";
import { useGetVouchers } from "@/features/useOrder";
import Loader from "@/components/ui/loader";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { BiTrash } from "react-icons/bi";
import Spinner from "@/components/Spinner";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { FaSearch } from "react-icons/fa";
import { IVoucher } from "@/types/product.types";

const AllProducts = () => {
  const { data: session } = useSession();
  const { products, isProductsLoading } = useGetProducts();
  const { deleteProduct, deleteProductPending } = useDeleteProduct();
  const { isVouchersLoading, vouchers } = useGetVouchers();

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [selectedVoucher, setSelectedVoucher] = useState<IVoucher | null>(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery.toLowerCase().trim());
    }, 300);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Filter valid vouchers
  useEffect(() => {
    if (vouchers?.length > 0) {
      const validVouchers = vouchers.filter(
        (voucher: IVoucher) =>
          voucher.voucherCount > 0 &&
          voucher.isActive &&
          new Date(voucher.expiryDate) > new Date()
      );

      if (validVouchers.length > 0) {
        const randomVoucher =
          validVouchers[Math.floor(Math.random() * validVouchers.length)];
        setSelectedVoucher(randomVoucher);
      } else {
        setSelectedVoucher(null);
      }
    }
  }, [vouchers]);

  if (isProductsLoading) return <Loader />;

  const handleDelete = async (id: string) => {
    deleteProduct(id);
  };

  const filteredProducts = products?.filter((product: any) =>
    product?.name.toLowerCase().includes(debouncedQuery)
  );

  return (
    <section className="overflow-hidden">
      {/* Show the Voucher Code Section */}
      {session?.user?.role !== "admin" &&
        selectedVoucher &&
        !isVouchersLoading && (
          <div className="bg-yellow-200 text-black p-4 rounded-lg text-center mb-4">
            <p className="text-lg font-semibold">
              🎉 Special Offer: {selectedVoucher?.name}
            </p>
            <p className="text-sm">
              Use code <span className="font-bold">{selectedVoucher.code}</span>{" "}
              for{" "}
              <span className="font-bold">
                {selectedVoucher.discountAmount}%
              </span>{" "}
              off!
            </p>
            <p className="text-xs text-gray-700">
              Valid until:{" "}
              {new Date(selectedVoucher.expiryDate).toLocaleDateString()}
            </p>
          </div>
        )}

      {/* Search Bar */}
      <div className="relative md:h-[70vh] h-auto md:p-0 py-4 w-full mb-4 bg-black">
        <div className="absolute inset-0 bg-black/60"></div>
        <Image
          src={"/bg.jpg"}
          quality={100}
          width={100}
          height={100}
          layout="fill"
          alt="Background Image"
          className="absolute w-full h-full inset-0 opacity-70 bg-cover bg-center"
        />

        <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 sm:px-6 text-center">
          {session?.user?.role !== "admin" && (
            <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight max-w-2xl">
              Discover Stunning Free Stock Photos & Royalty-Free Images
            </h1>
          )}
          {session?.user?.role === "admin" && (
            <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight max-w-2xl">
              Manage and search all available Images
            </h1>
          )}

          <div className="relative w-full max-w-xl mt-6">
            <input
              type="text"
              placeholder="Search high-quality images..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-5 pr-12 py-3 text-base sm:text-lg rounded-full border-none shadow-md bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/50 transition-all"
            />
            <FaSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600 text-lg sm:text-xl cursor-pointer" />
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 mb-4 py-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {filteredProducts?.length > 0 ? (
          filteredProducts.map((product: any, index: number) => (
            <div
              key={index}
              className="relative group overflow-hidden rounded-lg shadow-lg border border-gray-200 bg-white hover:shadow-2xl transition-all duration-300"
            >
              <Link
                href={`${
                  session?.user?.role === "admin"
                    ? "/admin/product/"
                    : "/product/"
                }${product?._id}`}
              >
                <div className="relative h-48 sm:h-56 md:h-60 w-full">
                  <Image
                    src={product?.image}
                    alt={product?.name}
                    layout="fill"
                    objectFit="cover"
                    className="group-hover:scale-105 transition-transform duration-300"
                  />

                  <div className="absolute bottom-0 left-0 w-full bg-black/70 text-white px-3 py-2 text-center transition-opacity duration-300">
                    <p className="text-sm font-medium truncate">
                      {product?.name}
                    </p>
                  </div>
                </div>
              </Link>

              {session?.user?.role === "admin" && (
                <div className="absolute top-3 right-3 bg-black/60 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    onClick={() => handleDelete(product?._id)}
                    className="p-2 rounded-full hover:bg-red-500 transition duration-300"
                  >
                    {deleteProductPending ? (
                      <Spinner />
                    ) : (
                      <BiTrash size={22} className="text-white" />
                    )}
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-center col-span-full text-gray-500">
            No images found.
          </p>
        )}
      </div>
    </section>
  );
};

export default AllProducts;
