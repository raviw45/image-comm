import Link from "next/link";
import React from "react";
import { Germania_One } from "next/font/google";

const germania = Germania_One({
  weight: "400",
  subsets: ["latin"],
});

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="container mx-auto flex flex-col items-center text-center">
        {/* MediaStock Logo */}
        <Link
          href={"/"}
          className={`text-3xl md:text-4xl text-[#d64e9d] font-bold ${germania.className}`}
        >
          MediaStock
        </Link>

        {/* Project Description */}
        <p className="text-gray-400 text-sm max-w-md mt-2">
          MediaStock is your go-to platform for high-quality, royalty-free
          images. Discover, download, and use stunning visuals for your next
          project.
        </p>

        {/* Contact Email */}
        <p className="text-gray-400 text-sm mt-4">
          Contact us:{" "}
          <a
            href="mailto:support@mediastock.com"
            className="text-blue-400 hover:text-blue-300"
          >
            codespace45@gmail.com
          </a>
        </p>

        {/* Copyright Text */}
        <p className="text-gray-500 text-xs mt-4">
          © {new Date().getFullYear()} MediaStock. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
