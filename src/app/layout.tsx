import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { cn } from "@/lib/utils";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AI Career Platform",
  description: "Next-gen career readiness platform",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={cn("h-full antialiased dark", "font-sans")}
      style={{ colorScheme: "dark" }}
    >
      <body className={cn("min-h-full flex flex-col font-sans overflow-x-hidden w-full max-w-full bg-black text-zinc-50", inter.variable)}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
