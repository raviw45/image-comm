import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "../globals.css";
import Providers from "@/components/Providers";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mediastock - Admin Panel",
  description: "Manage Images and orders",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.className} antialiased`}>
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="lazyOnload"
        />
        <Providers>
          <section className="flex min-h-screen overflow-x-hidden">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <main className="flex flex-col flex-1 min-h-screen">
              <Header />
              <div className="md:p-4 md:ml-56 md:pt-20 pt-16">{children}</div>
            </main>
          </section>
        </Providers>
      </body>
    </html>
  );
}
