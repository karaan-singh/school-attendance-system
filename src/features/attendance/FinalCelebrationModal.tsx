'use client';

import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Trophy,
  FileSpreadsheet,
  Compass,
  LayoutDashboard,
} from 'lucide-react';

interface FinalCelebrationModalProps {
  classCode: string;
  sessionId: string;
  stats?: {
    attendanceRate: number;
    presentCount: number;
    totalStudents: number;
  };
  rewards?: {
    xpGained: number;
    didLevelUp: boolean;
    newLevel: number;
    bloomRank: string;
    firefliesEarned: number;
  };
  onClose: () => void;
}

export default function FinalCelebrationModal({
  classCode,
  sessionId,
  stats,
  rewards,
  onClose,
}: FinalCelebrationModalProps) {
  const downloadUrl = `/api/excel/export-attendance?sessionId=${sessionId}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-3xl border border-blue-200 bg-white p-6 text-center shadow-2xl">
        {/* Golden Trophy Icon */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-amber-400 to-amber-500 shadow-lg shadow-amber-400/20 ring-4 ring-amber-100">
          <Trophy className="h-8 w-8 text-white" />
        </div>

        <h2 className="mt-4 font-display text-2xl font-bold tracking-tight text-slate-900">
          Forest Quest Complete!
        </h2>
        <p className="mt-1 text-xs text-slate-500 font-medium">
          Today&apos;s roll-call is confirmed and securely persisted to MySQL.
        </p>

        {/* Milestone Rewards Box */}
        <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50/60 p-4 text-left">
          <div className="flex items-center justify-between border-b border-blue-100 pb-2.5">
            <span className="text-xs font-semibold text-slate-600">Grove XP Gained</span>
            <span className="flex items-center gap-1 font-mono text-sm font-bold text-amber-600">
              <Sparkles className="h-3.5 w-3.5 text-amber-500" /> +{rewards?.xpGained || 50} XP
            </span>
          </div>

          <div className="flex items-center justify-between border-b border-blue-100 py-2.5">
            <span className="text-xs font-semibold text-slate-600">Bloom Rank</span>
            <span className="rounded-full bg-white px-2.5 py-0.5 text-xs font-bold text-emerald-700 border border-emerald-200">
              {rewards?.bloomRank || 'Whispering Sapling'}
            </span>
          </div>

          <div className="flex items-center justify-between pt-2.5">
            <span className="text-xs font-semibold text-slate-600">Attendance Rate</span>
            <span className="font-display text-base font-bold text-blue-700">
              {stats?.attendanceRate?.toFixed(1) || 100}%
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-col gap-2.5">
          <a
            href={downloadUrl}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-blue-600 bg-gradient-to-r from-blue-600 to-indigo-600 py-3 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:brightness-105"
          >
            <FileSpreadsheet className="h-4 w-4 text-amber-300" />
            <span>Download Official Excel (.xlsx)</span>
          </a>

          <div className="flex items-center gap-2">
            <Link
              href="/village"
              className="flex flex-1 items-center justify-center gap-1.5 rounded-2xl border border-slate-200 bg-slate-50 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
            >
              <Compass className="h-3.5 w-3.5 text-blue-600" />
              <span>Village Hub</span>
            </Link>
            <Link
              href="/dashboard"
              className="flex flex-1 items-center justify-center gap-1.5 rounded-2xl border border-slate-200 bg-slate-50 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
            >
              <LayoutDashboard className="h-3.5 w-3.5 text-blue-600" />
              <span>Dashboard</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
