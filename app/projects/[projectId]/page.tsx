import { HomeCandidate } from "@/components/dashboard/HomeCandidate";
import { createClient } from "@/lib/supabase/server";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const supabase = await createClient();
  const project = await supabase
    .from("projects")
    .select("id, title")
    .eq("id", projectId)
    .single();

  if (!project.data) {
    return <div> Project not found</div>;
  }

  return (
    <>
      <HomeCandidate project={project.data} />
    </>
  );
}
