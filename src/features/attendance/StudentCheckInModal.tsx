'use client';

import React, { useState } from 'react';
import { StudentRecord, AttendanceStatus } from '@/types';
import {
  X,
  Sparkles,
  Clock,
  ShieldAlert,
  Check,
  Phone,
  Trees,
  CheckCircle2,
} from 'lucide-react';

interface StudentCheckInModalProps {
  student: StudentRecord;
  onClose: () => void;
  onUpdateStatus: (studentId: string, status: AttendanceStatus, note?: string) => Promise<boolean>;
}

export default function StudentCheckInModal({
  student,
  onClose,
  onUpdateStatus,
}: StudentCheckInModalProps) {
  const [note, setNote] = useState(student.note || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSelectStatus = async (status: AttendanceStatus) => {
    setIsSubmitting(true);
    await onUpdateStatus(student.id, status, note);
    setIsSubmitting(false);
    onClose();
  };

  const statusOptions: Array<{
    status: AttendanceStatus;
    label: string;
    icon: any;
    desc: string;
    colorClasses: string;
  }> = [
    {
      status: 'PRESENT',
      label: 'Present',
      icon: Sparkles,
      desc: 'Blooms vibrant emerald foliage & sparks golden pollen',
      colorClasses:
        'border-emerald-200 bg-emerald-50/80 text-emerald-900 hover:bg-emerald-100 hover:border-emerald-400',
    },
    {
      status: 'LATE',
      label: 'Late',
      icon: Clock,
      desc: 'Awakens with warm glowing amber foliage',
      colorClasses:
        'border-amber-200 bg-amber-50/80 text-amber-900 hover:bg-amber-100 hover:border-amber-400',
    },
    {
      status: 'EXCUSED',
      label: 'Excused',
      icon: Check,
      desc: 'Protected under gentle sky-blue buds',
      colorClasses:
        'border-sky-200 bg-sky-50/80 text-sky-900 hover:bg-sky-100 hover:border-sky-400',
    },
    {
      status: 'ABSENT',
      label: 'Absent',
      icon: ShieldAlert,
      desc: 'Rests peacefully in dignified autumn slate',
      colorClasses:
        'border-slate-200 bg-slate-50 text-slate-800 hover:bg-slate-100 hover:border-slate-400',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-3xl border border-blue-100 bg-white p-6 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Student Header */}
        <div className="flex items-center gap-3.5 border-b border-slate-100 pb-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 shadow-2xs">
            <Trees className="h-7 w-7 text-blue-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-blue-700">
                {student.rollNumber}
              </span>
              <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                {student.gender}
              </span>
            </div>
            <h3 className="font-display text-lg font-bold text-slate-900">
              {student.fullName}
            </h3>
            <p className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
              <span>Species: {student.treeSpecies || 'Emerald Oak'}</span>
              {student.parentPhone && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Phone className="h-2.5 w-2.5 text-blue-500" />
                    {student.parentPhone}
                  </span>
                </>
              )}
            </p>
          </div>
        </div>

        {/* Status Actions */}
        <div className="mt-5 space-y-2.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
            Select Attendance Status
          </label>
          <div className="grid grid-cols-2 gap-2.5">
            {statusOptions.map((opt) => {
              const Icon = opt.icon;
              const isCurrent = student.status === opt.status;
              return (
                <button
                  key={opt.status}
                  disabled={isSubmitting}
                  onClick={() => handleSelectStatus(opt.status)}
                  className={`flex flex-col items-start gap-1 rounded-2xl border p-3.5 text-left transition-all ${
                    opt.colorClasses
                  } ${isCurrent ? 'ring-2 ring-blue-500 shadow-md scale-[1.02]' : ''}`}
                >
                  <div className="flex w-full items-center justify-between">
                    <div className="flex items-center gap-1.5 font-bold text-sm">
                      <Icon className="h-4 w-4" />
                      {opt.label}
                    </div>
                    {isCurrent && <CheckCircle2 className="h-4 w-4 text-blue-600" />}
                  </div>
                  <span className="text-[11px] opacity-80 leading-snug">
                    {opt.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Note Input */}
        <div className="mt-4">
          <label className="text-xs font-bold text-slate-700">
            Check-In Note (Optional)
          </label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. Doctor note received, arrived on time"
            className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>
    </div>
  );
}
