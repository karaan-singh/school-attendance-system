'use client';

import React from 'react';
import {
  BookOpen,
  X,
  Compass,
  Trees,
  Award,
  Sparkles,
} from 'lucide-react';

interface StoryJournalModalProps {
  onClose: () => void;
}

export default function StoryJournalModal({ onClose }: StoryJournalModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-blue-100 bg-white p-6 text-slate-800 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Journal Header */}
        <div className="flex items-center gap-3.5 border-b border-slate-100 pb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 border border-blue-200 shadow-xs">
            <BookOpen className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-blue-600">
                Expedition Archives
              </span>
            </div>
            <h2 className="font-display text-xl font-bold text-slate-900">
              Ranger Rowan&apos;s Field Guide & Forest Lore
            </h2>
          </div>
        </div>

        {/* Chapters Storyline Progression */}
        <div className="mt-5 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            The 5 Chapters of Daily Roll-Call
          </h3>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-4">
              <div className="flex items-center gap-2 font-display text-sm font-bold text-blue-900">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] text-white">1</span>
                <span>The Peaceful Village</span>
              </div>
              <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                Nestled beside Lake Sylva, the sunlit village huts house the student clans. Teachers gather their morning apprentices at the clan hearth.
              </p>
            </div>

            <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-4">
              <div className="flex items-center gap-2 font-display text-sm font-bold text-blue-900">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] text-white">2</span>
                <span>The Whispering Trail</span>
              </div>
              <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                Led by the Ranger explorer, the party traverses ancient stone waypoints beneath giant sequoias into the hidden clearing.
              </p>
            </div>

            <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-4">
              <div className="flex items-center gap-2 font-display text-sm font-bold text-blue-900">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] text-white">3</span>
                <span>Heartwood Clearing</span>
              </div>
              <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                Every enrolled student has an enchanted tree anchored around the sacred spring. Each tree awaits the morning roll-call.
              </p>
            </div>

            <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-4">
              <div className="flex items-center gap-2 font-display text-sm font-bold text-blue-900">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] text-white">4</span>
                <span>The Living Canopy</span>
              </div>
              <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                As students are marked, confirmed server transactions cause leaves to bloom, pollen sparkles to swirl, and harmonic pentatonic chimes to ring.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4">
            <div className="flex items-center gap-2 font-display text-sm font-bold text-amber-900">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-600 text-[10px] text-white">5</span>
              <span>The Mountain Sunset & Town Camping Celebration</span>
            </div>
            <p className="mt-1 text-xs text-amber-800 leading-relaxed">
              When attendance is verified, the forest canopy ascends into the sky. Behind Mount Solitude, the sun sets into twilight, the village bonfire ignites, and the entire academy celebrates camping together!
            </p>
          </div>
        </div>

        {/* Tree Species Bestiary */}
        <div className="mt-6 border-t border-slate-100 pt-5 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Sacred Tree Species Lore
          </h3>

          <div className="grid grid-cols-2 gap-2.5 text-xs sm:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-3">
              <span className="font-bold text-emerald-700">Emerald Oak</span>
              <p className="mt-0.5 text-[11px] text-slate-600">Steadfast, deep-rooted guardians.</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-3">
              <span className="font-bold text-blue-700">Silver Birch</span>
              <p className="mt-0.5 text-[11px] text-slate-600">Graceful, luminous white bark.</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-3">
              <span className="font-bold text-indigo-700">Twilight Willow</span>
              <p className="mt-0.5 text-[11px] text-slate-600">Gentle cascades drinking deep.</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-3">
              <span className="font-bold text-amber-700">Sunfire Maple</span>
              <p className="mt-0.5 text-[11px] text-slate-600">Warm vibrant autumn leaves.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
