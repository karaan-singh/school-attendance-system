'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { useAttendanceStore } from '@/store/useAttendanceStore';
import { useGameStore } from '@/store/useGameStore';
import CanvasContainer from '@/components/3d/CanvasContainer';
import JourneyPath from '@/components/3d/JourneyPath';
import TempleNightJourneyScene from '@/components/3d/TempleNightJourneyScene';
import StudentForest from '@/components/3d/StudentForest';
import CelebrationFX from '@/components/3d/CelebrationFX';
import CampingCelebrationCinematic from '@/components/3d/CampingCelebrationCinematic';
import AttendanceRosterTable from '@/features/attendance/AttendanceRosterTable';
import StudentCheckInModal from '@/features/attendance/StudentCheckInModal';
import SessionReviewModal from '@/features/attendance/SessionReviewModal';
import FinalCelebrationModal from '@/features/attendance/FinalCelebrationModal';
import StoryJournalModal from '@/features/story/StoryJournalModal';
import WoodcutterStoryboardModal from '@/features/story/WoodcutterStoryboardModal';
import { StudentRecord } from '@/types';
import {
  FastForward,
  Table,
  Eye,
  Sparkles,
  FileCheck2,
  ChevronLeft,
  Loader2,
  Sunset,
  Flame,
  BookOpen,
  Moon,
  Waves,
  Mountain,
  Trees,
} from 'lucide-react';
import Link from 'next/link';
import { forestAudio } from '@/lib/audio';

export default function AttendanceStoryPage() {
  const params = useParams();
  const classId = params.classId as string;

  const {
    currentSession,
    students,
    isSaving,
    undoStack,
    searchQuery,
    statusFilter,
    setSession,
    setSearchQuery,
    setStatusFilter,
    updateStudentStatus,
    markAllPresent,
    undoLastAction,
    finalizeSession,
  } = useAttendanceStore();

  const {
    currentChapter,
    setChapter,
    isTableMode,
    toggleTableMode,
    selectedStudentId,
    selectStudent,
  } = useGameStore();

  const [activeModalStudent, setActiveModalStudent] = useState<StudentRecord | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showCelebrationModal, setShowCelebrationModal] = useState(false);
  const [showJournalModal, setShowJournalModal] = useState(false);
  const [showStoryboardModal, setShowStoryboardModal] = useState(false);
  const [celebrationData, setCelebrationData] = useState<any>(null);
  const [isFinalizing, setIsFinalizing] = useState(false);

  // Cinematic Sunset & Camping Celebration State
  const [isCinematicRunning, setIsCinematicRunning] = useState(false);
  const [cinematicProgress, setCinematicProgress] = useState(0);
  const [cameraPreset, setCameraPreset] = useState<'grove' | 'waterfall' | 'ridge'>('grove');
  const cinematicAnimFrameRef = useRef<number | null>(null);

  // Load session from server
  useEffect(() => {
    if (!classId) return;

    fetch(`/api/sessions?classId=${classId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.session) {
          setSession(data.session);
          if (data.session.status === 'FINALIZED') {
            setChapter('CHAPTER_5_CELEBRATION');
          } else if (currentChapter === 'CHAPTER_1_VILLAGE') {
            setChapter('CHAPTER_2_JOURNEY');
          }
        }
      })
      .catch((err) => console.error('Failed to load session:', err));
  }, [classId, setSession, setChapter]);

  // Handle Journey Complete
  const handleJourneyComplete = () => {
    setChapter('CHAPTER_3_FOREST');
  };

  // Skip Journey directly to forest
  const handleSkipJourney = () => {
    setChapter('CHAPTER_3_FOREST');
  };

  // Student selection in 3D or Table
  const handleSelectStudentTree = (student: StudentRecord) => {
    selectStudent(student.id);
    setActiveModalStudent(student);
  };

  // Trigger Cinematic Finalization Animation
  const handleConfirmFinalize = async () => {
    setIsFinalizing(true);
    const result = await finalizeSession();
    setIsFinalizing(false);

    if (result.success) {
      setShowReviewModal(false);
      setCelebrationData(result);
      setChapter('CHAPTER_5_CELEBRATION');

      setIsCinematicRunning(true);
      setCinematicProgress(0);

      const duration = 12000;
      const startTime = performance.now();

      const animateCinematic = (time: number) => {
        const elapsed = time - startTime;
        const p = Math.min(elapsed / duration, 1);
        setCinematicProgress(p);

        if (p < 1) {
          cinematicAnimFrameRef.current = requestAnimationFrame(animateCinematic);
        } else {
          setIsCinematicRunning(false);
          setShowCelebrationModal(true);
        }
      };

      cinematicAnimFrameRef.current = requestAnimationFrame(animateCinematic);
    }
  };

  // Skip Cinematic
  const handleSkipCinematic = () => {
    if (cinematicAnimFrameRef.current) {
      cancelAnimationFrame(cinematicAnimFrameRef.current);
    }
    setCinematicProgress(1);
    setIsCinematicRunning(false);
    setShowCelebrationModal(true);
  };

  if (!currentSession) {
    return (
      <div className="flex h-[calc(100vh-64px)] w-full items-center justify-center bg-sky-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
          <span className="text-xs uppercase font-bold tracking-widest text-blue-800">
            Gathering Class into the Sunlit Grove...
          </span>
        </div>
      </div>
    );
  }

  const total = students.length;
  const presentCount = students.filter((s) => s.status === 'PRESENT').length;
  const rate = total > 0 ? (presentCount / total) * 100 : 0;
  const isFinalized = currentSession.status === 'FINALIZED';

  // Determine current sky mode
  const skyMode = isCinematicRunning
    ? 'cinematic'
    : currentChapter === 'CHAPTER_5_CELEBRATION'
    ? 'sunset'
    : 'day';

  return (
    <div className="relative h-[calc(100vh-64px)] w-full overflow-hidden bg-sky-50">
      {/* 3D Scene View */}
      {!isTableMode ? (
        <div className="absolute inset-0 h-full w-full">
          {currentChapter === 'CHAPTER_2_JOURNEY' ? (
            <TempleNightJourneyScene onComplete={handleJourneyComplete} speed={1} />
          ) : (
            <CanvasContainer
              cameraPosition={
                isCinematicRunning
                  ? [0, 8, 16]
                  : currentChapter === 'CHAPTER_5_CELEBRATION'
                  ? [0, 9, 20]
                  : cameraPreset === 'waterfall'
                  ? [0, 8.5, 15]
                  : cameraPreset === 'ridge'
                  ? [0, 26, 34]
                  : [0, 8.5, 18]
              }
              cameraTarget={
                cameraPreset === 'waterfall'
                  ? [0, 15, -42]
                  : cameraPreset === 'ridge'
                  ? [0, 10, -20]
                  : [0, 3, -4]
              }
              enableControls={!isCinematicRunning}
            >
              {isCinematicRunning ? (
                <>
                  <StudentForest
                    students={students}
                    selectedStudentId={selectedStudentId}
                    onSelectStudent={handleSelectStudentTree}
                    skyMode="cinematic"
                    cinematicProgress={cinematicProgress}
                  />
                  <CampingCelebrationCinematic progress={cinematicProgress} />
                </>
              ) : currentChapter === 'CHAPTER_5_CELEBRATION' ? (
                <>
                  <StudentForest
                    students={students}
                    selectedStudentId={selectedStudentId}
                    onSelectStudent={handleSelectStudentTree}
                    skyMode="sunset"
                  />
                  <CelebrationFX />
                  <CampingCelebrationCinematic progress={1} />
                </>
              ) : (
                <StudentForest
                  students={students}
                  selectedStudentId={selectedStudentId}
                  onSelectStudent={handleSelectStudentTree}
                  skyMode="day"
                />
              )}
            </CanvasContainer>
          )}
        </div>
      ) : (
        /* High-speed Roster Table Alternative */
        <div className="mx-auto max-w-5xl p-6">
          <AttendanceRosterTable
            students={students}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            statusFilter={statusFilter}
            onFilterChange={setStatusFilter}
            onUpdateStatus={updateStudentStatus}
            onMarkAllPresent={markAllPresent}
            onUndo={undoLastAction}
            canUndo={undoStack.length > 0}
            isSaving={isSaving}
            onSelectStudentRow={handleSelectStudentTree}
          />
        </div>
      )}

      {/* Persistent Floating Top HUD */}
      <div className="pointer-events-none absolute top-4 inset-x-0 z-20 flex items-start justify-between px-6">
        {/* Class Info Box */}
        <div className="pointer-events-auto flex items-center gap-3 rounded-3xl border border-blue-100 bg-white/95 p-3.5 shadow-md backdrop-blur-md">
          <Link
            href="/village"
            className="flex h-9 w-9 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
            title="Return to Village"
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-blue-700">
                {currentSession.classInfo?.code}
              </span>
              <h2 className="font-display text-sm font-bold text-slate-900">
                {currentSession.classInfo?.name}
              </h2>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              {new Date(currentSession.date).toLocaleDateString()} • {total} Students
            </p>
          </div>

          {/* Progress pill */}
          <div className="ml-3 hidden sm:flex flex-col items-end">
            <span className="text-[10px] font-bold text-blue-700">
              {presentCount}/{total} Present ({rate.toFixed(0)}%)
            </span>
            <div className="mt-1 h-2 w-28 overflow-hidden rounded-full bg-slate-100 border border-slate-200">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-300"
                style={{ width: `${rate}%` }}
              />
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="pointer-events-auto flex items-center gap-2">
          {/* Skip Cinematic Button */}
          {isCinematicRunning && (
            <button
              onClick={handleSkipCinematic}
              className="flex items-center gap-1.5 rounded-2xl border border-amber-300 bg-amber-50 px-3.5 py-2 text-xs font-bold text-amber-900 shadow-md backdrop-blur-md hover:bg-amber-100"
            >
              <FastForward className="h-4 w-4 text-amber-600" />
              <span>Skip Cinematic</span>
            </button>
          )}

          {/* Skip Journey Button (Chapter 2) */}
          {currentChapter === 'CHAPTER_2_JOURNEY' && !isTableMode && !isCinematicRunning && (
            <button
              onClick={handleSkipJourney}
              className="flex items-center gap-1.5 rounded-2xl border border-blue-200 bg-white px-3.5 py-2 text-xs font-bold text-blue-700 shadow-md backdrop-blur-md hover:bg-blue-50 active:scale-95 transition-all"
            >
              <FastForward className="h-4 w-4 text-blue-600" />
              <span>Skip Journey</span>
            </button>
          )}

          {/* 3D / Table View Switcher */}
          {!isCinematicRunning && (
            <button
              onClick={toggleTableMode}
              className="flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-white/95 px-3.5 py-2 text-xs font-bold text-slate-700 shadow-sm backdrop-blur-md hover:bg-slate-50 hover:text-blue-600 active:scale-95 transition-all"
            >
              {isTableMode ? (
                <>
                  <Eye className="h-4 w-4 text-blue-600" />
                  <span>3D Grove</span>
                </>
              ) : (
                <>
                  <Table className="h-4 w-4 text-slate-500" />
                  <span>Table View</span>
                </>
              )}
            </button>
          )}

          {/* 3D Camera Viewpoint Switcher (Grove / Waterfall / Ridge) */}
          {!isCinematicRunning && !isTableMode && currentChapter !== 'CHAPTER_2_JOURNEY' && (
            <div className="flex items-center rounded-2xl border border-slate-200 bg-white/95 p-1 shadow-sm backdrop-blur-md">
              <button
                onClick={() => {
                  setCameraPreset('grove');
                  forestAudio.playClick();
                }}
                className={`flex items-center gap-1 rounded-xl px-2.5 py-1 text-[11px] font-bold transition-all ${
                  cameraPreset === 'grove'
                    ? 'bg-emerald-100 text-emerald-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Grove Center View"
              >
                <Trees className="h-3.5 w-3.5 text-emerald-600" />
                <span className="hidden sm:inline">Grove</span>
              </button>
              <button
                onClick={() => {
                  setCameraPreset('waterfall');
                  forestAudio.playWaterSplash();
                }}
                className={`flex items-center gap-1 rounded-xl px-2.5 py-1 text-[11px] font-bold transition-all ${
                  cameraPreset === 'waterfall'
                    ? 'bg-cyan-100 text-cyan-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Waterfall & Gorge Vista"
              >
                <Waves className="h-3.5 w-3.5 text-cyan-600" />
                <span className="hidden sm:inline">Waterfall</span>
              </button>
              <button
                onClick={() => {
                  setCameraPreset('ridge');
                  forestAudio.playClick();
                }}
                className={`flex items-center gap-1 rounded-xl px-2.5 py-1 text-[11px] font-bold transition-all ${
                  cameraPreset === 'ridge'
                    ? 'bg-indigo-100 text-indigo-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Alpine Mountain Ridge Aerial View"
              >
                <Mountain className="h-3.5 w-3.5 text-indigo-600" />
                <span className="hidden sm:inline">Ridge</span>
              </button>
            </div>
          )}

          {/* Woodcutter Storyboard & Guide Selection Button */}
          {!isCinematicRunning && (
            <button
              onClick={() => setShowStoryboardModal(true)}
              className="flex items-center gap-1.5 rounded-2xl border border-red-200 bg-red-50/90 px-3.5 py-2 text-xs font-bold text-red-800 shadow-sm backdrop-blur-md hover:bg-red-100 active:scale-95 transition-all"
              title="Open Woodcutter Storyboard & Guide Selection"
            >
              <span>🪓 Storyboard</span>
            </button>
          )}

          {/* Temple Night Expedition Scene Button */}
          {!isCinematicRunning && currentChapter !== 'CHAPTER_2_JOURNEY' && (
            <button
              onClick={() => setChapter('CHAPTER_2_JOURNEY')}
              className="flex items-center gap-1.5 rounded-2xl border border-indigo-200 bg-indigo-50/90 px-3.5 py-2 text-xs font-bold text-indigo-800 shadow-sm backdrop-blur-md hover:bg-indigo-100 active:scale-95 transition-all"
              title="Experience Silas's Temple Night Expedition Scene"
            >
              <Moon className="h-4 w-4 text-indigo-600" />
              <span>Temple Night</span>
            </button>
          )}

          {/* Field Guide & Lore Button */}
          {!isCinematicRunning && (
            <button
              onClick={() => setShowJournalModal(true)}
              className="flex items-center gap-1.5 rounded-2xl border border-blue-200 bg-blue-50/90 px-3.5 py-2 text-xs font-bold text-blue-800 shadow-sm backdrop-blur-md hover:bg-blue-100 active:scale-95 transition-all"
              title="Open Ranger Field Lore & Guide"
            >
              <BookOpen className="h-4 w-4 text-blue-600" />
              <span className="hidden sm:inline">Field Lore</span>
            </button>
          )}

          {/* Review & Finalize Button */}
          {!isFinalized && !isCinematicRunning && (
            <button
              onClick={() => setShowReviewModal(true)}
              className="flex items-center gap-1.5 rounded-2xl border border-blue-500 bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-blue-500/25 hover:brightness-105 active:scale-95 transition-all"
            >
              <FileCheck2 className="h-4 w-4 text-amber-300" />
              <span>Review & Finalize</span>
            </button>
          )}
        </div>
      </div>

      {/* Cinematic Phase Story Narrator Subtitle */}
      {isCinematicRunning && (
        <div className="pointer-events-none absolute bottom-8 inset-x-0 z-30 flex justify-center px-4">
          <div className="animate-fade-in flex items-center gap-3 rounded-3xl border border-blue-200 bg-white/95 px-6 py-3.5 text-center shadow-2xl backdrop-blur-md">
            {cinematicProgress < 0.35 ? (
              <>
                <Sparkles className="h-5 w-5 text-blue-600 animate-spin" />
                <span className="font-display text-sm font-bold text-slate-900">
                  🌲 The Ancient Forest moves forward into the open skies...
                </span>
              </>
            ) : cinematicProgress < 0.75 ? (
              <>
                <Sunset className="h-5 w-5 text-amber-500 animate-pulse" />
                <span className="font-display text-sm font-bold text-amber-900">
                  🌄 Across the mountain horizon, the golden sun sets into twilight...
                </span>
              </>
            ) : (
              <>
                <Flame className="h-5 w-5 text-rose-500 animate-bounce" />
                <span className="font-display text-sm font-bold text-slate-900">
                  ⛺ Bonfires ignite, lanterns glow, and the whole town celebrates the camping festival!
                </span>
              </>
            )}
          </div>
        </div>
      )}

      {/* Floating Bottom Quick Instructions */}
      {!isTableMode && !isCinematicRunning && currentChapter !== 'CHAPTER_2_JOURNEY' && (
        <div className="pointer-events-none absolute bottom-6 inset-x-0 z-20 flex justify-center">
          <div className="pointer-events-auto flex items-center gap-3 rounded-full border border-blue-100 bg-white/95 px-5 py-2 text-xs text-slate-700 shadow-lg backdrop-blur-md">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 shadow-xs" />
            <span>Click any student tree to bloom leaves or record check-in note</span>
            <span className="text-slate-300">•</span>
            <button
              onClick={markAllPresent}
              className="font-bold text-blue-600 hover:underline"
            >
              Mark All Present
            </button>
          </div>
        </div>
      )}

      {/* Student Check-In Modal */}
      {activeModalStudent && (
        <StudentCheckInModal
          student={activeModalStudent}
          onClose={() => {
            setActiveModalStudent(null);
            selectStudent(null);
          }}
          onUpdateStatus={updateStudentStatus}
        />
      )}

      {/* Review Modal */}
      {showReviewModal && (
        <SessionReviewModal
          session={currentSession}
          onClose={() => setShowReviewModal(false)}
          onConfirmFinalize={handleConfirmFinalize}
          isSubmitting={isFinalizing}
        />
      )}

      {/* Celebration Modal */}
      {showCelebrationModal && (
        <FinalCelebrationModal
          classCode={currentSession.classInfo?.code || ''}
          sessionId={currentSession.id}
          stats={celebrationData?.stats}
          rewards={celebrationData?.rewards}
          onClose={() => setShowCelebrationModal(false)}
        />
      )}

      {/* Story Lore & Field Guide Modal */}
      {showJournalModal && (
        <StoryJournalModal onClose={() => setShowJournalModal(false)} />
      )}

      {/* Woodcutter Storyboard & Guide Selection Modal */}
      {showStoryboardModal && (
        <WoodcutterStoryboardModal onClose={() => setShowStoryboardModal(false)} />
      )}
    </div>
  );
}
