import {
  FileText,
  FolderPlus,
  Globe,
  ImageDown,
  PlaySquare,
} from "lucide-react";
import TaskLists from "./TaskLists";

export default function TaskSection({ tasks, loading, onAddTask }) {
  return (
    <div className="lg:col-span-2 flex flex-col">
      <div className="border-t max-h-[48vh] overflow-y-auto hide-scrollbar">
        {loading && <p className="p-6">Loading tasks…</p>}
        {!loading && !tasks?.length && (
          <p className="p-6 text-gray-500">No tasks</p>
        )}
        {!!tasks?.length && <TaskLists tasks={tasks} />}
      </div>

      <div className="flex items-center gap-3 mt-3">
        <button
          onClick={onAddTask}
          className="bg-[#63A053] text-white px-2.5 rounded-xs text-xl"
        >
          +
        </button>
        <FileText className="w-5 h-5 text-gray-500" />
        <ImageDown className="w-5 h-5 text-gray-500" />
        <PlaySquare className="w-5 h-5 text-gray-500" />
        <Globe className="w-5 h-5 text-gray-500" />
        <FolderPlus className="w-5 h-5 text-gray-500" />
      </div>
    </div>
  );
}
