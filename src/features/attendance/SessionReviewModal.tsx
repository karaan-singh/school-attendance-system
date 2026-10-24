'use client';

import React from 'react';
import { AttendanceSessionData } from '@/types';
import {
  AlertTriangle,
  X,
  Sparkles,
  FileCheck2,
} from 'lucide-react';

interface SessionReviewModalProps {
  session: AttendanceSessionData;
  onClose: () => void;
  onConfirmFinalize: () => void;
  isSubmitting: boolean;
}

export default function SessionReviewModal({
  session,
  onClose,
  onConfirmFinalize,
  isSubmitting,
}: SessionReviewModalProps) {
  const records = session.records;
  const total = records.length;
  const unmarked = records.filter((r) => !r.status);
  const presentCount = records.filter((r) => r.status === 'PRESENT').length;
  const absentCount = records.filter((r) => r.status === 'ABSENT').length;
  const lateCount = records.filter((r) => r.status === 'LATE').length;
  const excusedCount = records.filter((r) => r.status === 'EXCUSED').length;
  const rate = total > 0 ? (presentCount / total) * 100 : 0;

  const hasUnmarked = unmarked.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-3xl border border-blue-100 bg-white p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 shadow-2xs">
            <FileCheck2 className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-display text-lg font-bold text-slate-900">
              Review & Finalize Roll-Call
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              {session.classInfo?.name || 'Class Session'} • {new Date(session.date).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Warning if unmarked students exist */}
        {hasUnmarked && (
          <div className="mt-4 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-3.5 text-amber-900">
            <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600" />
            <div className="text-xs">
              <span className="font-bold">Attention: {unmarked.length} student(s) unmarked!</span>
              <p className="mt-0.5 text-amber-800 leading-relaxed">
                Please mark all students before concluding the journey, or tap &apos;Mark All Present&apos; on the table.
              </p>
            </div>
          </div>
        )}

        {/* Breakdown Stats */}
        <div className="mt-5 grid grid-cols-4 gap-2.5 text-center text-xs">
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-3">
            <span className="block text-[11px] font-bold text-emerald-700">Present</span>
            <span className="text-xl font-bold text-emerald-800">{presentCount}</span>
          </div>
          <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-3">
            <span className="block text-[11px] font-bold text-amber-700">Late</span>
            <span className="text-xl font-bold text-amber-800">{lateCount}</span>
          </div>
          <div className="rounded-2xl border border-rose-200 bg-rose-50/70 p-3">
            <span className="block text-[11px] font-bold text-rose-700">Absent</span>
            <span className="text-xl font-bold text-rose-800">{absentCount}</span>
          </div>
          <div className="rounded-2xl border border-sky-200 bg-sky-50/70 p-3">
            <span className="block text-[11px] font-bold text-sky-700">Excused</span>
            <span className="text-xl font-bold text-sky-800">{excusedCount}</span>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between rounded-2xl bg-blue-50/70 border border-blue-100 p-3.5 text-xs">
          <span className="font-semibold text-slate-700">Attendance Percentage:</span>
          <span className="font-display font-bold text-base text-blue-700">
            {rate.toFixed(1)}%
          </span>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-2xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            disabled={hasUnmarked || isSubmitting}
            onClick={onConfirmFinalize}
            className={`flex items-center gap-2 rounded-2xl px-5 py-2.5 text-xs font-bold shadow-md transition-all ${
              hasUnmarked
                ? 'cursor-not-allowed bg-slate-200 text-slate-400 opacity-60'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:brightness-105 active:scale-95 shadow-blue-500/25'
            }`}
          >
            <Sparkles className="h-4 w-4 text-amber-300" />
            <span>{isSubmitting ? 'Finalizing...' : 'Confirm & Celebrate'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
