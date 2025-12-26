"use client";

import { AdminUser } from "@/app/actions/users/getAdmins";
import { Check, ChevronDown, Search, User } from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { Input } from "./input";

interface AdminSelectProps {
  admins: AdminUser[];
  value: string;
  onChange: (adminId: string) => void;
  placeholder?: string;
}

export function AdminSelect({
  admins,
  value,
  onChange,
  placeholder = "Select admin",
}: AdminSelectProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  // Find selected admin
  const selectedAdmin = admins.find((admin) => admin.id === value);

  // Filter admins based on search query
  const filteredAdmins = admins.filter((admin) => {
    const searchLower = searchQuery.toLowerCase();
    const fullName = admin.fullName?.toLowerCase() || "";
    const email = admin.email.toLowerCase();
    return fullName.includes(searchLower) || email.includes(searchLower);
  });

  // Show only first 3 if no search query, otherwise show all filtered results
  const displayedAdmins = searchQuery
    ? filteredAdmins
    : filteredAdmins.slice(0, 3);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="w-full mt-1 flex items-center gap-2 border rounded px-3 py-2 bg-gray-50 dark:bg-neutral-800 hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors"
        >
          <User className="w-5 h-5 text-gray-500" />
          <span className="flex-1 text-left truncate">
            {selectedAdmin
              ? selectedAdmin.fullName || selectedAdmin.email
              : placeholder}
          </span>
          <ChevronDown className="w-4 h-4 text-gray-500" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[300px] p-0">
        {/* Search Input */}
        <div className="p-2 border-b">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search admins..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 h-8 text-sm"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>

        {/* Admin List */}
        <div className="max-h-[200px] overflow-y-auto">
          {displayedAdmins.length === 0 ? (
            <div className="p-3 text-sm text-gray-500 text-center">
              No admins found
            </div>
          ) : (
            displayedAdmins.map((admin) => (
              <DropdownMenuItem
                key={admin.id}
                onClick={() => {
                  onChange(admin.id);
                  setIsOpen(false);
                  setSearchQuery("");
                }}
                className="flex items-center gap-2 px-3 py-2 cursor-pointer"
              >
                <User className="w-4 h-4 text-gray-400" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {admin.fullName || "No name"}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {admin.email}
                  </p>
                </div>
                {admin.id === value && (
                  <Check className="w-4 h-4 text-green-600" />
                )}
              </DropdownMenuItem>
            ))
          )}
        </div>

        {/* Show more indicator */}
        {!searchQuery && filteredAdmins.length > 3 && (
          <div className="p-2 border-t text-xs text-gray-500 text-center">
            {filteredAdmins.length - 3} more... Use search to find
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
