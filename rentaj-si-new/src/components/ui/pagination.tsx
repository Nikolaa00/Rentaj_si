import * as React from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontalIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";

function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      data-slot="pagination"
      className={cn("", className)}
      {...props}
    />
  );
}

function PaginationContent({
  className,
  ...props
}: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="pagination-content"
      className={cn("flex flex-row items-center gap-2", className)}
      {...props}
    />
  );
}

function PaginationItem({ ...props }: React.ComponentProps<"li">) {
  return <li data-slot="pagination-item" {...props} />;
}

type PaginationLinkProps = {
  isActive?: boolean;
  className?: string;
} & React.ComponentProps<"a">;

function PaginationLink({
  className,
  isActive,
  ...props
}: PaginationLinkProps) {
  return (
    <a
      aria-current={isActive ? "page" : undefined}
      data-slot="pagination-link"
      data-active={isActive}
      className={cn(
        "inline-flex items-center justify-center w-8 h-8 rounded-lg border-2 font-medium text-sm transition-all duration-300 ease-in-out cursor-pointer",
        isActive
          ? "bg-[#6FB3DD] border-[#11212D] text-[#11212D] shadow-lg border-3 font-bold w-9 h-9  "
          : "bg-[#11212D] border-[#6FB3DD] text-[#6FB3DD] hover:bg-cyan-950 hover:shadow-md hover:scale-105",
        className
      )}
      {...props}
    />
  );
}

function PaginationPrevious({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      aria-label="Go to previous page"
      className={cn(
        "w-8 h-8 border-2 bg-[#11212D] border-[#6FB3DD] text-[#6FB3DD] hover:bg-cyan-950 hover:shadow-md",
        className
      )}
      {...props}
    >
      <ChevronLeftIcon className="w-5 h-5" />
    </PaginationLink>
  );
}

function PaginationNext({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      aria-label="Go to next page"
      className={cn(
        "w-8 h-8 border-2 bg-[#11212D] border-[#6FB3DD] text-[#6FB3DD] hover:bg-cyan-950 hover:shadow-md",
        className
      )}
      {...props}
    >
      <ChevronRightIcon className="w-5 h-5" />
    </PaginationLink>
  );
}

function PaginationEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className={cn(
        "flex items-center justify-center  text-[#55627D]",
        className
      )}
      {...props}
    >
      <MoreHorizontalIcon className="w-5 h-5" />
    </span>
  );
}

export {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
};
