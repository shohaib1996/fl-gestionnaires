import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TASK_STATUS_OPTIONS, TaskStatus } from "@/types/task-status";

interface TaskStatusCellProps {
  status: TaskStatus;
  role?: string;
  onChange: (status: TaskStatus) => void;
}
const CAN_EDIT_STATUS = ["admin", "super_admin"] as const;

function canEditStatus(role?: string) {
  return role && CAN_EDIT_STATUS.includes(role as any);
}

export function TaskStatusCell({
  status,
  role,
  onChange,
}: TaskStatusCellProps) {
  const editable = canEditStatus(role);

  // Get the label for the current status
  const currentOption = TASK_STATUS_OPTIONS.find((opt) => opt.value === status);
  const label = currentOption?.label || status.replace("_", " ");

  // Get color based on status
  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case "completed":
        return "text-[#63A053] font-semibold";
      case "in_progress":
        return "text-[#197b8d] font-semibold";
      default:
        return "text-gray-700 dark:text-gray-300";
    }
  };

  if (!editable) {
    return <span className={getStatusColor(status)}>{label}</span>;
  }

  return (
    <Select value={status} onValueChange={(v) => onChange(v as TaskStatus)}>
      <SelectTrigger className={`h-8 w-fit text-sm border-0 ${getStatusColor(status)}`}>
        <SelectValue />
      </SelectTrigger>

      <SelectContent>
        {TASK_STATUS_OPTIONS.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
