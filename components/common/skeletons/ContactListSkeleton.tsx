import { Skeleton } from "@/components/ui/skeleton";

export function ContactListSkeleton() {
  return (
    <div className="flex items-center justify-between gap-4 bg-white dark:bg-[#0D1514] border rounded px-4 py-2">
      {/* Left */}
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <Skeleton className="w-12 h-12 rounded-full" />

        {/* Text */}
        <div className="flex gap-3 items-center">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-28" />
        </div>
      </div>

      {/* Menu */}
      <Skeleton className="w-6 h-6 rounded-full" />
    </div>
  );
}
