import { create } from 'zustand';
import { AttendanceStatus, StudentRecord, AttendanceSessionData } from '@/types';
import { forestAudio } from '@/lib/audio';

interface UndoItem {
  studentId: string;
  previousStatus: AttendanceStatus | null;
  previousNote?: string | null;
}

interface AttendanceState {
  currentSession: AttendanceSessionData | null;
  students: StudentRecord[];
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  undoStack: UndoItem[];
  searchQuery: string;
  statusFilter: 'ALL' | AttendanceStatus | 'UNMARKED';

  // Actions
  setSession: (session: AttendanceSessionData) => void;
  setStudents: (students: StudentRecord[]) => void;
  setSearchQuery: (query: string) => void;
  setStatusFilter: (filter: 'ALL' | AttendanceStatus | 'UNMARKED') => void;

  // Single student status update (with optimistic UI & audio trigger)
  updateStudentStatus: (
    studentId: string,
    newStatus: AttendanceStatus,
    note?: string
  ) => Promise<boolean>;

  // Mark all currently unmarked students as PRESENT
  markAllPresent: () => Promise<boolean>;

  // Undo last action
  undoLastAction: () => Promise<boolean>;

  // Finalize session
  finalizeSession: () => Promise<{ success: boolean; progress?: any }>;

  // Refresh current session
  refreshSession: () => Promise<void>;
}

export const useAttendanceStore = create<AttendanceState>((set, get) => ({
  currentSession: null,
  students: [],
  isLoading: false,
  isSaving: false,
  error: null,
  undoStack: [],
  searchQuery: '',
  statusFilter: 'ALL',

  setSession: (session) => {
    set({
      currentSession: session,
      students: session.records,
    });
  },

  setStudents: (students) => set({ students }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setStatusFilter: (statusFilter) => set({ statusFilter }),

  updateStudentStatus: async (studentId, newStatus, note) => {
    const { currentSession, students, undoStack } = get();
    if (!currentSession) return false;

    const student = students.find((s) => s.id === studentId);
    if (!student) return false;

    const previousStatus = student.status;
    const previousNote = student.note;

    // Optimistic Update
    const updatedStudents = students.map((s) =>
      s.id === studentId
        ? {
            ...s,
            status: newStatus,
            note: note !== undefined ? note : s.note,
            checkInTime: newStatus === 'PRESENT' ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : s.checkInTime,
          }
        : s
    );

    // Calculate updated counts
    const presentCount = updatedStudents.filter((s) => s.status === 'PRESENT').length;
    const absentCount = updatedStudents.filter((s) => s.status === 'ABSENT').length;
    const lateCount = updatedStudents.filter((s) => s.status === 'LATE').length;
    const excusedCount = updatedStudents.filter((s) => s.status === 'EXCUSED').length;

    set({
      students: updatedStudents,
      currentSession: {
        ...currentSession,
        presentCount,
        absentCount,
        lateCount,
        excusedCount,
        records: updatedStudents,
      },
      undoStack: [...undoStack, { studentId, previousStatus, previousNote }],
      isSaving: true,
      error: null,
    });

    // Play tactile sound
    forestAudio.playLeafBloom(newStatus);

    try {
      const res = await fetch(`/api/sessions/${currentSession.id}/records`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId,
          status: newStatus,
          note,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to persist record to server');
      }

      set({ isSaving: false });
      return true;
    } catch (err: any) {
      // Rollback on network failure
      console.error(err);
      set({
        students,
        currentSession,
        error: 'Failed to save attendance record. Rolled back.',
        isSaving: false,
      });
      return false;
    }
  },

  markAllPresent: async () => {
    const { currentSession, students } = get();
    if (!currentSession) return false;

    set({ isSaving: true });
    try {
      const unmarkedOrNonPresent = students.filter((s) => s.status !== 'PRESENT');
      if (unmarkedOrNonPresent.length === 0) {
        set({ isSaving: false });
        return true;
      }

      const res = await fetch(`/api/sessions/${currentSession.id}/records`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'MARK_ALL_PRESENT',
        }),
      });

      if (!res.ok) throw new Error('Bulk update failed');

      forestAudio.playCelebrationFanfare();

      const updated = students.map((s) => ({
        ...s,
        status: 'PRESENT' as AttendanceStatus,
        checkInTime: s.checkInTime || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }));

      set({
        students: updated,
        currentSession: {
          ...currentSession,
          presentCount: updated.length,
          absentCount: 0,
          lateCount: 0,
          excusedCount: 0,
          records: updated,
        },
        isSaving: false,
      });

      return true;
    } catch (err) {
      console.error(err);
      set({ isSaving: false, error: 'Failed to mark all present' });
      return false;
    }
  },

  undoLastAction: async () => {
    const { undoStack, updateStudentStatus } = get();
    if (undoStack.length === 0) return false;

    const lastAction = undoStack[undoStack.length - 1];
    if (lastAction.previousStatus) {
      const success = await updateStudentStatus(
        lastAction.studentId,
        lastAction.previousStatus,
        lastAction.previousNote || undefined
      );
      if (success) {
        set({ undoStack: undoStack.slice(0, -1) });
        return true;
      }
    }
    return false;
  },

  finalizeSession: async () => {
    const { currentSession } = get();
    if (!currentSession) return { success: false };

    try {
      const res = await fetch(`/api/sessions/${currentSession.id}/finalize`, {
        method: 'POST',
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to finalize session');
      }

      const data = await res.json();
      forestAudio.playCelebrationFanfare();

      set({
        currentSession: {
          ...currentSession,
          status: 'FINALIZED',
        },
      });

      return { success: true, progress: data.progress };
    } catch (err: any) {
      return { success: false, error: err.message } as any;
    }
  },

  refreshSession: async () => {
    const { currentSession } = get();
    if (!currentSession) return;

    try {
      const res = await fetch(`/api/sessions?classId=${currentSession.classId}&date=${currentSession.date}`);
      if (res.ok) {
        const data = await res.json();
        set({
          currentSession: data.session,
          students: data.session.records,
        });
      }
    } catch (e) {
      console.error(e);
    }
  },
}));
