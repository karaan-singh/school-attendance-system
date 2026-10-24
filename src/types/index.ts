export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';

export interface StudentRecord {
  id: string;
  rollNumber: string;
  fullName: string;
  gender: string;
  avatarIcon: string;
  parentPhone?: string | null;
  treeSpecies?: string | null;
  status: AttendanceStatus | null;
  note?: string | null;
  recordId?: string | null;
  checkInTime?: string | null;
}

export interface SchoolClassData {
  id: string;
  name: string;
  code: string;
  grade: number;
  section: string;
  room?: string | null;
  hutStyle: string;
  hutColor: string;
  studentCount?: number;
  todaySessionStatus?: 'DRAFT' | 'FINALIZED' | 'NOT_STARTED';
  todaySessionId?: string | null;
  progress?: {
    level: number;
    currentXp: number;
    nextLevelXp: number;
    bloomRank: string;
    fireflies: number;
  } | null;
}

export interface AttendanceSessionData {
  id: string;
  classId: string;
  date: string;
  status: 'DRAFT' | 'FINALIZED';
  notes?: string | null;
  totalStudents: number;
  presentCount: number;
  absentCount: number;
  lateCount: number;
  excusedCount: number;
  records: StudentRecord[];
  classInfo?: SchoolClassData;
}

export type StoryChapter =
  | 'CHAPTER_1_VILLAGE'
  | 'CHAPTER_2_JOURNEY'
  | 'CHAPTER_3_FOREST'
  | 'CHAPTER_4_LIVING_FOREST'
  | 'CHAPTER_5_CELEBRATION';

export interface AudioSettings {
  soundEnabled: boolean;
  ambientVolume: number;
  fxVolume: number;
}

export interface GraphicsSettings {
  quality: 'low' | 'medium' | 'high';
  reducedMotion: boolean;
  enablePostProcessing: boolean;
  enableShadows: boolean;
}

export type ExpeditionGuide = 'WOODCUTTER' | 'RANGER' | 'DRUID' | 'SCOUT';

