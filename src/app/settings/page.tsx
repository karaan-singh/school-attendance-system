'use client';

import React, { useEffect, useState } from 'react';
import {
  Settings,
  Volume2,
  Monitor,
  Database,
  CheckCircle2,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { useGameStore } from '@/store/useGameStore';
import { forestAudio } from '@/lib/audio';

export default function SettingsPage() {
  const {
    audioSettings,
    updateAudioSettings,
    graphicsSettings,
    updateGraphicsSettings,
  } = useGameStore();

  const [dbStatus, setDbStatus] = useState<any>(null);
  const [isCheckingDb, setIsCheckingDb] = useState(false);

  const checkDb = async () => {
    setIsCheckingDb(true);
    try {
      const res = await fetch('/api/health');
      const data = await res.json();
      setDbStatus(data);
    } catch (err: any) {
      setDbStatus({ status: 'error', error: err.message });
    } finally {
      setIsCheckingDb(false);
    }
  };

  useEffect(() => {
    checkDb();
  }, []);

  const handleTestChime = () => {
    forestAudio.playLeafBloom('PRESENT');
  };

  const handleTestFanfare = () => {
    forestAudio.playCelebrationFanfare();
  };

  return (
    <div className="mx-auto max-w-4xl px-6 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-blue-100 pb-6">
        <h1 className="font-display text-2xl font-bold text-slate-900 sm:text-3xl flex items-center gap-2">
          <Settings className="h-7 w-7 text-blue-600" />
          System Settings & Diagnostics
        </h1>
        <p className="mt-1 text-xs text-slate-500 sm:text-sm font-medium">
          Customize audio experience, 3D graphics rendering, and test local XAMPP MySQL connectivity.
        </p>
      </div>

      {/* Audio Settings Card */}
      <div className="rounded-3xl border border-blue-100 bg-white p-6 shadow-sm space-y-5">
        <h2 className="font-display text-lg font-bold text-slate-900 flex items-center gap-2">
          <Volume2 className="h-5 w-5 text-blue-600" />
          Web Audio Synthesizer & Sound FX
        </h2>

        <div className="flex items-center justify-between border-b border-blue-50 pb-4">
          <div>
            <span className="text-xs font-bold text-slate-800">Enable Sound FX</span>
            <p className="text-xs text-slate-500 mt-0.5">
              Procedural breeze, leaf bloom crystal chimes, and celebration fanfare
            </p>
          </div>
          <input
            type="checkbox"
            checked={audioSettings.soundEnabled}
            onChange={(e) => {
              updateAudioSettings({ soundEnabled: e.target.checked });
              forestAudio.setSoundEnabled(e.target.checked);
            }}
            className="h-5 w-5 rounded border-blue-300 text-blue-600 accent-blue-600 cursor-pointer"
          />
        </div>

        {/* Test Audio Buttons */}
        <div className="flex items-center gap-3 pt-1">
          <button
            onClick={handleTestChime}
            className="rounded-2xl border border-blue-200 bg-blue-50 px-3.5 py-1.5 text-xs font-bold text-blue-800 hover:bg-blue-100 transition-colors shadow-2xs"
          >
            Play Bloom Chime 🎵
          </button>
          <button
            onClick={handleTestFanfare}
            className="rounded-2xl border border-amber-200 bg-amber-50 px-3.5 py-1.5 text-xs font-bold text-amber-800 hover:bg-amber-100 transition-colors shadow-2xs"
          >
            Play Victory Fanfare 🎺
          </button>
        </div>
      </div>

      {/* Graphics Settings Card */}
      <div className="rounded-3xl border border-blue-100 bg-white p-6 shadow-sm space-y-5">
        <h2 className="font-display text-lg font-bold text-slate-900 flex items-center gap-2">
          <Monitor className="h-5 w-5 text-blue-600" />
          3D Canvas & Graphics Rendering
        </h2>

        <div className="flex items-center justify-between border-b border-blue-50 pb-4">
          <div>
            <span className="text-xs font-bold text-slate-800">Graphics Quality</span>
            <p className="text-xs text-slate-500 mt-0.5">
              Adjust shadow maps and particle density for performance
            </p>
          </div>
          <select
            value={graphicsSettings.quality}
            onChange={(e) => updateGraphicsSettings({ quality: e.target.value as any })}
            className="rounded-2xl border border-blue-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
          >
            <option value="high">High (Full Shadows & Particles)</option>
            <option value="medium">Medium (Balanced)</option>
            <option value="low">Low (Fast Performance)</option>
          </select>
        </div>

        <div className="flex items-center justify-between pt-1">
          <div>
            <span className="text-xs font-bold text-slate-800">Reduced Motion</span>
            <p className="text-xs text-slate-500 mt-0.5">
              Disables camera pan swings and fast transitions for accessibility
            </p>
          </div>
          <input
            type="checkbox"
            checked={graphicsSettings.reducedMotion}
            onChange={(e) => updateGraphicsSettings({ reducedMotion: e.target.checked })}
            className="h-5 w-5 rounded border-blue-300 text-blue-600 accent-blue-600 cursor-pointer"
          />
        </div>
      </div>

      {/* Database Diagnostics */}
      <div className="rounded-3xl border border-blue-100 bg-white p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-slate-900 flex items-center gap-2">
            <Database className="h-5 w-5 text-blue-600" />
            MySQL Database Diagnostics
          </h2>
          <button
            onClick={checkDb}
            disabled={isCheckingDb}
            className="flex items-center gap-1.5 rounded-2xl border border-blue-200 bg-blue-50 px-3.5 py-1.5 text-xs font-bold text-blue-800 hover:bg-blue-100 transition-colors shadow-2xs"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isCheckingDb ? 'animate-spin' : ''}`} />
            <span>Test Connection</span>
          </button>
        </div>

        {dbStatus ? (
          <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-4 font-mono text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-700">Status:</span>
              <span
                className={`font-bold ${
                  dbStatus.status === 'healthy' ? 'text-emerald-600' : 'text-rose-600'
                }`}
              >
                {dbStatus.status?.toUpperCase()}
              </span>
            </div>
            <div className="mt-2 text-slate-600">
              <div>Engine: {dbStatus.engine || 'MySQL'}</div>
              <div>Database: forest_attendance</div>
              {dbStatus.stats && (
                <div className="mt-1 font-semibold text-blue-900">
                  Classes: {dbStatus.stats.classes} • Students: {dbStatus.stats.students}
                </div>
              )}
              {dbStatus.error && (
                <div className="mt-2 text-rose-600 font-sans">{dbStatus.error}</div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-xs text-slate-500">Checking database status...</div>
        )}
      </div>
    </div>
  );
}
