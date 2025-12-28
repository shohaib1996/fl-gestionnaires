import { TasksByMilestone } from "@/app/actions/tasks/getTasksByMilestone";
import { useUser } from "@/providers/UserProvider";
import { EditTaskInput } from "@/types/task";
import { useEffect, useState } from "react";
import { DesktopTaskTable } from "./DesktopTaskTable";
import MobileTaskList from "./MobileTaskLIst";

const LS_KEY = "active_task_row";

export default function TaskLists({
  tasks,
  setSelectedTask,
  setOpenEditDoc,
  setDoc,
  editTaskAsync,
}: {
  tasks: TasksByMilestone[];
  setSelectedTask: (task: TasksByMilestone) => void;
  setOpenEditDoc: (open: boolean) => void;
  setDoc: (doc: TasksByMilestone) => void;
  editTaskAsync: (editTaskInput: EditTaskInput) => void;
}) {
  const [activeIndex, setActiveIndex] = useState<number>(() => {
    if (typeof window === "undefined") return 0;

    const saved = localStorage.getItem(LS_KEY);
    return saved !== null ? Number(saved) : 0;
  });
  const { user } = useUser();
  useEffect(() => {
    if (!tasks.length) return;

    const index = activeIndex < tasks.length ? activeIndex : 0;

    setSelectedTask(tasks[index]);
  }, [tasks, activeIndex, setSelectedTask]);

  const handleRowClick = (task: TasksByMilestone, index: number) => {
    setActiveIndex(index);
    setSelectedTask(task);
    localStorage.setItem(LS_KEY, String(index));
  };

  return (
    <>
      {/* Desktop table */}
      <div className="hidden md:block">
        <DesktopTaskTable
          tasks={tasks}
          activeIndex={activeIndex}
          setSelectedTask={setSelectedTask}
          setOpenEditDoc={setOpenEditDoc}
          setDoc={setDoc}
          editTaskAsync={editTaskAsync}
          user={user}
          handleRowClick={handleRowClick}
        />
      </div>

      {/* Mobile cards */}
      <div className="block md:hidden">
        <MobileTaskList
          tasks={tasks}
          activeIndex={activeIndex}
          setActiveIndex={setActiveIndex}
          setSelectedTask={setSelectedTask}
          setOpenEditDoc={setOpenEditDoc}
          setDoc={setDoc}
          editTaskAsync={editTaskAsync}
          user={user}
        />
      </div>
    </>
  );
}
