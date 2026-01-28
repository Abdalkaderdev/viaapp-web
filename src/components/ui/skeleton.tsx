'use client';

import { clsx } from 'clsx';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={clsx(
        'animate-pulse bg-gray-200 rounded',
        className
      )}
      aria-hidden="true"
    />
  );
}

// Verse/Prayer Card Skeleton
export function CardSkeleton() {
  return (
    <div className="bg-white rounded-xl p-4 border border-gray-200 animate-pulse">
      <div className="flex items-start gap-3">
        <Skeleton className="w-10 h-10 rounded-lg flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-3/4 rounded" />
          <Skeleton className="h-4 w-full rounded" />
          <Skeleton className="h-4 w-2/3 rounded" />
        </div>
      </div>
    </div>
  );
}

// Stat Card Skeleton
export function StatCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-pulse">
      <div className="flex items-center gap-4">
        <Skeleton className="w-12 h-12 rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-20 rounded" />
          <Skeleton className="h-6 w-12 rounded" />
        </div>
      </div>
      <Skeleton className="h-3 w-32 rounded mt-3" />
    </div>
  );
}

// Quick Action Skeleton
export function QuickActionSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-pulse">
      <div className="flex items-start justify-between">
        <Skeleton className="w-12 h-12 rounded-xl" />
        <Skeleton className="w-5 h-5 rounded" />
      </div>
      <Skeleton className="h-5 w-24 rounded mt-4" />
      <Skeleton className="h-4 w-32 rounded mt-2" />
    </div>
  );
}

// Prayer Card Skeleton
export function PrayerCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200 animate-pulse">
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-40 rounded" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
          <Skeleton className="h-4 w-full rounded" />
          <div className="flex items-center gap-4 mt-3">
            <Skeleton className="h-4 w-16 rounded" />
            <Skeleton className="h-4 w-24 rounded" />
          </div>
        </div>
        <Skeleton className="w-9 h-9 rounded" />
      </div>
    </div>
  );
}

// Memory Verse Skeleton
export function VerseCardSkeleton() {
  return (
    <div className="bg-white rounded-xl p-4 border border-gray-200 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-3">
            <Skeleton className="h-5 w-24 rounded" />
            <Skeleton className="h-4 w-32 rounded" />
          </div>
          <Skeleton className="h-4 w-full rounded" />
          <div className="mt-3 flex items-center gap-3">
            <Skeleton className="h-2 w-full rounded-full" />
            <Skeleton className="h-4 w-8 rounded" />
          </div>
        </div>
        <Skeleton className="w-5 h-5 rounded ml-4" />
      </div>
    </div>
  );
}

// Bible Book Button Skeleton
export function BookButtonSkeleton() {
  return (
    <div className="p-3 bg-white rounded-lg border border-gray-200 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Skeleton className="h-4 w-20 rounded" />
          <Skeleton className="h-3 w-16 rounded" />
        </div>
        <Skeleton className="w-4 h-4 rounded" />
      </div>
    </div>
  );
}

// Reading Plan Card Skeleton
export function ReadingPlanSkeleton() {
  return (
    <div className="bg-white rounded-xl p-4 border border-gray-200 animate-pulse">
      <div className="flex items-start gap-3">
        <Skeleton className="w-10 h-10 rounded-lg flex-shrink-0" />
        <div className="flex-1 min-w-0 space-y-1">
          <Skeleton className="h-5 w-3/4 rounded" />
          <Skeleton className="h-4 w-24 rounded" />
        </div>
        <Skeleton className="h-7 w-14 rounded-lg flex-shrink-0" />
      </div>
    </div>
  );
}

// Activity Item Skeleton
export function ActivityItemSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4 animate-pulse">
      <Skeleton className="w-10 h-10 rounded-xl flex-shrink-0" />
      <div className="flex-1 min-w-0 space-y-1">
        <Skeleton className="h-4 w-32 rounded" />
        <Skeleton className="h-3 w-48 rounded" />
      </div>
      <Skeleton className="h-3 w-16 rounded flex-shrink-0" />
    </div>
  );
}

// Full Page Loading Skeleton
export function PageLoadingSkeleton() {
  return (
    <div className="max-w-4xl mx-auto animate-pulse" aria-label="Loading content" role="status">
      <div className="mb-8 space-y-2">
        <Skeleton className="h-8 w-48 rounded" />
        <Skeleton className="h-4 w-64 rounded" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>
      <div className="space-y-4">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
      <span className="sr-only">Loading...</span>
    </div>
  );
}
