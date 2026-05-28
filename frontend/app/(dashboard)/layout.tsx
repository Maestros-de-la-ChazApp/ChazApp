"use client";

import { Navbar } from "@/components/shared/Navbar";
import { Header } from "@/components/shared/Header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white md:flex flex-col">
      <Header />
      <Navbar />
      <main className="flex-1 md:ml-20 p-4 md:p-8">
        {children}
      </main>
    </div>
  );
}