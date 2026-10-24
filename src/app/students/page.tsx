'use client';

import React, { useEffect, useState } from 'react';
import ExcelImportWizard from '@/features/excel/ExcelImportWizard';
import { SchoolClassData } from '@/types';
import {
  Users,
  Search,
  Trees,
  Phone,
  FileSpreadsheet,
  Filter,
} from 'lucide-react';

const VILLAGE_NAMES: Record<number, string> = {
  1: 'Lakeside Valley',
  2: 'High Timber Ridge',
  3: 'Whispering River',
  4: 'Ancient Summit',
};

export default function StudentsRosterPage() {
  const [classes, setClasses] = useState<SchoolClassData[]>([]);
  const [activeGrade, setActiveGrade] = useState<number>(1);
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [students, setStudents] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showImport, setShowImport] = useState(false);

  const fetchRoster = async () => {
    setIsLoading(true);
    try {
      const classRes = await fetch('/api/classes');
      const classData = await classRes.json();
      if (classData.classes && classData.classes.length > 0) {
        setClasses(classData.classes);
        const firstInGrade = classData.classes.find((c: SchoolClassData) => c.grade === activeGrade) || classData.classes[0];
        setSelectedClassId(firstInGrade.id);

        const sessionRes = await fetch(`/api/sessions?classId=${firstInGrade.id}`);
        const sessionData = await sessionRes.json();
        if (sessionData.session?.records) {
          setStudents(sessionData.session.records);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRoster();
  }, []);

  const handleGradeFilterChange = async (grade: number) => {
    setActiveGrade(grade);
    const firstInGrade = classes.find((c) => c.grade === grade);
    if (firstInGrade) {
      handleClassTabChange(firstInGrade.id);
    }
  };

  const handleClassTabChange = async (classId: string) => {
    setSelectedClassId(classId);
    setIsLoading(true);
    try {
      const sessionRes = await fetch(`/api/sessions?classId=${classId}`);
      const sessionData = await sessionRes.json();
      if (sessionData.session?.records) {
        setStudents(sessionData.session.records);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const gradeClasses = classes.filter((c) => c.grade === activeGrade);
  const currentClass = classes.find((c) => c.id === selectedClassId);

  const filtered = students.filter((s) => {
    const q = searchQuery.toLowerCase();
    const nameMatch = s.fullName?.toLowerCase().includes(q);
    const rollMatch = s.rollNumber?.toLowerCase().includes(q);
    return nameMatch || rollMatch;
  });

  return (
    <div className="mx-auto max-w-7xl px-6 py-8 space-y-6">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-blue-100 pb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900 sm:text-3xl flex items-center gap-2">
            <Users className="h-7 w-7 text-blue-600" />
            Student Master Roster
          </h1>
          <p className="mt-1 text-xs text-slate-500 sm:text-sm font-medium">
            Live directory of 1,195 verified pupils across 4 Villages and 34 Section Huts.
          </p>
        </div>

        <button
          onClick={() => setShowImport(!showImport)}
          className="flex items-center gap-1.5 rounded-2xl border border-blue-200 bg-blue-50/80 px-4 py-2 text-xs font-bold text-blue-800 hover:bg-blue-100 shadow-2xs"
        >
          <FileSpreadsheet className="h-4 w-4 text-blue-600" />
          <span>{showImport ? 'Hide Excel Wizard' : 'Open Excel Import Wizard'}</span>
        </button>
      </div>

      {/* Excel Import Wizard */}
      {showImport && (
        <ExcelImportWizard
          classes={classes}
          onImportComplete={() => {
            fetchRoster();
          }}
        />
      )}

      {/* Multi-Village Grade Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-blue-100 bg-white p-3 shadow-sm">
        <div className="flex items-center gap-2 px-2 text-xs font-bold text-slate-700">
          <Filter className="h-4 w-4 text-blue-600" />
          <span>Village Realm:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {[1, 2, 3, 4].map((g) => (
            <button
              key={g}
              onClick={() => handleGradeFilterChange(g)}
              className={`flex items-center gap-2 rounded-2xl px-4 py-2 text-xs font-bold transition-all ${
                activeGrade === g
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-blue-50/60 text-slate-700 hover:bg-blue-100 hover:text-blue-900'
              }`}
            >
              <span>{g === 1 ? '🏞️' : g === 2 ? '🏔️' : g === 3 ? '🌿' : '🦅'}</span>
              <span>Grade {g}: {VILLAGE_NAMES[g]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Class Section Tabs & Search Bar */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Section Huts */}
          <div className="flex flex-wrap items-center gap-1.5">
            {gradeClasses.map((c) => (
              <button
                key={c.id}
                onClick={() => handleClassTabChange(c.id)}
                className={`rounded-2xl px-3.5 py-1.5 text-xs font-bold transition-all ${
                  selectedClassId === c.id
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <span>{c.code}</span>
                <span className="ml-1 opacity-75">({c.studentCount})</span>
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative min-w-[240px]">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search pupils or roll #..."
              className="w-full rounded-2xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        {/* Roster Table Card */}
        <div className="rounded-3xl border border-blue-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold text-slate-800">
                {currentClass ? currentClass.name : 'Roster'}
              </span>
              <p className="text-[11px] text-slate-500">
                Showing {filtered.length} verified enrolled students
              </p>
            </div>
            {isLoading && <span className="text-xs text-blue-600 font-bold animate-pulse">Loading roster...</span>}
          </div>

          <div className="mt-3 max-h-[520px] overflow-y-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="sticky top-0 bg-blue-50 text-[11px] font-bold uppercase text-blue-900">
                <tr>
                  <th className="py-3 px-3.5">Roll #</th>
                  <th className="py-3 px-3.5">Student Name</th>
                  <th className="py-3 px-3.5">Gender</th>
                  <th className="py-3 px-3.5">Tree Species</th>
                  <th className="py-3 px-3.5">Parent Contact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-blue-50/50 transition-colors">
                    <td className="py-3 px-3.5 font-mono font-bold text-blue-700">
                      {s.rollNumber}
                    </td>
                    <td className="py-3 px-3.5 font-bold text-slate-900">
                      {s.fullName}
                    </td>
                    <td className="py-3 px-3.5 text-slate-500 font-medium">{s.gender}</td>
                    <td className="py-3 px-3.5 text-slate-600">
                      <span className="flex items-center gap-1.5 font-medium">
                        <Trees className="h-3.5 w-3.5 text-emerald-600" />
                        {s.treeSpecies || 'Emerald Oak'}
                      </span>
                    </td>
                    <td className="py-3 px-3.5 text-slate-600">
                      <span className="flex items-center gap-1.5 font-mono text-slate-500">
                        <Phone className="h-3 w-3 text-slate-400" />
                        {s.parentPhone || '—'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
