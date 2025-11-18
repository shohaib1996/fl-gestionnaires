"use client"

import { MenuIcon, Plus, Search } from "lucide-react";
import { Input } from "../ui/input";
import Image from "next/image";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { ModeToggle } from "../ModeToggle/ModeToggle";
import Link from "next/link";

const Header = () => {
  return (
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
            <Button className="bg-[#63a053] hover:bg-[#528a45] rounded-xs cursor-pointer text-white text-sm px-4 py-2 flex items-center gap-1">
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
          </DropdownMenuContent>
        </DropdownMenu>

        <ModeToggle />
        <MenuIcon />
      </div>
    </header>
  );
};

export default Header;
