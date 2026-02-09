import React from "react";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[linear-gradient(180deg,var(--color-MY-palatte-1,#2C2C2C)0%,var(--color-MY-palatte-2,#55627D)90.38%)] min-h-screen flex flex-col items-center justify-between pb-10">
      <main>{children}</main>
    </div>
  );
}
