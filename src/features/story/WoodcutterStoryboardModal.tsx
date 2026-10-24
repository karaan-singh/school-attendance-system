'use client';

import React, { useState } from 'react';
import {
  Compass,
  X,
  Sparkles,
  ArrowRight,
  Check,
  Axe,
  Trees,
  Footprints,
  Flame,
  Volume2,
} from 'lucide-react';
import { useGameStore } from '@/store/useGameStore';
import { ExpeditionGuide } from '@/types';
import { forestAudio } from '@/lib/audio';

interface WoodcutterStoryboardModalProps {
  onClose: () => void;
  onEmbark?: () => void;
}

interface GuideOption {
  id: ExpeditionGuide;
  name: string;
  title: string;
  icon: string;
  badge: string;
  color: string;
  bgActive: string;
  borderActive: string;
  description: string;
  equipment: string;
}

const GUIDE_OPTIONS: GuideOption[] = [
  {
    id: 'WOODCUTTER',
    name: 'Silas the Woodcutter',
    title: 'Master Woodsman & Forest Pioneer',
    icon: '🪓',
    badge: 'Expedition Favorite',
    color: 'text-red-700',
    bgActive: 'bg-red-50/90',
    borderActive: 'border-red-400 ring-2 ring-red-400/20',
    description: 'Sturdy village timber craftsman who knows every hemlock and hidden trail. Clears fallen logs and guides students safely.',
    equipment: 'Crafted Timber Axe • Leather Work Apron • Amber Lantern',
  },
  {
    id: 'RANGER',
    name: 'Rowan the Forest Ranger',
    title: 'Chief Trail Warden & Tracker',
    icon: '🏹',
    badge: 'Trail Master',
    color: 'text-emerald-700',
    bgActive: 'bg-emerald-50/90',
    borderActive: 'border-emerald-400 ring-2 ring-emerald-400/20',
    description: 'Keen-eyed tracker and guardian of Lake Sylva who charts the ancient stone waypoints through the Whispering Glade.',
    equipment: 'Ranger Wide-Brim Hat • Expedition Pack • Wayfinder Compass',
  },
  {
    id: 'DRUID',
    name: 'Maeve the Tree Druid',
    title: 'Grove Herbalist & Flora Whisperer',
    icon: '🌿',
    badge: 'Living Canopy',
    color: 'text-teal-700',
    bgActive: 'bg-teal-50/90',
    borderActive: 'border-teal-400 ring-2 ring-teal-400/20',
    description: 'Speaks the harmonic language of ancient sequoias and guides students to blossom their sacred tree canopies.',
    equipment: 'Living Floral Staff • Ivy Crown • Verdant Cloak',
  },
  {
    id: 'SCOUT',
    name: 'Kael the Village Scout',
    title: 'Agile Pathfinder & Cartographer',
    icon: '🧭',
    badge: 'Swift Explorer',
    color: 'text-blue-700',
    bgActive: 'bg-blue-50/90',
    borderActive: 'border-blue-400 ring-2 ring-blue-400/20',
    description: 'Nimble cartographer who maps shortcut routes and spots elusive forest creatures along the water edge.',
    equipment: 'Brass Spyglass • Scout Feather Cap • Topographic Map',
  },
];

const STORY_PANELS = [
  {
    step: '1',
    title: 'Dawn at the Timber Hearth',
    icon: '🪓',
    summary: 'Silas the Woodcutter prepares his axes and lanterns as the morning bell echoes across Lake Sylva.',
    detail: 'Before the journey begins, the village expedition leader inspects trail markers and ensures all student apprentices are accounted for at their class hut.',
  },
  {
    step: '2',
    title: 'The Whispering Forest Path',
    icon: '🌲',
    summary: 'The expedition party ventures past mossy stones and towering redwoods on Chapter 2’s trail.',
    detail: 'Walking beneath sun-dappled branches, the selected guide leads the way toward Heartwood Glade, checking for safe footing and wild mushrooms.',
  },
  {
    step: '3',
    title: 'The Sacred Student Forest',
    icon: '🌳',
    summary: 'A secret clearing where each enrolled pupil has a personalized living tree rooted in the soil.',
    detail: 'As teachers confirm attendance in real-time, confirmed server transactions cause leaf canopies to sprout, pollen to sparkle, and crystal chimes to sound.',
  },
  {
    step: '4',
    title: 'Sunset & Town Bonfire Celebration',
    icon: '🏕️',
    summary: 'Upon finalization, the forest glides skyward, the sun sets over Mount Solitude, and town camping begins!',
    detail: 'The entire village clan rejoices around the roaring hearth fire, awarding class XP, bloom ranks, and glowing fireflies.',
  },
];

export default function WoodcutterStoryboardModal({
  onClose,
  onEmbark,
}: WoodcutterStoryboardModalProps) {
  const selectedGuide = useGameStore((state) => state.selectedGuide);
  const setGuide = useGameStore((state) => state.setGuide);

  const [activeTab, setActiveTab] = useState<'STORY' | 'SELECTION'>('SELECTION');

  const handleSelectGuide = (guide: ExpeditionGuide) => {
    setGuide(guide);
    forestAudio.playLeafBloom('PRESENT');
  };

  const handleEmbarkClick = () => {
    if (onEmbark) {
      onEmbark();
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-3xl border border-blue-100 bg-white p-6 sm:p-8 text-slate-800 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 rounded-2xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-4 border-b border-blue-50 pb-5">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-50 border border-blue-200 text-2xl shadow-xs">
            🪓
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-blue-600">
                Chapter 1 & 2 Storyboard
              </span>
              <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-[10px] font-bold text-blue-800">
                Official Roster Lore
              </span>
            </div>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900">
              The Woodcutter&apos;s Storyboard & Guide Selection
            </h2>
            <p className="mt-0.5 text-xs text-slate-500 font-medium">
              Choose your expedition guide and review the story trail into Heartwood Clearing.
            </p>
          </div>
        </div>

        {/* Tabs: Guide Selection vs Storyboard Panels */}
        <div className="mt-5 flex items-center gap-2 border-b border-blue-50 pb-3">
          <button
            onClick={() => setActiveTab('SELECTION')}
            className={`flex items-center gap-2 rounded-2xl px-4 py-2 text-xs font-bold transition-all ${
              activeTab === 'SELECTION'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-blue-50 hover:text-blue-700'
            }`}
          >
            <span>🪓 Select Expedition Guide</span>
            <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px]">
              {GUIDE_OPTIONS.find((g) => g.id === selectedGuide)?.name.split(' ')[0]}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('STORY')}
            className={`flex items-center gap-2 rounded-2xl px-4 py-2 text-xs font-bold transition-all ${
              activeTab === 'STORY'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-blue-50 hover:text-blue-700'
            }`}
          >
            <span>📜 Storyboard Panels (4)</span>
          </button>
        </div>

        {/* Tab 1: Character Guide Selection */}
        {activeTab === 'SELECTION' && (
          <div className="mt-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Select Your Leader for Chapter 2 Journey & Forest Roll-Call
              </span>
              <span className="text-xs font-medium text-blue-600">
                Click any guide to activate 3D model
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
              {GUIDE_OPTIONS.map((guide) => {
                const isSelected = selectedGuide === guide.id;
                return (
                  <button
                    key={guide.id}
                    onClick={() => handleSelectGuide(guide.id)}
                    className={`relative flex flex-col justify-between rounded-2xl border p-4 text-left transition-all ${
                      isSelected
                        ? `${guide.bgActive} ${guide.borderActive} shadow-sm`
                        : 'border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/30'
                    }`}
                  >
                    <div>
                      {/* Top Header */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <span className="text-2xl">{guide.icon}</span>
                          <div>
                            <h3 className="font-display text-sm font-bold text-slate-900">
                              {guide.name}
                            </h3>
                            <span className="text-[11px] font-semibold text-slate-500">
                              {guide.title}
                            </span>
                          </div>
                        </div>

                        {isSelected ? (
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white">
                            <Check className="h-3.5 w-3.5" />
                          </span>
                        ) : (
                          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500">
                            {guide.badge}
                          </span>
                        )}
                      </div>

                      {/* Description */}
                      <p className="mt-3 text-xs text-slate-600 leading-relaxed font-normal">
                        {guide.description}
                      </p>
                    </div>

                    {/* Equipment Pill */}
                    <div className="mt-3.5 border-t border-slate-100 pt-2.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        Equipment:
                      </span>
                      <p className="text-[11px] font-semibold text-slate-700">
                        {guide.equipment}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Storyboard Progression Panels */}
        {activeTab === 'STORY' && (
          <div className="mt-5 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              The 4 Storyboard Chapters of Forest Quest
            </span>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {STORY_PANELS.map((panel) => (
                <div
                  key={panel.step}
                  className="rounded-2xl border border-blue-100 bg-blue-50/50 p-4 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-display text-sm font-bold text-slate-900">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] text-white">
                        {panel.step}
                      </span>
                      <span>{panel.title}</span>
                    </div>
                    <span className="text-lg">{panel.icon}</span>
                  </div>

                  <p className="text-xs font-bold text-blue-900 leading-snug">
                    {panel.summary}
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {panel.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-blue-50 pt-5">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <span>Selected Guide:</span>
            <span className="font-bold text-slate-900 flex items-center gap-1">
              {GUIDE_OPTIONS.find((g) => g.id === selectedGuide)?.icon}
              {GUIDE_OPTIONS.find((g) => g.id === selectedGuide)?.name}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleEmbarkClick}
              className="flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition-colors"
            >
              <span>Confirm Guide & Begin Journey</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
