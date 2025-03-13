"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import AllProducts from "@/components/user/AllProducts";

const Page = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    if (session?.user?.role === "admin") {
      router.replace("/admin");
    } else {
      router.replace("/");
    }
  }, [session, status, router]);

  if (!session) return <h1 className="text-red-600 text-5xl">not logged</h1>;

  return (
    <div className="pt-20 px-2 overflow-x-hidden">
      <AllProducts />
    </div>
  );
};

export default Page;
