"use client";

import { useGetAllOrders } from "@/features/useOrder";
import React, { useMemo, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Loader from "@/components/ui/loader";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const OrdersPage = () => {
  const { isOrdersLoading, orders = [] } = useGetAllOrders(); // Ensure orders is always an array

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 6;

  const filteredOrders = useMemo(() => {
    return orders?.filter((order: any) => {
      const matchesSearch =
        order.productId?.name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        order.userId?.username
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        order.amount.toString().includes(searchTerm);

      const matchesDate = selectedDate
        ? new Date(order.createdAt).toISOString().split("T")[0] === selectedDate
        : true;

      return matchesSearch && matchesDate;
    });
  }, [orders, searchTerm, selectedDate]);

  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * ordersPerPage,
    currentPage * ordersPerPage
  );

  // Dates for filtering
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const currentMonth = today.getMonth();
  const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;

  // Filter orders
  const todayOrders = useMemo(
    () =>
      orders.filter((order: any) => {
        const orderDate = new Date(order?.createdAt);
        orderDate.setHours(0, 0, 0, 0);
        return orderDate.getTime() === today.getTime();
      }),
    [orders, today]
  );

  const previousMonthOrders = useMemo(
    () =>
      orders.filter(
        (order: any) => new Date(order?.createdAt).getMonth() === previousMonth
      ),
    [orders, previousMonth]
  );

  const currentMonthSales = useMemo(
    () =>
      orders
        .filter(
          (order: any) => new Date(order?.createdAt).getMonth() === currentMonth
        )
        .reduce((acc: number, order: any) => acc + order.amount, 0),
    [orders, currentMonth]
  );

  const previousMonthSales = useMemo(
    () =>
      previousMonthOrders.reduce(
        (acc: number, order: any) => acc + order.amount,
        0
      ),
    [previousMonthOrders]
  );

  if (isOrdersLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <section className="p-4 md:p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold text-center mb-6">
        Order History
      </h1>

      {/* Analytics Section */}
      <div className="flex flex-wrap justify-center items-center gap-4 mb-8">
        {[
          { title: "Total Orders", value: orders.length },
          { title: "Today's Orders", value: todayOrders.length },
          { title: "Previous Month Orders", value: previousMonthOrders.length },
          { title: "Current Month Sales", value: `₹${currentMonthSales}` },
          { title: "Previous Month Sales", value: `₹${previousMonthSales}` },
        ].map((item, index) => (
          <Card
            key={index}
            className="p-4 w-52 shadow-md border rounded-xl bg-white hover:shadow-lg transition-all duration-300"
          >
            <CardHeader>
              <CardTitle className="text-sm hidden sm:text-base whitespace-nowrap">
                {item.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col justify-center items-center gap-2">
              <h2 className="font-medium text-center whitespace-nowrap">
                {item.title}
              </h2>
              <p className="text-lg font-semibold">{item.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
        <div>
          <h2 className="text-sm ml-2">Apply filter</h2>
          <Input
            type="text"
            placeholder="Search by name or amount"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 border rounded-lg shadow-sm w-full md:w-64"
          />
        </div>
        <div className="space-y-1">
          <h2 className="text-sm ml-2">Filter by Date</h2>
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="p-2 border rounded-lg shadow-sm w-full md:w-64"
          />
        </div>
      </div>

      {/* Orders Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedOrders.map((order: any) => (
          <Card
            key={order._id?.toString()}
            className="shadow-lg border rounded-xl overflow-hidden"
          >
            {order.productId?.image && (
              <Image
                width={100}
                height={100}
                src={order.productId.image}
                alt={order.productId.name}
                className="w-full h-48 object-contain"
              />
            )}
            <CardHeader className="p-4">
              <CardTitle className="text-lg font-semibold text-gray-800">
                {order.productId?.name}
              </CardTitle>
              <p className="text-sm text-gray-500">
                {order.userId?.username} | {order.userId?.email}
              </p>
            </CardHeader>
            <CardContent className="p-4 flex flex-col gap-3">
              <div className="flex justify-between text-sm text-gray-600">
                <span className="font-medium">Amount:</span>
                <span className="font-semibold">₹{order.amount}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span className="font-medium">Variant:</span>
                <span className="font-semibold">
                  {order.variant?.type} ({order.variant?.license})
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Status:</span>
                <Badge
                  className={`px-4 py-1 text-white rounded-full text-xs font-semibold ${
                    order.status === "completed"
                      ? "bg-green-500"
                      : order.status === "pending"
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  }`}
                >
                  {order.status}
                </Badge>
              </div>
              <p className="text-xs text-right text-gray-500">
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <Button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            Previous
          </Button>
          <span className="font-semibold">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </section>
  );
};

export default OrdersPage;
