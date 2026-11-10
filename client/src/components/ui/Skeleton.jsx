import React from 'react';

export function Skeleton({ className = '', rounded = 'rounded-md' }) {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse bg-surface-subtle border border-border/50 ${rounded} ${className}`}
    />
  );
}

export function RoadmapCardSkeleton() {
  return (
    <div className="bg-surface p-6 rounded-lg border border-border shadow-sm flex flex-col justify-between h-72">
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-4 w-16" />
        </div>
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-12 w-full" />
      </div>
      <div className="pt-4 border-t border-border flex justify-between items-center">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-8 w-24" />
      </div>
    </div>
  );
}
