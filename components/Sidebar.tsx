"use client";

import React, { useState, useEffect } from "react";
import { Germania_One } from "next/font/google";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BiHome,
  BiShoppingBag,
  BiUser,
  BiBell,
  BiLogOut,
  BiMenu,
  BiX,
  BiLayerPlus,
} from "react-icons/bi";
import { useLogout } from "@/features/useAuth";
import Spinner from "./Spinner";

const germania = Germania_One({
  weight: "400",
  subsets: ["latin"],
});

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { logout, isLogoutPending } = useLogout();

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [isOpen]);

  return (
    <div className="relative z-50 overflow-x-hidden">
      {/* Mobile Toggle Button */}
      <button
        className="md:hidden fixed p-4 text-3xl text-gray-700"
        onClick={() => setIsOpen(true)}
        aria-label="Open Sidebar"
      >
        <BiMenu />
      </button>

      {/* Overlay for Mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 z-50 flex flex-col bg-white shadow-xl w-64 md:w-56 h-screen overflow-y-auto rounded-r-3xl transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Close Button for Mobile */}
        <button
          className="absolute top-4 right-4 md:hidden text-2xl text-gray-700"
          onClick={() => setIsOpen(false)}
          aria-label="Close Sidebar"
        >
          <BiX />
        </button>

        {/* Logo */}
        <div className="flex items-center justify-center h-20 shadow-md">
          <h2
            className={`md:text-[38px] text-[30px] text-[#d64e9d] font-bold ${germania.className}`}
          >
            mediastock
          </h2>
        </div>

        {/* Navigation Menu */}
        <ul className="flex flex-col py-4">
          <SidebarItem href="/admin" icon={<BiHome />} label="Dashboard" />
          <SidebarItem
            href="/admin/shopping"
            icon={<BiShoppingBag />}
            label="Sell History"
          />
          <SidebarItem
            href="/admin/create"
            icon={<BiLayerPlus />}
            label="Create"
          />
          <SidebarItem href="/profile" icon={<BiUser />} label="Profile" />
          <SidebarItem
            href="/admin/notifications"
            icon={<BiBell />}
            label="Notifications"
            badge="5"
          />
          <li
            onClick={() => {
              logout();
            }}
            className="flex cursor-pointer flex-row items-center h-12 px-4 transform hover:translate-x-2 transition-all ease-in duration-200 text-red-500 hover:text-red-300 group"
          >
            <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-red-500 group-hover:text-red-300 transition-colors">
              <BiLogOut />
            </span>
            {isLogoutPending ? (
              <Spinner />
            ) : (
              <span className="text-sm font-medium">Logout</span>
            )}
          </li>
        </ul>
      </div>
    </div>
  );
};

const SidebarItem = ({
  href,
  icon,
  label,
  badge = "",
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  badge?: string;
}) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <li>
      <Link
        href={href}
        className={`flex flex-row items-center h-12 px-4 transform hover:translate-x-2 transition-all ease-in duration-200 ${
          isActive
            ? "bg-gray-200 text-gray-900 font-semibold"
            : "text-gray-500 hover:text-gray-800"
        }`}
      >
        <span
          className={`inline-flex items-center justify-center h-12 w-12 text-lg ${
            isActive ? "text-gray-900" : "text-gray-400"
          }`}
        >
          {icon}
        </span>
        <span className="text-sm font-medium">{label}</span>
        {badge && (
          <span className="ml-auto mr-6 text-sm bg-red-100 rounded-full px-3 py-px text-red-500">
            {badge}
          </span>
        )}
      </Link>
    </li>
  );
};

export default Sidebar;
