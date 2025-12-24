import { useParams } from "next/navigation";
import DashboardSidebar from "./DashboardSidebar";
import ProjectSidebar from "./ProjectSidebar"; // later

export default function Sidebar() {
  const params = useParams();
  const projectId = params?.projectId as string | undefined;

  if (projectId) {
    return <ProjectSidebar projectId={projectId} />;
  }

  return <DashboardSidebar />;
}
