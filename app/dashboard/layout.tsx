"use client";

import LeftSidebar from "@/components/dashboard/LeftSidebar";
import RightSidebar from "@/components/dashboard/RightSidebar";
import Header from "@/components/Header/Header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
        <main className="flex-1 flex flex-col lg:max-w-[71vw] overflow-hidden ps-5 pe-4">
          <div className="flex-1 overflow-y-auto hide-scrollbar">
            {children}
          </div>
        </main>

        {/* Right Sidebar */}
        <div className="hidden lg:block flex-none min-w-[11vw] mt-19 mr-10 max-h-[30vh]">
          <RightSidebar />
        </div>
      </main>
    </div>
  );
}
