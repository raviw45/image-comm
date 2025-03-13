"use client";

import React from "react";
import PageLoader from "./PageLoader";

const Loader = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-white backdrop-blur-md z-50">
      <div className="relative">
        <div className="relative w-32 h-32">
          <PageLoader />
        </div>

        <div className="absolute inset-0 bg-gradient-to-tr from-[#d64e9d]/10 via-transparent to-[#d64e9d]/5 animate-pulse rounded-full blur-sm"></div>
      </div>
    </div>
  );
};

export default Loader;
