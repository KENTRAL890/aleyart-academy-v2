import { useEffect, useState } from 'react';
import type { ClassLevel, Subject } from '../types';
import { CLASS_LEVELS, SUBJECTS_BY_LEVEL, EARLY_CHILDHOOD_LEVELS } from '../data/constants';
import { printElementsClean } from '../utils/printDocument';

export default function OMRGenerator() {
  const [classLevel, setClassLevel] = useState<ClassLevel | ''>('');
  const [subject, setSubject] = useState<Subject | ''>('');
  const [questionCount, setQuestionCount] = useState(40);
  const [halfSheet, setHalfSheet] = useState(false);
  const [generated, setGenerated] = useState(false);

  const subjects = classLevel ? (SUBJECTS_BY_LEVEL[classLevel] || []) : [];

  // Auto-set class-based default number of questions
  useEffect(() => {
    if (!classLevel) return;
    if (['Basic 1', 'Basic 2', 'Basic 3'].includes(classLevel)) {
      setQuestionCount(30);
    } else if (['Basic 4', 'Basic 5', 'Basic 6'].includes(classLevel)) {
      setQuestionCount(30);
    } else if (['Basic 7', 'Basic 8', 'Basic 9'].includes(classLevel)) {
      setQuestionCount(40);
    }
  }, [classLevel]);

  const handleGenerate = () => {
    if (!classLevel || !subject) return;
    setGenerated(true);
  };

  const getColumns = (compact = false) => {
    const cols = compact ? 2 : questionCount > 50 ? 3 : 2;
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

  const renderOmrPanel = (compact = false, copyLabel?: string) => {
    const columns = getColumns(compact);
    const panelHeight = compact ? '148.5mm' : '297mm';
    const leftPad = compact ? '10mm' : '25mm';
    const rightPad = compact ? '10mm' : '15mm';
    const topPad = compact ? '8mm' : '15mm';
    const bottomPad = compact ? '8mm' : '15mm';
    const schoolFont = compact ? '13pt' : '16pt';
    const titleFont = compact ? '11pt' : '14pt';
    const infoFont = compact ? '9pt' : '11pt';
    const questionFont = compact ? '8pt' : '9pt';
    const instructionFont = compact ? '7.5pt' : '9pt';
    const boxHeight = compact ? '11px' : '12px';
    const boxWidth = compact ? '22px' : '26px';
    const contentWidth = compact ? '100%' : '17cm';

    return (
      <div
        style={{
          width: '210mm',
          height: panelHeight,
          paddingTop: topPad,
          paddingBottom: bottomPad,
          paddingLeft: leftPad,
          paddingRight: rightPad,
          background: 'white',
          boxSizing: 'border-box',
          fontFamily: "'Times New Roman', Times, serif",
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: compact ? '3px' : '4px' }}>
          <p style={{ fontSize: schoolFont, fontWeight: 'bold', letterSpacing: '2px', margin: 0 }}>ALEYART ACADEMY</p>
          <p style={{ fontSize: compact ? '7pt' : '9pt', fontStyle: 'italic', color: '#555', margin: '1px 0 0 0' }}>Motto: Seeking Wisdom</p>
          <p style={{ fontSize: titleFont, fontWeight: 'bold', margin: compact ? '3px 0 0 0' : '4px 0 0 0' }}>OBJECTIVE ANSWER SHEET</p>
          {copyLabel && <p style={{ fontSize: '7pt', fontWeight: 'bold', color: '#555', margin: '1px 0 0 0' }}>{copyLabel}</p>}
        </div>

        {/* Candidate Information */}
        <div style={{ border: '2px solid #000', padding: compact ? '5px 8px' : '8px 12px', marginBottom: compact ? '5px' : '8px', fontSize: infoFont, minHeight: compact ? '2.8cm' : '4cm' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: compact ? '3px 10px' : '6px 20px' }}>
            <p style={{ margin: '2px 0' }}><strong>SUBJECT:</strong> {(subject as string).toUpperCase()}</p>
            <p style={{ margin: '2px 0' }}><strong>CLASS:</strong> {(classLevel as string).toUpperCase()}</p>
            <p style={{ margin: '2px 0' }}><strong>FULL NAME:</strong> ____________________________</p>
            <p style={{ margin: '2px 0' }}><strong>INDEX NO:</strong> ________________</p>
            <p style={{ margin: '2px 0' }}><strong>DATE:</strong> ________________</p>
            <p style={{ margin: '2px 0' }}><strong>SIGNATURE:</strong> ________________</p>
          </div>
        </div>

        {/* Instructions */}
        <div style={{ border: '2px solid #000', padding: compact ? '4px 8px' : '6px 10px', marginBottom: compact ? '6px' : '10px', fontSize: instructionFont, minHeight: compact ? '2.2cm' : '3cm' }}>
          <p style={{ fontWeight: 'bold', marginBottom: '3px', textDecoration: 'underline', fontSize: compact ? '8pt' : '10pt' }}>INSTRUCTIONS TO CANDIDATES:</p>
          <table style={{ width: '100%' }}><tbody><tr>
            <td style={{ verticalAlign: 'top', width: '62%', paddingRight: compact ? '6px' : '10px' }}>
              <p style={{ margin: '1px 0' }}>1. Use a <b>2B pencil</b> ONLY.</p>
              <p style={{ margin: '1px 0' }}>2. Shade the box <b>completely and horizontally</b>.</p>
              <p style={{ margin: '1px 0' }}>3. Erase completely to change an answer.</p>
              <p style={{ margin: '1px 0' }}>4. Do NOT fold or make stray marks.</p>
            </td>
            <td style={{ verticalAlign: 'top', borderLeft: '1px solid #999', paddingLeft: compact ? '6px' : '10px' }}>
              <p style={{ fontWeight: 'bold', marginBottom: '2px' }}>SHADING:</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                <span style={{ color: 'green', fontWeight: 'bold', fontSize: compact ? '6.5pt' : '8pt' }}>RIGHT ✓</span>
                <span style={{ display: 'inline-block', width: boxWidth, height: boxHeight, background: '#000', border: '1px solid #000', textAlign: 'center', color: '#fff', fontSize: compact ? '6.5pt' : '8pt', fontWeight: 'bold', lineHeight: boxHeight }}>A</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ color: 'red', fontWeight: 'bold', fontSize: compact ? '6.5pt' : '8pt' }}>WRONG ✗</span>
                <span style={{ display: 'inline-block', width: boxWidth, height: boxHeight, background: '#fff', border: '1px solid #000', textAlign: 'center', fontSize: compact ? '6.5pt' : '8pt', lineHeight: boxHeight }}>✔</span>
                <span style={{ display: 'inline-block', width: boxWidth, height: boxHeight, background: '#fff', border: '1px solid #000', textAlign: 'center', fontSize: compact ? '6.5pt' : '8pt', lineHeight: boxHeight }}>•</span>
              </div>
            </td>
          </tr></tbody></table>
        </div>

        {/* Answer Grid */}
        <div style={{ width: contentWidth, maxHeight: compact ? '8.5cm' : '26cm', borderTop: '2px solid #000', paddingTop: '4px', display: 'grid', gridTemplateColumns: `repeat(${columns.length}, 1fr)`, gap: '0 10px', fontSize: questionFont }}>
          {columns.map((col, cIdx) => (
            <div key={cIdx} style={{ borderRight: cIdx < columns.length - 1 ? '1px solid #999' : 'none', paddingRight: cIdx < columns.length - 1 ? '8px' : '0' }}>
              <div style={{ display: 'grid', gridTemplateColumns: compact ? '18px 1fr' : '22px 1fr', marginBottom: '2px', borderBottom: '1.5px solid #000', paddingBottom: '2px' }}>
                <span style={{ fontWeight: 'bold', fontSize: compact ? '7pt' : '8pt' }}>No.</span>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', textAlign: 'center' }}>
                  {['A', 'B', 'C', 'D'].map(l => <span key={l} style={{ fontWeight: 'bold', fontSize: compact ? '7pt' : '8pt' }}>{l}</span>)}
                </div>
              </div>

              {col.map(qNum => (
                <div key={qNum} style={{ display: 'grid', gridTemplateColumns: compact ? '18px 1fr' : '22px 1fr', borderBottom: '0.5px solid #e5e7eb', paddingBottom: '1px', marginBottom: '1px', lineHeight: 1 }}>
                  <span style={{ fontWeight: 'bold', fontSize: questionFont, textAlign: 'right', paddingRight: '4px', fontFamily: 'monospace' }}>{qNum}.</span>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2px' }}>
                    {['A', 'B', 'C', 'D'].map(letter => (
                      <div key={letter} style={{ border: '1.5px solid #000', height: boxHeight, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: compact ? '6.5pt' : '7pt', fontWeight: 'bold', fontFamily: "'Times New Roman', serif", background: '#fff' }}>
                        [{letter}]
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div style={{ position: 'absolute', bottom: compact ? '8mm' : '15mm', left: leftPad, right: rightPad }} />
      </div>
    );
  };

  if (generated) {
    return (
      <div className="animate-fade-in">
        <div className="bg-white rounded-xl p-4 mb-4 flex flex-wrap gap-3 items-center no-print border border-gray-100">
          <button onClick={() => setGenerated(false)} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition">← Back</button>
          <button onClick={() => printElementsClean('.omr-sheet-page')} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition">🖨️ Print OMR Sheet</button>
        </div>

        {halfSheet ? (
          <div className="omr-sheet-page" style={{ width: '210mm', height: '297mm', background: 'white', margin: '0 auto', boxShadow: '0 0 12px rgba(0,0,0,0.1)', boxSizing: 'border-box', position: 'relative' }}>
            {renderOmrPanel(true, 'COPY 1')}
            <div style={{ position: 'absolute', top: '148.5mm', left: 0, right: 0, textAlign: 'center', zIndex: 2 }}>
              <span style={{ background: 'white', padding: '0 10px', fontSize: '7pt', color: '#cbd5e1', position: 'relative', top: '-7px' }}>CUT / FOLD HERE</span>
            </div>
            <div style={{ position: 'absolute', top: '148.5mm', left: 0, right: 0 }}>
              {renderOmrPanel(true, 'COPY 2')}
            </div>
          </div>
        ) : (
          <div className="omr-sheet-page" style={{ width: '210mm', minHeight: '297mm', background: 'white', margin: '0 auto', boxShadow: '0 0 12px rgba(0,0,0,0.1)', boxSizing: 'border-box' }}>
            {renderOmrPanel(false)}
          </div>
        )}
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
            <select value={classLevel} onChange={e => { setClassLevel(e.target.value as ClassLevel); setSubject(''); }} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50">
              <option value="">Select class...</option>
              {CLASS_LEVELS.filter(l => !EARLY_CHILDHOOD_LEVELS.includes(l)).map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Subject</label>
            <select value={subject} onChange={e => setSubject(e.target.value as Subject)} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50" disabled={!classLevel}>
              <option value="">Select subject...</option>
              {subjects.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Number of Questions</label>
            <input type="number" value={questionCount} onChange={e => setQuestionCount(parseInt(e.target.value) || 20)} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50" min="10" max="100" />
          </div>
          <label className="flex items-center gap-3 bg-blue-50 p-3 rounded-xl border border-blue-200 cursor-pointer">
            <input type="checkbox" checked={halfSheet} onChange={e => setHalfSheet(e.target.checked)} className="w-5 h-5 rounded" />
            <div>
              <span className="text-sm font-semibold text-blue-800">✂️ Divide into 2 Equal Parts</span>
              <p className="text-xs text-blue-600">Prints 2 copies on one A4 sheet. Each copy becomes 210 mm × 148.5 mm after folding/cutting.</p>
            </div>
          </label>
          <button onClick={handleGenerate} disabled={!classLevel || !subject} className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-xl font-medium transition">📋 Generate BECE OMR Sheet</button>
        </div>
      </div>
    </div>
  );
}
