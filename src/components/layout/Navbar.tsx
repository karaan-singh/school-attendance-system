'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Trees,
  Compass,
  LayoutDashboard,
  FileSpreadsheet,
  Users,
  Settings,
  Volume2,
  VolumeX,
  Sparkles,
  Database,
} from 'lucide-react';
import { useGameStore } from '@/store/useGameStore';
import { forestAudio } from '@/lib/audio';

export default function Navbar() {
  const pathname = usePathname();
  const { audioSettings, toggleSound } = useGameStore();
  const [dbHealthy, setDbHealthy] = useState<boolean | null>(null);

  useEffect(() => {
    fetch('/api/health')
      .then((res) => setDbHealthy(res.ok))
      .catch(() => setDbHealthy(false));
  }, [pathname]);

  const handleAudioToggle = () => {
    toggleSound();
    forestAudio.setSoundEnabled(!audioSettings.soundEnabled);
    if (!audioSettings.soundEnabled) {
      forestAudio.startAmbient();
    } else {
      forestAudio.stopAmbient();
    }
  };

  const navLinks = [
    { href: '/', label: 'Home', icon: Trees },
    { href: '/village', label: '3D Village', icon: Compass },
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/students', label: 'Roster & Import', icon: Users },
    { href: '/reports', label: 'Reports & Excel', icon: FileSpreadsheet },
    { href: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-50 h-16 w-full border-b border-blue-100 bg-white/90 shadow-sm backdrop-blur-md">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Brand */}
        <Link href="/" className="group flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 shadow-md shadow-blue-500/20 ring-1 ring-blue-400/40 transition-transform group-hover:scale-105">
            <Trees className="h-5 w-5 text-white" />
            <Sparkles className="absolute -top-1 -right-1 h-3.5 w-3.5 text-amber-300 animate-pulse" />
          </div>
          <div>
            <span className="block font-display text-lg font-bold tracking-wider text-slate-900 group-hover:text-blue-600 transition-colors">
              FOREST QUEST
            </span>
            <span className="block text-[10px] font-semibold uppercase tracking-widest text-blue-600">
              3D School Attendance
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden items-center gap-1.5 md:flex">
          {navLinks.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 shadow-xs ring-1 ring-blue-200'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Tools (Sound, DB Status, Ranger Profile) */}
        <div className="flex items-center gap-3">
          {/* Database Health Badge */}
          <div
            title={dbHealthy ? 'XAMPP MySQL Connected' : 'MySQL Connecting/Checking'}
            className="flex items-center gap-1.5 rounded-full bg-slate-50 px-3 py-1 text-[11px] font-medium text-slate-700 border border-slate-200 shadow-2xs"
          >
            <Database className="h-3 w-3 text-blue-600" />
            <span
              className={`h-2 w-2 rounded-full ${
                dbHealthy === true
                  ? 'bg-emerald-500 shadow-sm shadow-emerald-500/80'
                  : dbHealthy === false
                  ? 'bg-rose-500'
                  : 'bg-amber-400 animate-pulse'
              }`}
            />
            <span className="hidden sm:inline">MySQL 3306</span>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={handleAudioToggle}
            title={audioSettings.soundEnabled ? 'Mute Sound FX' : 'Enable Sound FX'}
            className={`flex h-9 w-9 items-center justify-center rounded-xl border transition-colors ${
              audioSettings.soundEnabled
                ? 'border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100'
                : 'border-slate-200 bg-slate-50 text-slate-400 hover:bg-slate-100'
            }`}
          >
            {audioSettings.soundEnabled ? (
              <Volume2 className="h-4 w-4 text-blue-600" />
            ) : (
              <VolumeX className="h-4 w-4 text-slate-400" />
            )}
          </button>

          {/* Teacher Profile Chip */}
          <Link
            href="/login"
            className="hidden items-center gap-2 rounded-xl border border-blue-200/80 bg-blue-50/70 px-3 py-1.5 text-xs font-semibold text-blue-900 hover:bg-blue-100 sm:flex"
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 font-bold text-[10px] text-white">
              R
            </span>
            <span>Ranger Rowan</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
