import { useEffect, useState } from 'react';
import type { User, ClassLevel, Subject, ExamType, ExamPaper, DifficultyLevel } from '../types';
import { CLASS_LEVELS, SUBJECTS_BY_LEVEL, EXAM_TYPES, SPECIAL_EXAM_TYPES, TOPICS_BY_SUBJECT_LEVEL, EARLY_CHILDHOOD_LEVELS, BEACON_OF_LIGHT_EXCERPTS, MATH_SHAPE_OPTIONS, getTopicsForTerm, NACCA_DIAGRAMS } from '../data/constants';
import { generateExamPaper } from '../data/questionGenerator';
import { saveExam } from '../store';
import ExamPreview from './ExamPreview';
import MarkingSchemeView from './MarkingSchemeView';
import CustomShapeBuilderModal, { CustomShapeResult } from './CustomShapeBuilderModal';
import { printElementsClean } from '../utils/printDocument';

interface Props {
  user: User;
  specialMode?: boolean;
}

interface SectionConfig {
  label: string;
  title: string;
  questionCount: number;
  marksPerQuestion: number;
  totalMarks: number;
}

export default function ExamGenerator({ user, specialMode }: Props) {
  const [step, setStep] = useState(1);
  const [classLevel, setClassLevel] = useState<ClassLevel | ''>('');
  const [subject, setSubject] = useState<Subject | ''>('');
  const [examType, setExamType] = useState<ExamType | ''>('');
  const [customExamType, setCustomExamType] = useState('');
  const [term, setTerm] = useState('Term 1');
  const [academicYear, setAcademicYear] = useState('2024/2025');
  const [duration, setDuration] = useState('1 hour 30 minutes');
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [additionalTopics, setAdditionalTopics] = useState('');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('Medium');
  
  // Custom Questions & Literature
  const [customObjectives, setCustomObjectives] = useState<{ question: string; options: string[]; correctAnswer: string; imageUrl?: string }[]>([]);
  const [customSubjectives, setCustomSubjectives] = useState<{ question: string; answer: string; marks: number; imageUrl?: string; subQuestions?: { label: string; question: string; answer: string; marks: number }[] }[]>([]);
  const [newObjQ, setNewObjQ] = useState('');
  const [newObjOpts, setNewObjOpts] = useState(['', '', '', '']);
  const [newObjAns, setNewObjAns] = useState('');
  const [newObjImg, setNewObjImg] = useState('');
  
  const [newSubjQ, setNewSubjQ] = useState('');
  const [newSubjAns, setNewSubjAns] = useState('');
  const [newSubjMarks, setNewSubjMarks] = useState(10);
  const [newSubjImg, setNewSubjImg] = useState('');
  const [showShapeModal, setShowShapeModal] = useState(false);

  // Literature selection for English Basic 7-9
  const [selectedLitIndex, setSelectedLitIndex] = useState<number | 'custom'>(-1);
  const [customLitTitle, setCustomLitTitle] = useState('');
  const [customLitExcerpt, setCustomLitExcerpt] = useState('');
  const [customLitQ1, setCustomLitQ1] = useState({ q: '', answer: '' });
  const [customLitQ2, setCustomLitQ2] = useState({ q: '', answer: '' });

  // Section A - Objective
  const [objectiveCount, setObjectiveCount] = useState(40);
  const [objectiveMarksPerQ, setObjectiveMarksPerQ] = useState(1);
  
  // Section B, C, D - Subjective
  const [subjectiveSections, setSubjectiveSections] = useState<SectionConfig[]>([
    { label: 'B', title: 'Theory', questionCount: 5, marksPerQuestion: 10, totalMarks: 50 }
  ]);
  const [subjectiveInstructions, setSubjectiveInstructions] = useState('');
  
  const [generatedExam, setGeneratedExam] = useState<ExamPaper | null>(null);
  const [showMarkingScheme, setShowMarkingScheme] = useState(false);
  const [saving, setSaving] = useState(false);

  const availableLevels = specialMode
    ? CLASS_LEVELS.filter(l => !EARLY_CHILDHOOD_LEVELS.includes(l))
    : CLASS_LEVELS.filter(l => !EARLY_CHILDHOOD_LEVELS.includes(l));

  const availableSubjects = classLevel ? (SUBJECTS_BY_LEVEL[classLevel] || []) : [];
  const rawTopics = (classLevel && subject) ? (TOPICS_BY_SUBJECT_LEVEL[subject as string]?.[classLevel] || []) : [];
  const availableTopics = getTopicsForTerm(rawTopics, term);

  const objectiveTotalMarks = objectiveCount * objectiveMarksPerQ;
  const subjectiveTotalMarks = subjectiveSections.reduce((sum, s) => sum + s.totalMarks, 0);
  const grandTotal = objectiveTotalMarks + subjectiveTotalMarks;

  // Auto-set NaCCA/level-based recommended objective question counts
  useEffect(() => {
    if (!classLevel) return;
    if (['Basic 1', 'Basic 2', 'Basic 3'].includes(classLevel)) {
      setObjectiveCount(30);
    } else if (['Basic 4', 'Basic 5', 'Basic 6'].includes(classLevel)) {
      setObjectiveCount(30);
    } else if (['Basic 7', 'Basic 8', 'Basic 9'].includes(classLevel)) {
      setObjectiveCount(40);
    }
  }, [classLevel]);

  const getExamTypes = (): ExamType[] => {
    if (classLevel) {
      const special = SPECIAL_EXAM_TYPES[classLevel as ClassLevel] || [];
      return [...EXAM_TYPES, ...special];
    }
    return EXAM_TYPES;
  };

  const addSection = () => {
    const nextLabel = String.fromCharCode(66 + subjectiveSections.length); // B, C, D, E...
    setSubjectiveSections([...subjectiveSections, {
      label: nextLabel,
      title: `Section ${nextLabel}`,
      questionCount: 4,
      marksPerQuestion: 10,
      totalMarks: 40,
    }]);
  };

  const removeSection = (idx: number) => {
    if (subjectiveSections.length > 1) {
      const updated = subjectiveSections.filter((_, i) => i !== idx);
      // Re-label sections
      updated.forEach((s, i) => {
        s.label = String.fromCharCode(66 + i);
      });
      setSubjectiveSections(updated);
    }
  };

  const updateSection = (idx: number, field: keyof SectionConfig, value: number | string) => {
    const updated = [...subjectiveSections];
    if (field === 'questionCount' || field === 'marksPerQuestion') {
      updated[idx][field] = value as number;
      updated[idx].totalMarks = updated[idx].questionCount * updated[idx].marksPerQuestion;
    } else if (field === 'totalMarks') {
      updated[idx].totalMarks = value as number;
      // Recalculate marks per question
      if (updated[idx].questionCount > 0) {
        updated[idx].marksPerQuestion = Math.floor((value as number) / updated[idx].questionCount);
      }
    } else {
      (updated[idx] as any)[field] = value;
    }
    setSubjectiveSections(updated);
  };

  // Parse uploaded/pasted document text, auto-detect Section A / Section B headings
  const parseUploadedText = (text: string) => {
    const cleaned = text
      .replace(/\uFEFF/g, '')
      .replace(/[\u2018\u2019]/g, "'")
      .replace(/[\u201C\u201D]/g, '"')
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n');

    const lines = cleaned.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    let currentSection: 'A' | 'B' | 'C' | 'D' | 'auto' = 'auto';
    const newObj: typeof customObjectives = [];
    const newSubj: typeof customSubjectives = [];
    // Track which uploaded sections we found for Section B/C/D
    const uploadedSectionNames: string[] = [];

    let pendingObjective: { question: string; options: string[]; correctAnswer?: string } | null = null;
    let pendingSubjective: { question: string; answer: string } | null = null;

    const flushObjective = () => {
      if (!pendingObjective) return;
      const opts = pendingObjective.options.length >= 4 ? pendingObjective.options.slice(0, 4) : [...pendingObjective.options, 'A. ___', 'B. ___', 'C. ___', 'D. ___'].slice(0, 4);
      newObj.push({
        question: pendingObjective.question,
        options: opts,
        correctAnswer: pendingObjective.correctAnswer || opts[0],
      });
      pendingObjective = null;
    };

    const flushSubjective = () => {
      if (!pendingSubjective) return;
      newSubj.push({
        question: pendingSubjective.question,
        answer: pendingSubjective.answer || 'Accept valid NaCCA-aligned answer.',
        marks: 10,
      });
      pendingSubjective = null;
    };

    for (const rawLine of lines) {
      const upper = rawLine.toUpperCase().replace(/[^A-Z0-9 ]/g, '');

      if (upper.includes('SECTION A') || upper === 'OBJECTIVE' || upper === 'OBJECTIVES' || upper === 'MCQ' || upper === 'MULTIPLE CHOICE') {
        flushObjective(); flushSubjective(); currentSection = 'A'; continue;
      }
      if (upper.includes('SECTION B') || upper === 'SUBJECTIVE' || upper === 'THEORY' || upper === 'ESSAY') {
        flushObjective(); flushSubjective(); currentSection = 'B';
        if (!uploadedSectionNames.includes('B')) uploadedSectionNames.push('B');
        continue;
      }
      if (upper.includes('SECTION C') || upper.includes('COMPREHENSION')) {
        flushObjective(); flushSubjective(); currentSection = 'C';
        if (!uploadedSectionNames.includes('C')) uploadedSectionNames.push('C');
        continue;
      }
      if (upper.includes('SECTION D') || upper.includes('COMPOSITION') || upper.includes('SUMMARY')) {
        flushObjective(); flushSubjective(); currentSection = 'D';
        if (!uploadedSectionNames.includes('D')) uploadedSectionNames.push('D');
        continue;
      }
      if (upper.startsWith('SECTION') || upper.startsWith('PART ') || /^[-=_*]{3,}$/.test(rawLine) || upper.startsWith('INSTRUCTIONS')) continue;

      const line = rawLine.replace(/^(\s*Q?\d+[\.\)\:]?)\s*/i, '').trim();
      if (!line) continue;

      // Objective options on separate lines: A. ..., B. ..., C. ..., D. ...
      const optionMatch = line.match(/^([A-D])\s*[\.|\)|\:]\s*(.+)$/i);
      if (optionMatch && currentSection === 'A') {
        if (!pendingObjective) pendingObjective = { question: 'Imported objective question', options: [] };
        pendingObjective.options.push(optionMatch[2].trim());
        continue;
      }

      // Correct answer line
      const answerMatch = line.match(/^(ANSWER|CORRECT ANSWER)\s*[:\-]\s*(.+)$/i);
      if (answerMatch) {
        const ansVal = answerMatch[2].trim();
        if (currentSection === 'A' && pendingObjective) pendingObjective.correctAnswer = ansVal;
        if ((currentSection === 'B' || currentSection === 'C' || currentSection === 'D') && pendingSubjective) pendingSubjective.answer = ansVal;
        continue;
      }

      // Pipe format still supported
      if (line.includes('|')) {
        const parts = line.split('|').map(p => p.trim()).filter(Boolean);
        if (currentSection === 'A' || (currentSection === 'auto' && parts.length >= 5)) {
          flushObjective();
          const q = parts[0];
          const opts = parts.slice(1, 5);
          const ans = parts[5] || parts[parts.length - 1] || opts[0];
          newObj.push({ question: q, options: opts, correctAnswer: ans });
        } else {
          flushSubjective();
          newSubj.push({ question: parts[0], answer: parts.slice(1).join(' ') || 'Accept valid NaCCA-aligned answer.', marks: 10 });
        }
        continue;
      }

      // Start of a new objective question
      if (currentSection === 'A') {
        if (pendingObjective && pendingObjective.options.length > 0) flushObjective();
        pendingObjective = { question: line, options: [] };
        continue;
      }

      // Start/append subjective question (B, C, or D)
      if (currentSection === 'B' || currentSection === 'C' || currentSection === 'D') {
        if (pendingSubjective) flushSubjective();
        pendingSubjective = { question: line, answer: '' };
        continue;
      }

      // Auto-detect fallback
      if (line.length > 15) {
        if (pendingSubjective) flushSubjective();
        pendingSubjective = { question: line, answer: '' };
      }
    }

    flushObjective();
    flushSubjective();

    if (newObj.length > 0) setCustomObjectives(prev => [...prev, ...newObj]);
    if (newSubj.length > 0) setCustomSubjectives(prev => [...prev, ...newSubj]);

    // Auto-create subjective section configs if document had Section C/D
    if (uploadedSectionNames.length > 1) {
      const newSections = uploadedSectionNames.map((label) => ({
        label,
        title: `Uploaded Section ${label}`,
        questionCount: Math.ceil(newSubj.length / uploadedSectionNames.length),
        marksPerQuestion: 10,
        totalMarks: Math.ceil(newSubj.length / uploadedSectionNames.length) * 10,
      }));
      setSubjectiveSections(newSections);
    }

    if (newObj.length + newSubj.length > 0) {
      const sectionInfo = uploadedSectionNames.length > 0 ? ` (Sections: ${uploadedSectionNames.join(', ')})` : '';
      alert(`✅ Loaded ${newObj.length} objective (Section A) + ${newSubj.length} subjective${sectionInfo} = ${newObj.length + newSubj.length} question(s) from document.`);
    } else {
      alert('⚠️ No questions detected. Use headings like SECTION A / SECTION B / SECTION C and put each question on its own line.');
    }
  };

  const handleGenerate = () => {
    if (!classLevel || !subject) return;
    const finalExamType = customExamType || examType || 'Class Test';
    const addTopics = additionalTopics.split(',').map(t => t.trim()).filter(Boolean);

    // Calculate total subjective questions and marks
    const totalSubjCount = subjectiveSections.reduce((sum, s) => sum + s.questionCount, 0);
    const totalSubjMarks = subjectiveSections.reduce((sum, s) => sum + s.totalMarks, 0);

    let litExcerptObj;
    if (subject === 'English Language' && ['Basic 7', 'Basic 8', 'Basic 9'].includes(classLevel as string)) {
      if (selectedLitIndex === 'custom' && customLitExcerpt) {
        litExcerptObj = {
          title: customLitTitle || 'Custom Literature Passage',
          excerpt: customLitExcerpt,
          questions: [
            { q: customLitQ1.q || 'What is the central message of this passage?', answer: customLitQ1.answer || 'Accept valid explanation.' },
            { q: customLitQ2.q || 'Identify a figure of speech or key element in the text.', answer: customLitQ2.answer || 'Accept valid literary device identification.' }
          ]
        };
      } else if (typeof selectedLitIndex === 'number' && selectedLitIndex >= 0 && BEACON_OF_LIGHT_EXCERPTS[selectedLitIndex]) {
        litExcerptObj = BEACON_OF_LIGHT_EXCERPTS[selectedLitIndex];
      }
    }

    const exam = generateExamPaper({
      classLevel: classLevel as ClassLevel,
      subject: subject as Subject,
      examType: finalExamType,
      difficulty,
      term,
      academicYear,
      duration,
      topics: selectedTopics,
      additionalTopics: addTopics,
      objectiveCount,
      objectiveMarks: objectiveTotalMarks,
      subjectiveCount: totalSubjCount,
      subjectiveMarks: totalSubjMarks,
      subjectiveSections: subjectiveSections.map(s => s.title),
      subjectiveInstructions,
      customObjectives,
      customSubjectives,
      literatureExcerpt: litExcerptObj,
      createdBy: user.name,
    });

    setGeneratedExam(exam);
    setStep(4);
  };

  const handleSaveExam = async () => {
    if (!generatedExam) return;
    setSaving(true);
    try {
      await saveExam({
        id: generatedExam.id,
        exam: generatedExam,
        markingScheme: generatedExam.markingScheme,
        savedAt: new Date().toISOString(),
        savedBy: user.name,
      });
      alert('Exam saved successfully! It can be accessed from "Saved Exams".');
    } catch (e) {
      alert('Failed to save exam. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateExam = (updated: ExamPaper) => {
    setGeneratedExam(updated);
  };

  if (generatedExam && step === 4) {
    return (
      <div className="animate-fade-in">
        {/* Toolbar */}
        <div className="bg-white rounded-xl p-4 mb-4 flex flex-wrap gap-3 items-center no-print border border-gray-100">
          <button onClick={() => { setStep(1); setGeneratedExam(null); }} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition">
            ← Back
          </button>
          <button onClick={handleSaveExam} disabled={saving} className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition">
            {saving ? '⏳ Saving...' : '💾 Save Exam'}
          </button>
          <button onClick={() => printElementsClean('.exam-paper')} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition">
            🖨️ Print Exam
          </button>
          <button onClick={() => setShowMarkingScheme(!showMarkingScheme)} className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition">
            {showMarkingScheme ? '📝 Show Exam' : '✅ Marking Scheme'}
          </button>
        </div>

        {showMarkingScheme ? (
          <MarkingSchemeView exam={generatedExam} />
        ) : (
          <>
            <ExamPreview exam={generatedExam} onUpdate={handleUpdateExam} />
            {/* Auto-attach graph paper when Maths + graph/statistics/data topic selected */}
            {generatedExam.subject === 'Mathematics' && 
              (selectedTopics.some(t => /graph|statistic|data|pie|chart|coordinate/i.test(t)) || additionalTopics.toLowerCase().includes('graph')) && (
              <div className="exam-paper" style={{ fontFamily: "'Times New Roman', Times, serif", pageBreakBefore: 'always' }}>
                <div style={{ textAlign: 'center', borderBottom: '2px solid #000', paddingBottom: '6px', marginBottom: '8px' }}>
                  <p style={{ fontSize: '14pt', fontWeight: 'bold', margin: 0 }}>GRAPH PAPER</p>
                  <p style={{ fontSize: '9pt', color: '#555', margin: '2px 0' }}>Use this graph paper for plotting graphs and charts.</p>
                </div>
                <svg width="100%" height="700" viewBox="0 0 680 700">
                  {Array.from({ length: 49 }).map((_, i) => (
                    <line key={`h${i}`} x1="0" y1={i * 14} x2="680" y2={i * 14} stroke={i % 5 === 0 ? '#60a5fa' : '#93c5fd'} strokeWidth={i % 5 === 0 ? 1 : 0.5} />
                  ))}
                  {Array.from({ length: 49 }).map((_, i) => (
                    <line key={`v${i}`} x1={i * 14} y1="0" x2={i * 14} y2="700" stroke={i % 5 === 0 ? '#60a5fa' : '#93c5fd'} strokeWidth={i % 5 === 0 ? 1 : 0.5} />
                  ))}
                  <line x1="340" y1="0" x2="340" y2="700" stroke="#1d4ed8" strokeWidth="2" />
                  <line x1="0" y1="350" x2="680" y2="350" stroke="#1d4ed8" strokeWidth="2" />
                  <text x="344" y="14" fontSize="10" fill="#1d4ed8" fontWeight="bold">y</text>
                  <text x="668" y="346" fontSize="10" fill="#1d4ed8" fontWeight="bold">x</text>
                  <text x="344" y="362" fontSize="9" fill="#1d4ed8">O</text>
                </svg>
              </div>
            )}
          </>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      {/* Progress Steps */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
        {['Class & Subject', 'Topics', 'Settings', 'Preview'].map((s, i) => (
          <div key={i} className="flex items-center gap-2 flex-shrink-0">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition ${
              step > i + 1 ? 'bg-green-500 text-white' : step === i + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              {step > i + 1 ? '✓' : i + 1}
            </div>
            <span className={`text-xs font-medium ${step === i + 1 ? 'text-blue-600' : 'text-gray-400'}`}>{s}</span>
            {i < 3 && <div className={`w-8 h-0.5 ${step > i + 1 ? 'bg-green-500' : 'bg-gray-200'}`} />}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl p-6 border border-gray-100">
        {/* Step 1: Class & Subject */}
        {step === 1 && (
          <div className="space-y-5">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {specialMode ? '🏆 Special Examination Setup' : '📝 Select Class & Subject'}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Class Level</label>
                <select
                  value={classLevel}
                  onChange={e => { setClassLevel(e.target.value as ClassLevel); setSubject(''); setSelectedTopics([]); }}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                >
                  <option value="">Select class...</option>
                  {availableLevels.map(l => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Subject</label>
                <select
                  value={subject}
                  onChange={e => { setSubject(e.target.value as Subject); setSelectedTopics([]); }}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                  disabled={!classLevel}
                >
                  <option value="">Select subject...</option>
                  {availableSubjects.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Exam Type</label>
                <select
                  value={examType}
                  onChange={e => setExamType(e.target.value as ExamType)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                >
                  <option value="">Select type...</option>
                  {getExamTypes().map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                  <option value="custom">Custom Type...</option>
                </select>
              </div>

              {examType === 'custom' && (
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Custom Exam Type</label>
                  <input
                    type="text"
                    value={customExamType}
                    onChange={e => setCustomExamType(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                    placeholder="Enter exam type name"
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Term</label>
                <select value={term} onChange={e => setTerm(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50">
                  <option>Term 1</option>
                  <option>Term 2</option>
                  <option>Term 3</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Academic Year</label>
                <input type="text" value={academicYear} onChange={e => setAcademicYear(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Duration</label>
                <input type="text" value={duration} onChange={e => setDuration(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50" />
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!classLevel || !subject || (!examType && !customExamType)}
              className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-xl font-medium transition"
            >
              Next: Select Topics →
            </button>
          </div>
        )}

        {/* Step 2: Topics */}
        {step === 2 && (
          <div className="space-y-5">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">📚 Select Topics</h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {availableTopics.map(topic => (
                <label key={topic} className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition ${
                  selectedTopics.includes(topic) ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
                }`}>
                  <input
                    type="checkbox"
                    checked={selectedTopics.includes(topic)}
                    onChange={e => {
                      if (e.target.checked) setSelectedTopics([...selectedTopics, topic]);
                      else setSelectedTopics(selectedTopics.filter(t => t !== topic));
                    }}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{topic}</span>
                </label>
              ))}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setSelectedTopics([...availableTopics])}
                className="px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-sm font-medium transition"
              >
                Select All
              </button>
              <button
                onClick={() => setSelectedTopics([])}
                className="px-4 py-2 bg-gray-50 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium transition"
              >
                Clear All
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Additional Topics (comma separated)</label>
              <input
                type="text"
                value={additionalTopics}
                onChange={e => setAdditionalTopics(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                placeholder="e.g., Word Problems, Graphs, Environmental Pollution"
              />
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition">
                ← Back
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={selectedTopics.length === 0 && !additionalTopics}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-xl font-medium transition"
              >
                Next: Settings →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Settings */}
        {step === 3 && (
          <div className="space-y-5">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">⚙️ Exam Settings</h3>

            {/* Difficulty Level Selector */}
            <div className="bg-yellow-50 rounded-xl p-5 border border-yellow-200">
              <h4 className="font-semibold text-yellow-800 mb-3 flex items-center gap-2">
                <span>🎯</span> Choose Examination Difficulty Level
              </h4>
              <div className="grid grid-cols-3 gap-3">
                {(['Easy', 'Medium', 'Hard'] as DifficultyLevel[]).map(lvl => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setDifficulty(lvl)}
                    className={`py-3 px-4 rounded-xl font-bold border transition ${
                      difficulty === lvl
                        ? 'bg-yellow-500 text-white border-yellow-600 shadow-md scale-[1.02]'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-yellow-400'
                    }`}
                  >
                    {lvl === 'Easy' ? '🟢 Easy' : lvl === 'Medium' ? '🟡 Medium' : '🔴 Hard'}
                  </button>
                ))}
              </div>
            </div>

            {/* Document Upload — Paste or Upload Questions from Word/Text */}
            <div className="bg-orange-50 rounded-xl p-5 border border-orange-200">
              <h4 className="font-semibold text-orange-800 mb-3 flex items-center gap-2">
                <span>📄</span> Upload / Paste Questions from Document (Word, Text)
              </h4>
              <p className="text-xs text-orange-600 mb-3">
                Paste questions from a Word document or upload a .txt file.<br/>
                Use headings like <b>SECTION A</b> or <b>OBJECTIVE</b> for MCQ questions, and <b>SECTION B</b> or <b>SUBJECTIVE</b> for essay questions.<br/>
                MCQ format: <code className="bg-orange-100 px-1 rounded text-[10px]">Question? | OptionA | OptionB | OptionC | OptionD | CorrectAnswer</code><br/>
                Subjective format: <code className="bg-orange-100 px-1 rounded text-[10px]">Question text | Answer text</code> or just <code className="bg-orange-100 px-1 rounded text-[10px]">Question text</code>
              </p>
              <div className="space-y-2">
                <textarea
                  placeholder={"SECTION A\nWhat is the capital of Ghana? | Kumasi | Accra | Tamale | Cape Coast | Accra\nWhich planet is closest to the sun? | Venus | Mercury | Earth | Mars | Mercury\n\nSECTION B\nExplain the importance of education in Ghana. | Education helps develop human capital...\nDescribe the water cycle."}
                  rows={5}
                  className="w-full px-3 py-2 border border-orange-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-orange-400"
                  onBlur={e => {
                    const text = e.target.value.trim();
                    if (!text) return;
                    parseUploadedText(text);
                    e.target.value = '';
                  }}
                />
                <div className="flex items-center gap-2">
                  <label className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-xs font-semibold cursor-pointer transition">
                    📁 Upload .txt File
                    <input
                      type="file"
                      accept=".txt,.text"
                      className="hidden"
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onload = (ev) => {
                          const text = (ev.target?.result as string || '').trim();
                          if (text) parseUploadedText(text);
                        };
                        reader.readAsText(file);
                        e.target.value = '';
                      }}
                    />
                  </label>
                  <span className="text-[10px] text-orange-500 font-semibold">{customObjectives.length} objective + {customSubjectives.length} subjective = {customObjectives.length + customSubjectives.length} question(s) loaded</span>
                </div>
              </div>
            </div>

            {/* Literature Selection for English Basic 7-9 */}
            {subject === 'English Language' && ['Basic 7', 'Basic 8', 'Basic 9'].includes(classLevel as string) && (
              <div className="bg-purple-50 rounded-xl p-5 border border-purple-200">
                <h4 className="font-semibold text-purple-800 mb-3 flex items-center gap-2">
                  <span>📚</span> Select Literature Story / Chapter ("The Beacon of Light")
                </h4>
                <div className="space-y-3">
                  <select
                    value={selectedLitIndex}
                    onChange={e => setSelectedLitIndex(e.target.value === 'custom' ? 'custom' : parseInt(e.target.value))}
                    className="w-full px-4 py-3 border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white font-medium"
                  >
                    <option value={-1}>Default / Auto-select from Question Bank</option>
                    {BEACON_OF_LIGHT_EXCERPTS.map((ex, idx) => (
                      <option key={idx} value={idx}>{ex.title}</option>
                    ))}
                    <option value="custom">✏️ Enter Custom Story Excerpt & Questions...</option>
                  </select>

                  {selectedLitIndex === 'custom' && (
                    <div className="bg-white p-4 rounded-xl border border-purple-200 space-y-3">
                      <input
                        type="text"
                        value={customLitTitle}
                        onChange={e => setCustomLitTitle(e.target.value)}
                        placeholder="Chapter Title e.g., Chapter 4: The Village Lighthouse"
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                      />
                      <textarea
                        value={customLitExcerpt}
                        onChange={e => setCustomLitExcerpt(e.target.value)}
                        placeholder="Enter the reading passage / excerpt here..."
                        rows={4}
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                      />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div className="p-2 bg-gray-50 rounded border">
                          <input
                            type="text"
                            value={customLitQ1.q}
                            onChange={e => setCustomLitQ1({ ...customLitQ1, q: e.target.value })}
                            placeholder="Question 1 (a)"
                            className="w-full px-2 py-1 border rounded text-xs mb-1"
                          />
                          <input
                            type="text"
                            value={customLitQ1.answer}
                            onChange={e => setCustomLitQ1({ ...customLitQ1, answer: e.target.value })}
                            placeholder="Exact Answer 1 (a)"
                            className="w-full px-2 py-1 border rounded text-xs text-green-700 font-medium"
                          />
                        </div>
                        <div className="p-2 bg-gray-50 rounded border">
                          <input
                            type="text"
                            value={customLitQ2.q}
                            onChange={e => setCustomLitQ2({ ...customLitQ2, q: e.target.value })}
                            placeholder="Question 2 (b)"
                            className="w-full px-2 py-1 border rounded text-xs mb-1"
                          />
                          <input
                            type="text"
                            value={customLitQ2.answer}
                            onChange={e => setCustomLitQ2({ ...customLitQ2, answer: e.target.value })}
                            placeholder="Exact Answer 2 (b)"
                            className="w-full px-2 py-1 border rounded text-xs text-green-700 font-medium"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Section A - Objective */}
            <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
              <h4 className="font-semibold text-blue-800 mb-3">📝 Section A - Objective Questions</h4>
              <div className="bg-blue-100 border border-blue-200 rounded-lg p-3 mb-3 text-xs text-blue-800">
                <strong>NaCCA Recommended Objective Count:</strong> Basic 1–3 = 30 questions, Basic 4–6 = 30 questions, Basic 7–9 = 40 questions.
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Number of Questions</label>
                  <input
                    type="number"
                    value={objectiveCount}
                    onChange={e => setObjectiveCount(parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    min="0" max="100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Marks per Question</label>
                  <input
                    type="number"
                    value={objectiveMarksPerQ}
                    onChange={e => setObjectiveMarksPerQ(parseInt(e.target.value) || 1)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    min="1" max="5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Total Marks</label>
                  <div className="px-4 py-3 bg-blue-100 rounded-xl font-semibold text-blue-800">
                    {objectiveTotalMarks} marks
                  </div>
                </div>
              </div>

              {/* Custom Objective Questions Adder */}
              <div className="mt-4 pt-4 border-t border-blue-200">
                <h5 className="text-xs font-bold text-blue-900 mb-2 uppercase tracking-wide">➕ Insert Custom Objective Question / Shape Diagram (Optional)</h5>
                {customObjectives.length > 0 && (
                  <div className="mb-3 space-y-1">
                    {customObjectives.map((co, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-white p-2 rounded border border-blue-200 text-xs">
                        <span className="font-medium truncate max-w-md">Q{idx+1}: {co.question}</span>
                        <button type="button" onClick={() => setCustomObjectives(customObjectives.filter((_, i) => i !== idx))} className="text-red-500 font-bold ml-2">✕ Remove</button>
                      </div>
                    ))}
                  </div>
                )}
                <div className="bg-white p-3 rounded-xl border border-blue-200 space-y-2 text-xs">
                  <input
                    type="text"
                    value={newObjQ}
                    onChange={e => setNewObjQ(e.target.value)}
                    placeholder="Enter custom multiple choice question..."
                    className="w-full px-3 py-1.5 border rounded-lg"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    {newObjOpts.map((opt, idx) => (
                      <input
                        key={idx}
                        type="text"
                        value={opt}
                        onChange={e => {
                          const u = [...newObjOpts];
                          u[idx] = e.target.value;
                          setNewObjOpts(u);
                        }}
                        placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                        className="px-2 py-1 border rounded"
                      />
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2 items-center">
                    <input
                      type="text"
                      value={newObjAns}
                      onChange={e => setNewObjAns(e.target.value)}
                      placeholder="Correct Answer (e.g. Option A text)"
                      className="flex-1 px-2 py-1 border rounded text-green-700 font-medium"
                    />
                    <input
                      type="text"
                      value={newObjImg}
                      onChange={e => setNewObjImg(e.target.value)}
                      placeholder="Paste Webpage Image Link / URL..."
                      className="w-48 px-2 py-1 border rounded text-xs"
                    />
                    <select
                      onChange={e => setNewObjImg(e.target.value)}
                      className="px-2 py-1 border rounded bg-gray-50 text-xs"
                    >
                      <option value="">Pick Prebuilt Diagram...</option>
                      <optgroup label="Mathematics Shapes">
                        {MATH_SHAPE_OPTIONS.map((shape, i) => (
                          <option key={i} value={shape.url}>📐 {shape.label}</option>
                        ))}
                      </optgroup>
                      {Object.entries(NACCA_DIAGRAMS).map(([subj, list]) => (
                        <optgroup key={subj} label={`NaCCA ${subj}`}>
                          {(list as {label:string;url:string}[]).map((item, i) => (
                            <option key={i} value={item.url}>📌 {item.label}</option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => {
                        if (!newObjQ) return;
                        setCustomObjectives([...customObjectives, { question: newObjQ, options: newObjOpts, correctAnswer: newObjAns || newObjOpts[0], imageUrl: newObjImg || undefined }]);
                        setNewObjQ('');
                        setNewObjOpts(['', '', '', '']);
                        setNewObjAns('');
                        setNewObjImg('');
                      }}
                      className="px-3 py-1 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700"
                    >
                      + Add Question
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Subjective Sections */}
            <div className="bg-green-50 rounded-xl p-5 border border-green-100">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-green-800">📖 Subjective Sections (B, C, D...)</h4>
                <button
                  onClick={addSection}
                  disabled={subjectiveSections.length >= 4}
                  className="px-3 py-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white rounded-lg text-sm font-medium"
                >
                  + Add Section
                </button>
              </div>

              {subject === 'English Language' && ['Basic 7', 'Basic 8', 'Basic 9'].includes(classLevel as string) && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                  <p className="text-xs text-yellow-800">
                    ✨ English Language (Basic 7-9) will automatically include: Grammar, Comprehension, Summary, and Composition sections.
                  </p>
                </div>
              )}

              {subjectiveSections.map((section, idx) => (
                <div key={idx} className="bg-white rounded-lg p-4 mb-3 border border-green-200">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-semibold text-green-700">Section {section.label}</span>
                    {subjectiveSections.length > 1 && (
                      <button
                        onClick={() => removeSection(idx)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        ✕ Remove
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Section Title</label>
                      <input
                        type="text"
                        value={section.title}
                        onChange={e => updateSection(idx, 'title', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="e.g., Theory"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">No. of Questions</label>
                      <input
                        type="number"
                        value={section.questionCount}
                        onChange={e => updateSection(idx, 'questionCount', parseInt(e.target.value) || 1)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        min="1" max="20"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Marks/Question</label>
                      <input
                        type="number"
                        value={section.marksPerQuestion}
                        onChange={e => updateSection(idx, 'marksPerQuestion', parseInt(e.target.value) || 1)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        min="1" max="25"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Total Marks</label>
                      <input
                        type="number"
                        value={section.totalMarks}
                        onChange={e => updateSection(idx, 'totalMarks', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-green-50 font-semibold"
                      />
                    </div>
                  </div>
                </div>
              ))}

              <div className="mt-4 p-3 bg-green-100 rounded-lg">
                <span className="text-sm text-green-700">Total Subjective Marks: </span>
                <span className="font-bold text-green-800">{subjectiveTotalMarks}</span>
              </div>

              {/* Custom Subjective Questions Adder */}
              <div className="mt-4 pt-4 border-t border-green-200">
                <h5 className="text-xs font-bold text-green-900 mb-2 uppercase tracking-wide">➕ Insert Custom Subjective Question / Shape Diagram (Optional)</h5>
                {customSubjectives.length > 0 && (
                  <div className="mb-3 space-y-1">
                    {customSubjectives.map((cs, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-white p-2 rounded border border-green-200 text-xs">
                        <span className="font-medium truncate max-w-md">Q{idx+1}: {cs.question} [{cs.marks}m]</span>
                        <button type="button" onClick={() => setCustomSubjectives(customSubjectives.filter((_, i) => i !== idx))} className="text-red-500 font-bold ml-2">✕ Remove</button>
                      </div>
                    ))}
                  </div>
                )}
                <div className="bg-white p-3 rounded-xl border border-green-200 space-y-2 text-xs">
                  <textarea
                    value={newSubjQ}
                    onChange={e => setNewSubjQ(e.target.value)}
                    placeholder="Enter custom subjective/essay/theory question..."
                    rows={2}
                    className="w-full px-3 py-1.5 border rounded-lg"
                  />
                  <textarea
                    value={newSubjAns}
                    onChange={e => setNewSubjAns(e.target.value)}
                    placeholder="Exact Correct Answer & Working for Marking Scheme..."
                    rows={2}
                    className="w-full px-3 py-1.5 border rounded-lg text-green-700 font-medium"
                  />
                  <div className="flex flex-wrap gap-2 items-center">
                    <div className="flex items-center gap-1">
                      <span>Marks:</span>
                      <input
                        type="number"
                        value={newSubjMarks}
                        onChange={e => setNewSubjMarks(parseInt(e.target.value) || 10)}
                        className="w-16 px-2 py-1 border rounded"
                      />
                    </div>
                    <input
                      type="text"
                      value={newSubjImg}
                      onChange={e => setNewSubjImg(e.target.value)}
                      placeholder="Paste Webpage Diagram URL..."
                      className="w-44 px-2 py-1 border rounded text-xs"
                    />
                    <select
                      onChange={e => setNewSubjImg(e.target.value)}
                      className="px-2 py-1 border rounded bg-gray-50 text-xs"
                    >
                      <option value="">Pick Prebuilt Diagram...</option>
                      <optgroup label="Mathematics Shapes">
                        {MATH_SHAPE_OPTIONS.map((shape, i) => (
                          <option key={i} value={shape.url}>📐 {shape.label}</option>
                        ))}
                      </optgroup>
                      {Object.entries(NACCA_DIAGRAMS).map(([subj, list]) => (
                        <optgroup key={subj} label={`NaCCA ${subj}`}>
                          {(list as {label:string;url:string}[]).map((item, i) => (
                            <option key={i} value={item.url}>📌 {item.label}</option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => setShowShapeModal(true)}
                      className="px-3 py-1 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 text-xs"
                    >
                      📐 Launch Custom Shape Builder...
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (!newSubjQ) return;
                        setCustomSubjectives([...customSubjectives, { question: newSubjQ, answer: newSubjAns || 'Accept valid answer.', marks: newSubjMarks, imageUrl: newSubjImg || undefined }]);
                        setNewSubjQ('');
                        setNewSubjAns('');
                        setNewSubjMarks(10);
                        setNewSubjImg('');
                      }}
                      className="ml-auto px-3 py-1 bg-green-600 text-white font-semibold rounded hover:bg-green-700"
                    >
                      + Add Subjective Question
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Section Instructions */}
            <div className="bg-purple-50 rounded-xl p-5 border border-purple-100">
              <h4 className="font-semibold text-purple-800 mb-3">📋 Section B Instructions</h4>
              <select
                value={subjectiveInstructions}
                onChange={e => setSubjectiveInstructions(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white mb-2"
              >
                <option value="">Auto-generate based on subject</option>
                <option value="Answer Question 1 (COMPULSORY) and any other THREE questions.">Answer Q1 (Compulsory) + 3 others</option>
                <option value="Answer Question 1 (COMPULSORY) and any other TWO questions.">Answer Q1 (Compulsory) + 2 others</option>
                <option value="Answer FOUR questions in total including the compulsory question.">Answer 4 questions total (incl. compulsory)</option>
                <option value="Answer the compulsory question and ONE question from each section.">Answer compulsory + 1 from each section</option>
                <option value="Answer ALL questions in this section.">Answer ALL questions</option>
                <option value="Answer any FOUR questions from this section.">Answer any 4 questions</option>
                <option value="Answer any THREE questions from this section.">Answer any 3 questions</option>
                <option value="custom">Custom instructions...</option>
              </select>
              {subjectiveInstructions === 'custom' && (
                <input
                  type="text"
                  onChange={e => setSubjectiveInstructions(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                  placeholder="Enter custom instructions..."
                />
              )}
            </div>

            {/* Summary */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <h4 className="font-medium text-gray-700 mb-3">📊 Exam Summary</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                <div className="bg-white p-3 rounded-lg border">
                  <p className="text-gray-500 text-xs">Section A</p>
                  <p className="font-bold text-blue-600">{objectiveCount} Qs</p>
                  <p className="text-xs text-gray-400">{objectiveTotalMarks} marks</p>
                </div>
                {subjectiveSections.map((s, i) => (
                  <div key={i} className="bg-white p-3 rounded-lg border">
                    <p className="text-gray-500 text-xs">Section {s.label}</p>
                    <p className="font-bold text-green-600">{s.questionCount} Qs</p>
                    <p className="text-xs text-gray-400">{s.totalMarks} marks</p>
                  </div>
                ))}
                <div className="bg-gradient-to-r from-blue-600 to-green-600 p-3 rounded-lg text-white">
                  <p className="text-xs opacity-80">Grand Total</p>
                  <p className="font-bold text-xl">{grandTotal}</p>
                  <p className="text-xs opacity-80">marks</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(2)} className="px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition">
                ← Back
              </button>
              <button
                onClick={handleGenerate}
                className="px-6 py-3 text-white rounded-xl font-medium transition hover:shadow-lg"
                style={{ background: 'linear-gradient(135deg, #1a237e, #3949ab)' }}
              >
                🚀 Generate Exam
              </button>
            </div>
          </div>
        )}
      </div>

      {showShapeModal && (
        <CustomShapeBuilderModal
          onClose={() => setShowShapeModal(false)}
          onInsert={(res: CustomShapeResult) => {
            setCustomSubjectives([...customSubjectives, {
              question: res.suggestedQuestion,
              answer: res.suggestedAnswer,
              marks: res.suggestedMarks,
              imageUrl: res.svgDataUrl,
              subQuestions: res.subQuestions
            }]);
            setShowShapeModal(false);
          }}
        />
      )}
    </div>
  );
}
