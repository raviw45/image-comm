import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.externals = config.externals || [];
    config.externals.push("nodemailer", "fs", "child_process", "tls", "net");
    return config;
  },
  images: {
    unoptimized: true,
    domains: ["res.cloudinary.com", "lh3.googleusercontent.com"],
  },
};

export default nextConfig;
