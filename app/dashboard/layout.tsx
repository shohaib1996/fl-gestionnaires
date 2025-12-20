"use client";

import LogoutButton from "@/components/auth/LogoutButton";
import LeftSidebar from "@/components/dashboard/LeftSidebar";
import RightSidebar from "@/components/dashboard/RightSidebar";
import { ModeToggle } from "@/components/ModeToggle/ModeToggle";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useUser } from "@/providers/UserProvider";
import { MenuIcon, Plus, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user } = useUser();

  return (
    <div className="h-screen w-screen flex flex-col bg-background text-gray-800 dark:bgbackround dark:text-gray-100 overflow-hidden">
      {/* Header */}
      <header className="hidden lg:flex items-center justify-between border-b bg-white px-6 py-3 shadow-sm dark:bg-neutral-800 shrink-0">
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
          {user && (
            <div className="flex flex-col">
              <span className="text-sm font-medium leading-none">
                {user?.fullName || ""}
              </span>
              <span className="text-xs leading-none text-muted-foreground">
                {user.email}
              </span>
            </div>
          )}
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
              <Button className="bg-[#63a053] hover:bg-[#528a45] rounded-xs cursor-pointer text-white text-sm px-4 py-2 flex items-center gap-1">
                <Plus className="w-4 h-4" /> Ajouter
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              sideOffset={6}
              className="w-44 bg-white dark:bg-neutral-800 border dark:border-neutral-700 shadow-md rounded-md"
            >
              {/* account requests */}
              <DropdownMenuItem className="cursor-pointer focus:bg-[#326EA6] focus:text-white">
                <Link href="/dashboard/account-requests">
                  Demande de compte
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => console.log("Add Task")}
                className="cursor-pointer focus:bg-[#326EA6] focus:text-white"
              >
                Tâche
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => console.log("Add Project")}
                className="cursor-pointer focus:bg-[#326EA6] focus:text-white"
              >
                Projet
              </DropdownMenuItem>
              <Link href="/contact">
                <DropdownMenuItem className="cursor-pointer focus:bg-[#326EA6] focus:text-white">
                  Contact
                </DropdownMenuItem>
              </Link>
              <DropdownMenuItem
                onClick={() => console.log("Add Dossier")}
                className="cursor-pointer focus:bg-[#326EA6] focus:text-white"
              >
                Dossier
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.push("/profile")}
                className="cursor-pointer focus:bg-[#326EA6] focus:text-white"
              >
                Profil
              </DropdownMenuItem>

              <div className="h-px bg-gray-300 my-1"></div>

              {/* logout button */}

              <DropdownMenuItem className="cursor-pointer transition text-red-600 focus:bg-red-600/10 focus:text-red-600 dark:focus:bg-red-600/20">
                <LogoutButton />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <ModeToggle />
          <MenuIcon />
        </div>
      </header>

      {/* Main layout */}
      <main className="flex w-screen h-screen bg-[#ebebeb] dark:bg-card overflow-hidden">
        <div className="hidden lg:block flex-none min-w-[14vw] h-full mt-19 ml-10 max-h-[72vh]">
          <LeftSidebar />
        </div>

        {/* Middle Section (Main Content) */}
        <main className="flex-1 flex flex-col lg:max-w-[70vw] overflow-hidden lg:px-4.5">
          <div className="flex-1 overflow-y-auto hide-scrollbar">
            {children}
          </div>
        </main>

        {/* Right Sidebar */}
        <div className="hidden lg:block flex-none min-w-[14vw] mt-19 mr-10 max-h-[35vh]">
          <RightSidebar />
        </div>
      </main>
    </div>
  );
}
