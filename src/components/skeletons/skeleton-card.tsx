import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonCard() {
  return (
    <div className="px-4">
      <div className="flex flex-col justify-end gap-2 md:justify-between  md:flex-row mb-4">
        <Skeleton className="w-44 h-10 rounded" />
        <Skeleton className="w-44 h-10 rounded" />
      </div>
      <div className="flex flex-wrap gap-4">
        <Skeleton className="rounded-lg p-4 flex flex-col md:w-[48%] lg:w-[49%] w-full h-80" />
        <Skeleton className="rounded-lg p-4 flex flex-col md:w-[48%] lg:w-[49%] w-full h-80" />
      </div>
    </div>
  );
}
