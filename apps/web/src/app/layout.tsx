import type { Metadata } from "next";
import { Cormorant_Garamond } from "next/font/google";
import { Toaster } from "@/shared/ui/sonner";
import { cn } from "@/shared/lib/cn";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-heading",
});

export const metadata: Metadata = {
  title: "Satuwaktu",
  description: "Kenangan yang tersimpan.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={cn(cormorant.variable)}>
      <body className="antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
