"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function JalonDetailsBodySkeleton() {
  return (
    <div className="px-10 py-7 space-y-10">
      {/* TOP GRID */}
      <div className="grid grid-cols-12 gap-8">
        {/* Description */}
        <div className="col-span-6 space-y-3">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-11/12" />
          <Skeleton className="h-4 w-10/12" />
        </div>

        {/* Date Start + Manager */}
        <div className="col-span-2 space-y-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-3 w-14" />

          <div className="mt-5 space-y-3">
            <Skeleton className="h-4 w-28" />
            <div className="flex items-center gap-3">
              <Skeleton className="w-12 h-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          </div>
        </div>

        {/* Date End */}
        <div className="col-span-2 space-y-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-3 w-14" />
        </div>

        {/* Priority */}
        <div className="col-span-2 space-y-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>

      {/* DELIVERABLES */}
      <div>
        <Skeleton className="h-4 w-48 mb-6" />
        <div className="grid grid-cols-3 gap-10">
          {[0, 1].map((col) => (
            <div key={col}>
              <Skeleton className="h-px w-full mb-3" />
              <div className="flex items-center gap-4">
                <Skeleton className="w-11 h-11 rounded" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER BUTTON */}
      <div className="flex justify-center pt-4">
        <Skeleton className="h-10 w-32 rounded-xs" />
      </div>
    </div>
  );
}
