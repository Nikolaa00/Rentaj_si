"use client";
import { cn } from "@/lib/utils";
import {
  InstagramIcon,
  LinkedInIcon,
  FacebookIcon,
} from "@/app/components/ui/icons";
import { useRouter } from "next/navigation";

import { LucideLogOut } from "lucide-react";

interface FooterProps {
  className?: string;
  children?: React.ReactNode;
}

export function FooterContainer({ className, children }: FooterProps) {
  return (
    <div
      className={cn(
        "bg-[linear-gradient(180deg,var(--color-MY-palatte-2,rgba(85,98,125,0.67))_0%,var(--color-MY-palatte-1,rgba(44,44,44,0.67))_86.06%)] w-full max-w-[1600px] h-48 rounded-t-[3.125rem]",
        className
      )}
    >
      {children}
    </div>
  );
}

export function Footer({ className }: FooterProps) {
  const router = useRouter();
  const handleLogout = () => {
    localStorage.removeItem("authToken");

    router.push("/login");
  };
  return (
    <FooterContainer
      className={cn("flex justify-center items-center gap-[15px]", className)}
    >
      <a href="https://www.facebook.com/" aria-label="Facebook">
        <FacebookIcon />
      </a>
      <a href="https://www.instagram.com/" aria-label="LinkedIn">
        <LinkedInIcon />
      </a>
      <a href="https://www.linkedin.com/" aria-label="Instagram">
        <InstagramIcon />
      </a>
      <button onClick={handleLogout}>
        <LucideLogOut className="text-[#738089]"/>
      </button>
    </FooterContainer>
  );
}
