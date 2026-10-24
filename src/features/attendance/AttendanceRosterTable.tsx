'use client';

import React, { useMemo } from 'react';
import { StudentRecord, AttendanceStatus } from '@/types';
import {
  Sparkles,
  Search,
  Undo2,
  CheckCircle,
  Clock,
  ShieldAlert,
  Check,
  Trees,
} from 'lucide-react';

interface AttendanceRosterTableProps {
  students: StudentRecord[];
  searchQuery: string;
  onSearchChange: (q: string) => void;
  statusFilter: 'ALL' | AttendanceStatus | 'UNMARKED';
  onFilterChange: (f: 'ALL' | AttendanceStatus | 'UNMARKED') => void;
  onUpdateStatus: (studentId: string, status: AttendanceStatus) => Promise<boolean>;
  onMarkAllPresent: () => Promise<boolean>;
  onUndo: () => Promise<boolean>;
  canUndo: boolean;
  isSaving: boolean;
  onSelectStudentRow: (student: StudentRecord) => void;
}

export default function AttendanceRosterTable({
  students,
  searchQuery,
  onSearchChange,
  statusFilter,
  onFilterChange,
  onUpdateStatus,
  onMarkAllPresent,
  onUndo,
  canUndo,
  isSaving,
  onSelectStudentRow,
}: AttendanceRosterTableProps) {
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchesSearch =
        s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.rollNumber.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (statusFilter === 'ALL') return true;
      if (statusFilter === 'UNMARKED') return !s.status;
      return s.status === statusFilter;
    });
  }, [students, searchQuery, statusFilter]);

  const total = students.length;
  const presentCount = students.filter((s) => s.status === 'PRESENT').length;
  const absentCount = students.filter((s) => s.status === 'ABSENT').length;
  const lateCount = students.filter((s) => s.status === 'LATE').length;
  const excusedCount = students.filter((s) => s.status === 'EXCUSED').length;
  const rate = total > 0 ? (presentCount / total) * 100 : 0;

  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-blue-100 bg-white/95 p-6 shadow-xl backdrop-blur-md">
      {/* Tally Metrics Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-6">
        <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-3 text-center">
          <span className="block text-[11px] font-semibold text-slate-500">Total Enrolled</span>
          <span className="font-display text-xl font-bold text-slate-900">{total}</span>
        </div>
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-3 text-center">
          <span className="block text-[11px] font-bold text-emerald-700">Present</span>
          <span className="font-display text-xl font-bold text-emerald-700">{presentCount}</span>
        </div>
        <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-3 text-center">
          <span className="block text-[11px] font-bold text-amber-700">Late</span>
          <span className="font-display text-xl font-bold text-amber-700">{lateCount}</span>
        </div>
        <div className="rounded-2xl border border-rose-200 bg-rose-50/70 p-3 text-center">
          <span className="block text-[11px] font-bold text-rose-700">Absent</span>
          <span className="font-display text-xl font-bold text-rose-700">{absentCount}</span>
        </div>
        <div className="rounded-2xl border border-sky-200 bg-sky-50/70 p-3 text-center">
          <span className="block text-[11px] font-bold text-sky-700">Excused</span>
          <span className="font-display text-xl font-bold text-sky-700">{excusedCount}</span>
        </div>
        <div className="rounded-2xl border border-blue-200 bg-blue-50/80 p-3 text-center">
          <span className="block text-[11px] font-bold text-blue-700">Attendance Rate</span>
          <span className="font-display text-xl font-bold text-blue-800">
            {rate.toFixed(0)}%
          </span>
        </div>
      </div>

      {/* Control Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-y border-slate-200/80 py-3.5">
        {/* Search */}
        <div className="relative min-w-[220px] flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search student or roll #..."
            className="w-full rounded-2xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Undo Button */}
          <button
            onClick={onUndo}
            disabled={!canUndo || isSaving}
            title="Undo last marked action"
            className={`flex items-center gap-1.5 rounded-2xl border px-3.5 py-2 text-xs font-semibold transition-all ${
              canUndo
                ? 'border-slate-300 bg-white text-slate-700 shadow-2xs hover:bg-slate-50'
                : 'border-slate-200 bg-slate-50 text-slate-400 opacity-60'
            }`}
          >
            <Undo2 className="h-3.5 w-3.5" />
            <span>Undo</span>
          </button>

          {/* Mark All Present */}
          <button
            onClick={onMarkAllPresent}
            disabled={isSaving}
            className="flex items-center gap-1.5 rounded-2xl border border-blue-600 bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:brightness-105 active:scale-95 transition-all"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-300" />
            <span>Mark All Present</span>
          </button>
        </div>
      </div>

      {/* Status Filter Chips */}
      <div className="flex flex-wrap items-center gap-1.5">
        {[
          { key: 'ALL', label: 'All Roster' },
          { key: 'PRESENT', label: 'Present' },
          { key: 'LATE', label: 'Late' },
          { key: 'ABSENT', label: 'Absent' },
          { key: 'EXCUSED', label: 'Excused' },
          { key: 'UNMARKED', label: 'Unmarked' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => onFilterChange(tab.key as any)}
            className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
              statusFilter === tab.key
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Roster Table */}
      <div className="max-h-[460px] overflow-y-auto rounded-2xl border border-slate-200 shadow-2xs">
        <table className="w-full text-left text-xs">
          <thead className="sticky top-0 z-10 bg-blue-50 text-[11px] font-bold uppercase tracking-wider text-blue-900 shadow-2xs">
            <tr>
              <th className="py-3 px-3.5">Roll #</th>
              <th className="py-3 px-3.5">Student Name</th>
              <th className="py-3 px-3.5 hidden sm:table-cell">Species</th>
              <th className="py-3 px-3.5">Current Status</th>
              <th className="py-3 px-3.5 text-right">Quick Mark</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {filteredStudents.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-slate-400">
                  No matching student records found.
                </td>
              </tr>
            ) : (
              filteredStudents.map((s) => (
                <tr
                  key={s.id}
                  onClick={() => onSelectStudentRow(s)}
                  className="cursor-pointer transition-colors hover:bg-blue-50/50"
                >
                  <td className="py-3 px-3.5 font-mono font-bold text-blue-700">
                    {s.rollNumber}
                  </td>
                  <td className="py-3 px-3.5">
                    <span className="font-bold text-slate-900">{s.fullName}</span>
                    <span className="ml-2 text-[10px] text-slate-500 font-medium">({s.gender})</span>
                  </td>
                  <td className="py-3 px-3.5 hidden sm:table-cell text-slate-600">
                    <div className="flex items-center gap-1.5 font-medium">
                      <Trees className="h-3.5 w-3.5 text-emerald-600" />
                      {s.treeSpecies || 'Emerald Oak'}
                    </div>
                  </td>
                  <td className="py-3 px-3.5">
                    {s.status === 'PRESENT' ? (
                      <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2 py-0.5 font-bold text-emerald-700 border border-emerald-200">
                        <CheckCircle className="h-3 w-3 text-emerald-600" /> Present
                      </span>
                    ) : s.status === 'LATE' ? (
                      <span className="inline-flex items-center gap-1 rounded-lg bg-amber-50 px-2 py-0.5 font-bold text-amber-700 border border-amber-200">
                        <Clock className="h-3 w-3 text-amber-600" /> Late
                      </span>
                    ) : s.status === 'ABSENT' ? (
                      <span className="inline-flex items-center gap-1 rounded-lg bg-rose-50 px-2 py-0.5 font-bold text-rose-700 border border-rose-200">
                        <ShieldAlert className="h-3 w-3 text-rose-600" /> Absent
                      </span>
                    ) : s.status === 'EXCUSED' ? (
                      <span className="inline-flex items-center gap-1 rounded-lg bg-sky-50 px-2 py-0.5 font-bold text-sky-700 border border-sky-200">
                        <Check className="h-3 w-3 text-sky-600" /> Excused
                      </span>
                    ) : (
                      <span className="text-slate-400 italic">Unmarked</span>
                    )}
                  </td>
                  <td className="py-3 px-3.5 text-right">
                    <div
                      className="inline-flex items-center gap-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        title="Mark Present"
                        onClick={() => onUpdateStatus(s.id, 'PRESENT')}
                        className={`rounded-lg px-2.5 py-1 font-bold text-[10px] transition-all ${
                          s.status === 'PRESENT'
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                        }`}
                      >
                        P
                      </button>
                      <button
                        title="Mark Late"
                        onClick={() => onUpdateStatus(s.id, 'LATE')}
                        className={`rounded-lg px-2.5 py-1 font-bold text-[10px] transition-all ${
                          s.status === 'LATE'
                            ? 'bg-amber-600 text-white shadow-xs'
                            : 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
                        }`}
                      >
                        L
                      </button>
                      <button
                        title="Mark Absent"
                        onClick={() => onUpdateStatus(s.id, 'ABSENT')}
                        className={`rounded-lg px-2.5 py-1 font-bold text-[10px] transition-all ${
                          s.status === 'ABSENT'
                            ? 'bg-rose-600 text-white shadow-xs'
                            : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                        }`}
                      >
                        A
                      </button>
                      <button
                        title="Mark Excused"
                        onClick={() => onUpdateStatus(s.id, 'EXCUSED')}
                        className={`rounded-lg px-2.5 py-1 font-bold text-[10px] transition-all ${
                          s.status === 'EXCUSED'
                            ? 'bg-sky-600 text-white shadow-xs'
                            : 'bg-sky-50 text-sky-700 border border-sky-200 hover:bg-sky-100'
                        }`}
                      >
                        E
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
