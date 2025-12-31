"use client";

import { format } from "date-fns";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

import { Calendar } from "@/components/ui/calendar";

import { useCreateCalendarEvent } from "@/hooks/useCalendarEvents";
import { useUsersForParticipants } from "@/hooks/useUsersForParticipants";
import { Calendar1, ChevronDown, MapPin, User2, X } from "lucide-react";
import { toast } from "sonner";
import { TimePicker24 } from "../common/TimePicker24";

type Participant = {
  id: string;
  name: string;
  email: string;
};

export default function AddTaskDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { data: allParticipants = [], isLoading: loadingUsers } =
    useUsersForParticipants();

  // form fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const [location, setLocation] = useState<string>("En ligne");

  const createEvent = useCreateCalendarEvent();

  const toISODate = (d: Date) => format(d, "yyyy-MM-dd");

  const [participantQuery, setParticipantQuery] = useState("");
  const [selectedParticipants, setSelectedParticipants] = useState<
    Participant[]
  >([]);

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

  // date pickers -------------------------------------------
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);

  const [endDateEnabled, setEndDateEnabled] = useState(false);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  const fmt = (d: Date | undefined) => (d ? format(d, "dd/MM/yyyy") : "");

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setStartDate(undefined);
    setEndDate(undefined);
    setEndDateEnabled(false);
    setStartTime("");
    setEndTime("");
    setLocation("Online");
    setSelectedParticipants([]);
    setParticipantQuery("");
  };

  const handleSave = async () => {
    if (!title || !startDate) {
      toast.error("Titre et date de début requis");
      return;
    }

    const result = await createEvent.mutateAsync({
      title,
      description: description || undefined,
      event_type: "task",

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

    if (result.success === false) {
      toast.error(result.message ?? "Une erreur est survenue");
      return;
    }

    toast.success("Événement créé avec succès");

    resetForm();
    onOpenChange(false);
  };

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
                      <Calendar1 className="w-4 h-4 text-gray-500" />
                      <span>{startDate ? fmt(startDate) : "JJ/MM/AAAA"}</span>
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </button>
                </PopoverTrigger>

                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* End date with dynamic icon */}
            <div>
              <label className="text-sm font-medium">Date de fin</label>

              <Popover>
                <PopoverTrigger asChild>
                  <button
                    className={`w-full flex items-center justify-between py-3 px-3 rounded text-sm transition ${
                      endDateEnabled
                        ? "bg-gray-100 text-gray-700"
                        : "bg-gray-200 text-gray-400"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Calendar1 className="w-4 h-4" />
                      <span>{endDate ? fmt(endDate) : "JJ/MM/AAAA"}</span>
                    </div>

                    {/* RIGHT-SIDE ICON */}
                    {endDateEnabled ? (
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M6 12C6.78793 12 7.56815 11.8448 8.2961 11.5433C9.02405 11.2417 9.68549 10.7998 10.2426 10.2426C10.7998 9.68549 11.2417 9.02405 11.5433 8.2961C11.8448 7.56815 12 6.78793 12 6C12 5.21207 11.8448 4.43185 11.5433 3.7039C11.2417 2.97595 10.7998 2.31451 10.2426 1.75736C9.68549 1.20021 9.02405 0.758251 8.2961 0.456723C7.56815 0.155195 6.78793 -1.17411e-08 6 0C4.4087 2.37122e-08 2.88258 0.632141 1.75736 1.75736C0.632141 2.88258 0 4.4087 0 6C0 7.5913 0.632141 9.11742 1.75736 10.2426C2.88258 11.3679 4.4087 12 6 12ZM5.84533 8.42667L9.17867 4.42667L8.15467 3.57333L5.288 7.01267L3.80467 5.52867L2.862 6.47133L4.862 8.47133L5.378 8.98733L5.84533 8.42667Z"
                          fill="#63A053"
                        />
                      </svg>
                    ) : (
                      <svg
                        onClick={(e) => {
                          e.stopPropagation();
                          setEndDateEnabled(true);
                        }}
                        className="cursor-pointer"
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M6 12C6.78793 12 7.56815 11.8448 8.2961 11.5433C9.02405 11.2417 9.68549 10.7998 10.2426 10.2426C10.7998 9.68549 11.2417 9.02405 11.5433 8.2961C11.8448 7.56815 12 6.78793 12 6C12 5.21207 11.8448 4.43185 11.5433 3.7039C11.2417 2.97595 10.7998 2.31451 10.2426 1.75736C9.68549 1.20021 9.02405 0.758251 8.2961 0.456723C7.56815 0.155195 6.78793 -1.17411e-08 6 0C4.4087 2.37122e-08 2.88258 0.632141 1.75736 1.75736C0.632141 2.88258 0 4.4087 0 6C0 7.5913 0.632141 9.11742 1.75736 10.2426C2.88258 11.3679 4.4087 12 6 12ZM5.84533 8.42667L9.17867 4.42667L8.15467 3.57333L5.288 7.01267L3.80467 5.52867L2.862 6.47133L4.862 8.47133L5.378 8.98733L5.84533 8.42667Z"
                          fill="#A4A4A4"
                        />
                      </svg>
                    )}
                  </button>
                </PopoverTrigger>

                {endDateEnabled && (
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={(d) => setEndDate(d!)}
                    />
                  </PopoverContent>
                )}
              </Popover>
            </div>
          </div>

          {/* Time pickers */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Heure de début</label>
              <TimePicker24 value={startTime} onChange={setStartTime} />
            </div>

            <div>
              <label className="text-sm font-medium">Heure de fin</label>
              <TimePicker24 value={endTime} onChange={setEndTime} />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="text-sm font-medium mb-2 block">Lieu</label>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="w-full flex items-center justify-between bg-gray-100 py-3 px-3 rounded text-sm text-gray-600">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4" />
                    <span>{location}</span>
                  </div>
                  <ChevronDown className="w-4 h-4" />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-56">
                <DropdownMenuItem onSelect={() => setLocation("En ligne")}>
                  En ligne
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setLocation("En présentiel")}>
                  En présentiel
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setLocation("Hybride")}>
                  Hybride
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Participants Multi-select */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              Participants
            </label>

            {/* Selected chips */}
            <div className="flex flex-wrap gap-2 mb-2">
              {selectedParticipants.slice(0, 2).map((p) => (
                <div
                  key={p.email}
                  className="flex items-center gap-1 bg-gray-200 text-sm px-2 py-1 rounded"
                >
                  {p.name}
                  <button
                    onClick={() => removeParticipant(p.email)}
                    className="text-gray-600 hover:text-black"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}

              {selectedParticipants.length > 2 && (
                <span className="text-xs text-gray-500">
                  +{selectedParticipants.length - 2} more
                </span>
              )}
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="w-full flex items-center justify-between bg-gray-100 py-3 px-3 rounded text-sm text-gray-600">
                  <div className="flex items-center gap-3">
                    <User2 className="w-4 h-4" />
                    <span>Ajouter</span>
                  </div>
                  <ChevronDown className="w-4 h-4" />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-72 p-2">
                {/* search */}
                <div className="px-1 pb-2">
                  <Input
                    value={participantQuery}
                    onChange={(e) => setParticipantQuery(e.target.value)}
                    placeholder="Chercher"
                  />
                </div>

                {/* list */}
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
                        className={`flex flex-col ${
                          selected ? "opacity-50" : ""
                        }`}
                      >
                        <span>{p.name}</span>
                        <span className="text-xs text-gray-500">{p.email}</span>
                      </DropdownMenuItem>
                    );
                  })}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Buttons */}
          <div className="flex justify-center gap-3 pt-4 pb-8">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="px-6 h-11 bg-[#63a053] hover:bg-[#528a45] text-white rounded-none"
            >
              Annuler
            </Button>

            <Button
              onClick={handleSave}
              className="bg-[#63a053] hover:bg-[#528a45] px-6 h-11 rounded-none"
            >
              Sauvegarder
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
