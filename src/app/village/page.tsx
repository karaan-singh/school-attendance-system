'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import CanvasContainer from '@/components/3d/CanvasContainer';
import VillageScene from '@/components/3d/VillageScene';
import StoryJournalModal from '@/features/story/StoryJournalModal';
import WoodcutterStoryboardModal from '@/features/story/WoodcutterStoryboardModal';
import { SchoolClassData } from '@/types';
import {
  Compass,
  Users,
  CheckCircle2,
  Clock,
  ArrowRight,
  BookOpen,
  Sparkles,
  MapPin,
} from 'lucide-react';
import { useGameStore } from '@/store/useGameStore';

interface VillageRealm {
  grade: number;
  name: string;
  enclave: string;
  icon: string;
  description: string;
  badge: string;
  cameraPos: [number, number, number];
}

const VILLAGE_REALMS: VillageRealm[] = [
  {
    grade: 1,
    name: 'Lakeside Valley Village',
    enclave: 'Grade 1 • 9 Section Huts',
    icon: '🏞️',
    description: 'Sunlit shores of Lake Sylva with water lilies and fishing docks.',
    badge: 'Lakeside Realm',
    cameraPos: [0, 9, 18],
  },
  {
    grade: 2,
    name: 'High Timber Ridge Village',
    enclave: 'Grade 2 • 9 Section Huts',
    icon: '🏔️',
    description: 'Golden birch highlands with rocky lookouts and warm timber cabins.',
    badge: 'Highland Realm',
    cameraPos: [2, 10, 19],
  },
  {
    grade: 3,
    name: 'Whispering River Enclave',
    enclave: 'Grade 3 • 8 Section Huts',
    icon: '🌿',
    description: 'Emerald mossy riverbanks with weeping willows and stone bridges.',
    badge: 'Riverbank Realm',
    cameraPos: [-2, 9, 18],
  },
  {
    grade: 4,
    name: 'Ancient Summit Sanctum',
    enclave: 'Grade 4 • 8 Section Huts',
    icon: '🦅',
    description: 'Elevated mountain plateau looking out over snow-capped Mount Solitude.',
    badge: 'Alpine Realm',
    cameraPos: [0, 11, 20],
  },
];

export default function VillageHubPage() {
  const router = useRouter();
  const [classes, setClasses] = useState<SchoolClassData[]>([]);
  const [activeGrade, setActiveGrade] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(true);
  const [showLoreModal, setShowLoreModal] = useState(false);
  const [showWoodcutterModal, setShowWoodcutterModal] = useState(false);
  const { selectClass, setChapter, selectedGuide } = useGameStore();

  useEffect(() => {
    fetch('/api/classes')
      .then((res) => res.json())
      .then((data) => {
        if (data.classes) setClasses(data.classes);
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);

  const handleSelectClass = (c: SchoolClassData) => {
    selectClass(c.id, c.code, c.name);
    setChapter('CHAPTER_2_JOURNEY');
    router.push(`/attendance/${c.id}`);
  };

  const currentRealm = VILLAGE_REALMS.find((r) => r.grade === activeGrade) || VILLAGE_REALMS[0];
  const visibleClasses = classes.filter((c) => c.grade === activeGrade);
  const totalStudentsInVillage = visibleClasses.reduce((sum, c) => sum + (c.studentCount || 0), 0);

  return (
    <div className="relative h-[calc(100vh-64px)] w-full overflow-hidden bg-sky-50">
      {/* 3D Canvas Scene */}
      <CanvasContainer cameraPosition={currentRealm.cameraPos} enableControls={true}>
        <VillageScene
          classes={visibleClasses}
          onSelectClass={handleSelectClass}
          onOpenStoryboard={() => setShowWoodcutterModal(true)}
        />
      </CanvasContainer>

      {/* Top Village Realm Selector & Storyboard Controls */}
      <div className="pointer-events-none absolute top-4 inset-x-0 z-20 flex flex-wrap items-start justify-between gap-3 px-6">
        {/* Village Title & Lore Card */}
        <div className="pointer-events-auto max-w-sm rounded-3xl border border-blue-100 bg-white/95 p-4 sm:p-5 shadow-lg backdrop-blur-md">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xl">{currentRealm.icon}</span>
              <span className="text-[11px] font-bold uppercase tracking-widest text-blue-600">
                {currentRealm.badge}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setShowWoodcutterModal(true)}
                className="flex items-center gap-1 rounded-xl border border-red-200 bg-red-50/90 px-2.5 py-1 text-[11px] font-bold text-red-800 hover:bg-red-100 transition-colors shadow-2xs"
                title="View Woodcutter Storyboard & Select Guide"
              >
                <span>🪓 Guide</span>
              </button>
              <button
                onClick={() => setShowLoreModal(true)}
                className="flex items-center gap-1 rounded-xl border border-blue-200 bg-blue-50/90 px-2.5 py-1 text-[11px] font-bold text-blue-800 hover:bg-blue-100 transition-colors shadow-2xs"
              >
                <BookOpen className="h-3.5 w-3.5 text-blue-600" />
                <span>Lore</span>
              </button>
            </div>
          </div>

          <h1 className="mt-2 font-display text-lg sm:text-xl font-bold text-slate-900">
            {currentRealm.name}
          </h1>
          <p className="mt-0.5 text-xs text-slate-600 leading-relaxed">
            {currentRealm.description}
          </p>

          <div className="mt-2.5 flex items-center justify-between border-t border-slate-100 pt-2 text-[11px] font-medium text-slate-500">
            <span>{visibleClasses.length} Section Huts</span>
            <span className="font-bold text-blue-700">{totalStudentsInVillage} Real Pupils</span>
          </div>
        </div>

        {/* Multi-Village World Realm Switcher Tabs */}
        <div className="pointer-events-auto flex items-center gap-1.5 rounded-3xl border border-blue-100 bg-white/95 p-1.5 shadow-lg backdrop-blur-md">
          {VILLAGE_REALMS.map((realm) => {
            const isActive = activeGrade === realm.grade;
            return (
              <button
                key={realm.grade}
                onClick={() => setActiveGrade(realm.grade)}
                className={`flex items-center gap-2 rounded-2xl px-3.5 py-2 text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-blue-50 hover:text-blue-700'
                }`}
              >
                <span>{realm.icon}</span>
                <span className="hidden sm:inline">Grade {realm.grade}</span>
                <span className="text-[10px] font-medium opacity-80 sm:hidden">G{realm.grade}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Floating Bottom Class Section Hut Selector Bar */}
      <div className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 w-full max-w-5xl px-4">
        <div className="flex items-center justify-between gap-3 rounded-3xl border border-blue-100 bg-white/95 p-3.5 shadow-xl backdrop-blur-md">
          <div className="hidden sm:flex items-center gap-2 px-2 text-xs font-bold text-slate-700 shrink-0">
            <Compass className="h-4 w-4 text-blue-600" />
            <span>Select Section:</span>
          </div>

          <div className="flex flex-1 items-center gap-2.5 overflow-x-auto pb-1 sm:pb-0">
            {visibleClasses.map((c) => {
              const isFinal = c.todaySessionStatus === 'FINALIZED';
              const isDraft = c.todaySessionStatus === 'DRAFT';
              return (
                <button
                  key={c.id}
                  onClick={() => handleSelectClass(c)}
                  className="flex flex-1 min-w-[165px] items-center justify-between gap-2 rounded-2xl border border-slate-200 bg-slate-50/80 px-3.5 py-2.5 text-left transition-all hover:border-blue-400 hover:bg-blue-50/60 hover:shadow-xs active:scale-95"
                >
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-[11px] font-bold text-blue-700">
                        {c.code}
                      </span>
                      <span className="text-xs font-bold text-slate-900 whitespace-nowrap">
                        Sec {c.section}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 flex items-center gap-1 font-medium mt-0.5">
                      <Users className="h-2.5 w-2.5" />
                      {c.studentCount} students
                    </span>
                  </div>

                  <div className="shrink-0">
                    {isFinal ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    ) : isDraft ? (
                      <Clock className="h-4 w-4 text-amber-500 animate-pulse" />
                    ) : (
                      <ArrowRight className="h-4 w-4 text-slate-400" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Woodcutter Storyboard & Guide Selection Modal */}
      {showWoodcutterModal && (
        <WoodcutterStoryboardModal onClose={() => setShowWoodcutterModal(false)} />
      )}

      {/* Ranger Story Lore Guide Modal */}
      {showLoreModal && (
        <StoryJournalModal onClose={() => setShowLoreModal(false)} />
      )}
    </div>
  );
}
