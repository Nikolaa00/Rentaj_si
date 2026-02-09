import type { Metadata } from "next";
import "./globals.css";
import { Poppins } from "next/font/google";

// Вчитување на Poppins и врзување со CSS variable --font-sans
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["200","300","400", "500", "600", "700"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "RentajSi",
  description: "Car rental application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${poppins.variable}`}>
        {children}
      </body>
    </html>
  );
}
