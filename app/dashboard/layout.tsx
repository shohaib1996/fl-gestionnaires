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
import { Search } from "lucide-react";
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
                src="/images/Logo FL.png"
                alt="FL Logo"
                width={72}
                height={70}
                quality={100}
                className="rounded-full"
              />
              <h1 className="text-lg md:text-xl font-bold text-[#63a053]">
                Gestionnaires
              </h1>
            </div>
          </Link>
          <div className="h-10 w-[0.3px] bg-[#000000] mx-2" />
          <div className="relative w-[37px] h-[37px] rounded-full overflow-hidden">
            <Image
              src="/images/Photo ID.png"
              alt="User photo"
              fill
              className="object-cover"
              sizes="37px"
            />
          </div>
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

        <div className="flex items-center gap-[15px]">
          {/* Search */}
          <div className="hidden md:block relative w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#63a053] h-4 w-4" />
            <Input
              type="text"
              placeholder="Candidat, contact, activité, étiquette...ect"
              className="pl-9 h-[37px] bg-gray-100 border-0 text-sm text-[#A4A4A4] placeholder:text-gray-500 focus-visible:ring-1 focus-visible:ring-[#63a053]"
            />
          </div>

          {/* Dropdown Trigger */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                style={{
                  padding: "10px",
                }}
                className="bg-[#63a053] hover:bg-[#528a45] rounded-xs cursor-pointer text-white text-sm  w-[43px] h-[31px] flex items-center gap-1"
              >
                <svg
                  className="w-[23px] h-[11px]"
                  viewBox="0 0 26 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1.15039 1.15002H24.1504"
                    stroke="white"
                    strokeWidth="2.3"
                    strokeLinecap="round"
                  />
                  <path
                    d="M1.15039 6.65002H24.1504"
                    stroke="white"
                    strokeWidth="2.3"
                    strokeLinecap="round"
                  />
                  <path
                    d="M1.15039 12.15H24.1504"
                    stroke="white"
                    strokeWidth="2.3"
                    strokeLinecap="round"
                  />
                </svg>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              sideOffset={6}
              className="w-44 bg-white dark:bg-neutral-800 border dark:border-neutral-700 shadow-md rounded-none"
            >
              {/* account requests */}
              <DropdownMenuItem className="cursor-pointer rounded-xs focus:bg-[#326EA6] focus:text-white">
                <Link href="/dashboard/account-requests">
                  Demande de compte
                </Link>
              </DropdownMenuItem>

              <Link href="/dashboard">
                <DropdownMenuItem className="cursor-pointer rounded-xs focus:bg-[#326EA6] focus:text-white">
                  Projet
                </DropdownMenuItem>
              </Link>

              <Link href="/contact">
                <DropdownMenuItem className="cursor-pointer rounded-xs focus:bg-[#326EA6] focus:text-white">
                  Contact
                </DropdownMenuItem>
              </Link>

              {/* <DropdownMenuItem
                onClick={() => router.push("/profile")}
                className="cursor-pointer rounded-xs focus:bg-[#326EA6] focus:text-white"
              >
                Profil
              </DropdownMenuItem> */}

              <div className="h-px bg-gray-300 my-1"></div>

              {/* logout button */}

              <DropdownMenuItem className="cursor-pointer rounded-xs transition text-red-600 focus:bg-red-600/10 focus:text-red-600 dark:focus:bg-red-600/20">
                <LogoutButton />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <ModeToggle />
        </div>
      </header>

      {/* Main layout */}
      <main className="flex w-screen h-screen bg-[#ebebeb] dark:bg-card overflow-hidden">
        <div className="hidden lg:block flex-none min-w-[14vw] h-full mt-19 ml-10 max-h-[80vh]">
          <LeftSidebar />
        </div>

        {/* Middle Section (Main Content) */}
        <main className="flex-1 flex flex-col lg:max-w-[70vw] overflow-hidden ps-5 pe-4">
          <div className="flex-1 overflow-y-auto hide-scrollbar">
            {children}
          </div>
        </main>

        {/* Right Sidebar */}
        <div className="hidden lg:block flex-none min-w-[14vw] mt-19 mr-10 max-h-[30vh]">
          <RightSidebar />
        </div>
      </main>
    </div>
  );
}
