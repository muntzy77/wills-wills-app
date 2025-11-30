import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import type { ReactNode } from "react";

export const metadata = {
  title: "Will’s Wills",
  description: "Modern Estate Planning. Simplified."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#FAFAFA] text-black min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 max-w-4xl mx-auto py-8 px-6">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
