import { useState } from 'react';
import type { ClassLevel, Subject } from '../types';
import { CLASS_LEVELS, SUBJECTS_BY_LEVEL, EARLY_CHILDHOOD_LEVELS } from '../data/constants';

export default function AnswerBookletGen() {
  const [classLevel, setClassLevel] = useState<ClassLevel | ''>('');
  const [subject, setSubject] = useState<Subject | ''>('');
  const [examType, setExamType] = useState('End of Term Examination');
  const [pageCount, setPageCount] = useState(8);
  const [hasMargin, setHasMargin] = useState(true);
  const [hasLines, setHasLines] = useState(true);
  const [generated, setGenerated] = useState(false);

  const subjects = classLevel ? (SUBJECTS_BY_LEVEL[classLevel] || []) : [];

  const handleGenerate = () => {
    if (!classLevel || !subject) return;
    setGenerated(true);
  };

  if (generated) {
    return (
      <div className="animate-fade-in">
        <div className="bg-white rounded-xl p-4 mb-4 flex flex-wrap gap-3 items-center no-print border border-gray-100">
          <button onClick={() => setGenerated(false)} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition">
            ← Back
          </button>
          <button onClick={() => { document.title = ' '; window.print(); }} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition">
            🖨️ Print Answer Booklet
          </button>
        </div>

        {/* Answer Booklet Pages — BECE Style A4 */}
        {Array.from({ length: pageCount }).map((_, pageIdx) => (
          <div key={pageIdx} style={{
            width: '210mm', minHeight: '297mm', padding: '12mm 15mm',
            background: 'white', margin: '0 auto 8px auto', boxSizing: 'border-box',
            fontFamily: "'Times New Roman', Times, serif", fontSize: '12px',
            boxShadow: '0 0 10px rgba(0,0,0,0.08)', position: 'relative',
            pageBreakAfter: 'always',
          }}>
            {pageIdx === 0 ? (
              <>
                {/* Cover Page — BECE Style */}
                <div style={{ border: '3px solid #000', padding: '20px', marginBottom: '15px' }}>
                  <div style={{ textAlign: 'center', borderBottom: '2px solid #000', paddingBottom: '12px', marginBottom: '15px' }}>
                    <p style={{ fontSize: '20px', fontWeight: 900, letterSpacing: '2px', margin: '0 0 2px 0' }}>ALEYART ACADEMY</p>
                    <p style={{ fontSize: '10px', fontStyle: 'italic', color: '#555', margin: '0 0 4px 0' }}>Motto: Seeking Wisdom</p>
                    <p style={{ fontSize: '14px', fontWeight: 700, margin: '0 0 2px 0' }}>ANSWER BOOKLET</p>
                    <p style={{ fontSize: '10px', color: '#666', margin: 0 }}>Standard A4 (210 mm × 297 mm) — BECE Format</p>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 20px', fontSize: '12px', marginBottom: '12px' }}>
                    <p style={{ margin: '4px 0' }}><strong>Subject:</strong> {subject}</p>
                    <p style={{ margin: '4px 0' }}><strong>Class:</strong> {classLevel}</p>
                    <p style={{ margin: '4px 0' }}><strong>Exam Type:</strong> {examType}</p>
                    <p style={{ margin: '4px 0' }}><strong>Date:</strong> _______________________</p>
                  </div>

                  <div style={{ borderTop: '1px solid #000', paddingTop: '10px', fontSize: '12px' }}>
                    <p style={{ margin: '6px 0' }}><strong>Student Full Name:</strong> _____________________________________________</p>
                    <p style={{ margin: '6px 0' }}><strong>Index Number:</strong> ______________________</p>
                    <p style={{ margin: '6px 0' }}><strong>Signature:</strong> ___________________________</p>
                  </div>
                </div>

                {/* Instructions */}
                <div style={{ border: '2px solid #000', padding: '8px 12px', marginBottom: '15px', fontSize: '11px' }}>
                  <p style={{ fontWeight: 900, textDecoration: 'underline', marginBottom: '4px' }}>INSTRUCTIONS TO CANDIDATES:</p>
                  <ul style={{ margin: 0, paddingLeft: '18px' }}>
                    <li style={{ marginBottom: '2px' }}>Write your answers neatly and clearly in this booklet.</li>
                    <li style={{ marginBottom: '2px' }}>Start each new question on a fresh line.</li>
                    <li style={{ marginBottom: '2px' }}>Do NOT tear any pages from this booklet.</li>
                    <li style={{ marginBottom: '2px' }}>Show all working clearly where required.</li>
                    <li>This booklet contains {pageCount} pages. Check that all pages are present.</li>
                  </ul>
                </div>

                {/* First page writing area */}
                <div style={{
                  marginLeft: hasMargin ? '45px' : '0',
                  borderLeft: hasMargin ? '2px solid #dc2626' : 'none',
                  paddingLeft: hasMargin ? '12px' : '0',
                  minHeight: '300px',
                }}>
                  {hasLines && Array.from({ length: 16 }).map((_, lineIdx) => (
                    <div key={lineIdx} style={{ borderBottom: '1px solid #93c5fd', height: '24px' }} />
                  ))}
                </div>
              </>
            ) : (
              <>
                {/* Subsequent Pages — BECE Style */}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', borderBottom: '1px solid #000', paddingBottom: '4px', marginBottom: '8px', color: '#555' }}>
                  <span style={{ fontWeight: 700 }}>{subject} — {classLevel}</span>
                  <span>Page {pageIdx + 1} of {pageCount}</span>
                </div>

                <div style={{
                  marginLeft: hasMargin ? '45px' : '0',
                  borderLeft: hasMargin ? '2px solid #dc2626' : 'none',
                  paddingLeft: hasMargin ? '12px' : '0',
                  minHeight: '700px',
                }}>
                  {hasLines && Array.from({ length: 30 }).map((_, lineIdx) => (
                    <div key={lineIdx} style={{ borderBottom: '1px solid #93c5fd', height: '24px' }} />
                  ))}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto animate-fade-in">
      <div className="bg-white rounded-xl p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">📖 Generate BECE-Style Answer Booklet</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Class Level</label>
            <select
              value={classLevel}
              onChange={e => { setClassLevel(e.target.value as ClassLevel); setSubject(''); }}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
            >
              <option value="">Select class...</option>
              {CLASS_LEVELS.filter(l => !EARLY_CHILDHOOD_LEVELS.includes(l)).map(l => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Subject</label>
            <select
              value={subject}
              onChange={e => setSubject(e.target.value as Subject)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
              disabled={!classLevel}
            >
              <option value="">Select subject...</option>
              {subjects.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Exam Type</label>
            <input
              type="text"
              value={examType}
              onChange={e => setExamType(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Number of Pages</label>
            <input
              type="number"
              value={pageCount}
              onChange={e => setPageCount(parseInt(e.target.value) || 4)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
              min="2" max="20"
            />
          </div>

          <div className="flex gap-6">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={hasMargin} onChange={e => setHasMargin(e.target.checked)} className="w-4 h-4 rounded" />
              <span className="text-sm text-gray-600">Red Margin Line</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={hasLines} onChange={e => setHasLines(e.target.checked)} className="w-4 h-4 rounded" />
              <span className="text-sm text-gray-600">Ruled Lines</span>
            </label>
          </div>

          <button
            onClick={handleGenerate}
            disabled={!classLevel || !subject}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-xl font-medium transition"
          >
            📖 Generate BECE Answer Booklet
          </button>
        </div>
      </div>
    </div>
  );
}
