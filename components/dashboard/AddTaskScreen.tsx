"use client";

import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  ArrowLeft,
  Calendar1,
  ChevronDown,
  MapPin,
  User2,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { Calendar } from "@/components/ui/calendar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";

import { useCreateCalendarEvent } from "@/hooks/useCalendarEvents";
import { useUsersForParticipants } from "@/hooks/useUsersForParticipants";

interface AddTaskScreenProps {
  onBack: () => void;
}

type Participant = {
  id: string;
  name: string;
  email: string;
};

export default function AddTaskScreen({ onBack }: AddTaskScreenProps) {
  /* ---------------- data ---------------- */
  const { data: allParticipants = [] } = useUsersForParticipants();
  const createEvent = useCreateCalendarEvent();

  /* ---------------- form state ---------------- */
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();

  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const [location, setLocation] = useState<string>("Online");

  const [participantQuery, setParticipantQuery] = useState("");
  const [selectedParticipants, setSelectedParticipants] = useState<
    Participant[]
  >([]);

  /* ---------------- helpers ---------------- */
  const fmt = (d?: Date) => (d ? format(d, "dd/MM/yyyy") : "");
  const toISO = (d: Date) => format(d, "yyyy-MM-dd");

  const filteredParticipants = useMemo(() => {
    const q = participantQuery.trim().toLowerCase();
    if (!q) return allParticipants;

    return allParticipants.filter(
      (p) =>
        p.name.toLowerCase().includes(q) || p.email.toLowerCase().includes(q)
    );
  }, [participantQuery, allParticipants]);

  const addParticipant = (p: Participant) => {
    if (!selectedParticipants.find((x) => x.id === p.id)) {
      setSelectedParticipants((prev) => [...prev, p]);
    }
  };

  const removeParticipant = (id: string) => {
    setSelectedParticipants((prev) => prev.filter((p) => p.id !== id));
  };

  /* ---------------- submit ---------------- */
  const handleSave = async () => {
    if (!title || !startDate) {
      toast.error("Titre et date requis");
      return;
    }

    const result = await createEvent.mutateAsync({
      title,
      description: description || undefined,
      event_type: "task",

      start_date: toISO(startDate),
      end_date: toISO(endDate ?? startDate),

      start_time: startTime || undefined,
      end_time: endTime || undefined,

      location_type:
        location === "Online"
          ? "online"
          : location === "Sur site"
          ? "onsite"
          : "hybrid",

      location_label: location,

      participantIds: selectedParticipants.map((p) => p.id),
    });

    if (result?.success === false) {
      toast.error(result.message ?? "Erreur lors de la création");
      return;
    }

    toast.success("Tâche créée avec succès");
    onBack();
  };

  // console.log("all participants", allParticipants, filteredParticipants);

  /* ================= UI (UNCHANGED) ================= */
  return (
    <div
      className="bg-white dark:bg-[#121212] w-full flex flex-col transition-colors duration-300 relative"
      style={{ height: "calc(var(--vh, 1vh) * 100)" }}
    >
      {/* Header */}
      <div className="w-full h-24 flex items-center justify-between bg-[#63a053] shadow-sm px-6 mb-4 shrink-0">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>

        <div className="absolute left-1/2 -translate-x-1/2 w-full px-12 pointer-events-none">
          <h1 className="font-bold text-white text-xl text-center truncate">
            Ajouter une tâche ou un rendez-vous
          </h1>
        </div>

        <div className="w-10" />
      </div>

      {/* Form */}
      <div className="flex-1 overflow-y-auto px-6 pb-24 hide-scrollbar">
        <div className="w-full max-w-lg mx-auto space-y-10">
          {/* Title */}
          <div>
            <label className="text-xl font-medium">Titre</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Titre de la tâche"
              className="mt-1 bg-gray-100 text-xl h-12 rounded-xs border-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-xl font-medium">Brève description</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brève description"
              className="mt-1 bg-gray-100 min-h-[120px] text-xl rounded-xs border-none"
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xl font-medium">Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <button className="w-full flex justify-between bg-gray-100 py-3 px-3 rounded text-xl">
                    <div className="flex items-center gap-3">
                      <Calendar1 className="w-4 h-4" />
                      {startDate ? fmt(startDate) : "JJ/MM/AAAA"}
                    </div>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="p-0">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    locale={fr}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <label className="text-xl font-medium">Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <button className="w-full flex justify-between bg-gray-100 py-3 px-3 rounded text-xl">
                    <div className="flex items-center gap-3">
                      <Calendar1 className="w-4 h-4" />
                      {endDate ? fmt(endDate) : "JJ/MM/AAAA"}
                    </div>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="p-0">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    locale={fr}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xl font-medium">Heure de début</label>
              <Input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="bg-gray-100 h-14"
              />
            </div>
            <div>
              <label className="text-xl font-medium">Heure de fin</label>
              <Input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="bg-gray-100 h-14"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="text-xl font-medium mb-2 block">Lieu</label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="w-full flex justify-between bg-gray-100 py-3 px-3 rounded text-xl">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4" />
                    {location}
                  </div>
                  <ChevronDown className="w-4 h-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {["Online", "Sur site", "Hybride"].map((l) => (
                  <DropdownMenuItem key={l} onSelect={() => setLocation(l)}>
                    {l}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Participants */}
          <div>
            <label className="text-xl font-medium mb-2 block">
              Participants
            </label>

            {/* selected */}
            <div className="flex flex-wrap gap-2 mb-2">
              {selectedParticipants.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center gap-1 bg-gray-200 px-2 py-1 rounded"
                >
                  {p.name}
                  <button onClick={() => removeParticipant(p.id)}>
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="w-full flex justify-between bg-gray-100 py-3 px-3 rounded text-xl">
                  <div className="flex items-center gap-3">
                    <User2 className="w-4 h-4" />
                    Ajouter
                  </div>
                  <ChevronDown className="w-4 h-4" />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-72 p-2">
                <Input
                  value={participantQuery}
                  onChange={(e) => setParticipantQuery(e.target.value)}
                  placeholder="Chercher"
                />
                <div className="max-h-44 overflow-auto mt-2">
                  {filteredParticipants.map((p) => (
                    <DropdownMenuItem
                      key={p.id}
                      disabled={
                        !!selectedParticipants.find((x) => x.id === p.id)
                      }
                      onSelect={() => addParticipant(p)}
                    >
                      <div>
                        <div>{p.name}</div>
                        <div className="text-xs text-gray-500">{p.email}</div>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Save */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#63a053] hover:bg-[#528a45] z-50">
        <button
          onClick={handleSave}
          className="w-full h-16 text-white font-semibold text-xl"
        >
          Sauvegarder
        </button>
      </div>
    </div>
  );
}
