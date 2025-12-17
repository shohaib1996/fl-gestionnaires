import MilestoneSection from "@/components/sections/MilestoneSection";
import PreviewSection from "@/components/sections/PreviewSection";
import ProjectHeader from "@/components/sections/ProjectHeader";
import ProjectModals from "@/components/sections/ProjectModals";
import TaskSection from "@/components/sections/TaskSection";

export default function ProjectDetailsView(props) {
  const {
    project,
    isLoading,
    tasks,
    tasksLoading,
    activeMilestoneId,
    onMilestoneChange,
    onAddTask,
  } = props;

  if (isLoading || !project) {
    return <div className="p-6 text-gray-500">Loading project...</div>;
  }

  return (
    <div className="p-0">
      <ProjectHeader />

      <MilestoneSection
        milestones={project.milestones}
        activeMilestoneId={activeMilestoneId}
        onChange={onMilestoneChange}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-6 pb-6">
        <TaskSection
          tasks={tasks}
          loading={tasksLoading}
          onAddTask={onAddTask}
        />

        <PreviewSection preview={project.preview} />
      </div>

      <ProjectModals project={project} />
    </div>
  );
}
