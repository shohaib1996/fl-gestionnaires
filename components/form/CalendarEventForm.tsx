"use client";

import { format } from "date-fns";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
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

import { useUsersForParticipants } from "@/hooks/useUsersForParticipants";
import { Calendar1, Check, ChevronDown, MapPin, User2, X } from "lucide-react";
import { toast } from "sonner";
import { Spinner } from "../ui/spinner";

export type Participant = {
  id: string;
  name?: string;
  email?: string;
  img?: string;
};

interface CalendarEventFormProps {
  mode: "create" | "edit";

  initialValues?: {
    title: string;
    description?: string;
    start_date: Date;
    end_date: Date;
    start_time?: string;
    end_time?: string;
    location_label?: string;
    participants: Participant[];
  };

  onSubmit: (payload: {
    title: string;
    description?: string;
    start_date: string;
    end_date: string;
    start_time?: string;
    end_time?: string;
    location_type?: "online" | "onsite" | "hybrid";
    location_label?: string;
    participantIds: string[];
  }) => Promise<void>;

  onCancel: () => void;
}

export default function CalendarEventForm({
  mode,
  initialValues,
  onSubmit,
  onCancel,
}: CalendarEventFormProps) {
  const { data: allParticipants = [] } = useUsersForParticipants();
  const [loading, setLoading] = useState(false);

  /* ---------------- Helpers ---------------- */
  const toISODate = (d: Date) => format(d, "yyyy-MM-dd");
  const fmt = (d: Date | undefined) => (d ? format(d, "dd/MM/yyyy") : "");

  /* ---------------- Form state ---------------- */
  const [title, setTitle] = useState(() => initialValues?.title ?? "");

  const [description, setDescription] = useState(
    () => initialValues?.description ?? ""
  );

  const [startTime, setStartTime] = useState(
    () => initialValues?.start_time ?? ""
  );

  const [endTime, setEndTime] = useState(() => initialValues?.end_time ?? "");

  const [location, setLocation] = useState(
    () => initialValues?.location_label ?? "Online"
  );

  const [startDate, setStartDate] = useState<Date | undefined>(() =>
    initialValues?.start_date ? new Date(initialValues.start_date) : undefined
  );

  const [endDateEnabled, setEndDateEnabled] = useState(() =>
    initialValues ? initialValues.start_date !== initialValues.end_date : false
  );

  const [endDate, setEndDate] = useState<Date | undefined>(() =>
    initialValues?.end_date ? new Date(initialValues.end_date) : undefined
  );

  const [selectedParticipants, setSelectedParticipants] = useState<
    Participant[]
  >(() => initialValues?.participants ?? []);

  const [participantQuery, setParticipantQuery] = useState("");

  /* ---------------- Participants logic ---------------- */
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

  /* ---------------- Submit ---------------- */
  const handleSubmit = async () => {
    if (!title || !startDate) {
      toast.error("Titre et date de début requis");
      return;
    }
    setLoading(true);
    await onSubmit({
      title,
      description: description || undefined,
      start_date: toISODate(startDate),
      end_date:
        endDateEnabled && endDate ? toISODate(endDate) : toISODate(startDate),
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
    setLoading(false);
  };

  /* ==================================================== */

  return (
    <div className="space-y-4 py-3 px-16">
      {/* Title */}
      <div>
        <label className="text-sm font-medium">Titre</label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Titre de la tâche"
          className="mt-1 bg-gray-100 rounded-xs"
        />
      </div>

      {/* Description */}
      <div>
        <label className="text-sm font-medium">Brève description</label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Brève description"
          className="mt-1 bg-gray-100 min-h-[100px] rounded-xs"
        />
      </div>

      {/* Date pickers */}
      <div className="grid grid-cols-2 gap-4">
        {/* Start date */}
        <div>
          <label className="text-sm font-medium">Date de début</label>
          <Popover>
            <PopoverTrigger asChild>
              <button className="w-full flex items-center justify-between bg-gray-100 py-3 px-3 rounded text-sm text-gray-600">
                <div className="flex items-center gap-3">
                  <Calendar1 className="w-4 h-4" />
                  <span>{startDate ? fmt(startDate) : "JJ/MM/AAAA"}</span>
                </div>
                <ChevronDown className="w-4 h-4" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={setStartDate}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* End date */}
        <div>
          <label className="text-sm font-medium">Date de fin</label>
          <Popover>
            <PopoverTrigger asChild>
              <button
                className={`w-full flex items-center justify-between py-3 px-3 rounded text-sm ${
                  endDateEnabled ? "bg-gray-100" : "bg-gray-200 text-gray-400"
                }`}
                onClick={(e) => {
                  if (!endDateEnabled) {
                    e.preventDefault();
                    setEndDateEnabled(true);
                  }
                }}
              >
                <div className="flex items-center gap-3">
                  <Calendar1 className="w-4 h-4" />
                  <span>{endDate ? fmt(endDate) : "JJ/MM/AAAA"}</span>
                </div>

                {endDateEnabled ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
              </button>
            </PopoverTrigger>

            {endDateEnabled && (
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                />
              </PopoverContent>
            )}
          </Popover>
        </div>
      </div>

      {/* Time pickers */}
      <div className="grid grid-cols-2 gap-4">
        <Input
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          className="bg-gray-100"
        />
        <Input
          type="time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          className="bg-gray-100"
        />
      </div>

      {/* Location */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="w-full flex items-center justify-between bg-gray-100 py-3 px-3 rounded text-sm">
            <MapPin className="w-4 h-4" />
            <span>{location}</span>
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

      {/* Participants */}
      <div>
        <label className="text-sm font-medium mb-2 block">Participants</label>

        <div className="flex flex-wrap gap-2 mb-2">
          {selectedParticipants.map((p) => (
            <div
              key={p.id}
              className="flex items-center gap-1 bg-gray-200 text-sm px-2 py-1 rounded"
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
            <button className="w-full flex items-center justify-between bg-gray-100 py-3 px-3 rounded text-sm">
              <User2 className="w-4 h-4" />
              <span>Ajouter</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-72 p-2">
            <Input
              value={participantQuery}
              onChange={(e) => setParticipantQuery(e.target.value)}
              placeholder="Chercher"
            />
            <div className="max-h-44 overflow-auto">
              {filteredParticipants.map((p) => {
                const selected = !!selectedParticipants.find(
                  (x) => x.id === p.id
                );

                return (
                  <DropdownMenuItem
                    key={p.id}
                    disabled={selected}
                    onSelect={() => addParticipant(p)}
                    className={selected ? "opacity-50" : ""}
                  >
                    <div>
                      <div>{p.name}</div>
                      <div className="text-xs text-gray-500">{p.email}</div>
                    </div>
                  </DropdownMenuItem>
                );
              })}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Actions */}
      <div className="flex justify-center gap-3 pt-4 pb-8">
        <Button
          variant="outline"
          onClick={onCancel}
          className="px-6 h-11 bg-red-600 text-white rounded-none"
        >
          Annuler
        </Button>

        <Button
          onClick={handleSubmit}
          className="bg-[#63a053] px-6 h-11 rounded-none"
          disabled={loading}
        >
          {loading && <Spinner className="mr-2 h-4 w-4 animate-spin" />}
          {mode === "create" ? "Créer" : "Sauvegarder"}
        </Button>
      </div>
    </div>
  );
}
