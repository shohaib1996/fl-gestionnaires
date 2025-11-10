import LeftSidebar from "@/components/dashboard/LeftSidebar";
import RightSidebar from "@/components/dashboard/RightSidebar";
import { ModeToggle } from "@/components/ModeToggle/ModeToggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MenuIcon, Search } from "lucide-react";
import Image from "next/image";

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
          <div className="hidden md:block relative w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#63a053] h-4 w-4" />
            <Input
              type="text"
              placeholder="Candidat, contact, activité, étiquette...ect"
              className="pl-9 bg-gray-100 border-0 text-sm placeholder:text-gray-500 focus-visible:ring-1 focus-visible:ring-[#63a053]"
            />
          </div>
          <Button className="bg-[#63a053] hover:bg-[#528a45] text-white text-sm px-4 py-2">
            + Ajouter
          </Button>
          <ModeToggle />
          <MenuIcon />
        </div>
      </header>

      {/* Main layout (fills remaining viewport height) */}
      <main className="flex flex-1 overflow-hidden">
        <LeftSidebar />
        <section className="flex-1 flex flex-col overflow-hidden px-6 py-3">
          {children}
        </section>
        <RightSidebar />
      </main>
    </div>
  );
}
