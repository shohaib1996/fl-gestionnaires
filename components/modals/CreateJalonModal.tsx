"use client";

import { AdminUser, getAdmins } from "@/app/actions/users/getAdmins";
import { useCreateMilestone } from "@/hooks/useCreateMilestone";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AdminSelect } from "../ui/admin-select";

import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon, ChevronDown, Clock, Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import AddDocumentModal from "./AddDocumentModal";

import { createTask } from "@/app/actions/tasks/createTask";
import { taskKeys } from "@/hooks/useTasksByMilestone";
import {
  createMilestoneSchema,
  type CreateMilestoneFormValues,
} from "@/schemas/milestone.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { iconMap } from "../common/FileIconMap";

interface AddDocumentPayload {
  name: string;
  category: string | null;
  description: string;
  file_format: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  projectId: string;
  projectName: string;
  manager: {
    id: string;
    name: string | null;
  };
}

export default function CreateJalonModal({
  open,
  onClose,
  projectId,
  manager,
  projectName,
}: Props) {
  const [addDocumentModalOpen, setAddDocumentModalOpen] = useState(false);
  const [tasks, setTasks] = useState<AddDocumentPayload[]>([]);
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loadingAdmins, setLoadingAdmins] = useState(true);

  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutateAsync, isPending } = useCreateMilestone();

  const form = useForm<CreateMilestoneFormValues>({
    resolver: zodResolver(createMilestoneSchema),
    defaultValues: {
      priority: "normal",
      managerId: manager.id,
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

  const onSubmit = async (values: CreateMilestoneFormValues) => {
    try {
      const data = createMilestoneSchema.parse(values);

      // 1. Create milestone
      const milestone = await mutateAsync({
        projectId,
        title: data.title,
        description: data.description,
        startDate: data.startDate,
        endDate: data.endDate,
        startTime: data.startTime,
        endTime: data.endTime,
        priority: data.priority,
        managerId: manager.id,
      });
      if (!milestone.success) {
        toast.error(milestone.message);
        return;
      }
      // 2. Create tasks linked to milestone
      if (milestone.success) {
        if (!milestone.data) return;
        const milestoneId = milestone.data.id;

        await Promise.all(
          tasks.map((task) =>
            createTask({
              milestoneId,
              title: task.name,
              description: task.description,
              category: task.category,
              file_format: task.file_format,
            })
          )
        );

        // Invalidate tasks query for the new milestone
        queryClient.invalidateQueries({
          queryKey: taskKeys.byMilestone(milestoneId),
        });

        // Invalidate sidebar overview to update milestone and document counts
        queryClient.invalidateQueries({
          queryKey: ["project-sidebar-overview", projectId],
        });

        // Wait for all queries to settle before navigating
        await queryClient.refetchQueries({
          queryKey: taskKeys.byMilestone(milestoneId),
        });

        // Navigate to the new milestone
        router.push(
          `/dashboard/${projectId}/project/${projectId}?milestone=${milestoneId}`
        );
      }

      onClose();
    } catch (error) {
      console.error(error);

      toast.error("Une erreur est survenue lors de la création du jalon");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="p-0 bg-white dark:bg-neutral-900 min-w-[70vw] max-h-[85vh] overflow-auto border-none rounded-none text-gray-800 dark:text-gray-200">
        {/* Header */}
        <DialogHeader className="px-8 py-4 bg-[#63A053] dark:bg-[#4e8742] text-white">
          <DialogTitle className="text-lg font-semibold flex justify-between items-center px-5">
            <p>Créer un jalon</p>
            <p className="text-sm opacity-90">{projectName}</p>
          </DialogTitle>
        </DialogHeader>

        {/* Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-8">
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
                <p className="text-xs text-red-500 mt-1">
                  {errors.title.message}
                </p>
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
                        selected={
                          field.value ? new Date(field.value) : undefined
                        }
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
                        selected={
                          field.value ? new Date(field.value) : undefined
                        }
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
                      <DropdownMenuItem
                        onClick={() => field.onChange("normal")}
                      >
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
                    placeholder={
                      loadingAdmins ? "Loading..." : "Select admin..."
                    }
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
                onClick={() => setAddDocumentModalOpen(true)}
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
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-200 rounded"
            >
              Annuler
            </button>

            <button
              type="submit"
              disabled={isPending}
              className="px-6 py-2 bg-[#63A053] hover:bg-[#528a45] text-white rounded"
            >
              {isPending ? "Création..." : "Sauvegarder"}
            </button>
          </div>
        </form>

        <AddDocumentModal
          open={addDocumentModalOpen}
          onClose={() => setAddDocumentModalOpen(false)}
          onSubmit={(data) => {
            setTasks([...tasks, data]);
            setAddDocumentModalOpen(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
