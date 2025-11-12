"use client";

import LeftSidebar from "@/components/dashboard/LeftSidebar";
import RightSidebar from "@/components/dashboard/RightSidebar";
import { ModeToggle } from "@/components/ModeToggle/ModeToggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MenuIcon, Search, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen w-screen flex flex-col bg-gray-100 text-gray-800 dark:bg-neutral-900 dark:text-gray-100 overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between border-b bg-white px-6 py-3 shadow-sm dark:bg-neutral-800 shrink-0">
        <div className="flex items-center gap-3">
          <Link href={`/dashboard`}>
            <div className="flex items-center gap-3">
              <Image
                src="/images/216_1705.png"
                alt="FL Logo"
                width={70}
                height={70}
                className="rounded-full"
              />
              <h1 className="text-lg md:text-xl font-bold text-[#63a053]">
                Gestionnaires
              </h1>
            </div>
          </Link>
          <div className="h-10 w-px bg-gray-400 mx-2" />

          <Image
            src="/images/profile.jpeg"
            alt="User photo"
            width={48}
            height={48}
            className="rounded-full object-cover h-12"
          />
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="hidden md:block relative w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#63a053] h-4 w-4" />
            <Input
              type="text"
              placeholder="Candidat, contact, activité, étiquette...ect"
              className="pl-9 bg-gray-100 border-0 text-sm placeholder:text-gray-500 focus-visible:ring-1 focus-visible:ring-[#63a053]"
            />
          </div>

          {/* Dropdown Trigger */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="bg-[#63a053] hover:bg-[#528a45] text-white text-sm px-4 py-2 flex items-center gap-1">
                <Plus className="w-4 h-4" /> Ajouter
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              sideOffset={6}
              className="w-44 bg-white dark:bg-neutral-800 border dark:border-neutral-700 shadow-md rounded-md"
            >
              <DropdownMenuItem
                onClick={() => console.log("Add Task")}
                className="cursor-pointer hover:bg-[#63a053]/10"
              >
                Tâche
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => console.log("Add Project")}
                className="cursor-pointer hover:bg-[#63a053]/10"
              >
                Projet
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => console.log("Add Contact")}
                className="cursor-pointer hover:bg-[#63a053]/10"
              >
                Contact
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => console.log("Add Dossier")}
                className="cursor-pointer hover:bg-[#63a053]/10"
              >
                Dossier
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <ModeToggle />
          <MenuIcon />
        </div>
      </header>

      {/* Main layout */}
      <main className="flex w-screen h-screen bg-[#ebebeb] overflow-hidden">
        <div className="flex-none min-w-[14vw] h-full mt-19 ml-10 max-h-[72vh]">
          <LeftSidebar />
        </div>

        {/* Middle Section (Main Content) */}
        <main className="flex-1 flex flex-col max-w-[70vw] max-h-[71vh] overflow-hidden px-6 pt-6">
          <div className="flex-1 overflow-y-auto">{children}</div>
        </main>

        {/* Right Sidebar */}
        <div className="flex-none min-w-[14vw] mt-19 mr-10 max-h-[35vh]">
          <RightSidebar />
        </div>
      </main>
    </div>
  );
}
