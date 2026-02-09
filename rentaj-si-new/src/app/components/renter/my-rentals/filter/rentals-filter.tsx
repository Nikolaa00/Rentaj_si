"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";

type FilterStatus = "All" | "Confirmed" | "Canceled";

const Divider: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="190"
    height="2"
    viewBox="0 0 190 2"
    fill="none"
  >
    <path
      d="M0 1C3.16667 1.03333 6.33333 1.065 9.5 1.095C38 1.365 66.5 1.5 95 1.5C123.5 1.5 152 1.365 180.5 1.095C183.667 1.065 186.833 1.03333 190 1C186.833 0.966667 183.667 0.935 180.5 0.905C152 0.635 123.5 0.5 95 0.5C66.5 0.5 38 0.635 9.5 0.905C6.33333 0.935 3.16667 0.966667 0 1Z"
      fill="white"
    />
  </svg>
);

interface FilterDropdownProps {
  onFilterChange?: (filter: FilterStatus) => void;
}

export default function FilterDropdown({
  onFilterChange,
}: FilterDropdownProps) {
  const [selectedFilter, setSelectedFilter] =
    React.useState<FilterStatus>("All");
  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  const filters: FilterStatus[] = ["All", "Confirmed", "Canceled"];

  const handleFilterSelect = (filter: FilterStatus): void => {
    setSelectedFilter(filter);
    setIsOpen(false);
    onFilterChange?.(filter);
  };

  return (
    <div className="w-[280px]">
      <p className="pl-8 text-gray-700 italic text-sm mb-3 text-start font-semibold">
        Filter by status
      </p>

      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <button className="w-full bg-white rounded-full border-3 border-[#407BFF] px-6 py-4 h-auto flex items-center justify-between shadow-lg transition-all  outline-none">
            <span className="text-gray-700 italic  text-sm font-light">
              {selectedFilter}
            </span>
            <Image
              src={"/svg/AC.svg"}
              alt="Arrow icon"
              width={24}
              height={32}
              className={`w-5 h-5 text-black transition-transform duration-300 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          className="w-(--radix-dropdown-menu-trigger-width) 
             bg-[linear-gradient(180deg,#6FB3DD_0%,#2C2C2C_100%)] 
             rounded-3xl border-0 p-4
             origin-top animate-open "
          align="center"
        >
          {filters.map((filter: FilterStatus, index: number) => (
            <React.Fragment key={filter}>
              <DropdownMenuItem
                onClick={() => handleFilterSelect(filter)}
                className="text-white text-lg [text-shadow:0_4px_4px_black]   italic font-medium py-3 px-4 rounded-2xl hover:scale-105 transition text-center justify-center cursor-pointer  hover:outline-none hover:border-none"
              >
                Sort by {filter}
              </DropdownMenuItem>
              {index < filters.length - 1 && (
                <div className="flex justify-center ">
                  <Divider />
                </div>
              )}
            </React.Fragment>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
