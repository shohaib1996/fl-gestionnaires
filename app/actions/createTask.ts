"use server";

import { createClient } from "@/lib/supabase/server";

export async function createTask(task: any) {
  const supabase = await createClient();

  const payload = {
    title: task.title,
    description: task.description,
    start_date: task.startDate,
    end_date: task.endDate,
    start_time: task.startTime,
    end_time: task.endTime,
    location: task.location,
    participants: task.participants,
  };

  console.log("📤 Sending payload:", payload);

  const { data, error } = await supabase
    .from("tasks")
    .insert([payload])
    .select()
    .single();

  if (error) {
    console.error("❌ Supabase insert error:", error);
    return { error: error.message };
  }

  return { data };
}
