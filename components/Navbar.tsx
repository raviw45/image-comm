"use client";
import React, { useState, useEffect } from "react";
import { Germania_One } from "next/font/google";
import Link from "next/link";
import { Button } from "./ui/button";
import { IoMenu, IoClose } from "react-icons/io5";
import { BsCart3 } from "react-icons/bs";
import { FaClipboardList } from "react-icons/fa";
import { MdLogout } from "react-icons/md";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useLogout } from "@/features/useAuth";
import Spinner from "./Spinner";
import { useGetCartItems } from "@/features/useCart";

const germania = Germania_One({
  weight: "400",
  subsets: ["latin"],
});

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session } = useSession();
  const { logout, isLogoutPending } = useLogout();
  const { cartItems } = useGetCartItems();
  const [cartCount, setCartCount] = useState<number>(0);

  useEffect(() => {
    setCartCount(cartItems?.length || 0);
  }, [cartItems]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
  };

  const UserLinks = () => {
    return (
      <>
        <DropdownMenuItem asChild>
          <Link href="/orders" className="flex items-center gap-2">
            <FaClipboardList className="text-gray-700 text-lg" />
            Orders
          </Link>
        </DropdownMenuItem>
      </>
    );
  };

  if (session?.user?.role === "admin") return;

  return (
    <nav className="w-screen fixed z-50 h-20 bg-white">
      <div className="w-full h-full flex justify-between items-center md:px-10 px-2">
        <div className="flex flex-row gap-8">
          <Link
            href={"/"}
            className={`md:text-[38px] text-[30px] text-[#d64e9d] font-bold ${germania.className}`}
          >
            mediastock
          </Link>
          <ul className="md:flex hidden flex-row gap-6 justify-center items-center">
            <li>
              <Link
                href="/images"
                className="capitalize text-[17px] text-gray-700 font-medium"
              >
                images
              </Link>
            </li>
            <li>
              <Link
                href="/videos"
                className="capitalize text-[17px] text-gray-700 font-medium"
              >
                videos
              </Link>
            </li>
          </ul>
        </div>

        {/* User Avatar & Dropdown Menu */}
        <div className="flex flex-row justify-center items-center md:gap-6 gap-4">
          <Link href="/cart" className="relative flex items-center">
            <BsCart3 className="text-gray-700 text-2xl font-bold" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </Link>

          {!session ? (
            <>
              <Link
                href="/login"
                className="text-md text-gray-700 md:flex justify-center items-center hidden"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="md:flex justify-center items-center hidden"
              >
                <Button>Sign Up</Button>
              </Link>
            </>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger className="focus:outline-none">
                <Avatar className="border-2 border-gray-700 cursor-pointer">
                  {session?.user?.image ? (
                    <AvatarImage
                      src={session.user.image}
                      alt="User Image"
                      width={30}
                      height={30}
                    />
                  ) : (
                    <AvatarFallback className="text-xl font-bold text-black">
                      {session?.user?.name
                        ? session.user.name.charAt(0).toUpperCase()
                        : session?.user?.username?.slice(0, 1)}
                    </AvatarFallback>
                  )}
                </Avatar>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-40 m-4 ">
                <UserLinks />
                <DropdownMenuItem asChild>
                  {isLogoutPending ? (
                    <Spinner />
                  ) : (
                    <div
                      onClick={() => handleLogout()}
                      className="flex items-center gap-2 text-red-500 "
                    >
                      <MdLogout className=" text-lg" />
                      Logout
                    </div>
                  )}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Mobile Menu Button */}
          <div className="md:hidden flex justify-center items-center">
            <button onClick={toggleMenu}>
              {isMenuOpen ? (
                <IoClose className="text-gray-700 text-2xl" />
              ) : (
                <IoMenu className="text-gray-700 text-2xl" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute top-20 left-0 w-full bg-white shadow-md py-4 flex flex-col items-center gap-4 md:hidden">
          <Link
            href="/images"
            className="capitalize text-[17px] text-gray-700"
            onClick={() => setIsMenuOpen(false)}
          >
            images
          </Link>
          <Link
            href="/videos"
            className="capitalize text-[17px] text-gray-700"
            onClick={() => setIsMenuOpen(false)}
          >
            videos
          </Link>
          {!session && (
            <div className="flex gap-4 flex-row">
              <Link
                href="/login"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-md text-gray-700 md:m-0 m-2 flex justify-center items-center"
              >
                Login
              </Link>
              <Button
                variant="default"
                className="flex justify-center items-center"
              >
                Sign Up
              </Button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
