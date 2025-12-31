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

  if (!editable) {
    return <>{status.replace("_", " ")}</>;
  }

  return (
    <Select value={status} onValueChange={(v) => onChange(v as TaskStatus)}>
      <SelectTrigger className="h-8 w-fit text-sm  border-0">
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
