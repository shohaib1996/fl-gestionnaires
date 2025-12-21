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
import { Calendar1, Check, ChevronDown, MapPin, User2, X } from "lucide-react";
import { toast } from "sonner";

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

  const [location, setLocation] = useState<string>("Online");

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
                    onClick={(e) => {
                      // If disabled, clicking should ONLY toggle
                      if (!endDateEnabled) {
                        e.preventDefault();
                        setEndDateEnabled(true);
                        return;
                      }
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <Calendar1 className="w-4 h-4" />
                      <span>{endDate ? fmt(endDate) : "JJ/MM/AAAA"}</span>
                    </div>

                    {/* RIGHT-SIDE ICON */}
                    {endDateEnabled ? (
                      <ChevronDown className="w-4 h-4 text-gray-600" />
                    ) : (
                      <Check
                        className="w-4 h-4 text-gray-400"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEndDateEnabled(true);
                        }}
                      />
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
              <Input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="bg-gray-100 mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Heure de fin</label>
              <Input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="bg-gray-100 mt-1"
              />
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
              className="px-6 h-11 bg-red-600 text-white rounded-none"
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
