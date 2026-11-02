import React from 'react';

export default function GlobalLoading() {
  return (
    <div className="relative min-h-[calc(100vh-64px)] w-full overflow-hidden bg-slate-50/50 p-6">
      {/* Animated subtle shimmer header */}
      <div className="mx-auto max-w-7xl animate-pulse space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200/60 pb-6">
          <div className="space-y-2">
            <div className="h-4 w-32 rounded-full bg-blue-100/80" />
            <div className="h-8 w-64 rounded-xl bg-slate-200/80" />
            <div className="h-4 w-96 rounded-lg bg-slate-100" />
          </div>
          <div className="h-10 w-28 rounded-2xl bg-blue-100/60" />
        </div>

        {/* Content Skeleton Cards Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 pt-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-32 rounded-3xl border border-slate-200/60 bg-white/70 p-4 shadow-xs backdrop-blur-sm"
            >
              <div className="flex items-center justify-between">
                <div className="h-4 w-12 rounded bg-blue-50" />
                <div className="h-3 w-3 rounded-full bg-slate-200" />
              </div>
              <div className="mt-4 h-5 w-28 rounded bg-slate-200" />
              <div className="mt-3 h-3 w-20 rounded bg-slate-100" />
            </div>
          ))}
        </div>

        {/* Big Canvas / Area Skeleton */}
        <div className="mt-6 h-80 rounded-3xl border border-slate-200/60 bg-gradient-to-b from-blue-50/40 via-white/50 to-slate-50/40 p-6 flex flex-col items-center justify-center">
          <div className="flex items-center gap-3 text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <div className="h-2 w-2 rounded-full bg-blue-500 animate-ping" />
            <span>Streaming Page Viewport...</span>
          </div>
        </div>
      </div>
    </div>
  );
}
