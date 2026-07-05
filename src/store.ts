import { supabase, isSupabaseConfigured } from './lib/supabase';
import type { User, SavedExam, EarlyChildhoodAssessment, ExamPaper, MarkingSchemeItem } from './types';
import { DEFAULT_USERS } from './data/constants';

const STORAGE_KEYS = {
  users: 'aleyart_users',
  currentUser: 'aleyart_current_user',
  savedExams: 'aleyart_saved_exams',
  assessments: 'aleyart_assessments',
};

// ============ HELPERS ============

function readLocal<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key);
    if (stored) return JSON.parse(stored);
  } catch (e) {
    console.error('localStorage read error:', e);
  }
  return fallback;
}

function writeLocal(key: string, data: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('localStorage write error:', e);
  }
}

// ============ REAL-TIME LISTENERS ============

type ExamListener = (exams: SavedExam[]) => void;
const examListeners = new Set<ExamListener>();

export function onExamsChange(listener: ExamListener): () => void {
  examListeners.add(listener);
  return () => { examListeners.delete(listener); };
}

function notifyExamListeners() {
  const exams = getLocalExams();
  examListeners.forEach(fn => fn(exams));
}

function rowToSavedExam(row: Record<string, unknown>): SavedExam {
  return {
    id: row.id as string,
    exam: typeof row.exam_data === 'string' ? JSON.parse(row.exam_data as string) : row.exam_data as ExamPaper,
    markingScheme: typeof row.marking_scheme === 'string' ? JSON.parse(row.marking_scheme as string) : row.marking_scheme as MarkingSchemeItem[],
    savedAt: row.created_at as string,
    savedBy: row.created_by as string,
  };
}

// Start Supabase real-time subscription
let realtimeStarted = false;

export function startRealtimeSync() {
  if (realtimeStarted || !isSupabaseConfigured()) return;
  realtimeStarted = true;

  supabase
    .channel('exams-realtime')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'exams' }, (payload) => {
      const newExam = rowToSavedExam(payload.new);
      const exams = getLocalExams();
      if (!exams.find(e => e.id === newExam.id)) {
        exams.unshift(newExam);
        saveLocalExams(exams);
        notifyExamListeners();
      }
    })
    .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'exams' }, (payload) => {
      const updated = rowToSavedExam(payload.new);
      const exams = getLocalExams();
      const idx = exams.findIndex(e => e.id === updated.id);
      if (idx >= 0) {
        exams[idx] = updated;
      } else {
        exams.unshift(updated);
      }
      saveLocalExams(exams);
      notifyExamListeners();
    })
    .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'exams' }, (payload) => {
      const deletedId = (payload.old as Record<string, unknown>).id as string;
      const exams = getLocalExams().filter(e => e.id !== deletedId);
      saveLocalExams(exams);
      notifyExamListeners();
    })
    .subscribe();
}

// ============ USER MANAGEMENT ============

export async function getUsers(): Promise<User[]> {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase.from('users').select('*');
      if (error) throw error;
      if (data && data.length > 0) return data as User[];
    } catch (e) {
      console.error('Supabase users error:', e);
    }
  }
  const local = readLocal<User[]>(STORAGE_KEYS.users, []);
  if (local.length > 0) return local;
  writeLocal(STORAGE_KEYS.users, DEFAULT_USERS);
  return DEFAULT_USERS as User[];
}

export function getCurrentUser(): User | null {
  return readLocal<User | null>(STORAGE_KEYS.currentUser, null);
}

export async function login(name: string, password: string): Promise<User | null> {
  const users = await getUsers();
  const user = users.find(u => u.name === name && u.password === password);
  if (user) {
    writeLocal(STORAGE_KEYS.currentUser, user);
    return user;
  }
  return null;
}

export function logout() {
  localStorage.removeItem(STORAGE_KEYS.currentUser);
}

// ============ EXAM MANAGEMENT ============

function getLocalExams(): SavedExam[] {
  return readLocal<SavedExam[]>(STORAGE_KEYS.savedExams, []);
}

function saveLocalExams(exams: SavedExam[]): void {
  writeLocal(STORAGE_KEYS.savedExams, exams);
}

export async function getSavedExams(): Promise<SavedExam[]> {
  // If Supabase is configured, fetch from cloud (source of truth)
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('exams')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        const supaExams: SavedExam[] = data.map(row => rowToSavedExam(row));
        // Merge with any local-only exams
        const localExams = getLocalExams();
        const merged = new Map<string, SavedExam>();
        for (const ex of supaExams) merged.set(ex.id, ex);
        for (const ex of localExams) {
          if (!merged.has(ex.id)) merged.set(ex.id, ex);
        }
        const result = Array.from(merged.values()).sort(
          (a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime()
        );
        saveLocalExams(result);
        return result;
      }
    } catch (e) {
      console.error('Supabase fetch error:', e);
    }
  }

  return getLocalExams();
}

export async function saveExam(exam: SavedExam): Promise<void> {
  // 1. Save to localStorage
  const exams = getLocalExams();
  const existing = exams.findIndex(e => e.id === exam.id);
  if (existing >= 0) {
    exams[existing] = exam;
  } else {
    exams.unshift(exam);
  }
  saveLocalExams(exams);
  notifyExamListeners();

  // 2. Save to Supabase
  if (isSupabaseConfigured()) {
    try {
      const { error } = await supabase.from('exams').upsert({
        id: exam.id,
        exam_data: exam.exam,
        marking_scheme: exam.markingScheme,
        class_level: exam.exam.classLevel,
        subject: exam.exam.subject,
        exam_type: exam.exam.examType,
        created_by: exam.savedBy,
        created_at: exam.savedAt,
        updated_at: new Date().toISOString(),
      });
      if (error) console.error('Supabase save error:', error);
    } catch (e) {
      console.error('Supabase sync error:', e);
    }
  }
}

export async function updateExam(id: string, examPaper: ExamPaper, markingScheme: MarkingSchemeItem[]): Promise<void> {
  // 1. Update localStorage
  const exams = getLocalExams();
  const idx = exams.findIndex(e => e.id === id);
  if (idx >= 0) {
    exams[idx].exam = examPaper;
    exams[idx].markingScheme = markingScheme;
    saveLocalExams(exams);
    notifyExamListeners();
  }

  // 2. Update Supabase
  if (isSupabaseConfigured()) {
    try {
      const { error } = await supabase.from('exams').update({
        exam_data: examPaper,
        marking_scheme: markingScheme,
        updated_at: new Date().toISOString(),
      }).eq('id', id);
      if (error) console.error('Supabase update error:', error);
    } catch (e) {
      console.error('Supabase update sync error:', e);
    }
  }
}

export async function deleteExam(id: string): Promise<void> {
  // 1. Delete from localStorage
  const exams = getLocalExams().filter(e => e.id !== id);
  saveLocalExams(exams);
  notifyExamListeners();

  // 2. Delete from Supabase
  if (isSupabaseConfigured()) {
    try {
      const { error } = await supabase.from('exams').delete().eq('id', id);
      if (error) console.error('Supabase delete error:', error);
    } catch (e) {
      console.error('Supabase delete sync error:', e);
    }
  }
}

export async function getExamsByClass(classLevel: string): Promise<SavedExam[]> {
  const allExams = await getSavedExams();
  return allExams.filter(e => e.exam.classLevel === classLevel);
}

// ============ ASSESSMENT MANAGEMENT ============

export async function getAssessments(): Promise<EarlyChildhoodAssessment[]> {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('assessments')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        const result = data.map(row =>
          typeof row.assessment_data === 'string'
            ? JSON.parse(row.assessment_data)
            : row.assessment_data
        );
        writeLocal(STORAGE_KEYS.assessments, result);
        return result;
      }
    } catch (e) {
      console.error('Supabase assessments error:', e);
    }
  }

  return readLocal<EarlyChildhoodAssessment[]>(STORAGE_KEYS.assessments, []);
}

export async function saveAssessment(assessment: EarlyChildhoodAssessment): Promise<void> {
  const assessments = readLocal<EarlyChildhoodAssessment[]>(STORAGE_KEYS.assessments, []);
  assessments.unshift(assessment);
  writeLocal(STORAGE_KEYS.assessments, assessments);

  if (isSupabaseConfigured()) {
    try {
      await supabase.from('assessments').insert({
        id: assessment.id,
        assessment_data: assessment,
        class_level: assessment.classLevel,
        child_name: assessment.childName || 'Unknown',
        assessed_by: assessment.assessedBy,
        created_at: assessment.date,
      });
    } catch (e) {
      console.error('Supabase assessment sync error:', e);
    }
  }
}

// ============ CONNECTION STATUS ============

export function getConnectionStatus(): 'supabase' | 'local' {
  return isSupabaseConfigured() ? 'supabase' : 'local';
}
