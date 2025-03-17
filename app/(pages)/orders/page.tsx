"use client";

import { useGetOrders } from "@/features/useOrder";
import React from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import Loader from "@/components/ui/loader";
import { saveAs } from "file-saver";
import { IMAGE_VARIANTS } from "@/types/product.types";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { PiDownloadSimpleBold } from "react-icons/pi";

const getDownloadUrl = (imageUrl: string, variantType: string) => {
  const baseUrl = imageUrl.split("/upload/")[0];
  const publicId = imageUrl.split("/upload/")[1];

  const variant = IMAGE_VARIANTS[variantType as keyof typeof IMAGE_VARIANTS];
  if (!variant) return imageUrl;

  const { width, height } = variant.dimensions;
  const transformation = `upload/w_${width},h_${height},c_fill`;

  return `${baseUrl}/${transformation}/${publicId}`;
};

const handleDownload = (imageUrl: string, variantType: string) => {
  const downloadUrl = getDownloadUrl(imageUrl, variantType);
  saveAs(downloadUrl, `image-${variantType.toLowerCase()}.jpg`);
};

const OrdersPage = () => {
  const { orders, isOrdersLoading } = useGetOrders();
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-lg font-medium">
          You must be logged in to view your orders.
        </p>
        <Button className="mt-4" onClick={() => router.push("/login")}>
          Login
        </Button>
      </div>
    );
  }

  if (isOrdersLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <section className="pt-20 px-4 md:px-10">
      <h1 className="text-2xl font-bold mb-6 text-center">Your Orders</h1>
      {orders.length === 0 ? (
        <p className="text-center text-gray-500">No orders found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {orders.map((order: any) => (
            <div
              key={order._id}
              className="bg-white shadow-md rounded-lg p-4 flex flex-col gap-4 border"
            >
              <div className="relative w-full h-48 rounded-lg overflow-hidden">
                <Image
                  src={order.productId.image}
                  alt={order.productId.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col gap-1">
                <h2 className="text-lg font-semibold">
                  {order.productId.name}
                </h2>
                <Badge
                  className={`text-white w-fit ${
                    order.status === "completed"
                      ? "bg-green-500"
                      : "bg-yellow-500"
                  }`}
                >
                  {order.status}
                </Badge>
                <p className="text-sm text-gray-500">
                  Ordered on: {new Date(order.createdAt).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Variant:</span>{" "}
                  {order.variant.type} ({order.variant.license})
                </p>
                <p className="text-lg font-semibold text-blue-600">
                  ₹{order.amount}
                </p>
                {order.status === "completed" && (
                  <Button
                    onClick={() =>
                      handleDownload(order.productId.image, order.variant.type)
                    }
                    className="mt-2 text-white px-4 py-2 rounded-md text-sm transition"
                  >
                    <PiDownloadSimpleBold />
                    Download
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default OrdersPage;
