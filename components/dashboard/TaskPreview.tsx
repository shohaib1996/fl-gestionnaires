import { TasksByMilestone } from "@/app/actions/tasks/getTasksByMilestone";
import useEditTask from "@/hooks/useEditTask";
import { useTasksByMilestone } from "@/hooks/useTasksByMilestone";
import { useUser } from "@/providers/UserProvider";
import { useState } from "react";
import EditDocumentModal from "../modals/EditDocumentModal";
import TaskLists from "../sections/TaskLists";

interface Props {
  activeMilestoneId: string;
  project: {
    id: string;
    title: string;
  };
}

export default function TaskPreview({ activeMilestoneId, project }: Props) {
  const [openEditDoc, setOpenEditDoc] = useState(false);
  const [doc, setDoc] = useState<TasksByMilestone | null>(null);
  const [selectedTask, setSelectedTask] = useState<TasksByMilestone | null>(
    null
  );

  const { user } = useUser();

  // ✅ Tasks fetch only when milestone resolved
  const { data: tasks, isLoading: tasksLoading } = useTasksByMilestone(
    activeMilestoneId ?? "",
    {
      enabled: !!activeMilestoneId,
    }
  );

  const { editTaskAsync } = useEditTask(activeMilestoneId ?? "");

  if (tasksLoading) {
    return <div className="text-center">Loading...</div>;
  }

  if (!tasksLoading && !tasks?.length) {
    return <div className="text-center ">No tasks found</div>;
  }

  if (!tasks) return null;
  return (
    <div className="space-y-3 pb-10">
      {!tasksLoading && tasks?.length ? (
        <TaskLists
          tasks={tasks}
          setSelectedTask={setSelectedTask}
          setOpenEditDoc={setOpenEditDoc}
          setDoc={setDoc}
          editTaskAsync={editTaskAsync}
        />
      ) : null}
      {doc && (
        <EditDocumentModal
          open={openEditDoc}
          onClose={() => {
            setOpenEditDoc(false);
            setDoc(null);
          }}
          doc={doc}
          milestoneId={activeMilestoneId ?? ""}
          projectId={project.id ?? ""}
          role={user?.role ?? ""}
        />
      )}
    </div>
  );
}
