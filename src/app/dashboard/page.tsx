'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Compass,
  Users,
  Trees,
  CheckCircle2,
  Clock,
  FileSpreadsheet,
  Database,
  Award,
} from 'lucide-react';
import { SchoolClassData } from '@/types';

export default function DashboardPage() {
  const [classes, setClasses] = useState<SchoolClassData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/classes')
      .then((res) => res.json())
      .then((data) => {
        if (data.classes) setClasses(data.classes);
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);

  const totalStudents = classes.reduce((sum, c) => sum + (c.studentCount || 0), 0);
  const finalizedCount = classes.filter((c) => c.todaySessionStatus === 'FINALIZED').length;
  const inProgressCount = classes.filter((c) => c.todaySessionStatus === 'DRAFT').length;

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-blue-100 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-blue-50 border border-blue-200 px-3.5 py-1 font-mono text-[11px] font-bold text-blue-700">
              Ranger Rowan • Sylva Ancient Academy
            </span>
          </div>
          <h1 className="mt-2 font-display text-2xl font-bold text-slate-900 sm:text-3xl">
            Teacher Command Center
          </h1>
          <p className="mt-1 text-xs text-slate-500 sm:text-sm">
            Monitor daily roll-call sessions, inspect class progression ranks, and download reports.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/village"
            className="flex items-center gap-2 rounded-2xl border border-blue-600 bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:brightness-105"
          >
            <Compass className="h-4 w-4 text-amber-300" />
            <span>Open 3D Village Hub</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-3xl border border-blue-100 bg-white/95 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Total Classes</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Trees className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 font-display text-2xl font-bold text-slate-900">
            {classes.length} Enclaves
          </div>
          <p className="mt-1 text-[11px] text-slate-500 font-medium">Grades 1-A, 1-B, 2-A, 3-A</p>
        </div>

        <div className="rounded-3xl border border-blue-100 bg-white/95 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Enrolled Students</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 font-display text-2xl font-bold text-slate-900">
            {totalStudents} Students
          </div>
          <p className="mt-1 text-[11px] text-slate-500 font-medium">Synchronized with MySQL</p>
        </div>

        <div className="rounded-3xl border border-blue-100 bg-white/95 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Today&apos;s Sessions</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 font-display text-2xl font-bold text-emerald-700">
            {finalizedCount} / {classes.length} Complete
          </div>
          <p className="mt-1 text-[11px] text-slate-500 font-medium">
            {inProgressCount} currently in progress
          </p>
        </div>

        <div className="rounded-3xl border border-blue-100 bg-white/95 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Database Engine</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <Database className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 font-display text-2xl font-bold text-slate-900">
            MySQL 3306
          </div>
          <p className="mt-1 text-[11px] text-emerald-600 font-bold">
            Local XAMPP Active
          </p>
        </div>
      </div>

      {/* Class Enclaves Grid */}
      <div className="mt-8">
        <div className="flex items-center justify-between pb-4">
          <h2 className="font-display text-lg font-bold text-slate-900">
            Today&apos;s Class Sessions
          </h2>
          <span className="text-xs font-semibold text-slate-500">
            Date: {new Date().toLocaleDateString()}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {classes.map((cls) => {
            const isFinalized = cls.todaySessionStatus === 'FINALIZED';
            const isDraft = cls.todaySessionStatus === 'DRAFT';
            const progress = cls.progress;

            return (
              <div
                key={cls.id}
                className="flex flex-col justify-between rounded-3xl border border-blue-100 bg-white p-6 shadow-sm transition-all hover:border-blue-300 hover:shadow-md"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="rounded-md bg-blue-50 px-2 py-0.5 font-mono text-xs font-bold text-blue-700 border border-blue-200">
                        {cls.code}
                      </span>
                      <h3 className="mt-2 font-display text-lg font-bold text-slate-900">
                        {cls.name}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium">
                        {cls.room || 'Canopy Hut'} • {cls.studentCount} Registered Students
                      </p>
                    </div>

                    {/* Status Pill */}
                    {isFinalized ? (
                      <span className="flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Finalized
                      </span>
                    ) : isDraft ? (
                      <span className="flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">
                        <Clock className="h-3.5 w-3.5 animate-pulse" /> In Progress
                      </span>
                    ) : (
                      <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-500">
                        Not Started
                      </span>
                    )}
                  </div>

                  {/* Grove Progress Meter */}
                  {progress && (
                    <div className="mt-4 rounded-2xl border border-blue-50 bg-blue-50/50 p-3.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-700 flex items-center gap-1">
                          <Award className="h-3.5 w-3.5 text-blue-600" />
                          Rank: {progress.bloomRank}
                        </span>
                        <span className="font-mono text-blue-700 font-bold">
                          Lv. {progress.level} ({progress.currentXp}/{progress.nextLevelXp} XP)
                        </span>
                      </div>
                      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-200">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-indigo-600"
                          style={{
                            width: `${(progress.currentXp / progress.nextLevelXp) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-4">
                  <Link
                    href={`/attendance/${cls.id}`}
                    className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-blue-600 bg-gradient-to-r from-blue-600 to-indigo-600 py-2.5 text-xs font-bold text-white shadow-xs hover:brightness-105 active:scale-95"
                  >
                    <Compass className="h-4 w-4 text-amber-300" />
                    <span>Launch 3D Journey</span>
                  </Link>

                  <a
                    href={`/api/excel/export-attendance?classId=${cls.id}`}
                    className="flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100"
                    title="Export attendance spreadsheet"
                  >
                    <FileSpreadsheet className="h-4 w-4 text-blue-600" />
                    <span>Excel</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
