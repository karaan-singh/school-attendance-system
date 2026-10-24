'use client';

import React, { useState } from 'react';
import {
  Upload,
  FileSpreadsheet,
  CheckCircle,
  AlertTriangle,
  Download,
  Loader2,
  Sparkles,
} from 'lucide-react';

interface ExcelImportWizardProps {
  classes: Array<{ id: string; name: string; code: string }>;
  onImportComplete?: () => void;
}

export default function ExcelImportWizard({
  classes,
  onImportComplete,
}: ExcelImportWizardProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id || '');
  const [isLoading, setIsLoading] = useState(false);
  const [previewData, setPreviewData] = useState<any>(null);
  const [resultMessage, setResultMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setErrorMessage(null);
    setResultMessage(null);
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('preview', 'true');
      if (selectedClassId) formData.append('classId', selectedClassId);

      const res = await fetch('/api/excel/import-students', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to parse spreadsheet');
      }

      setPreviewData(data);
    } catch (err: any) {
      setErrorMessage(err.message);
      setPreviewData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCommitImport = async () => {
    if (!selectedFile) return;

    setIsLoading(true);
    setErrorMessage(null);
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('preview', 'false');
      if (selectedClassId) formData.append('classId', selectedClassId);

      const res = await fetch('/api/excel/import-students', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Import failed');

      setResultMessage(data.message || 'Students imported successfully!');
      setPreviewData(null);
      setSelectedFile(null);
      if (onImportComplete) onImportComplete();
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-3xl border border-blue-100 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h2 className="font-display text-lg font-bold text-slate-900 flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-blue-600" />
            Excel Roster Import Wizard
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Upload student spreadsheets to enroll or sync classes directly into MySQL
          </p>
        </div>

        {/* Download Template Link */}
        <a
          href="/api/excel/template"
          className="flex items-center gap-1.5 rounded-2xl border border-blue-200 bg-blue-50/70 px-4 py-2 text-xs font-bold text-blue-700 hover:bg-blue-100 shadow-2xs"
        >
          <Download className="h-3.5 w-3.5 text-blue-600" />
          <span>Download Excel Template</span>
        </a>
      </div>

      {/* Target Class Selector */}
      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-xs font-bold text-slate-700">
            Default Target Class
          </label>
          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
          >
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.code})
              </option>
            ))}
          </select>
        </div>

        {/* Upload Zone */}
        <div>
          <label className="block text-xs font-bold text-slate-700">
            Spreadsheet File (.xlsx, .xls)
          </label>
          <label className="mt-1 flex cursor-pointer items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-blue-200 bg-blue-50/50 px-4 py-2 text-xs text-slate-600 transition-colors hover:border-blue-400 hover:bg-blue-50">
            <Upload className="h-4 w-4 text-blue-600" />
            <span className="font-medium">{selectedFile ? selectedFile.name : 'Choose or drop Excel file'}</span>
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-blue-700 font-medium">
          <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />
          <span>Processing spreadsheet...</span>
        </div>
      )}

      {/* Error Banner */}
      {errorMessage && (
        <div className="mt-4 flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 p-3.5 text-xs text-rose-800 font-medium">
          <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Success Banner */}
      {resultMessage && (
        <div className="mt-4 flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs text-emerald-800 font-medium">
          <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>{resultMessage}</span>
        </div>
      )}

      {/* Validation Preview Table */}
      {previewData && (
        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs font-bold">
              <span className="text-slate-900">
                Found {previewData.total} Student(s)
              </span>
              <span className="text-emerald-700">
                • {previewData.validCount} Valid
              </span>
              {previewData.invalidCount > 0 && (
                <span className="text-rose-600">
                  • {previewData.invalidCount} Issue(s)
                </span>
              )}
            </div>

            <button
              onClick={handleCommitImport}
              disabled={isLoading || previewData.validCount === 0}
              className="flex items-center gap-1.5 rounded-2xl border border-blue-600 bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:brightness-105 active:scale-95"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-300" />
              <span>Import Valid Records</span>
            </button>
          </div>

          <div className="max-h-[300px] overflow-y-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="sticky top-0 bg-blue-50 text-[11px] font-bold text-blue-900">
                <tr>
                  <th className="py-2.5 px-3">Roll #</th>
                  <th className="py-2.5 px-3">Name</th>
                  <th className="py-2.5 px-3">Class</th>
                  <th className="py-2.5 px-3">Gender</th>
                  <th className="py-2.5 px-3">Tree Species</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {previewData.rows.map((r: any, idx: number) => (
                  <tr key={idx} className={r.isValid ? '' : 'bg-rose-50/50'}>
                    <td className="py-2 px-3 font-mono font-bold text-blue-700">
                      {r.rollNumber}
                    </td>
                    <td className="py-2 px-3 font-semibold text-slate-800">{r.fullName}</td>
                    <td className="py-2 px-3 text-slate-500">{r.classCode || 'Default'}</td>
                    <td className="py-2 px-3 text-slate-500">{r.gender}</td>
                    <td className="py-2 px-3 text-slate-600">{r.treeSpecies}</td>
                    <td className="py-2 px-3">
                      {r.isValid ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                          <CheckCircle className="h-3 w-3" /> Ready
                        </span>
                      ) : (
                        <span className="text-rose-600 font-semibold">
                          {r.errors.join(', ')}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
