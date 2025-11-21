"use client";

import { useMemo, useState } from "react";
import { format } from "date-fns";
import {
  ArrowLeft,
  Calendar1,
  ChevronDown,
  Clock,
  MapPin,
  User2,
} from "lucide-react";

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
import { fr } from "date-fns/locale";

interface AddTaskScreenProps {
  onBack: () => void;
}

export default function AddTaskScreen({ onBack }: AddTaskScreenProps) {
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
    <div
      className="bg-white dark:bg-[#121212] w-full flex flex-col transition-colors duration-300 relative"
      style={{ height: "calc(var(--vh, 1vh) * 100)" }}
    >
      {/* Header */}
      <div className="w-full h-24 flex items-center justify-between bg-[#63a053] shadow-sm px-6 mb-4 transition-colors duration-300 shrink-0">
        {/* Back Arrow */}
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          aria-label="Retour"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>

        <div className="absolute left-1/2 transform -translate-x-1/2 w-full px-12 pointer-events-none">
          <h1 className="font-bold text-white text-xl tracking-wide text-center truncate">
            Ajouter une tâche ou un rendez-vous
          </h1>
        </div>

        {/* Placeholder for symmetry or menu if needed */}
        <div className="w-10" />
      </div>

      {/* Scrollable Form Content */}
      <div className="flex-1 overflow-y-auto px-6 pb-24 hide-scrollbar">
        <div className="w-full max-w-lg mx-auto space-y-10">
          {/* Title */}
          <div>
            <label className="text-xl font-medium dark:text-gray-200">
              Titre
            </label>
            <Input
              placeholder="Titre de la tâche"
              className="mt-1 bg-gray-100 h-12 dark:bg-gray-800 dark:text-white rounded-xs border-none placeholder:text-xl"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-xl font-medium dark:text-gray-200">
              Brève description
            </label>
            <Textarea
              placeholder="Brève description"
              className="mt-1 bg-gray-100 dark:bg-gray-800 dark:text-white min-h-[120px] rounded-xs border-none placeholder:text-xl"
            />
          </div>

          {/* Date pickers */}
          <div className="grid grid-cols-2 gap-4">
            {/* Start Date */}
            <div>
              <label className="text-xl font-medium dark:text-gray-200">
                Date
              </label>

              <Popover>
                <PopoverTrigger asChild className="dark:bg-gray-800">
                  <button
                    type="button"
                    className="w-full flex items-center justify-between bg-gray-100 dark:bg-gray-800 py-3 px-3 rounded text-left text-xl text-gray-600 dark:text-gray-300 hover:shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <Calendar1 className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      <span
                        className={`${
                          startDate
                            ? "text-gray-800 dark:text-white"
                            : "text-gray-500 dark:text-gray-400"
                        }`}
                      >
                        {startDate ? fmt(startDate) : "JJ/MM/AAAA"}
                      </span>
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  </button>
                </PopoverTrigger>

                <PopoverContent
                  align="start"
                  sideOffset={8}
                  className="w-auto p-0"
                >
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    autoFocus
                    className="rounded-xs"
                    locale={fr}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* End Date */}
            <div>
              <label className="text-xl font-medium dark:text-gray-200">
                Date
              </label>

              <Popover>
                <PopoverTrigger asChild className="dark:bg-gray-800">
                  <button
                    type="button"
                    className="w-full flex items-center justify-between bg-gray-100 dark:bg-gray-800 py-3 px-3 rounded text-left text-xl text-gray-600 dark:text-gray-300 hover:shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <Calendar1 className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      <span
                        className={`${
                          endDate
                            ? "text-gray-800 dark:text-white"
                            : "text-gray-500 dark:text-gray-400"
                        }`}
                      >
                        {endDate ? fmt(endDate) : "JJ/MM/AAAA"}
                      </span>
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />
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
                    onSelect={setEndDate}
                    locale={fr}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Hours */}
          <div className="grid grid-cols-2 gap-4">
            {/* Heure de début */}
            <div>
              <label className="text-xl font-medium dark:text-gray-200">
                Heure de début
              </label>
              <div className="relative mt-1">
                <Input
                  type="time"
                  placeholder="HH:MM"
                  className="bg-gray-100 dark:bg-gray-800 dark:text-white pl-10 rounded-xs border-none placeholder:text-xl h-14"
                />
                <Clock className="w-4 h-4 text-gray-500 dark:text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Heure de fin */}
            <div>
              <label className="text-xl font-medium dark:text-gray-200">
                Heure de fin
              </label>
              <div className="relative mt-1">
                <Input
                  type="time"
                  placeholder="HH:MM"
                  className="bg-gray-100 dark:bg-gray-800 dark:text-white pl-10 rounded-xs border-none placeholder:text-xl h-14"
                />
                <Clock className="w-4 h-4 text-gray-500 dark:text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Lieu (dropdown) */}
          <div>
            <label className="text-xl font-medium mb-2 block dark:text-gray-200">
              Lieu
            </label>

            <DropdownMenu>
              <DropdownMenuTrigger
                asChild
                className="bg-gray-100 dark:bg-gray-800"
              >
                <button
                  type="button"
                  className="w-full flex items-center justify-between bg-gray-100 dark:bg-gray-800 py-3 px-3 rounded text-left text-xl text-gray-600 dark:text-gray-300 hover:shadow-sm"
                  aria-haspopup="true"
                >
                  <div className="flex items-center gap-3 ">
                    <MapPin className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    <span
                      className={`${
                        location
                          ? "text-gray-800 dark:text-white"
                          : "text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      {location || "Sélectionner un lieu"}
                    </span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="start"
                sideOffset={6}
                className="w-56"
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
            <label className="text-xl font-medium mb-2 block dark:text-gray-200">
              Participants
            </label>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="w-full flex items-center justify-between bg-gray-100 dark:bg-gray-800 py-3 px-3 rounded text-left text-xl text-gray-600 dark:text-gray-300 hover:shadow-sm"
                  aria-haspopup="true"
                >
                  <div className="flex items-center gap-3">
                    <User2 className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    <span
                      className={`${
                        participant
                          ? "text-gray-800 dark:text-white"
                          : "text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      {participant ?? "Chercher"}
                    </span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="start"
                sideOffset={6}
                className="w-72 p-2"
              >
                <div className="px-1 pb-2">
                  <Input
                    value={participantQuery}
                    onChange={(e) => setParticipantQuery(e.target.value)}
                    placeholder="Chercher"
                    className="bg-white dark:bg-gray-900 dark:text-white"
                  />
                </div>

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
        </div>
      </div>

      {/* Fixed Bottom Button */}
      <div
        className="fixed bottom-0 left-0 right-0 bg-[#63a053] hover:bg-[#528a43] z-50"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <button
          onClick={onBack} // In a real app, this would be the submit handler
          className="w-full h-16 text-white font-semibold text-xl flex items-center justify-center gap-2"
        >
          Sauvegarder
        </button>
      </div>
    </div>
  );
}
