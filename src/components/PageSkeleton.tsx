import { Skeleton } from '@/components/ui/skeleton';

export const DashboardSkeleton = () => (
  <div className="px-4 py-5 space-y-6">
    <div className="flex items-start justify-between">
      <div>
        <Skeleton className="h-3 w-32 mb-2" />
        <Skeleton className="h-5 w-40" />
      </div>
      <Skeleton className="h-10 w-20 rounded-xl" />
    </div>
    <div className="grid grid-cols-2 gap-3">
      {[...Array(4)].map((_, i) => (
        <Skeleton key={i} className="h-24 rounded-2xl" />
      ))}
    </div>
    <div>
      <Skeleton className="h-3 w-28 mb-3" />
      <div className="space-y-2">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-14 rounded-xl" />
        ))}
      </div>
    </div>
  </div>
);

export const TicketsSkeleton = () => (
  <div className="px-4 py-5 space-y-4">
    <div className="flex items-center justify-between">
      <Skeleton className="h-5 w-20" />
      <Skeleton className="h-8 w-20 rounded-xl" />
    </div>
    <div className="flex gap-2">
      {[...Array(4)].map((_, i) => (
        <Skeleton key={i} className="h-7 w-16 rounded-full" />
      ))}
    </div>
    <Skeleton className="h-9 w-full rounded-xl" />
    <div className="space-y-3">
      {[...Array(3)].map((_, i) => (
        <Skeleton key={i} className="h-28 rounded-xl" />
      ))}
    </div>
  </div>
);

export const AreasSkeleton = () => (
  <div className="px-4 py-5 space-y-4">
    <div className="flex items-center justify-between">
      <Skeleton className="h-5 w-16" />
      <Skeleton className="h-8 w-20 rounded-xl" />
    </div>
    <div className="space-y-3">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-card rounded-xl shadow-sm overflow-hidden">
          <Skeleton className="w-full h-32" />
          <div className="p-3.5">
            <Skeleton className="h-4 w-32 mb-1.5" />
            <Skeleton className="h-3 w-40" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const InventorySkeleton = () => (
  <div className="px-4 py-5 space-y-4">
    <div className="flex items-center justify-between">
      <Skeleton className="h-5 w-24" />
      <Skeleton className="h-8 w-20 rounded-xl" />
    </div>
    <div className="flex gap-2">
      {[...Array(4)].map((_, i) => (
        <Skeleton key={i} className="h-7 w-16 rounded-full" />
      ))}
    </div>
    <div className="space-y-2">
      {[...Array(5)].map((_, i) => (
        <Skeleton key={i} className="h-16 rounded-xl" />
      ))}
    </div>
  </div>
);

export const PoolsSkeleton = () => (
  <div className="px-4 py-5 space-y-5">
    <div className="flex items-center justify-between">
      <Skeleton className="h-5 w-20" />
      <Skeleton className="h-8 w-24 rounded-xl" />
    </div>
    <div className="flex gap-2">
      {[...Array(3)].map((_, i) => (
        <Skeleton key={i} className="h-7 w-24 rounded-full" />
      ))}
    </div>
    <div className="grid grid-cols-3 gap-3">
      {[...Array(3)].map((_, i) => (
        <Skeleton key={i} className="h-20 rounded-xl" />
      ))}
    </div>
    <Skeleton className="h-44 rounded-xl" />
  </div>
);
