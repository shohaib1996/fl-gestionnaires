"use client";

import { useMemo, useState } from "react";
import { format } from "date-fns";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

import {
  MapPin,
  Search as SearchIcon,
  ChevronDown,
  User2,
  Calendar1,
  Clock,
} from "lucide-react";

export default function AddTaskDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [location, setLocation] = useState<string>("Online");
  const [participant, setParticipant] = useState<string | null>(null);
  const [participantQuery, setParticipantQuery] = useState("");

  // use `Date | undefined` to match Calendar prop types
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  // example participants — replace with real data if you have it
  const allParticipants = useMemo(
    () => [
      "Alice Dupont",
      "Benoît Martin",
      "Céline Durand",
      "David Moreau",
      "Emma Laurent",
    ],
    []
  );

  const filteredParticipants = useMemo(() => {
    const q = participantQuery.trim().toLowerCase();
    if (!q) return allParticipants;
    return allParticipants.filter((p) => p.toLowerCase().includes(q));
  }, [allParticipants, participantQuery]);

  // safe formatter — returns empty string when date is undefined
  const fmt = (d: Date | undefined) => (d ? format(d, "dd/MM/yyyy") : "");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg p-0 rounded-none border-none">
        <DialogHeader>
          <DialogTitle className="text-sm font-semibold bg-[#63A053] text-white py-5 text-center">
            Ajouter une tâche ou un rendez-vous
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-3 px-16">
          {/* Title */}
          <div>
            <label className="text-sm font-medium">Titre</label>
            <Input
              placeholder="Titre de la tâche"
              className="mt-1 bg-gray-100 rounded-xs"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium">Brève description</label>
            <Textarea
              placeholder="Brève description"
              className="mt-1 bg-gray-100 min-h-[100px] rounded-xs"
            />
          </div>

          {/* Date pickers (shadcn calendar popovers) */}
          <div className="grid grid-cols-2 gap-4">
            {/* Start Date */}
            <div>
              <label className="text-sm font-medium">Date</label>

              <Popover>
                <PopoverTrigger asChild className="dark:bg-gray-100/10">
                  <button
                    type="button"
                    className="w-full flex items-center justify-between bg-gray-100 py-3 px-3 rounded text-left text-sm text-gray-600 hover:shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <Calendar1 className="w-4 h-4 text-gray-500" />
                      <span
                        className={`${
                          startDate ? "text-gray-800" : "text-gray-500"
                        }`}
                      >
                        {startDate ? fmt(startDate) : "JJ/MM/AAAA"}
                      </span>
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </button>
                </PopoverTrigger>

                <PopoverContent
                  align="start"
                  sideOffset={8}
                  className="w-auto p-0"
                >
                  {/* Calendar expects Date | undefined */}
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={(d) => {
                      // d has type Date | undefined — matches our state type
                      setStartDate(d);
                    }}
                    autoFocus
                    className="rounded-xs"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* End Date */}
            <div>
              <label className="text-sm font-medium">Date</label>

              <Popover>
                <PopoverTrigger asChild className="dark:bg-gray-100/10">
                  <button
                    type="button"
                    className="w-full flex items-center justify-between bg-gray-100 py-3 px-3 rounded text-left text-sm text-gray-600 hover:shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <Calendar1 className="w-4 h-4 text-gray-500" />
                      <span
                        className={`${
                          endDate ? "text-gray-800" : "text-gray-500"
                        }`}
                      >
                        {endDate ? fmt(endDate) : "JJ/MM/AAAA"}
                      </span>
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </button>
                </PopoverTrigger>

                <PopoverContent
                  align="start"
                  sideOffset={8}
                  className="w-auto p-0"
                >
                  <Calendar
                    mode="single"
                    className="rounded-xs"
                    selected={endDate}
                    onSelect={(d) => {
                      setEndDate(d);
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Hours */}
          <div className="grid grid-cols-2 gap-4">
            {/* Heure de début */}
            <div>
              <label className="text-sm font-medium">Heure de début</label>
              <div className="relative mt-1">
                <Input
                  placeholder="HH:MM"
                  className="bg-gray-100 pl-10 rounded-xs"
                />
                <Clock className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Heure de fin */}
            <div>
              <label className="text-sm font-medium">Heure de fin</label>
              <div className="relative mt-1">
                <Input
                  placeholder="HH:MM"
                  className="bg-gray-100 pl-10 rounded-xs"
                />
                <Clock className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Lieu (dropdown) */}
          <div>
            <label className="text-sm font-medium mb-2 block">Lieu</label>

            <DropdownMenu>
              <DropdownMenuTrigger asChild className="bg-gray-100 dark:bg-gray-100/10">
                <button
                  type="button"
                  className="w-full flex items-center justify-between bg-gray-100 py-3 px-3 rounded text-left text-sm text-gray-600 hover:shadow-sm"
                  aria-haspopup="true"
                >
                  <div className="flex items-center gap-3 ">
                    <MapPin className="w-4 h-4 text-gray-500 dark:text-white" />
                    <span
                      className={`${
                        location ? "text-gray-800 dark:text-white" : "text-gray-500 dark:text-white"
                      }`}
                    >
                      {location || "Sélectionner un lieu"}
                    </span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="start"
                sideOffset={6}
                className="w-56 "
              >
                <DropdownMenuItem onSelect={() => setLocation("Online")}>
                  Online
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setLocation("Sur site")}>
                  Sur site
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setLocation("Hybride")}>
                  Hybride
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Participants (dropdown with search) */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              Participants
            </label>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="w-full flex items-center justify-between bg-gray-100 dark:bg-gray-100/10 py-3 px-3 rounded text-left text-sm text-gray-600 hover:shadow-sm"
                  aria-haspopup="true"
                >
                  <div className="flex items-center gap-3">
                    <User2 className="w-4 h-4 text-gray-500 dark:text-white" />
                    <span
                      className={`${
                        participant ? "text-gray-800 dark:text-white" : "text-gray-500 dark:text-white"
                      }`}
                    >
                      {participant ?? "Chercher"}
                    </span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="start"
                sideOffset={6}
                className="w-72 p-2"
              >
                {/* Search field inside dropdown */}
                <div className="px-1 pb-2">
                  <Input
                    value={participantQuery}
                    onChange={(e) => setParticipantQuery(e.target.value)}
                    placeholder="Chercher"
                    className="bg-white"
                  />
                </div>

                {/* participant list */}
                <div className="max-h-44 overflow-auto">
                  {filteredParticipants.length === 0 ? (
                    <div className="px-3 py-2 text-sm text-gray-500">
                      Aucun résultat
                    </div>
                  ) : (
                    filteredParticipants.map((p) => (
                      <DropdownMenuItem
                        key={p}
                        onSelect={() => {
                          setParticipant(p);
                          setParticipantQuery("");
                        }}
                      >
                        {p}
                      </DropdownMenuItem>
                    ))
                  )}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Buttons */}
          <div className="flex justify-center gap-3 pt-2 pb-8">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="px-6 h-11 bg-red-600 text-white rounded-none"
            >
              Annuler
            </Button>

            <Button className="bg-[#63a053] hover:bg-[#528a45] px-6 h-11 rounded-none">
              Sauvegarder
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
