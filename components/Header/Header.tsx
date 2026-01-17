"use client";

import { useUser } from "@/providers/UserProvider";
import { Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import LogoutButton from "../auth/LogoutButton";
import { ModeToggle } from "../ModeToggle/ModeToggle";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Input } from "../ui/input";

const Header = () => {
  const { user } = useUser();

  return (
    <header className="hidden lg:flex items-center h-28 justify-between border-b bg-white px-6 py-3 shadow-sm dark:bg-neutral-800 shrink-0">
      <div className="flex items-center gap-3">
        <Link href={`/dashboard`}>
          <div className="flex items-center gap-3">
            <Image
              src="/images/FLLogo.svg"
              alt="FL Logo"
              width={90}
              height={90}
              quality={100}
              className="rounded-full"
            />
            <h1 className="text-lg md:text-[1.5rem] font-bold text-[#63a053]">
              Gestionnaires
            </h1>
          </div>
        </Link>
        <div className="h-10 w-[0.3px] bg-[#000000] mx-2" />
        <div className="relative w-12 h-12 rounded-full overflow-hidden">
          <Image
            src="/images/christina.jpg"
            alt="User photo"
            width={65}
            height={65}
            className="object-cover"
            sizes="65px"
          />
        </div>
        {user && (
          <div className="flex flex-col">
            <span className="text-[1.125rem] font-medium leading-none">
              {user?.fullName || ""}
            </span>
            <span className="text-[1rem] leading-none text-muted-foreground">
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
            className="pl-9 h-10 bg-gray-100 border-0 text-sm text-[#A4A4A4] placeholder:text-gray-500 focus-visible:ring-1 focus-visible:ring-[#63a053]"
          />
        </div>

        {/* Dropdown Trigger */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              style={{
                padding: "10px",
              }}
              className="bg-[#63a053] hover:bg-[#528a45] rounded cursor-pointer text-white text-sm  w-10 h-8 flex items-center gap-1"
            >
              <svg
                className="w-full h-full"
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
              <Link href="/dashboard/account-requests">Demande de compte</Link>
            </DropdownMenuItem>

            {/* Comptes - Only visible to super_admin */}
            {user?.role === "super_admin" && (
              <DropdownMenuItem className="cursor-pointer rounded-xs focus:bg-[#326EA6] focus:text-white">
                <Link href="/dashboard/users">Comptes</Link>
              </DropdownMenuItem>
            )}

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
  );
};

export default Header;
