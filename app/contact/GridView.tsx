"use client";

import { BorderBeam } from "@/components/ui/border-beam";
import { MapPin, MoreHorizontal } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ContactListItem } from "../actions/contact/contact.actions";

interface Props {
  contacts: ContactListItem[];
}

export default function GridView({ contacts }: Props) {
  return (
    /* === GRID VIEW === */
    <div className="grid grid-cols-5 gap-4 transition-all">
      {contacts.map((person) => (
        <div
          key={person.id}
          className="
                  bg-white border rounded p-8 shadow-sm relative 
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
              {person.is_my_contact && (
                <BorderBeam className="absolute inset-0 rounded-full pointer-events-none" />
              )}

              <div className="w-20 h-20 rounded-full border-4 border-[#A9C5A1] dark:border-[#4F6D47] overflow-hidden">
                <Image
                  src={person.image_url || "/images/manager.png"}
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
              <Link href={`/contact/${person.id}`}>
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
  );
}
