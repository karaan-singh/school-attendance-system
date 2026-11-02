'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Trees,
  Compass,
  Sparkles,
  LayoutDashboard,
  FileSpreadsheet,
  Users,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import dynamic from 'next/dynamic';
import { fetchWithCache } from '@/lib/apiCache';
import { SchoolClassData } from '@/types';
import { useRouter } from 'next/navigation';

const CanvasContainer = dynamic(() => import('@/components/3d/CanvasContainer'), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 h-full w-full bg-gradient-to-b from-sky-100/40 via-white/30 to-slate-50/40" />
  ),
});

const VillageScene = dynamic(() => import('@/components/3d/VillageScene'), {
  ssr: false,
});

interface HomePageClientProps {
  initialClasses: SchoolClassData[];
}

export default function HomePageClient({ initialClasses }: HomePageClientProps) {
  const router = useRouter();
  const [classes, setClasses] = useState<SchoolClassData[]>(initialClasses);
  const [canMount3D, setCanMount3D] = useState(false);
  const [enable3D, setEnable3D] = useState(true);

  useEffect(() => {
    // Background revalidate if initialClasses is empty
    if (initialClasses.length === 0) {
      fetchWithCache<{ classes: SchoolClassData[] }>('/api/classes')
        .then((data) => {
          if (data?.classes) setClasses(data.classes);
        })
        .catch((err) => console.error(err));
    }

    // Check user preference for 3D background
    const saved = localStorage.getItem('fq_home_3d');
    if (saved === 'false') {
      setEnable3D(false);
      return;
    }

    // Progressive Idle Mount: let DOM hydrate & paint smoothly before mounting WebGL
    let idleHandle: any;
    let timerHandle: any;
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      idleHandle = (window as any).requestIdleCallback(() => setCanMount3D(true), { timeout: 600 });
    } else {
      timerHandle = setTimeout(() => setCanMount3D(true), 250);
    }

    return () => {
      if (idleHandle && 'cancelIdleCallback' in window) (window as any).cancelIdleCallback(idleHandle);
      if (timerHandle) clearTimeout(timerHandle);
    };
  }, [initialClasses.length]);

  const toggle3DMode = () => {
    const nextVal = !enable3D;
    setEnable3D(nextVal);
    localStorage.setItem('fq_home_3d', String(nextVal));
    if (nextVal) setCanMount3D(true);
  };

  const handleSelectClass = (c: SchoolClassData) => {
    router.push(`/attendance/${c.id}`);
  };

  return (
    <div className="relative min-h-[calc(100vh-64px)] w-full overflow-hidden bg-gradient-to-b from-sky-50 via-white to-slate-50">
      {/* 3D Background Canvas Preview with Deferred Progressive Loading */}
      {enable3D && canMount3D ? (
        <div className="absolute inset-0 h-full w-full opacity-65 transition-opacity duration-700 ease-in">
          <CanvasContainer cameraPosition={[0, 9, 17]} enableControls={true}>
            <VillageScene classes={classes} onSelectClass={handleSelectClass} />
          </CanvasContainer>
        </div>
      ) : (
        /* Lightweight 0ms CSS Ambient Sunlit Backdrop */
        <div className="absolute inset-0 h-full w-full bg-gradient-to-br from-sky-100/50 via-blue-50/30 to-indigo-50/40">
          <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-blue-200/40 blur-3xl" />
          <div className="absolute top-1/2 -left-20 h-80 w-80 rounded-full bg-emerald-200/30 blur-3xl" />
        </div>
      )}

      {/* Atmospheric Vignette Gradients */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-white/95 via-white/50 to-transparent" />

      {/* Hero Content Overlay */}
      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-64px)] max-w-7xl flex-col justify-between px-6 py-12">
        <div className="max-w-2xl space-y-6">
          {/* Badge & Performance Mode Toggle */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/90 px-4 py-1.5 text-xs font-bold text-blue-700 shadow-xs backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-amber-500 animate-pulse" />
              <span>Story-Driven 3D School Attendance Engine</span>
            </div>

            <button
              onClick={toggle3DMode}
              title="Toggle between Interactive 3D Valley and Instant 0ms Fast Mode"
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold shadow-xs transition-all backdrop-blur-md ${
                enable3D
                  ? 'border-emerald-200 bg-emerald-50/90 text-emerald-800 hover:bg-emerald-100'
                  : 'border-blue-200 bg-blue-50/90 text-blue-800 hover:bg-blue-100'
              }`}
            >
              <span>{enable3D ? '🏞️ 3D Valley (Active)' : '⚡ Fast Mode (Active)'}</span>
              <span className="text-[10px] opacity-75 underline">switch</span>
            </button>
          </div>

          {/* Title */}
          <h1 className="font-display text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl sm:leading-[1.1]">
            Transform Roll-Call into a{' '}
            <span className="text-blue-shimmer">Living Forest Quest</span>
          </h1>

          {/* Description */}
          <p className="text-sm leading-relaxed text-slate-600 sm:text-base">
            Where every student is an enchanted tree in a sunlit alpine valley. Featuring interactive
            3D village selection, character journey tracking, living canopy bloom feedback tied to verified
            MySQL state, and instant Excel roster import & attendance export.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href="/village"
              className="group flex items-center gap-2 rounded-2xl border border-blue-500 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-500/25 hover:brightness-105 active:scale-95 transition-all"
            >
              <Compass className="h-4 w-4 text-amber-300 transition-transform group-hover:rotate-45" />
              <span>Enter Chapter 1: The Village</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              href="/dashboard"
              className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white/90 px-6 py-3.5 text-sm font-bold text-slate-700 shadow-sm backdrop-blur-md hover:bg-slate-50 hover:text-blue-600 transition-all"
            >
              <LayoutDashboard className="h-4 w-4 text-blue-600" />
              <span>Teacher Dashboard</span>
            </Link>
          </div>

          {/* Highlights */}
          <div className="grid grid-cols-2 gap-3 pt-6 sm:grid-cols-3">
            <div className="rounded-2xl border border-blue-100 bg-white/85 p-3.5 shadow-xs backdrop-blur-sm">
              <div className="flex items-center gap-2 text-slate-900 text-xs font-bold">
                <CheckCircle2 className="h-4 w-4 text-blue-600" />
                <span>Prisma & MySQL</span>
              </div>
              <p className="mt-1 text-[11px] text-slate-500">
                XAMPP MySQL relational storage with audit trail
              </p>
            </div>

            <div className="rounded-2xl border border-blue-100 bg-white/85 p-3.5 shadow-xs backdrop-blur-sm">
              <div className="flex items-center gap-2 text-slate-900 text-xs font-bold">
                <Trees className="h-4 w-4 text-emerald-600" />
                <span>5 Chapters</span>
              </div>
              <p className="mt-1 text-[11px] text-slate-500">
                Village, Journey, Forest, Bloom & Mountain Sunset
              </p>
            </div>

            <div className="rounded-2xl border border-blue-100 bg-white/85 p-3.5 shadow-xs backdrop-blur-sm col-span-2 sm:col-span-1">
              <div className="flex items-center gap-2 text-slate-900 text-xs font-bold">
                <FileSpreadsheet className="h-4 w-4 text-sky-600" />
                <span>ExcelJS Suite</span>
              </div>
              <p className="mt-1 text-[11px] text-slate-500">
                Roster import wizard & styled .xlsx reports
              </p>
            </div>
          </div>
        </div>

        {/* Quick Class Huts Cards */}
        <div className="pt-8">
          <div className="flex items-center justify-between pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Active Class Enclaves
            </span>
            <Link
              href="/village"
              className="text-xs font-bold text-blue-600 hover:underline"
            >
              Explore 3D Village →
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4">
            {classes.length === 0 ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-blue-100 bg-white/70 p-4 shadow-xs backdrop-blur-md animate-pulse h-28"
                >
                  <div className="flex items-center justify-between">
                    <div className="h-4 w-12 bg-blue-100/60 rounded" />
                    <div className="h-2.5 w-2.5 bg-blue-100/60 rounded-full" />
                  </div>
                  <div className="mt-3 h-4 w-32 bg-slate-200/60 rounded" />
                  <div className="mt-4 h-3 w-20 bg-slate-100 rounded" />
                </div>
              ))
            ) : (
              classes.map((c) => (
                <div
                  key={c.id}
                  onClick={() => handleSelectClass(c)}
                  className="group cursor-pointer rounded-2xl border border-blue-100 bg-white/90 p-4 shadow-xs backdrop-blur-md transition-all hover:border-blue-400 hover:shadow-md hover:-translate-y-0.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="rounded-md bg-blue-50 px-2 py-0.5 font-mono text-[11px] font-bold text-blue-700 border border-blue-200">
                      {c.code}
                    </span>
                    <span
                      className="h-2.5 w-2.5 rounded-full ring-2 ring-white shadow-xs"
                      style={{ backgroundColor: c.hutColor }}
                    />
                  </div>
                  <h4 className="mt-2 font-display text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {c.name}
                  </h4>
                  <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3 text-slate-400" />
                      {c.studentCount} Students
                    </span>
                    <span className="font-bold text-blue-600 group-hover:underline">
                      Take Roll-Call →
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

