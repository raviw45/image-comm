"use client";
import React from "react";
import { SessionProvider, useSession } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import PageLoader from "./ui/PageLoader";

const Providers = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient();

  return (
    <SessionProvider refetchInterval={15 * 60}>
      <QueryClientProvider client={queryClient}>
        <SessionLoader>{children}</SessionLoader>
        <Toaster position="top-center" reverseOrder={false} />
      </QueryClientProvider>
    </SessionProvider>
  );
};

const SessionLoader = ({ children }: { children: React.ReactNode }) => {
  const { status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen">
        <PageLoader />
      </div>
    );
  }

  return children;
};

export default Providers;
