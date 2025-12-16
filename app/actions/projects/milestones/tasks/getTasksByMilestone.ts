"use server";

import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/types/actions";

// -----------------------------
// Raw DB result types
// -----------------------------
interface TaskRow {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  status: string;
  order_index: number;

  documents: DocumentRow[] | null;
}

interface DocumentRow {
  id: string;
  name: string;
  category: string;
  status: string;
  type: string;
  file_format: string;
  file_path: string | null;
  created_at: string;
}

// -----------------------------
// UI shape
// -----------------------------
export interface TasksByMilestone {
  id: string;
  goal: string;

  documents?: {
    id: string;
    name: string;
    date: string;
    description?: string;
    category: string;
    status: string;
    type: string;
    file_format: string;
    file_path?: string | null;
  }[];

  preview: {
    image: string;
    type: string;
  };
}

export async function getTasksByMilestone(
  milestoneId: string
): Promise<ActionResult<TasksByMilestone[]>> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("tasks")
    .select(
      `
      id,
      title,
      description,
      category,
      status,
      order_index,
      documents (
        id,
        name,
        category,
        status,
        type,
        file_format,
        file_path,
        created_at
      )
    `
    )
    .eq("milestone_id", milestoneId)
    .order("order_index", { ascending: true });

  if (error) {
    return {
      success: false,
      message: error.message,
      code: error.code,
    };
  }

  const shaped: TasksByMilestone[] = (data as TaskRow[]).map((task) => ({
    id: task.id,
    goal: task.title,

    documents: task.documents?.map((doc) => ({
      id: doc.id,
      name: doc.name,
      date: doc.created_at,
      category: doc.category,
      status: doc.status,
      type: doc.type,
      file_format: doc.file_format,
      file_path: doc.file_path ?? null,
    })),

    preview: {
      image: "",
      type: "",
    },
  }));

  return {
    success: true,
    data: shaped,
  };
}
