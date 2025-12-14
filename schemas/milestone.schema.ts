import { z } from "zod";

export const milestonePriorityEnum = z.enum(["low", "normal", "high"]);

export const createMilestoneSchema = z.object({
  title: z.string().min(1, "Title is required"),

  description: z
    .string()
    .max(1000, "Description is too long")
    .optional()
    .or(z.literal("")),

  priority: milestonePriorityEnum.optional().default("normal"),

  startDate: z.string().optional(),
  endDate: z.string().optional(),

  startTime: z.string().optional(),
  endTime: z.string().optional(),

  managerId: z.string().uuid().optional(),
});

/**
 * 🔑 IMPORTANT TYPES
 * - use INPUT type for react-hook-form
 * - use OUTPUT type for submit / DB
 */
export type CreateMilestoneFormValues = z.input<typeof createMilestoneSchema>;

export type CreateMilestoneData = z.output<typeof createMilestoneSchema>;
