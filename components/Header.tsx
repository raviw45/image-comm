"use client";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useSession } from "next-auth/react";

const Header = () => {
  const { data: session } = useSession();
  return (
    <header className="flex fixed z-20 shadow-md w-full bg-white justify-end px-8 py-2">
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
      <div className="flex justify-center items-center capitalize p-1 font-bold">
        {session?.user?.name ? (
          <span>{session?.user?.name}</span>
        ) : (
          <span>{session?.user?.username}</span>
        )}
      </div>
    </header>
  );
};

export default Header;
