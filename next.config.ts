import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.externals.push("nodemailer", "fs", "child_process", "tls", "net");
    return config;
  },
  /* config options here */
  images: {
    unoptimized: true,
    domains: [
      "res.cloudinary.com",
      "lh3.googleusercontent.com",
      "https://mediastock.vercel.app/",
    ],
  },
};

export default nextConfig;
