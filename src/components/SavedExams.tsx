import { useState, useEffect } from 'react';
import type { User, ExamPaper, SavedExam } from '../types';
import { getSavedExams, deleteExam, updateExam, onExamsChange } from '../store';
import { CLASS_LEVELS, EARLY_CHILDHOOD_LEVELS } from '../data/constants';
import ExamPreview from './ExamPreview';
import MarkingSchemeView from './MarkingSchemeView';
import { printElementsClean } from '../utils/printDocument';

interface Props {
  user: User;
}

export default function SavedExams({ user: _user }: Props) {
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedTerm, setSelectedTerm] = useState('all');
  const [selectedExamType, setSelectedExamType] = useState('all');
  const [searchText, setSearchText] = useState('');
  const [viewingExam, setViewingExam] = useState<SavedExam | null>(null);
  const [showMarking, setShowMarking] = useState(false);
  const [allExams, setAllExams] = useState<SavedExam[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadExams();
    const unsub = onExamsChange((exams) => setAllExams(exams));
    return unsub;
  }, []);

  const loadExams = async () => {
    setLoading(true);
    try { setAllExams(await getSavedExams()); } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const filteredExams = allExams.filter(e => {
    if (selectedClass !== 'all' && e.exam.classLevel !== selectedClass) return false;
    if (selectedSubject !== 'all' && e.exam.subject !== selectedSubject) return false;
    if (selectedTerm !== 'all' && e.exam.term !== selectedTerm) return false;
    if (selectedExamType !== 'all' && e.exam.examType !== selectedExamType) return false;
    if (searchText) {
      const s = searchText.toLowerCase();
      return e.exam.subject.toLowerCase().includes(s) || e.exam.classLevel.toLowerCase().includes(s) || e.exam.examType.toLowerCase().includes(s) || e.savedBy.toLowerCase().includes(s);
    }
    return true;
  });

  const uniqueSubjects = Array.from(new Set(allExams.map(e => e.exam.subject)));
  const uniqueTerms = Array.from(new Set(allExams.map(e => e.exam.term)));
  const uniqueExamTypes = Array.from(new Set(allExams.map(e => e.exam.examType)));

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this exam?')) { await deleteExam(id); await loadExams(); }
  };

  const handleUpdateExam = async (updated: ExamPaper) => {
    if (viewingExam) {
      const updatedSaved: SavedExam = { ...viewingExam, exam: updated, markingScheme: updated.markingScheme };
      setViewingExam(updatedSaved);
      await updateExam(viewingExam.id, updated, updated.markingScheme);
    }
  };

  const handleExportPdf = () => {
    printElementsClean('.exam-paper');
  };

  if (viewingExam) {
    return (
      <div className="animate-fade-in">
        <div className="bg-white rounded-xl p-4 mb-4 flex flex-wrap gap-3 items-center no-print border border-gray-100">
          <button onClick={() => { setViewingExam(null); setShowMarking(false); }} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition">← Back</button>
          <button onClick={handleExportPdf} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition">🖨️ Print / Export PDF</button>
          <button onClick={() => setShowMarking(!showMarking)} className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition">
            {showMarking ? '📝 Show Exam' : '✅ Marking Scheme'}
          </button>
        </div>
        {showMarking ? <MarkingSchemeView exam={viewingExam.exam} /> : <ExamPreview exam={viewingExam.exam} onUpdate={handleUpdateExam} />}
      </div>
    );
  }

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="text-center"><div className="text-4xl mb-4 animate-pulse">📚</div><p className="text-gray-500">Loading saved exams...</p></div></div>;
  }

  return (
    <div className="animate-fade-in">
      {/* Search & Filter Bar */}
      <div className="bg-white rounded-xl p-4 mb-4 border border-gray-100 space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="text"
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            placeholder="🔍 Search by subject, class, exam type, teacher..."
            className="flex-1 min-w-48 px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button onClick={loadExams} className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm">🔄</button>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)} className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs">
            <option value="all">All Classes</option>
            {CLASS_LEVELS.filter(l => !EARLY_CHILDHOOD_LEVELS.includes(l)).map(l => <option key={l} value={l}>{l}</option>)}
          </select>
          <select value={selectedSubject} onChange={e => setSelectedSubject(e.target.value)} className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs">
            <option value="all">All Subjects</option>
            {uniqueSubjects.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={selectedTerm} onChange={e => setSelectedTerm(e.target.value)} className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs">
            <option value="all">All Terms</option>
            {uniqueTerms.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <select value={selectedExamType} onChange={e => setSelectedExamType(e.target.value)} className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs">
            <option value="all">All Exam Types</option>
            {uniqueExamTypes.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <span className="text-xs text-gray-400 ml-auto">{filteredExams.length} result(s)</span>
        </div>
      </div>

      {filteredExams.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center border border-gray-100">
          <span className="text-5xl block mb-4">📂</span>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No Saved Exams</h3>
          <p className="text-sm text-gray-500">Generate and save exams to see them here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredExams.map(exam => (
            <div key={exam.id} className="bg-white rounded-xl p-5 border border-gray-100 hover:shadow-md transition">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-gray-800">{exam.exam.subject}</h4>
                  <p className="text-xs text-gray-500">{exam.exam.classLevel} • {exam.exam.examType}</p>
                </div>
                <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full">{exam.exam.term}</span>
              </div>
              <div className="text-xs text-gray-400 mb-3">
                <p>By: {exam.savedBy} • {new Date(exam.savedAt).toLocaleDateString()}</p>
                <p>Marks: {exam.exam.totalMarks} • {exam.exam.difficulty || 'Medium'}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setViewingExam(exam)} className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-xs font-medium transition">👁️ View</button>
                <button onClick={() => { setViewingExam(exam); setShowMarking(true); }} className="flex-1 px-3 py-2 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg text-xs font-medium transition">✅ Marking</button>
                <button onClick={() => handleDelete(exam.id)} className="px-3 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-xs font-medium transition">🗑️</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
