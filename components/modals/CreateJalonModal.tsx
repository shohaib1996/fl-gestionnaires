"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
} from "@/components/ui/dialog";

import { CalendarIcon, Clock, User } from "lucide-react";

import { useState } from "react";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

import { Button } from "@/components/ui/button";

import { Calendar } from "@/components/ui/calendar";

import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function CreateJalonModal({ open, onClose }: Props) {
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="
          p-0 
          bg-white dark:bg-neutral-900
          shadow-[0_1px_4px_rgba(0,0,0,0.08)] dark:shadow-[0_1px_6px_rgba(255,255,255,0.07)]
          min-w-[30vw]
          max-h-[75vh]
          border-none
          rounded-none
          text-gray-800 dark:text-gray-200
        "
      >
        {/* Header */}
        <DialogHeader
          className="
            px-8 py-4 
            bg-[#63A053] dark:bg-[#4e8742]
            text-white 
            flex flex-row justify-between items-center
          "
        >
          <DialogTitle className="text-lg font-semibold">
            Créer un jalon
          </DialogTitle>
        </DialogHeader>

        {/* Body */}
        <div className="p-6 space-y-4">
          {/* Name */}
          <div>
            <label className="text-sm text-gray-700 dark:text-gray-300">Nom</label>
            <input
              type="text"
              placeholder="Nommer le jalon"
              className="
                w-full border rounded-xs px-3 py-2 mt-1 
                bg-gray-50 dark:bg-neutral-800 
                border-gray-300 dark:border-neutral-700
                text-sm 
                text-gray-800 dark:text-gray-200
                placeholder:text-gray-400 dark:placeholder:text-gray-500
              "
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-sm text-gray-700 dark:text-gray-300">Brève description</label>
            <textarea
              placeholder="Brève description"
              className="
                w-full border rounded-xs px-3 py-2 mt-1 
                bg-gray-50 dark:bg-neutral-800 
                border-gray-300 dark:border-neutral-700
                text-sm 
                h-20
                text-gray-800 dark:text-gray-200
                placeholder:text-gray-400 dark:placeholder:text-gray-500
              "
            />
          </div>

          {/* Dates & Priority */}
          <div className="grid grid-cols-3 gap-4">
            {/* Start Date */}
            <div>
              <label className="text-sm text-gray-700 dark:text-gray-300">Date de début</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="
                      w-full justify-start text-left mt-1 
                      bg-gray-50 dark:bg-neutral-800 
                      border border-gray-300 dark:border-neutral-700
                      rounded-sm 
                      font-normal text-sm 
                      px-2 py-2 h-auto
                      text-gray-700 dark:text-gray-200
                    "
                  >
                    <CalendarIcon className="w-4 h-4 text-gray-500 dark:text-gray-400 mr-2" />
                    {startDate ? format(startDate, "dd/MM/yyyy") : "JJ/MM/AAAA"}
                  </Button>
                </PopoverTrigger>

                <PopoverContent className=" dark:bg-neutral-900 dark:border-neutral-700">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    locale={fr}
                    className="dark:bg-neutral-900 dark:text-white"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* End Date */}
            <div>
              <label className="text-sm text-gray-700 dark:text-gray-300">Date butoir</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="
                      w-full justify-start text-left mt-1 
                      bg-gray-50 dark:bg-neutral-800 
                      border border-gray-300 dark:border-neutral-700
                      rounded-sm 
                      font-normal text-sm 
                      px-2 py-2 h-auto
                      text-gray-700 dark:text-gray-200
                    "
                  >
                    <CalendarIcon className="w-4 h-4 text-gray-500 dark:text-gray-400 mr-2" />
                    {endDate ? format(endDate, "dd/MM/yyyy") : "JJ/MM/AAAA"}
                  </Button>
                </PopoverTrigger>

                <PopoverContent className=" dark:bg-neutral-900 dark:border-neutral-700">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    locale={fr}
                    className="dark:bg-neutral-900 dark:text-white"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Priority */}
            <div>
              <label className="text-sm text-gray-700 dark:text-gray-300">Priorités</label>
              <select
                className="
                  w-full border bg-gray-50 dark:bg-neutral-800 
                  rounded-sm px-3 py-2 mt-1 text-sm
                  border-gray-300 dark:border-neutral-700
                  text-gray-700 dark:text-gray-200
                "
              >
                <option>Normale</option>
                <option>Haute</option>
                <option>Basse</option>
              </select>
            </div>
          </div>

          {/* Times */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-700 dark:text-gray-300">Heure de début</label>
              <div
                className="
                  flex items-center border bg-gray-50 dark:bg-neutral-800 
                  border-gray-300 dark:border-neutral-700 
                  rounded-sm px-2 mt-1
                "
              >
                <Clock className="w-4 h-4 text-gray-500 dark:text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="HH:MM"
                  className="
                    w-full bg-transparent 
                    py-2 text-sm outline-none rounded-xs
                    text-gray-800 dark:text-gray-200
                    placeholder:text-gray-400 dark:placeholder:text-gray-500
                  "
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-700 dark:text-gray-300">Heure de fin</label>
              <div
                className="
                  flex items-center border bg-gray-50 dark:bg-neutral-800 
                  border-gray-300 dark:border-neutral-700 
                  rounded-sm px-2 mt-1
                "
              >
                <Clock className="w-4 h-4 text-gray-500 dark:text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="HH:MM"
                  className="
                    w-full bg-transparent 
                    py-2 text-sm outline-none rounded-xs
                    text-gray-800 dark:text-gray-200
                    placeholder:text-gray-400 dark:placeholder:text-gray-500
                  "
                />
              </div>
            </div>
          </div>

          {/* Responsable */}
          <div>
            <label className="text-sm text-gray-700 dark:text-gray-300">
              Responsable du jalon
            </label>

            <div className="flex items-start gap-3 mt-1">
              <div
                className="
                  w-12 h-12 rounded-full 
                  bg-gray-200 dark:bg-neutral-700 
                  flex items-center justify-center
                "
              >
                <User className="w-6 h-6 text-gray-500 dark:text-gray-300" />
              </div>

              <div className="flex-1 space-y-2">
                <input
                  type="text"
                  placeholder="Entrez le nom"
                  className="
                    w-full border px-3 py-2 text-sm bg-gray-50 dark:bg-neutral-800
                    border-gray-300 dark:border-neutral-700 rounded-xs
                    text-gray-800 dark:text-gray-200
                  "
                />

                <input
                  type="text"
                  placeholder="Entrez le titre"
                  className="
                    w-full border px-3 py-2 text-sm bg-gray-50 dark:bg-neutral-800
                    border-gray-300 dark:border-neutral-700 rounded-xs
                    text-gray-800 dark:text-gray-200
                  "
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-center mb-8 gap-3.5">
          <button
            onClick={onClose}
            className="
              px-4 py-2 bg-gray-200 dark:bg-neutral-700 
              text-sm text-gray-700 dark:text-gray-200 
              rounded-sm 
              hover:bg-gray-300 dark:hover:bg-neutral-600
            "
          >
            Annuler
          </button>

          <button
            className="
              px-4 py-2 
              bg-[#63A053] dark:bg-[#4e8742] 
              text-white 
              rounded-sm text-sm 
              hover:bg-[#528a45] dark:hover:bg-[#3b6c34]
            "
          >
            Sauvegarder
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
