"use server";

import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/types/actions";
import { TaskStatus } from "@/types/task-status";

/* ---------------------------------
   Supabase query row shape
---------------------------------- */
interface TaskWithDocumentRow {
  id: string;
  title: string;
  description: string | null;
  category: string;
  status: TaskStatus;
  order_index: number | null;
  created_at: string;
  file_format: string;
  document: {
    id: string;
    name: string;
    category: string | null;
    status: string | null;
    type: string | null;
    file_format: string | null;
    file_path: string | null;
    created_at: string;
  } | null;
}

/* ---------------------------------
   UI shape (what frontend consumes)
---------------------------------- */
export interface TasksByMilestone {
  id: string;
  goal: string;
  created_at: string;
  file_format: string;
  status: TaskStatus;
  category: string;
  description: string | null;
  document: {
    id: string;
    name: string;
    created_at: string;
    description?: string | null;
    category?: string | null;
    status?: string | null;
    type?: string | null;
    file_format?: string | null;
    file_path?: string | null;
  } | null;
  preview?: {
    image: string;
    type: string;
  } | null;
}

/* ---------------------------------
   Action
---------------------------------- */
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
        created_at,
        file_format,
        document:documents (
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
    .order("order_index", { ascending: true })
    .returns<TaskWithDocumentRow[]>();

  if (error) {
    return {
      success: false,
      message: error.message,
      code: error.code,
    };
  }

  const shaped: TasksByMilestone[] = (data ?? []).map((task) => {
    const doc = task.document;

    return {
      id: task.id,
      goal: task.description ?? task.title,
      created_at: task.created_at,
      file_format: task.file_format,
      status: task.status,
      category: task.category,
      description: task.description,
      document: doc
        ? {
            id: doc.id,
            name: doc.name,
            created_at: doc.created_at,
            description: task.description,
            category: doc.category,
            status: doc.status,
            type: doc.type,
            file_format: doc.file_format,
            file_path: doc.file_path,
          }
        : null,
      preview: null,
    };
  });

  return {
    success: true,
    data: shaped,
  };
}
