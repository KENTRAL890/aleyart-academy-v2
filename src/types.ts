export type UserRole = 'admin' | 'teacher';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  subject?: string;
  password: string;
}

export type ClassLevel =
  | 'Creche' | 'N1' | 'N2' | 'KG1' | 'KG2'
  | 'Basic 1' | 'Basic 2' | 'Basic 3' | 'Basic 4' | 'Basic 5' | 'Basic 6'
  | 'Basic 7' | 'Basic 8' | 'Basic 9';

export type Subject =
  | 'English Language' | 'Mathematics' | 'Science' | 'Social Studies'
  | 'Computing' | 'Creative Arts' | 'RME' | 'History' | 'French'
  | 'Ga/Twi' | 'Career Technology'
  | 'Literacy & Language' | 'Numeracy' | 'Environmental Studies'
  | 'Physical & Psychosocial Development';

export type ExamType =
  | 'End of Month Test' | 'End of Term Examination' | 'Mid-Term Test'
  | 'Class Test' | 'Entrance Exam' | 'B.E.C.E Standard Exam'
  | 'Transitional Exam' | string;

export type QuestionType =
  | 'Multiple Choice' | 'Short Answer' | 'Essay/Theory'
  | 'Fill in the Blank' | 'True or False' | 'Subjective';

export type DifficultyLevel = 'Easy' | 'Medium' | 'Hard';

export interface SubQuestion {
  id: string;
  label: string; // e.g., "1a", "1ai", "1b"
  question: string;
  answer: string;
  marks: number;
  imageUrl?: string;
}

export interface DiagramLabel {
  label: string;   // e.g. "A", "B", "C", "1", "2"
  part: string;     // e.g. "CPU", "Monitor", "Filter Funnel"
  use?: string;     // e.g. "Processes data", "Displays output"
}

export interface Question {
  id: string;
  questionNumber: number;
  type: QuestionType;
  question: string;
  options?: string[]; // For MCQ: [A, B, C, D]
  correctAnswer: string;
  marks: number;
  isCompulsory?: boolean;
  isPractical?: boolean;
  subQuestions?: SubQuestion[];
  imageUrl?: string;
  diagramLabels?: DiagramLabel[];
  section?: string; // A, B, C, D
  explanation?: string;
  working?: string;
}

export interface ExamSection {
  id: string;
  sectionLabel: string; // "A", "B", "C", "D"
  title: string;
  instructions: string;
  questions: Question[];
  totalMarks: number;
  isObjective: boolean;
  numberOfQuestionsToAnswer?: number;
}

export interface EnglishSectionB {
  grammar?: ExamSection;
  comprehension?: ExamSection;
  summary?: ExamSection;
  composition?: ExamSection;
  literature?: ExamSection;
  vocabulary?: ExamSection;
  oralLanguage?: ExamSection;
}

export interface CustomObjectiveQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  imageUrl?: string;
}

export interface CustomSubjectiveQuestion {
  question: string;
  answer: string;
  marks: number;
  imageUrl?: string;
  subQuestions?: {
    label: string;
    question: string;
    answer: string;
    marks: number;
  }[];
}

export interface ExamPaper {
  id: string;
  schoolName: string;
  classLevel: ClassLevel;
  subject: Subject;
  examType: ExamType;
  difficulty?: DifficultyLevel;
  term: string;
  academicYear: string;
  duration: string;
  totalMarks: number;
  sections: ExamSection[];
  englishSections?: EnglishSectionB;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  topics: string[];
  additionalTopics: string[];
  markingScheme: MarkingSchemeItem[];
}

export interface MarkingSchemeItem {
  questionId: string;
  questionNumber: number;
  sectionLabel: string;
  question: string;
  correctAnswer: string;
  marks: number;
  imageUrl?: string;
  diagramLabels?: DiagramLabel[];
  working?: string;
  explanation?: string;
  subAnswers?: {
    label: string;
    answer: string;
    marks: number;
    working?: string;
  }[];
}

export interface SavedExam {
  id: string;
  exam: ExamPaper;
  markingScheme: MarkingSchemeItem[];
  savedAt: string;
  savedBy: string;
}

export interface EarlyChildhoodAssessment {
  id: string;
  classLevel: 'Creche' | 'N1' | 'N2' | 'KG1' | 'KG2';
  childName?: string;
  assessmentType: string;
  areas: AssessmentArea[];
  observations: string;
  date: string;
  assessedBy: string;
}

export interface AssessmentArea {
  name: string;
  criteria: {
    skill: string;
    rating: 'Excellent' | 'Good' | 'Developing' | 'Needs Support';
    comment: string;
  }[];
}

export interface OMRSheet {
  id: string;
  classLevel: ClassLevel;
  subject: Subject;
  numberOfQuestions: number;
  optionsPerQuestion: number;
  studentName?: string;
  studentId?: string;
}

export interface AnswerBooklet {
  id: string;
  classLevel: ClassLevel;
  subject: Subject;
  examType: ExamType;
  numberOfPages: number;
  hasMargin: boolean;
  hasLines: boolean;
}
