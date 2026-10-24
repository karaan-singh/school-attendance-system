import { create } from 'zustand';
import { StoryChapter, GraphicsSettings, AudioSettings, ExpeditionGuide } from '@/types';

interface GameState {
  currentChapter: StoryChapter;
  selectedClassId: string | null;
  selectedClassCode: string | null;
  selectedClassName: string | null;
  selectedStudentId: string | null;
  cameraPosition: [number, number, number];
  cameraTarget: [number, number, number];
  isJourneySkipped: boolean;
  isTableMode: boolean;
  audioSettings: AudioSettings;
  graphicsSettings: GraphicsSettings;
  selectedGuide: ExpeditionGuide;

  // Actions
  setChapter: (chapter: StoryChapter) => void;
  setGuide: (guide: ExpeditionGuide) => void;
  selectClass: (classId: string, code: string, name: string) => void;
  selectStudent: (studentId: string | null) => void;
  setCamera: (pos: [number, number, number], target: [number, number, number]) => void;
  setSkipJourney: (skip: boolean) => void;
  toggleTableMode: () => void;
  setTableMode: (val: boolean) => void;
  toggleSound: () => void;
  updateAudioSettings: (settings: Partial<AudioSettings>) => void;
  updateGraphicsSettings: (settings: Partial<GraphicsSettings>) => void;
  resetToVillage: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  currentChapter: 'CHAPTER_1_VILLAGE',
  selectedClassId: null,
  selectedClassCode: null,
  selectedClassName: null,
  selectedStudentId: null,
  cameraPosition: [0, 8, 16],
  cameraTarget: [0, 1, 0],
  isJourneySkipped: false,
  isTableMode: false,
  selectedGuide: 'WOODCUTTER',
  audioSettings: {
    soundEnabled: true,
    ambientVolume: 0.25,
    fxVolume: 0.6,
  },
  graphicsSettings: {
    quality: 'high',
    reducedMotion: false,
    enablePostProcessing: true,
    enableShadows: true,
  },

  setChapter: (chapter) => set({ currentChapter: chapter }),
  setGuide: (guide) => set({ selectedGuide: guide }),

  selectClass: (classId, code, name) =>
    set({
      selectedClassId: classId,
      selectedClassCode: code,
      selectedClassName: name,
      selectedStudentId: null,
    }),

  selectStudent: (studentId) => set({ selectedStudentId: studentId }),

  setCamera: (pos, target) => set({ cameraPosition: pos, cameraTarget: target }),

  setSkipJourney: (skip) => set({ isJourneySkipped: skip }),

  toggleTableMode: () => set((state) => ({ isTableMode: !state.isTableMode })),

  setTableMode: (val) => set({ isTableMode: val }),

  toggleSound: () =>
    set((state) => ({
      audioSettings: {
        ...state.audioSettings,
        soundEnabled: !state.audioSettings.soundEnabled,
      },
    })),

  updateAudioSettings: (settings) =>
    set((state) => ({
      audioSettings: { ...state.audioSettings, ...settings },
    })),

  updateGraphicsSettings: (settings) =>
    set((state) => ({
      graphicsSettings: { ...state.graphicsSettings, ...settings },
    })),

  resetToVillage: () =>
    set({
      currentChapter: 'CHAPTER_1_VILLAGE',
      selectedClassId: null,
      selectedClassCode: null,
      selectedClassName: null,
      selectedStudentId: null,
      cameraPosition: [0, 8, 16],
      cameraTarget: [0, 1, 0],
      isJourneySkipped: false,
      isTableMode: false,
    }),
}));
