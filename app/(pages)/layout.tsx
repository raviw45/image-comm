import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "../globals.css";
import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mediastock - Get High-Quality Images",
  description: "Explore and purchase high-quality images on Mediastock.",
};

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.className} antialiased`}>
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="lazyOnload"
        />
        <Providers>
          <Navbar />
          {modal}
          {children}
        </Providers>
      </body>
    </html>
  );
}
