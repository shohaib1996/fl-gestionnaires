import { Skeleton } from "@/components/ui/skeleton";

export function ContactGridSkeleton() {
  return (
    <div className="bg-white dark:bg-[#0D1514] border rounded p-8">
      {/* Avatar */}
      <div className="flex justify-center mb-4">
        <Skeleton className="w-20 h-20 rounded-full" />
      </div>

      {/* Name */}
      <Skeleton className="h-4 w-3/4 mx-auto mb-2" />

      {/* Title */}
      <Skeleton className="h-3 w-1/2 mx-auto mb-4" />

      {/* City */}
      <Skeleton className="h-3 w-2/3 mx-auto mb-6" />

      {/* Buttons */}
      <div className="flex justify-center gap-2">
        <Skeleton className="h-8 w-20 rounded-full" />
        <Skeleton className="h-8 w-20 rounded-full" />
      </div>
    </div>
  );
}
