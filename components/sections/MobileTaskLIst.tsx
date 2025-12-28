import { TasksByMilestone } from "@/app/actions/tasks/getTasksByMilestone";
import { EditTaskInput } from "@/types/task";
import { iconMap } from "../common/FileIconMap";
import { TaskStatusCell } from "./TaskStatusCell";
export interface TaskListsProps {
  tasks: TasksByMilestone[];

  setSelectedTask: (task: TasksByMilestone) => void;

  setOpenEditDoc: (open: boolean) => void;

  setDoc: (task: TasksByMilestone) => void;

  editTaskAsync: (editTaskInput: EditTaskInput) => Promise<void> | void;

  activeIndex: number | string;

  setActiveIndex: (index: number) => void;

  user: any;
}
export default function MobileTaskList({
  tasks,
  activeIndex,
  setActiveIndex,
  setSelectedTask,
  setOpenEditDoc,
  setDoc,
  editTaskAsync,
  user,
}: TaskListsProps & { activeIndex: number }) {
  return (
    <div className="space-y-3">
      {tasks.map((task, i) => {
        const Icon = iconMap[task.file_format];

        return (
          <div
            key={task.id}
            onClick={() => {
              setActiveIndex(i);
              setSelectedTask(task);
            }}
            className={`bg-white rounded-xs p-4 shadow-sm border 
              ${i === activeIndex ? "border-blue-400" : "border-gray-200"}
            `}
          >
            {/* Top row */}
            <div className="flex justify-between items-start gap-2">
              <p className="text-sm font-medium text-gray-800">
                {task.description}
              </p>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setDoc(task);
                  setOpenEditDoc(true);
                }}
              >
                <Icon className="w-6 h-6 text-[#326EA6]" />
              </button>
            </div>

            {/* Meta */}
            <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
              <span className="capitalize">{task.category}</span>
              <span>
                {new Date(task.created_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "2-digit",
                })}
              </span>
            </div>

            {/* Status */}
            <div className="mt-3">
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
            </div>
          </div>
        );
      })}
    </div>
  );
}
