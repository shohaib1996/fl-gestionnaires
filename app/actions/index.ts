"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// ===== PROJECT ACTIONS =====

export async function createProject(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const projectData = {
    entrepreneur_id: user.id,
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    category: formData.get("category") as string,
    phase: formData.get("phase") as string,
    location_city: formData.get("location_city") as string,
    location_province: formData.get("location_province") as string,
    status: "submitted",
  };

  const { data, error } = await supabase
    .from("projects")
    .insert([projectData])
    .select()
    .single();

  if (error) {
    console.error("Error creating project:", error);
    return { error: error.message };
  }

  revalidatePath("/dashboard");

  return { data };
}

export async function createProjectWithCollaborators(
  projectData: any,
  collaborators: any[]
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  // Insert project
  const { data: project, error: projectError } = await supabase
    .from("projects")
    .insert([{ ...projectData, entrepreneur_id: user.id }])
    .select()
    .single();

  if (projectError) return { error: projectError.message };

  // Insert collaborators if any
  if (collaborators.length > 0) {
    const collaboratorsWithProjectId = collaborators.map((c) => ({
      ...c,
      project_id: project.id,
    }));

    const { error: collabError } = await supabase
      .from("collaborators")
      .insert(collaboratorsWithProjectId);

    if (collabError) return { error: collabError.message };
  }

  revalidatePath("/dashboard");
  return { data: project };
}

export async function updateProject(projectId: string, updates: any) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("projects")
    .update(updates)
    .eq("id", projectId)
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/${projectId}`);

  return { data };
}

export async function updateProjectStatus(projectId: string, status: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("projects")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", projectId)
    .select();

  if (error) return { error: error.message };

  revalidatePath("/dashboard");
  return { data };
}

export async function deleteProject(projectId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("projects")
    .delete()
    .eq("id", projectId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

// ===== CONTACT ACTIONS =====

export async function createContact(contactData: any) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const { data, error } = await supabase
    .from("contacts")
    .insert([{ ...contactData, created_by: user.id }])
    .select()
    .single();

  if (error) return { error: error.message };

  revalidatePath("/contact");
  return { data };
}

export async function updateContact(contactId: string, updates: any) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("contacts")
    .update(updates)
    .eq("id", contactId)
    .select();

  if (error) return { error: error.message };

  revalidatePath("/contact");
  return { data };
}

export async function deleteContact(contactId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("contacts")
    .delete()
    .eq("id", contactId);

  if (error) return { error: error.message };

  revalidatePath("/contact");
  return { success: true };
}

// ===== TASK ACTIONS =====

export async function createTask(taskData: any) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const { data, error } = await supabase
    .from("tasks")
    .insert([{ ...taskData, created_by: user.id }])
    .select()
    .single();

  if (error) return { error: error.message };

  revalidatePath("/tasks");
  return { data };
}

export async function updateTask(taskId: string, updates: any) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("tasks")
    .update(updates)
    .eq("id", taskId)
    .select();

  if (error) return { error: error.message };

  revalidatePath("/tasks");
  return { data };
}

export async function deleteTask(taskId: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("tasks").delete().eq("id", taskId);

  if (error) return { error: error.message };

  revalidatePath("/tasks");
  return { success: true };
}

// ===== AUTH ACTIONS =====

export async function signUp(email: string, password: string, metadata: any) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        firstName: metadata.firstName,
        lastName: metadata.lastName,
      },
    },
  });

  if (error) return { error: error.message };

  return { data };
}

export async function signIn(email: string, password: string) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) return { error: error.message };

  redirect("/dashboard");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
