"use client";

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
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon, ChevronDown, Clock, Plus, User } from "lucide-react";
import { Controller, useForm } from "react-hook-form";

import { AdminUser, getAdmins } from "@/app/actions/users/getAdmins";
import { iconMap } from "@/components/common/FileIconMap";
import AddDocumentModal from "@/components/modals/AddDocumentModal";
import {
  CreateMilestoneFormValues,
  createMilestoneSchema,
} from "@/schemas/milestone.schema";
import { useEffect, useState } from "react";
import { AdminSelect } from "../ui/admin-select";

interface AddDocumentPayload {
  name: string;
  category: string | null;
  description: string;
  file_format: string;
}

interface Props {
  defaultValues?: Partial<CreateMilestoneFormValues>;
  manager: { id: string; name: string | null };
  onSubmit: (
    values: CreateMilestoneFormValues,
    tasks: AddDocumentPayload[]
  ) => Promise<void>;
  submitLabel?: string;
  loading?: boolean;
  onCancel?: () => void;
  defaultTasks?: AddDocumentPayload[];
}

export function MilestoneForm({
  defaultValues,
  manager,
  onSubmit,
  submitLabel = "Sauvegarder",
  loading,
  onCancel,
  defaultTasks,
}: Props) {
  const [addDocOpen, setAddDocOpen] = useState(false);
  const [tasks, setTasks] = useState<AddDocumentPayload[]>(defaultTasks ?? []);
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loadingAdmins, setLoadingAdmins] = useState(true);

  const form = useForm<CreateMilestoneFormValues>({
    resolver: zodResolver(createMilestoneSchema),
    defaultValues: {
      priority: "normal",
      ...defaultValues,
    },
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = form;

  // Fetch admins on component mount
  useEffect(() => {
    const fetchAdmins = async () => {
      setLoadingAdmins(true);
      const result = await getAdmins();
      if (result.success && result.data) {
        setAdmins(result.data);
      }
      setLoadingAdmins(false);
    };

    fetchAdmins();
  }, []);

  return (
    <form
      onSubmit={handleSubmit((v) => onSubmit(v, tasks))}
      className="space-y-8"
    >
      {/* Row 1 */}
      <div className="grid grid-cols-12 gap-6 items-start">
        {/* Name */}
        <div className="col-span-6">
          <label className="block text-sm text-gray-700 dark:text-gray-300">
            Nom
          </label>
          <Input
            {...register("title")}
            placeholder="Nommer le jalon"
            className="w-full border rounded px-3 py-2 mt-1"
          />
          {errors.title && (
            <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>
          )}
        </div>

        {/* Start Date */}
        <div className="col-span-2">
          <label className="block text-sm text-gray-700 dark:text-gray-300">
            Date de début
          </label>
          <Controller
            control={control}
            name="startDate"
            render={({ field }) => (
              <Popover>
                <PopoverTrigger asChild>
                  <button className="w-full mt-1 flex items-center gap-2 border rounded px-3 py-2 bg-gray-50 dark:bg-neutral-800">
                    <CalendarIcon className="w-4 h-4 text-gray-500" />
                    <span className="flex-1 text-left">
                      {field.value
                        ? format(new Date(field.value), "dd/MM/yyyy")
                        : "JJ/MM/AAAA"}
                    </span>
                  </button>
                </PopoverTrigger>
                <PopoverContent>
                  <Calendar
                    mode="single"
                    selected={field.value ? new Date(field.value) : undefined}
                    onSelect={(date) =>
                      field.onChange(date ? date.toISOString() : undefined)
                    }
                    locale={fr}
                  />
                </PopoverContent>
              </Popover>
            )}
          />
        </div>

        {/* End Date */}
        <div className="col-span-2">
          <label className="block text-sm text-gray-700 dark:text-gray-300">
            Date butoir
          </label>
          <Controller
            control={control}
            name="endDate"
            render={({ field }) => (
              <Popover>
                <PopoverTrigger asChild>
                  <button className="w-full mt-1 flex items-center gap-2 border rounded px-3 py-2 bg-gray-50 dark:bg-neutral-800">
                    <CalendarIcon className="w-4 h-4 text-gray-500" />
                    <span className="flex-1 text-left">
                      {field.value
                        ? format(new Date(field.value), "dd/MM/yyyy")
                        : "JJ/MM/AAAA"}
                    </span>
                  </button>
                </PopoverTrigger>
                <PopoverContent>
                  <Calendar
                    mode="single"
                    selected={field.value ? new Date(field.value) : undefined}
                    onSelect={(date) =>
                      field.onChange(date ? date.toISOString() : undefined)
                    }
                    locale={fr}
                  />
                </PopoverContent>
              </Popover>
            )}
          />
          {errors.endDate && (
            <p className="text-xs text-red-500 mt-1">
              {errors.endDate.message}
            </p>
          )}
        </div>

        {/* Priority */}
        <div className="col-span-2">
          <label className="block text-sm text-gray-700 dark:text-gray-300">
            Priorités
          </label>
          <Controller
            name="priority"
            control={control}
            render={({ field }) => (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="w-full mt-1 flex items-center justify-between border rounded px-3 py-2 bg-gray-50 dark:bg-neutral-800">
                    <span>
                      {field.value === "high"
                        ? "Haute"
                        : field.value === "low"
                        ? "Basse"
                        : "Normale"}
                    </span>
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => field.onChange("normal")}>
                    Normale
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => field.onChange("high")}>
                    Haute
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => field.onChange("low")}>
                    Basse
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          />
        </div>
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-12 gap-6 items-start">
        {/* Description */}
        <div className="col-span-6">
          <label className="block text-sm text-gray-700 dark:text-gray-300">
            Brève description
          </label>
          <Textarea
            {...register("description")}
            placeholder="Brève description"
            className="w-full mt-1 h-24"
          />
        </div>

        {/* Start Time */}
        <div className="col-span-2">
          <label className="block text-sm text-gray-700 dark:text-gray-300">
            Heure de début
          </label>
          <div className="w-full mt-1 flex items-center gap-2 border rounded px-3 py-2 bg-gray-50 dark:bg-neutral-800">
            <Clock className="w-4 h-4 text-gray-500" />
            <input
              type="time"
              {...register("startTime")}
              className="w-full bg-transparent outline-none"
            />
          </div>
        </div>

        {/* End Time */}
        <div className="col-span-2">
          <label className="block text-sm text-gray-700 dark:text-gray-300">
            Heure de fin
          </label>
          <div className="w-full mt-1 flex items-center gap-2 border rounded px-3 py-2 bg-gray-50 dark:bg-neutral-800">
            <Clock className="w-4 h-4 text-gray-500" />
            <input
              type="time"
              {...register("endTime")}
              className="w-full bg-transparent outline-none"
            />
          </div>
        </div>

        {/* Responsable */}
        <div className="col-span-2">
          <label className="block text-sm text-gray-700 dark:text-gray-300">
            Responsable du jalon
          </label>
          <Controller
            name="managerId"
            control={control}
            render={({ field }) => (
              <AdminSelect
                admins={admins}
                value={field.value || manager.id}
                onChange={(adminId) => {
                  field.onChange(adminId);
                  setValue("managerId", adminId);
                }}
                placeholder={loadingAdmins ? "Loading..." : "Select admin..."}
              />
            )}
          />
        </div>
      </div>

      {/* Deliverables */}
      <div className="mt-4 pt-4 border-t">
        <div className="flex items-center gap-3 mb-4">
          <p className="text-sm italic text-gray-600">
            Créer une liste des livrables à compléter durant ce jalon
          </p>
          <button
            type="button"
            onClick={() => setAddDocOpen(true)}
            className="px-3 py-1.5 bg-[#63A053] hover:bg-[#528a45] text-white rounded-xs flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-8">
          {tasks.map((task, idx) => {
            const Icon = iconMap[task.file_format];
            return (
              <div key={idx} className="flex items-center gap-3">
                <Icon className="w-7 h-7 text-[#326EA6]" />
                <p className="text-sm">{task.name}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-center gap-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 bg-gray-200 rounded"
          >
            Annuler
          </button>
        )}

        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-[#63A053] hover:bg-[#528a45] text-white rounded"
        >
          {loading ? "En cours..." : submitLabel}
        </button>
      </div>

      <AddDocumentModal
        open={addDocOpen}
        onClose={() => setAddDocOpen(false)}
        onSubmit={(data) => {
          setTasks([...tasks, data]);
          setAddDocOpen(false);
        }}
      />
    </form>
  );
}
