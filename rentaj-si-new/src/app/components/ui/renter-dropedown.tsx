"use client";

import * as React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThreeDotsIcon } from "@/app/components/ui/three-dots-icon";
import { DropdownBackgroundIcon } from "@/app/components/ui/dropdown-background-icon";
import { MenuDividerIcon } from "@/app/components/ui/menu-divider-icon";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation"; 

interface UserDropdownMenuProps {
  className?: string;
}

export default function UserDropdownMenu({ className }: UserDropdownMenuProps) {
  const router = useRouter();

  const handleMyRentals = () => {
    router.push("/renter/rentals");
  };

  const handleDashboard = () => {
    router.push("/renter/dashboard");
  };

  const handleLogout = () => {

    localStorage.removeItem("authToken");

    router.push("/login");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="focus:outline-none rounded-full border-2 border-[#407BFF] transition-transform hover:scale-105 active:scale-95"
          aria-label="Open user menu"
        >
          <ThreeDotsIcon />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className={cn(
          "relative p-0 border-0 bg-transparent shadow-none overflow-visible w-fit origin-top animate-open ",
          className
        )}
        sideOffset={8}
      >
        <div className="relative">
          {/* Background */}
          <DropdownBackgroundIcon className="absolute left-[30px] drop-shadow-2xl pointer-events-none" />

          {/* Items */}
          <div className="relative flex left-[55px] top-[-5px] flex-col items-center gap-2 justify-center pt-16 pb-12 z-10">
            <DropdownMenuItem
              className="text-white focus:outline-none text-xl font-semibold italic bg-transparent hover:bg-transparent focus:bg-transparent cursor-pointer hover:scale-105 transition-transform"
              onClick={handleMyRentals}
            >
              My Rentals
            </DropdownMenuItem>

            <MenuDividerIcon />

            <DropdownMenuItem
              className="text-white focus:outline-none text-xl font-semibold italic bg-transparent hover:bg-transparent focus:bg-transparent cursor-pointer hover:scale-105 transition-transform"
              onClick={handleDashboard}
            >
              Dashboard
            </DropdownMenuItem>

            <MenuDividerIcon />

            <DropdownMenuItem
              variant="destructive"
              className="text-red-800 focus:outline-none text-xl font-bold italic bg-transparent hover:bg-transparent focus:bg-transparent cursor-pointer hover:scale-105 transition-transform"
              onClick={handleLogout}
            >
              Log out
            </DropdownMenuItem>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
