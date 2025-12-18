"use client";

import { BorderBeam } from "@/components/ui/border-beam";
import { MoreHorizontal } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ContactListItem } from "../actions/contact/contact.actions";

interface Props {
  contacts: ContactListItem[];
}
export default function ListView({ contacts }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 transition-all">
      {contacts.map((person) => (
        <Link key={person.id} href={`/contact/${person.id}`}>
          <div
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
                    src={person.image_url || "/images/manager.png"}
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

                <span className="text-gray-400 dark:text-gray-500">|</span>

                <span className="whitespace-nowrap">{person.title}</span>

                <span className="text-gray-400 dark:text-gray-500">|</span>

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
  );
}
