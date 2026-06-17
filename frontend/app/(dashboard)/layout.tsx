"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/shared/Navbar";
import { Header } from "@/components/shared/Header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("isSidebarOpen");
    if (stored !== null) {
      setIsSidebarOpen(stored === "true");
    }
  }, []);

  const handleSidebarToggle = (isOpen: boolean) => {
    setIsSidebarOpen(isOpen);
    localStorage.setItem("isSidebarOpen", String(isOpen));
  };

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row">
      <Navbar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={handleSidebarToggle} />
      <div className={`flex-1 flex flex-col transition-all duration-300 min-w-0 ${isSidebarOpen ? "md:ml-64" : "md:ml-20"}`}>
        <Header />
        <main className="flex-1 p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}