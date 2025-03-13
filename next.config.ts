import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.externals.push("nodemailer", "fs", "child_process", "tls", "net");
    return config;
  },
  /* config options here */
  images: {
    domains: ["res.cloudinary.com"],
  },
};

export default nextConfig;
