/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import LoginPage from "@/components/LoginPage";
import React, { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Germania_One } from "next/font/google";
import { useRouter } from "next/navigation";
const germania = Germania_One({
  weight: "400",
  subsets: ["latin"],
});

const page: React.FC = () => {
  const [open, setOpen] = useState(true);
  const router = useRouter();
  return (
    <Dialog open={open} onOpenChange={() => router.back()}>
      <DialogContent className="md:px-8 space-y-0">
        <DialogTitle
          className={`text-center md:text-[38px] text-[30px] text-[#d64e9d] font-bold ${germania.className}`}
        >
          mediastock
        </DialogTitle>
        <LoginPage setOpen={() => setOpen(!open)} />
      </DialogContent>
    </Dialog>
  );
};

export default page;
