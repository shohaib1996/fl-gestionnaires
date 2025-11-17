"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
} from "@/components/ui/dialog";
import {
  CalendarIcon,
  Clock,
  User,
  FileText,
  PlaySquare,
  Image as ImageIcon,
  Plus,
  ChevronDown,
} from "lucide-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function CreateJalonModal({ open, onClose }: Props) {
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="p-0 bg-white dark:bg-neutral-900 min-w-[70vw] max-h-[85vh] overflow-auto border-none rounded-none text-gray-800 dark:text-gray-200">
        {/* Header */}
        <DialogHeader className="px-8 py-4 bg-[#63A053] dark:bg-[#4e8742] text-white">
          <DialogTitle className="text-lg font-semibold flex justify-between items-center px-5">
            <p>Créer un jalon</p>
            <p className="text-sm opacity-90">Colla Naturelle</p>
          </DialogTitle>
        </DialogHeader>

        {/* Body */}
        <div className="p-6 space-y-8">
          {/* Row 1 */}
          <div className="grid grid-cols-12 gap-6 items-start">
            {/* Name */}
            <div className="col-span-6">
              <label className="block text-sm text-gray-700 dark:text-gray-300">Nom</label>
              <input
                type="text"
                placeholder="Nommer le jalon"
                className="w-full border rounded px-3 py-2 mt-1 bg-gray-50 dark:bg-neutral-800 border-gray-200 dark:border-neutral-700 text-sm text-gray-800 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-500"
              />
            </div>

            {/* Start Date */}
            <div className="col-span-2">
              <label className="block text-sm text-gray-700 dark:text-gray-300">Date de début</label>
              <Popover>
                <PopoverTrigger asChild>
                  <button className="w-full mt-1 flex items-center gap-2 border rounded px-3 py-2 bg-gray-50 dark:bg-neutral-800 border-gray-200 dark:border-neutral-700 text-sm text-gray-700 dark:text-gray-200">
                    <CalendarIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    <span className="flex-1 text-left">
                      {startDate ? format(startDate, "dd/MM/yyyy") : "JJ/MM/AAAA"}
                    </span>
                  </button>
                </PopoverTrigger>
                <PopoverContent className="p-2! bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700">
                  <Calendar mode="single" selected={startDate} onSelect={setStartDate} locale={fr} className="dark:bg-neutral-900 dark:text-gray-100" />
                </PopoverContent>
              </Popover>
            </div>

            {/* End Date */}
            <div className="col-span-2">
              <label className="block text-sm text-gray-700 dark:text-gray-300">Date butoir</label>
              <Popover>
                <PopoverTrigger asChild>
                  <button className="w-full mt-1 flex items-center gap-2 border rounded px-3 py-2 bg-gray-50 dark:bg-neutral-800 border-gray-200 dark:border-neutral-700 text-sm text-gray-700 dark:text-gray-200">
                    <CalendarIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    <span className="flex-1 text-left">
                      {endDate ? format(endDate, "dd/MM/yyyy") : "JJ/MM/AAAA"}
                    </span>
                  </button>
                </PopoverTrigger>
                <PopoverContent className="p-2! bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700">
                  <Calendar mode="single" selected={endDate} onSelect={setEndDate} locale={fr} className="dark:bg-neutral-900 dark:text-gray-100" />
                </PopoverContent>
              </Popover>
            </div>

            {/* Priority */}
            <div className="col-span-2">
              <label className="block text-sm text-gray-700 dark:text-gray-300">Priorités</label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="w-full mt-1 flex items-center justify-between border rounded px-3 py-2 bg-gray-50 dark:bg-neutral-800 border-gray-200 dark:border-neutral-700 text-sm text-gray-700 dark:text-gray-200">
                    <span>Normale</span>
                    <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700">
                  <DropdownMenuItem className="text-sm">Normale</DropdownMenuItem>
                  <DropdownMenuItem className="text-sm">Haute</DropdownMenuItem>
                  <DropdownMenuItem className="text-sm">Basse</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-12 gap-6 items-start">
            {/* Description */}
            <div className="col-span-6">
              <label className="block text-sm text-gray-700 dark:text-gray-300">Brève description</label>
              <textarea
                placeholder="Brève description"
                className="w-full mt-1 border rounded px-3 py-2 bg-gray-50 dark:bg-neutral-800 border-gray-200 dark:border-neutral-700 text-sm h-24 text-gray-800 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-500"
              />
            </div>

            {/* Start Time */}
            <div className="col-span-2">
              <label className="block text-sm text-gray-700 dark:text-gray-300">Heure de début</label>
              <div className="w-full mt-1 flex items-center gap-2 border rounded px-3 py-2 bg-gray-50 dark:bg-neutral-800 border-gray-200 dark:border-neutral-700 text-sm text-gray-700 dark:text-gray-200">
                <Clock className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <input type="time" placeholder="HH:MM" className="w-full bg-transparent outline-none text-gray-800 dark:text-gray-200" />
              </div>
            </div>

            {/* End Time */}
            <div className="col-span-2">
              <label className="block text-sm text-gray-700 dark:text-gray-300">Heure de fin</label>
              <div className="w-full mt-1 flex items-center gap-2 border rounded px-3 py-2 bg-gray-50 dark:bg-neutral-800 border-gray-200 dark:border-neutral-700 text-sm text-gray-700 dark:text-gray-200">
                <Clock className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <input type="text" placeholder="HH:MM" className="w-full bg-transparent outline-none text-gray-800 dark:text-gray-200" />
              </div>
            </div>

            {/* Responsable Dropdown */}
            <div className="col-span-2">
              <label className="block text-sm text-gray-700 dark:text-gray-300">Responsable du jalon</label>
              <div className="w-full mt-1">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="w-full flex items-center justify-between border rounded px-3 py-2 bg-gray-50 dark:bg-neutral-800 border-gray-200 dark:border-neutral-700 text-sm text-gray-700 dark:text-gray-200">
                      <span className="flex items-center gap-2">
                        <User className="w-5 h-5 text-gray-500 dark:text-gray-300" />
                        <span>Chercher</span>
                      </span>
                      <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    </button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent className="w-full bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700">
                    <DropdownMenuItem className="text-sm">Jean Dupont</DropdownMenuItem>
                    <DropdownMenuItem className="text-sm">Marie Durand</DropdownMenuItem>
                    <DropdownMenuItem className="text-sm">Antoine Bernard</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>

          {/* Deliverables Section */}
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-neutral-700">
            <div className="flex justify-start gap-3 items-center mb-4">
              <p className="text-sm italic text-gray-600 dark:text-gray-400">Créer une liste des livrables à compléter durant ce jalon</p>
              <button className="px-3 py-1.5 bg-[#63A053] dark:bg-[#4e8742] text-white rounded-xs flex items-center gap-2">
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-8">
              {[0, 1].map((col) => (
                <div key={col} className="space-y-4">
                  {[FileText, PlaySquare, ImageIcon].map((Icon, idx) => (
                    <div key={idx}>
                      <hr className="border-[#989898]/30 dark:border-[#ffffff]/10" />
                      <div className="flex items-center gap-3 py-2">
                        <div className="w-10 h-10 rounded flex items-center justify-center">
                          <Icon className="w-7 h-7 text-[#326EA6] dark:text-[#7fb5df]" />
                        </div>
                        <div className="flex gap-5 items-center">
                          <p className="text-sm font-medium text-[#343E47] dark:text-gray-100">Permit document 2025</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Document légal</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}

              {/* Empty Column */}
              <div className="space-y-4">
                <div className="h-16"></div>
                <div className="h-16"></div>
                <div className="h-16"></div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-200 dark:bg-neutral-700 text-gray-800 dark:text-gray-100 rounded hover:bg-gray-300 dark:hover:bg-neutral-600"
            >
              Annuler
            </button>

            <button className="px-6 py-2 bg-[#63A053] dark:bg-[#4e8742] text-white rounded hover:bg-[#528a45] dark:hover:bg-[#3b6c34]">
              Sauvegarder
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
