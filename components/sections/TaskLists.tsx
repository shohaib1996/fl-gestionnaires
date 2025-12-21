import { TasksByMilestone } from "@/app/actions/tasks/getTasksByMilestone";
import { iconMap } from "@/components/common/FileIconMap";
import { useUser } from "@/providers/UserProvider";
import { EditTaskInput } from "@/types/task";
import { useEffect, useState } from "react";
import { TaskStatusCell } from "./TaskStatusCell";

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
    <table className="w-full text-sm">
      <thead className="bg-gray-50 dark:bg-neutral-700 text-gray-700 dark:text-gray-200 sticky top-0">
        <tr>
          <th className="text-left px-4 py-2">Date</th>
          <th className="text-left px-4 py-2"></th>
          <th className="text-left px-4 py-2">Description</th>
          <th className="text-left px-4 py-2">Catégorie</th>
          <th className="text-left px-4 py-2">Progression</th>
        </tr>
      </thead>

      <tbody>
        {tasks.map((task, i) => {
          const Icon = iconMap[task.file_format];
          return (
            <tr
              key={i}
              onClick={() => handleRowClick(task, i)}
              className={`border-t dark:border-neutral-700 hover:bg-blue-50 dark:hover:bg-neutral-700/50 transition ${
                i === activeIndex ? "bg-blue-50 dark:bg-neutral-700/50" : ""
              } h-[7vh] cursor-pointer`}
            >
              <td className="px-4 py-2 text-gray-600 dark:text-gray-300">
                {new Date(task.created_at).toLocaleString("en-US", {
                  month: "short",
                  day: "2-digit",
                })}
              </td>

              <td className="px-4 py-2 gap-2 text-gray-700 dark:text-gray-200">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setDoc(task);
                    setOpenEditDoc(true);
                  }}
                >
                  <Icon className="w-6 h-6 text-[#326EA6] cursor-pointer" />
                </button>
              </td>
              <td className="px-4 py-2 gap-2 text-gray-700 dark:text-gray-200">
                {task.description}
              </td>

              <td className="px-4 py-2 text-gray-600 dark:text-gray-300">
                {task.category}
              </td>

              <td className="px-4 py-2 text-gray-700 dark:text-gray-100 capitalize">
                <TaskStatusCell
                  status={task.status}
                  role={user?.role}
                  onChange={(newStatus) =>
                    editTaskAsync({
                      taskId: task.id,
                      status: newStatus,
                    })
                  }
                />
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
