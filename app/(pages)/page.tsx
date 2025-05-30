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

  return (
    <div className="pt-20 px-2 overflow-hidden">
      <AllProducts />
    </div>
  );
};

export default Page;
