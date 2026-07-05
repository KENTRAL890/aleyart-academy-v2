import { useState } from 'react';
import type { ClassLevel, Subject } from '../types';
import { CLASS_LEVELS, SUBJECTS_BY_LEVEL, EARLY_CHILDHOOD_LEVELS } from '../data/constants';

export default function OMRGenerator() {
  const [classLevel, setClassLevel] = useState<ClassLevel | ''>('');
  const [subject, setSubject] = useState<Subject | ''>('');
  const [questionCount, setQuestionCount] = useState(40);
  const [generated, setGenerated] = useState(false);

  const subjects = classLevel ? (SUBJECTS_BY_LEVEL[classLevel] || []) : [];

  const handleGenerate = () => {
    if (!classLevel || !subject) return;
    setGenerated(true);
  };

  // Split questions into columns for proper BECE layout
  const getColumns = () => {
    const cols = questionCount > 50 ? 3 : 2;
    const perCol = Math.ceil(questionCount / cols);
    const columns: number[][] = [];
    for (let c = 0; c < cols; c++) {
      const start = c * perCol;
      const end = Math.min(start + perCol, questionCount);
      const col: number[] = [];
      for (let i = start; i < end; i++) col.push(i + 1);
      columns.push(col);
    }
    return columns;
  };

  if (generated) {
    const columns = getColumns();

    return (
      <div className="animate-fade-in">
        <div className="bg-white rounded-xl p-4 mb-4 flex flex-wrap gap-3 items-center no-print border border-gray-100">
          <button onClick={() => setGenerated(false)} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition">
            ← Back
          </button>
          <button onClick={() => { document.title = ' '; window.print(); }} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition">
            🖨️ Print OMR Sheet
          </button>
        </div>

        {/* BECE-STYLE OMR SHEET — Standard A4: 210mm × 297mm */}
        <div style={{
          width: '210mm', minHeight: '297mm', padding: '10mm 12mm',
          background: 'white', margin: '0 auto', boxSizing: 'border-box',
          fontFamily: 'Arial, Helvetica, sans-serif', fontSize: '11px',
          boxShadow: '0 0 12px rgba(0,0,0,0.1)', position: 'relative',
        }}>
          {/* Top Header */}
          <div style={{ borderBottom: '3px solid #000', paddingBottom: '8px', marginBottom: '10px', textAlign: 'center' }}>
            <p style={{ fontSize: '18px', fontWeight: 900, letterSpacing: '3px', margin: '0 0 2px 0' }}>ALEYART ACADEMY</p>
            <p style={{ fontSize: '9px', fontStyle: 'italic', color: '#555', margin: '0 0 4px 0' }}>Motto: Seeking Wisdom</p>
            <p style={{ fontSize: '13px', fontWeight: 700, margin: '0 0 4px 0' }}>OBJECTIVE TEST — OMR ANSWER SHEET</p>
            <p style={{ fontSize: '9px', color: '#555', margin: 0 }}>Standard A4 (210 mm × 297 mm) — BECE Box-Shading Format</p>
          </div>

          {/* Student Info */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 20px', fontSize: '11px', marginBottom: '8px', borderBottom: '1px solid #000', paddingBottom: '8px' }}>
            <p style={{ margin: 0 }}><strong>SUBJECT:</strong> {(subject as string).toUpperCase()}</p>
            <p style={{ margin: 0 }}><strong>CLASS:</strong> {(classLevel as string).toUpperCase()}</p>
            <p style={{ margin: 0 }}><strong>STUDENT NAME:</strong> ________________________________________</p>
            <p style={{ margin: 0 }}><strong>INDEX NO:</strong> _________________ <strong>DATE:</strong> ____________</p>
          </div>

          {/* Instructions Box */}
          <div style={{ border: '2px solid #000', padding: '6px 10px', marginBottom: '10px', fontSize: '10px' }}>
            <p style={{ fontWeight: 900, marginBottom: '3px', textDecoration: 'underline' }}>INSTRUCTIONS TO CANDIDATES:</p>
            <table style={{ width: '100%' }}><tbody><tr>
              <td style={{ verticalAlign: 'top', width: '60%' }}>
                <p style={{ margin: '1px 0' }}>1. Use a <b>2B pencil</b> ONLY.</p>
                <p style={{ margin: '1px 0' }}>2. Shade the box <b>completely and horizontally</b> for your chosen answer.</p>
                <p style={{ margin: '1px 0' }}>3. Erase completely to change an answer. Do NOT fold this sheet.</p>
              </td>
              <td style={{ verticalAlign: 'top', paddingLeft: '12px', borderLeft: '1px solid #999' }}>
                <p style={{ fontWeight: 700, marginBottom: '2px' }}>EXAMPLE:</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ color: 'green', fontWeight: 900, fontSize: '9px' }}>RIGHT ✓</span>
                  <span style={{ display: 'inline-block', width: '28px', height: '14px', background: '#000', border: '1px solid #000', textAlign: 'center', color: '#fff', fontSize: '9px', fontWeight: 900, lineHeight: '14px' }}>A</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                  <span style={{ color: 'red', fontWeight: 900, fontSize: '9px' }}>WRONG ✗</span>
                  <span style={{ display: 'inline-block', width: '28px', height: '14px', background: '#fff', border: '1px solid #000', textAlign: 'center', fontSize: '9px', lineHeight: '14px' }}>✔</span>
                  <span style={{ display: 'inline-block', width: '28px', height: '14px', background: '#fff', border: '1px solid #000', textAlign: 'center', fontSize: '9px', lineHeight: '14px' }}>•</span>
                </div>
              </td>
            </tr></tbody></table>
          </div>

          {/* Answer Grid — BECE Column Layout */}
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${columns.length}, 1fr)`, gap: '0 16px', borderTop: '2px solid #000', paddingTop: '6px' }}>
            {columns.map((col, cIdx) => (
              <div key={cIdx} style={{ borderRight: cIdx < columns.length - 1 ? '1px solid #999' : 'none', paddingRight: cIdx < columns.length - 1 ? '12px' : '0' }}>
                {/* Column Header */}
                <div style={{ display: 'grid', gridTemplateColumns: '24px 1fr', gap: '0', marginBottom: '3px', borderBottom: '1px solid #000', paddingBottom: '2px' }}>
                  <span style={{ fontWeight: 900, fontSize: '9px' }}>No.</span>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', textAlign: 'center' }}>
                    {['A', 'B', 'C', 'D'].map(l => (
                      <span key={l} style={{ fontWeight: 900, fontSize: '9px' }}>{l}</span>
                    ))}
                  </div>
                </div>

                {/* Question Rows */}
                {col.map(qNum => (
                  <div key={qNum} style={{
                    display: 'grid', gridTemplateColumns: '24px 1fr', gap: '0',
                    borderBottom: '1px solid #e5e7eb', paddingBottom: '1px', marginBottom: '1px',
                  }}>
                    <span style={{ fontWeight: 800, fontSize: '10px', textAlign: 'right', paddingRight: '4px', fontFamily: 'monospace' }}>{qNum}.</span>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '3px' }}>
                      {['A', 'B', 'C', 'D'].map(letter => (
                        <div key={letter} style={{
                          border: '1.5px solid #000', height: '14px',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '8px', fontWeight: 700, fontFamily: 'monospace',
                          background: '#fff',
                        }}>
                          [{letter}]
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Footer */}
          <div style={{ position: 'absolute', bottom: '10mm', left: '12mm', right: '12mm', borderTop: '2px solid #000', paddingTop: '6px', textAlign: 'center' }}>
            <p style={{ fontSize: '9px', fontWeight: 700, color: '#555' }}>DO NOT MAKE ANY STRAY MARKS ON THIS SHEET</p>
            <div style={{ border: '1px dashed #999', height: '28px', marginTop: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '8px', color: '#aaa', fontFamily: 'monospace' }}>
              [ OFFICIAL MARKING / SCANNER ZONE ]
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto animate-fade-in">
      <div className="bg-white rounded-xl p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">📋 Generate BECE-Style OMR Answer Sheet</h3>
        
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
            <label className="block text-sm font-medium text-gray-600 mb-2">Number of Questions</label>
            <input
              type="number"
              value={questionCount}
              onChange={e => setQuestionCount(parseInt(e.target.value) || 20)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
              min="10" max="100"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={!classLevel || !subject}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-xl font-medium transition"
          >
            📋 Generate BECE OMR Sheet
          </button>
        </div>
      </div>
    </div>
  );
}
