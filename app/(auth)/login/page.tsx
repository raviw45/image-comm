"use client";
import LoginPage from "@/components/LoginPage";
import React from "react";

const page = () => {
  return (
    <section className="w-screen h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white md:w-[420px] border shadow-gray-400 w-full shadow-lg rounded-lg p-8">
        <LoginPage setOpen={() => {}} />
      </div>
    </section>
  );
};

export default page;
