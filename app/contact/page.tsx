"use client";

import { useState } from "react";
import Image from "next/image";
import {
  ChevronDown,
  LayoutGrid,
  List,
  Plus,
  MoreHorizontal,
  MapPin,
} from "lucide-react";
import Header from "@/components/Header/Header";
import { Input } from "@/components/ui/input";
import { BorderBeam } from "@/components/ui/border-beam";
import Link from "next/link";

const dummyPeople = [
  {
    id: 1,
    name: "Jacqueline Katanga",
    title: "Architecte",
    city: "Kolwezi, Lualaba",
    img: "/images/manager.png",
  },
  {
    id: 2,
    name: "Jacqueline Katanga",
    title: "Architecte",
    city: "Kolwezi, Lualaba",
    img: "/images/manager.png",
  },
  {
    id: 3,
    name: "Jacqueline Katanga",
    title: "Architecte",
    city: "Kolwezi, Lualaba",
    img: "/images/manager.png",
  },
  {
    id: 4,
    name: "Jacqueline Katanga",
    title: "Architecte",
    city: "Kolwezi, Lualaba",
    img: "/images/manager.png",
  },
  {
    id: 5,
    name: "Jacqueline Katanga",
    title: "Architecte",
    city: "Kolwezi, Lualaba",
    img: "/images/manager.png",
  },
  {
    id: 6,
    name: "Jojo Lipasa",
    title: "Architecte",
    city: "Kolwezi, Lualaba",
    img: "/images/manager.png",
  },
  {
    id: 7,
    name: "Lilly Mala",
    title: "Architecte",
    city: "Kolwezi, Lualaba",
    img: "/images/manager.png",
  },
  {
    id: 8,
    name: "Maggy Temo",
    title: "Architecte",
    city: "Kolwezi, Lualaba",
    img: "/images/manager.png",
  },
  {
    id: 9,
    name: "Jacques Marsse",
    title: "Architecte",
    city: "Kolwezi, Lualaba",
    img: "/images/manager.png",
  },
  {
    id: 10,
    name: "Jacqueline Katanga",
    title: "Architecte",
    city: "Kolwezi, Lualaba",
    img: "/images/manager.png",
  },
];

const Contact = () => {
  const [view, setView] = useState<"grid" | "list">("grid");

  return (
    <div>
      <Header />
      <div className="w-full px-40 py-8">
        {/* === TOP BAR === */}
        <div>
          <div className="flex justify-between items-center mb-10">
            <div className="flex flex-2 items-center">
              {/* Search */}
              <div className="flex items-center w-1/4 ">
                <Input
                  type="text"
                  placeholder="Chercher..."
                  className="w-full outline-none text-sm bg-card rounded-xs
                             dark:bg-[#071014] dark:text-gray-100 dark:placeholder:text-gray-400"
                />
              </div>

              {/* Middle actions */}
              <div className="flex items-center">
                {/* Filter */}
                <button className="flex items-center gap-2 bg-black dark:bg-[#63A053] text-white border rounded px-4 py-1.5 text-sm shadow-sm">
                  Afficher par
                  <ChevronDown className="w-4 h-4" />
                </button>

                {/* Grid/List icons (toggle) */}
                <div className="flex items-center gap-3 rounded-md ml-3">
                  <button
                    aria-pressed={view === "grid"}
                    onClick={() => setView("grid")}
                    className={`flex items-center justify-center p-2 rounded-md transition-colors cursor-pointer duration-150 ${
                      view === "grid"
                        ? "bg-[#E9F6E8] dark:bg-[#113926] text-[#326A35]"
                        : "text-gray-600 dark:text-gray-300"
                    }`}
                    title="Grid view"
                  >
                    <LayoutGrid className="w-5 h-5" />
                  </button>

                  <button
                    aria-pressed={view === "list"}
                    onClick={() => setView("list")}
                    className={`flex items-center justify-center p-2 rounded-md transition-colors cursor-pointer duration-150 ${
                      view === "list"
                        ? "bg-[#E9F6E8] dark:bg-[#113926] text-[#326A35]"
                        : "text-gray-600 dark:text-gray-300"
                    }`}
                    title="List view"
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>

                {/* Add contact */}
                <button className="flex items-center gap-2 bg-black dark:bg-[#63A053] text-white rounded px-4 py-1.5 text-sm shadow ml-3">
                  <Plus className="w-4 h-4" />
                  Ajouter un contact
                </button>
              </div>
            </div>

            <button className="mes-contacts-css">Mes contacts</button>
          </div>
        </div>

        {/* === CONTENT === */}
        {view === "grid" ? (
          /* === GRID VIEW === */
          <div className="grid grid-cols-5 gap-4 transition-all">
            {dummyPeople.map((person) => (
              <div
                key={person.id}
                className="
                  bg-white border rounded p-8 shadow-sm relative cursor-pointer
                  dark:bg-[#0D1514] dark:border-[#1F2A27] dark:shadow-none

                  transition-all duration-300 ease-[cubic-bezier(.22,.61,.36,1)]
                  hover:-translate-y-1.5
                  hover:shadow-[0_8px_20px_rgba(0,0,0,0.08)]
                  hover:border-[#63A053]/50
                  hover:bg-[#FAFAFA]

                  dark:hover:border-[#63A053]/40
                  dark:hover:shadow-[0_0_22px_rgba(99,160,83,0.12)]
                  dark:hover:bg-[#121c1a]
                "
              >
                {/* Card menu */}
                <button className="absolute top-4 right-4 text-gray-400 dark:text-gray-300">
                  <MoreHorizontal className="w-5 h-5" />
                </button>

                {/* Avatar */}
                <div className="flex justify-center mb-4">
                  <div className="relative p-1 rounded-full">
                    <BorderBeam className="absolute inset-0 rounded-full pointer-events-none" />

                    <div className="w-20 h-20 rounded-full border-4 border-[#A9C5A1] dark:border-[#4F6D47] overflow-hidden">
                      <Image
                        src={person.img}
                        alt={person.name}
                        width={80}
                        height={80}
                        className="rounded-full"
                      />
                    </div>
                  </div>
                </div>

                {/* Name */}
                <p className="text-center font-semibold pb-2 text-gray-900 dark:text-white">
                  {person.name}
                </p>

                {/* Role */}
                <p className="text-center text-sm text-gray-500 border-t py-2 dark:text-gray-300 dark:border-[#263430]">
                  {person.title}
                </p>

                {/* Location */}
                <div className="flex flex-col items-center gap-1 mt-3 text-sm text-gray-500 dark:text-gray-300">
                  <MapPin className="w-5 h-5 text-black dark:text-white" />
                  {person.city}
                </div>

                {/* Segmented Profile/Message */}
                <div className="flex justify-center mt-5">
                  <div className="flex rounded-full overflow-hidden">
                    <Link href={`/contact/123456`}>
                      <button className="px-6 cursor-pointer py-1.5 text-sm font-medium dark:bg-[#326EA6] bg-[#63A053] text-white rounded-l-full">
                        Profil
                      </button>
                    </Link>

                    <div className="w-px bg-[#4C7B40]/20"></div>

                    <button className="px-6 py-1.5 text-sm font-medium dark:bg-[#326EA6]/30 bg-[#E3EDDF] dark:text-white/60 rounded-r-full">
                      Message
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* === LIST VIEW (super minimal) === */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 transition-all">
            {dummyPeople.map((person) => (
              <Link href={`/contact/123456`}>
                <div
                  key={person.id}
                  className="
       flex items-center justify-between gap-4 bg-white border rounded px-4 py-1.5
    dark:bg-[#0D1514] dark:border-[#1F2A27]
    transition-all duration-300 ease-[cubic-bezier(.22,.61,.36,1)]
    hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,0,0,0.06)]
    hover:bg-[#FBFBFB] hover:border-[#63A053]/30 cursor-pointer
      "
                >
                  {/* LEFT SIDE: Avatar + Info */}
                  <div className="flex items-center gap-4 min-w-0">
                    {/* Avatar */}
                    <div className="relative p-1 rounded-full shrink-0">
                      <BorderBeam className="absolute inset-0 rounded-full pointer-events-none" />
                      <div className="w-12 h-12 rounded-full border-4 border-[#A9C5A1] dark:border-[#4F6D47] overflow-hidden">
                        <Image
                          src={person.img}
                          alt={person.name}
                          width={48}
                          height={48}
                          className="rounded-full object-cover"
                        />
                      </div>
                    </div>

                    {/* Name / Role / City inline */}
                    <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-200 flex-wrap">
                      <span className="font-semibold whitespace-nowrap">
                        {person.name}
                      </span>

                      <span className="text-gray-400 dark:text-gray-500">
                        |
                      </span>

                      <span className="whitespace-nowrap">{person.title}</span>

                      <span className="text-gray-400 dark:text-gray-500">
                        |
                      </span>

                      <span className="whitespace-nowrap">{person.city}</span>
                    </div>
                  </div>

                  {/* THREE DOTS */}
                  <button className="text-gray-400 dark:text-gray-300 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#0F1A18] transition shrink-0">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-center items-center gap-4 mt-10 text-gray-500 dark:text-gray-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="18"
            viewBox="0 0 20 18"
            fill="none"
          >
            <path
              d="M9.95947 0L19.9188 17.25H0.000180244L9.95947 0Z"
              fill="#C7C7C7"
            />
          </svg>
          <span>1-20</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="18"
            viewBox="0 0 20 18"
            fill="none"
          >
            <path
              d="M9.95947 17.25L19.9188 0L0.000180244 0L9.95947 17.25Z"
              fill="#C7C7C7"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Contact;
