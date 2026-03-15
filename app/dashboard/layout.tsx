"use client";

import LeftSidebar from "@/components/dashboard/LeftSidebar";
import RightSidebar from "@/components/dashboard/RightSidebar";
import Header from "@/components/Header/Header";
import { useEffect, useState } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  if (!isDesktop) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-background text-gray-800 dark:text-gray-100 p-8 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 mb-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        <h1 className="text-2xl font-semibold mb-3">Desktop Only</h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-sm">
          This dashboard is only accessible on desktop. Please use a desktop computer to access this page.
        </p>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-background text-gray-800 dark:bgbackround dark:text-gray-100 overflow-hidden">
      {/* Header */}
      <Header />

      {/* Main layout */}
      <main className="flex w-screen h-screen bg-[#ebebeb] dark:bg-card overflow-hidden">
        <div className="hidden lg:block flex-none min-w-[14vw] h-full mt-19 ml-10 max-h-[72vh]">
          <LeftSidebar />
        </div>

        {/* Middle Section (Main Content) */}
        <main className="flex-1 flex flex-col lg:max-w-[72.5vw] overflow-hidden ps-5 pe-4">
          <div className="flex-1 overflow-y-auto hide-scrollbar">
            {children}
          </div>
        </main>

        {/* Right Sidebar */}
        <div className="hidden lg:block flex-none min-w-[9.5vw] mt-19 mr-10 max-h-[30vh]">
          <RightSidebar />
        </div>
      </main>
    </div>
  );
}
