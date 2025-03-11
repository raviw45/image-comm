"use client";

import AddVoucherForm from "@/components/admin/AddVoucherForm";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import React, { useState } from "react";
import { LuTrash2 } from "react-icons/lu";
import { GrEdit } from "react-icons/gr";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDeleteVoucher, useGetVouchers } from "@/features/useOrder";
import { IVoucher } from "@/types/product.types";
import Loader from "@/components/ui/loader";

const Page = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [selectedVoucher, setSelectedVoucher] = useState<IVoucher | null>(null);

  const { vouchers, isVouchersLoading } = useGetVouchers();
  const { deleteVoucher } = useDeleteVoucher();

  const handleDeleteClick = (voucher: IVoucher) => {
    setSelectedVoucher(voucher);
    setIsDeleteModalOpen(true);
  };
  const handleEditClick = (voucher: IVoucher) => {
    setSelectedVoucher(voucher);
    setIsAddModalOpen(true);
  };

  const confirmDelete = () => {
    deleteVoucher(selectedVoucher?._id?.toString() || "");
    setIsDeleteModalOpen(false);
    setSelectedVoucher(null);
  };

  const onClose = () => {
    setIsAddModalOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedVoucher(null);
  };

  return (
    <>
      <div className="flex flex-col p-4">
        <Button onClick={() => setIsAddModalOpen(true)} className="self-end">
          Add Voucher
        </Button>

        {/* Responsive Table Container */}
        <div className="overflow-x-auto mt-4">
          {isVouchersLoading ? (
            <Loader />
          ) : (
            <Table className="w-full border">
              <TableCaption>A list of your vouchers.</TableCaption>
              <TableHeader>
                <TableRow className="hidden md:table-row">
                  <TableHead className="border-r text-center">Name</TableHead>
                  <TableHead className="border-r text-center">Code</TableHead>
                  <TableHead className="border-r text-center">
                    Expiry Date
                  </TableHead>
                  <TableHead className="border-r text-center">
                    Number Voucher
                  </TableHead>
                  <TableHead className="border-r text-center">Status</TableHead>
                  <TableHead className="border-r text-center">
                    Discount Amount
                  </TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vouchers.map((voucher: IVoucher, index: number) => (
                  <TableRow key={index} className="flex flex-col md:table-row">
                    <TableCell className="border-r text-center md:table-cell">
                      {voucher.name}
                    </TableCell>
                    <TableCell className="border-r text-center md:table-cell">
                      {voucher.code}
                    </TableCell>
                    <TableCell className="border-r text-center md:table-cell">
                      {new Date(voucher.expiryDate).toLocaleDateString(
                        "en-GB",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        }
                      )}
                    </TableCell>
                    <TableCell className="border-r text-center md:table-cell">
                      {voucher.voucherCount}
                    </TableCell>
                    <TableCell className="border-r text-center md:table-cell">
                      {voucher.isActive ? (
                        <span className="md:w-auto  w-20 bg-green-500 rounded-md flex justify-center items-center text-white px-2">
                          active
                        </span>
                      ) : (
                        <span className="bg-black rounded-md flex justify-center items-center text-white px-2">
                          disabled
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="border-r text-center md:table-cell">
                      {voucher.discountAmount}
                    </TableCell>
                    {/* Actions */}
                    <TableCell className="text-center flex gap-2 justify-center flex-wrap">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDeleteClick(voucher)}
                        className="w-8 h-8 p-1 md:w-auto md:h-auto"
                      >
                        <LuTrash2 size={16} />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEditClick(voucher)}
                        className="w-8 h-8 p-1 md:w-auto md:h-auto"
                      >
                        <GrEdit size={16} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      {/* Add Voucher Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={() => onClose()}>
        <DialogContent className="w-[80%] md:w-auto rounded-md">
          <DialogTitle hidden>Add Voucher</DialogTitle>
          <AddVoucherForm voucher={selectedVoucher} onClose={() => onClose()} />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="text-center w-[90%] md:w-auto">
          <DialogTitle className="text-red-600">Confirm Deletion</DialogTitle>
          <p>
            Are you sure you want to delete{" "}
            <strong>{selectedVoucher?.name}</strong>?
          </p>
          <div className="flex justify-center gap-4 mt-4">
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Page;
