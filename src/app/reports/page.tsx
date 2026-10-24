'use client';

import React, { useEffect, useState } from 'react';
import {
  FileSpreadsheet,
  Download,
  Sparkles,
  ArrowDownToLine,
  FileText,
} from 'lucide-react';
import { SchoolClassData } from '@/types';

export default function ReportsHubPage() {
  const [classes, setClasses] = useState<SchoolClassData[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/classes')
      .then((res) => res.json())
      .then((data) => {
        if (data.classes && data.classes.length > 0) {
          setClasses(data.classes);
          setSelectedClassId(data.classes[0].id);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-6 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-blue-100 pb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900 sm:text-3xl flex items-center gap-2">
            <FileSpreadsheet className="h-7 w-7 text-blue-600" />
            Attendance Reports & Excel Exports
          </h1>
          <p className="mt-1 text-xs text-slate-500 sm:text-sm font-medium">
            Generate official formatted spreadsheets (.xlsx) with attendance statistics, custom headers, and audit records.
          </p>
        </div>

        {/* Template Button */}
        <a
          href="/api/excel/template"
          className="flex items-center gap-1.5 rounded-2xl border border-blue-200 bg-blue-50/80 px-4 py-2 text-xs font-bold text-blue-800 hover:bg-blue-100 shadow-2xs"
        >
          <Download className="h-4 w-4 text-blue-600" />
          <span>Download Roster Template</span>
        </a>
      </div>

      {/* Export Cards Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Card 1: Today's Roll-Call Export */}
        <div className="flex flex-col justify-between rounded-3xl border border-blue-100 bg-white p-6 shadow-sm">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600">
              <Sparkles className="h-4 w-4 text-amber-500" />
              <span>Single Session Export</span>
            </div>
            <h2 className="mt-2 font-display text-xl font-bold text-slate-900">
              Daily Attendance Report (.xlsx)
            </h2>
            <p className="mt-1 text-xs text-slate-500 leading-relaxed font-medium">
              Download the official attendance record for today or a chosen date, featuring color-coded badges, present rates, and timestamps.
            </p>

            {/* Class Selector */}
            <div className="mt-4">
              <label className="text-xs font-bold text-slate-700">
                Select Class
              </label>
              <select
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
                className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
              >
                {[1, 2, 3, 4].map((grade) => {
                  const gradeClasses = classes.filter((c) => c.grade === grade);
                  if (gradeClasses.length === 0) return null;
                  const villageLabel =
                    grade === 1
                      ? 'Grade 1 • Lakeside Valley Village'
                      : grade === 2
                      ? 'Grade 2 • High Timber Ridge Village'
                      : grade === 3
                      ? 'Grade 3 • Whispering River Enclave'
                      : 'Grade 4 • Ancient Summit Sanctum';
                  return (
                    <optgroup key={grade} label={villageLabel}>
                      {gradeClasses.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.code} — {c.name}
                        </option>
                      ))}
                    </optgroup>
                  );
                })}
              </select>
            </div>
          </div>

          <div className="mt-6 border-t border-slate-100 pt-4">
            <a
              href={`/api/excel/export-attendance?classId=${selectedClassId}`}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-blue-600 bg-gradient-to-r from-blue-600 to-indigo-600 py-3 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:brightness-105 active:scale-95"
            >
              <ArrowDownToLine className="h-4 w-4 text-amber-300" />
              <span>Download Excel Report</span>
            </a>
          </div>
        </div>

        {/* Card 2: All Classes Quick Export Hub */}
        <div className="flex flex-col justify-between rounded-3xl border border-blue-100 bg-white p-6 shadow-sm">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600">
              <FileText className="h-4 w-4" />
              <span>Direct Class Downloads</span>
            </div>
            <h2 className="mt-2 font-display text-xl font-bold text-slate-900">
              Quick Class Workbooks
            </h2>
            <p className="mt-1 text-xs text-slate-500 leading-relaxed font-medium">
              Instant 1-click download of the latest attendance sheets for each active enclave.
            </p>

            <div className="mt-4 space-y-2">
              {classes.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50/80 p-3"
                >
                  <div>
                    <span className="font-bold text-xs text-slate-800">
                      {c.name}
                    </span>
                    <span className="ml-2 font-mono text-[10px] font-bold text-blue-700">
                      {c.code}
                    </span>
                  </div>
                  <a
                    href={`/api/excel/export-attendance?classId=${c.id}`}
                    className="flex items-center gap-1 rounded-xl bg-blue-50 border border-blue-200 px-3 py-1 text-[11px] font-bold text-blue-800 hover:bg-blue-100 transition-colors"
                  >
                    <Download className="h-3 w-3 text-blue-600" />
                    <span>Download</span>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
