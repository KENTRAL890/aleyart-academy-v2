import { useState } from 'react';
import type { ExamPaper, Question, SubQuestion, DiagramLabel } from '../types';
import { MATH_SHAPE_OPTIONS, NACCA_DIAGRAMS } from '../data/constants';
import MathFormattedText from './MathFormattedText';
import CustomShapeBuilderModal, { CustomShapeResult } from './CustomShapeBuilderModal';

interface Props {
  exam: ExamPaper;
  onUpdate: (exam: ExamPaper) => void;
}

export default function ExamPreview({ exam, onUpdate }: Props) {
  const [editingQuestion, setEditingQuestion] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [editAnswer, setEditAnswer] = useState('');
  const [editOptions, setEditOptions] = useState<string[]>([]);
  const [editSubQuestions, setEditSubQuestions] = useState<SubQuestion[]>([]);
  const [editMarks, setEditMarks] = useState(0);
  const [editImageUrl, setEditImageUrl] = useState('');
  const [editDiagramLabels, setEditDiagramLabels] = useState<DiagramLabel[]>([]);
  const [showShapeModal, setShowShapeModal] = useState(false);

  const isBasic1to3 = ['Basic 1', 'Basic 2', 'Basic 3'].includes(exam.classLevel);
  const isBasic1to9 = !['Creche', 'N1', 'N2', 'KG1', 'KG2'].includes(exam.classLevel);
  const isB6toB9 = ['Basic 6', 'Basic 7', 'Basic 8', 'Basic 9'].includes(exam.classLevel);
  void isB6toB9;

  const startEdit = (q: Question) => {
    setEditingQuestion(q.id);
    setEditText(q.question);
    setEditAnswer(q.correctAnswer);
    setEditOptions(q.options ? [...q.options] : []);
    setEditSubQuestions(q.subQuestions ? q.subQuestions.map(sq => ({ ...sq })) : []);
    setEditMarks(q.marks);
    setEditImageUrl(q.imageUrl || '');
    setEditDiagramLabels(q.diagramLabels ? q.diagramLabels.map(dl => ({ ...dl })) : []);
  };

  const saveEdit = (sectionIdx: number, qIdx: number) => {
    const updatedSections = [...exam.sections];
    const section = { ...updatedSections[sectionIdx] };
    const questions = [...section.questions];
    const q = { ...questions[qIdx] };

    q.question = editText;
    q.correctAnswer = editAnswer;
    q.marks = editMarks;
    q.imageUrl = editImageUrl || undefined;
    q.diagramLabels = editDiagramLabels.length > 0 ? editDiagramLabels : undefined;
    if (editOptions.length > 0) q.options = editOptions;
    if (editSubQuestions.length > 0) q.subQuestions = editSubQuestions;

    questions[qIdx] = q;
    section.questions = questions;
    section.totalMarks = questions.reduce((s, qq) => s + qq.marks, 0);
    updatedSections[sectionIdx] = section;

    // Auto-update marking scheme with diagram labels and answers
    const updatedScheme = exam.markingScheme.map(ms => {
      if (ms.questionId === q.id) {
        return {
          ...ms,
          question: q.question,
          correctAnswer: q.correctAnswer,
          marks: q.marks,
          imageUrl: q.imageUrl,
          diagramLabels: q.diagramLabels,
          subAnswers: q.subQuestions?.map(sq => ({
            label: sq.label,
            answer: sq.answer,
            marks: sq.marks,
          })),
        };
      }
      return ms;
    });

    onUpdate({
      ...exam,
      sections: updatedSections,
      markingScheme: updatedScheme,
      updatedAt: new Date().toISOString(),
    });
    setEditingQuestion(null);
  };

  const deleteQuestion = (sectionIdx: number, qIdx: number) => {
    if (!confirm('Delete this question?')) return;
    const updatedSections = [...exam.sections];
    const section = { ...updatedSections[sectionIdx] };
    const deletedQ = section.questions[qIdx];
    section.questions = section.questions.filter((_, i) => i !== qIdx);
    // Re-number
    section.questions.forEach((q, i) => { q.questionNumber = i + 1; });
    section.totalMarks = section.questions.reduce((s, q) => s + q.marks, 0);
    updatedSections[sectionIdx] = section;

    const updatedScheme = exam.markingScheme.filter(ms => ms.questionId !== deletedQ.id);

    onUpdate({
      ...exam,
      sections: updatedSections,
      markingScheme: updatedScheme,
      updatedAt: new Date().toISOString(),
    });
  };

  const renderAnswerLines = (count: number) => {
    return Array.from({ length: count }).map((_, i) => (
      <div key={i} style={{ borderBottom: '1px solid #666', height: '28px', margin: '2px 0' }} />
    ));
  };

  const renderObjectiveEditor = (_q: Question, sIdx: number, qIdx: number) => (
    <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-3 no-print mb-3">
      <label className="text-xs font-medium text-gray-500 block mb-1">Question:</label>
      <textarea
        value={editText}
        onChange={e => setEditText(e.target.value)}
        className="w-full p-2 border rounded text-sm mb-2"
        rows={2}
      />
      <div className="grid grid-cols-2 gap-2 mb-2">
        {editOptions.map((opt, oIdx) => (
          <div key={oIdx} className="flex items-center gap-1">
            <span className="text-xs font-bold">{String.fromCharCode(65 + oIdx)}.</span>
            <input
              value={opt}
              onChange={e => {
                const newOpts = [...editOptions];
                newOpts[oIdx] = e.target.value;
                setEditOptions(newOpts);
              }}
              className="flex-1 px-2 py-1 border rounded text-sm"
            />
          </div>
        ))}
      </div>
      <div className="flex items-center gap-3 mb-2">
        <div className="flex items-center gap-1">
          <span className="text-xs">Correct Answer:</span>
          <select
            value={editAnswer}
            onChange={e => setEditAnswer(e.target.value)}
            className="px-2 py-1 border rounded text-sm"
          >
            {editOptions.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-xs">Marks:</span>
          <input type="number" value={editMarks} onChange={e => setEditMarks(parseInt(e.target.value) || 1)} className="w-16 px-2 py-1 border rounded text-sm" />
        </div>
      </div>
      <div className="mb-3">
        <label className="text-xs font-medium text-gray-500 block mb-1">Insert Diagram / Shape / Webpage Image URL:</label>
        <div className="flex gap-2 mb-1">
          <input
            type="text"
            value={editImageUrl}
            onChange={e => setEditImageUrl(e.target.value)}
            placeholder="Paste any image URL from a webpage..."
            className="flex-1 px-2 py-1 border rounded text-xs"
          />
          <button
            type="button"
            onClick={() => setShowShapeModal(true)}
            className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold whitespace-nowrap"
          >
            📐 Custom Shape...
          </button>
        </div>
        <select
          value={editImageUrl}
          onChange={e => setEditImageUrl(e.target.value)}
          className="w-full px-2 py-1 border rounded text-xs bg-white"
        >
          <option value="">— Or pick from NaCCA Diagram Library —</option>
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
        {editImageUrl && (
          <img src={editImageUrl} alt="Preview" className="mt-2 max-h-28 rounded border" />
        )}
      </div>

      {/* Diagram Labels Editor — for labelling parts of diagrams */}
      {editImageUrl && (
        <div className="mb-3 bg-indigo-50 border border-indigo-200 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-indigo-800">🏷️ Diagram Labels (label parts for students to identify):</label>
            <button type="button" onClick={() => setEditDiagramLabels([...editDiagramLabels, { label: String.fromCharCode(65 + editDiagramLabels.length), part: '', use: '' }])} className="px-2 py-0.5 bg-indigo-600 text-white rounded text-[10px] font-bold">+ Add Label</button>
          </div>
          {editDiagramLabels.map((dl, dlIdx) => (
            <div key={dlIdx} className="grid grid-cols-4 gap-1 mb-1 items-center">
              <input value={dl.label} onChange={e => { const u = [...editDiagramLabels]; u[dlIdx] = { ...u[dlIdx], label: e.target.value }; setEditDiagramLabels(u); }} placeholder="Label (A,B,C)" className="px-1.5 py-1 border rounded text-xs font-bold text-center" />
              <input value={dl.part} onChange={e => { const u = [...editDiagramLabels]; u[dlIdx] = { ...u[dlIdx], part: e.target.value }; setEditDiagramLabels(u); }} placeholder="Part name (e.g. CPU)" className="px-1.5 py-1 border rounded text-xs" />
              <input value={dl.use || ''} onChange={e => { const u = [...editDiagramLabels]; u[dlIdx] = { ...u[dlIdx], use: e.target.value }; setEditDiagramLabels(u); }} placeholder="Use/Function (optional)" className="px-1.5 py-1 border rounded text-xs" />
              <button type="button" onClick={() => setEditDiagramLabels(editDiagramLabels.filter((_, i) => i !== dlIdx))} className="text-red-500 font-bold text-xs">✕</button>
            </div>
          ))}
          {editDiagramLabels.length === 0 && <p className="text-[10px] text-indigo-500 italic">No labels yet. Click + Add Label to label diagram parts.</p>}
        </div>
      )}

      <div className="flex gap-2">
        <button onClick={() => saveEdit(sIdx, qIdx)} className="px-3 py-1.5 bg-green-600 text-white rounded text-xs font-medium">✓ Save</button>
        <button onClick={() => setEditingQuestion(null)} className="px-3 py-1.5 bg-gray-400 text-white rounded text-xs">Cancel</button>
        <button onClick={() => { deleteQuestion(sIdx, qIdx); setEditingQuestion(null); }} className="px-3 py-1.5 bg-red-500 text-white rounded text-xs ml-auto">🗑 Delete</button>
      </div>
    </div>
  );

  const renderSubjectiveEditor = (_q: Question, sIdx: number, qIdx: number) => (
    <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4 no-print mb-4">
      <label className="text-xs font-medium text-gray-500 block mb-1">Question:</label>
      <textarea
        value={editText}
        onChange={e => setEditText(e.target.value)}
        className="w-full p-2 border rounded text-sm mb-2"
        rows={4}
      />
      <div className="flex items-center gap-3 mb-3">
        <div className="flex items-center gap-1">
          <span className="text-xs">Total Marks:</span>
          <input type="number" value={editMarks} onChange={e => setEditMarks(parseInt(e.target.value) || 1)} className="w-16 px-2 py-1 border rounded text-sm" />
        </div>
      </div>
      
      <label className="text-xs font-medium text-gray-500 block mb-1">Answer:</label>
      <textarea
        value={editAnswer}
        onChange={e => setEditAnswer(e.target.value)}
        className="w-full p-2 border rounded text-sm mb-3"
        rows={2}
      />

      <div className="mb-3">
        <label className="text-xs font-medium text-gray-500 block mb-1">Insert Diagram / Shape / Webpage Image URL:</label>
        <div className="flex gap-2 mb-1">
          <input
            type="text"
            value={editImageUrl}
            onChange={e => setEditImageUrl(e.target.value)}
            className="flex-1 px-2 py-1 border rounded text-xs"
            placeholder="Paste any image URL from a webpage..."
          />
          <button
            type="button"
            onClick={() => setShowShapeModal(true)}
            className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold whitespace-nowrap"
          >
            📐 Custom Shape...
          </button>
        </div>
        <select
          onChange={e => setEditImageUrl(e.target.value)}
          className="w-full px-2 py-1 border rounded text-xs bg-white"
        >
          <option value="">— Or pick from NaCCA Diagram Library —</option>
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
        {editImageUrl && (
          <img src={editImageUrl} alt="Preview" className="mt-2 max-h-32 rounded border" />
        )}
      </div>

      {/* Diagram Labels Editor — for Science, Computing, Creative Arts, Career Tech */}
      {editImageUrl && (
        <div className="mb-3 bg-indigo-50 border border-indigo-200 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-indigo-800">🏷️ Diagram Labels (label parts for students to identify):</label>
            <button type="button" onClick={() => setEditDiagramLabels([...editDiagramLabels, { label: String.fromCharCode(65 + editDiagramLabels.length), part: '', use: '' }])} className="px-2 py-0.5 bg-indigo-600 text-white rounded text-[10px] font-bold">+ Add Label</button>
          </div>
          {editDiagramLabels.map((dl, dlIdx) => (
            <div key={dlIdx} className="grid grid-cols-4 gap-1 mb-1 items-center">
              <input value={dl.label} onChange={e => { const u = [...editDiagramLabels]; u[dlIdx] = { ...u[dlIdx], label: e.target.value }; setEditDiagramLabels(u); }} placeholder="Label (A,B,C)" className="px-1.5 py-1 border rounded text-xs font-bold text-center" />
              <input value={dl.part} onChange={e => { const u = [...editDiagramLabels]; u[dlIdx] = { ...u[dlIdx], part: e.target.value }; setEditDiagramLabels(u); }} placeholder="Part name (e.g. Monitor)" className="px-1.5 py-1 border rounded text-xs" />
              <input value={dl.use || ''} onChange={e => { const u = [...editDiagramLabels]; u[dlIdx] = { ...u[dlIdx], use: e.target.value }; setEditDiagramLabels(u); }} placeholder="Use/Function (optional)" className="px-1.5 py-1 border rounded text-xs" />
              <button type="button" onClick={() => setEditDiagramLabels(editDiagramLabels.filter((_, i) => i !== dlIdx))} className="text-red-500 font-bold text-xs">✕</button>
            </div>
          ))}
          {editDiagramLabels.length === 0 && <p className="text-[10px] text-indigo-500 italic">No labels yet. Click + Add Label to label diagram parts for students to identify.</p>}
        </div>
      )}

      {editSubQuestions.length > 0 && (
        <div className="space-y-2 mb-3">
          <label className="text-xs font-medium text-gray-500 block">Sub-Questions:</label>
          {editSubQuestions.map((sq, sqIdx) => (
            <div key={sq.id} className="bg-white p-3 rounded border">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-blue-600">({sq.label})</span>
                <input
                  value={sq.question}
                  onChange={e => {
                    const u = [...editSubQuestions];
                    u[sqIdx] = { ...u[sqIdx], question: e.target.value };
                    setEditSubQuestions(u);
                  }}
                  className="flex-1 px-2 py-1 border rounded text-sm"
                  placeholder="Sub-question"
                />
                <input
                  type="number"
                  value={sq.marks}
                  onChange={e => {
                    const u = [...editSubQuestions];
                    u[sqIdx] = { ...u[sqIdx], marks: parseInt(e.target.value) || 1 };
                    setEditSubQuestions(u);
                  }}
                  className="w-16 px-2 py-1 border rounded text-sm"
                  title="Marks"
                />
              </div>
              <div className="flex items-start gap-2">
                <span className="text-xs text-green-600 mt-1">Ans:</span>
                <textarea
                  value={sq.answer}
                  onChange={e => {
                    const u = [...editSubQuestions];
                    u[sqIdx] = { ...u[sqIdx], answer: e.target.value };
                    setEditSubQuestions(u);
                  }}
                  className="flex-1 px-2 py-1 border rounded text-sm"
                  rows={2}
                />
              </div>
            </div>
          ))}
          <button
            onClick={() => {
              const newLabel = editSubQuestions.length > 0
                ? String.fromCharCode(editSubQuestions[editSubQuestions.length - 1].label.charCodeAt(0) + 1)
                : 'a';
              setEditSubQuestions([...editSubQuestions, {
                id: `sq_${Date.now()}`,
                label: newLabel,
                question: '',
                answer: '',
                marks: 2,
              }]);
            }}
            className="text-xs text-blue-600 hover:text-blue-800 font-medium"
          >
            + Add Sub-Question
          </button>
        </div>
      )}

      <div className="flex gap-2">
        <button onClick={() => saveEdit(sIdx, qIdx)} className="px-3 py-1.5 bg-green-600 text-white rounded text-xs font-medium">✓ Save</button>
        <button onClick={() => setEditingQuestion(null)} className="px-3 py-1.5 bg-gray-400 text-white rounded text-xs">Cancel</button>
        <button onClick={() => { deleteQuestion(sIdx, qIdx); setEditingQuestion(null); }} className="px-3 py-1.5 bg-red-500 text-white rounded text-xs ml-auto">🗑 Delete</button>
      </div>
    </div>
  );

  return (
    <div className="exam-paper" style={{ fontFamily: "'Times New Roman', Times, serif", fontSize: '12pt', lineHeight: '1.5' }}>
      {/* Exam Header */}
      <div className="text-center mb-1" style={{ borderBottom: '3px double #000', paddingBottom: '12px' }}>
        <h1 style={{ fontSize: '16pt', fontWeight: 'bold', letterSpacing: '2px', textTransform: 'uppercase', margin: 0 }}>
          {exam.schoolName}
        </h1>
        <p style={{ fontSize: '9pt', margin: '2px 0', fontStyle: 'italic', color: '#555' }}>
          Motto: Seeking Wisdom
        </p>
        <h2 style={{ fontSize: '13pt', fontWeight: 'bold', textTransform: 'uppercase', margin: '8px 0 0 0' }}>
          {exam.examType}
        </h2>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10pt', margin: '10px 0', borderBottom: '1px solid #ccc', paddingBottom: '8px' }}>
        <div>
          <p style={{ margin: '2px 0' }}><strong>Subject:</strong> {exam.subject}</p>
          <p style={{ margin: '2px 0' }}><strong>Class:</strong> {exam.classLevel}</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ margin: '2px 0' }}><strong>Duration:</strong> {exam.duration}</p>
          <p style={{ margin: '2px 0' }}><strong>Total Marks:</strong> {exam.totalMarks}</p>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10pt', margin: '0 0 8px 0' }}>
        <span><strong>Term:</strong> {exam.term}</span>
        <span><strong>Academic Year:</strong> {exam.academicYear}</span>
      </div>
      <div style={{ fontSize: '10pt', margin: '0 0 16px 0', borderBottom: '1px solid #000', paddingBottom: '8px' }}>
        <p style={{ margin: '4px 0' }}><strong>Name:</strong> ________________________________________________ <strong>Date:</strong> __________________</p>
      </div>

      {/* Exam Sections */}
      {exam.sections.map((section, sIdx) => (
        <div key={section.id} style={{ marginBottom: '20px' }}>
          {/* Section Header */}
          <div style={{
            background: '#f0f0f0',
            border: '1px solid #999',
            padding: '6px 12px',
            fontWeight: 'bold',
            fontSize: '11pt',
            textTransform: 'uppercase',
            marginBottom: '8px',
          }}>
            {section.title} [{section.totalMarks} MARKS]
          </div>
          <p style={{ fontSize: '9pt', fontStyle: 'italic', color: '#555', marginBottom: '10px' }}>
            {section.instructions}
          </p>

          {/* Objective Section - Two Column Layout for Basic 1-9 */}
          {section.isObjective ? (
            <div className={isBasic1to9 ? 'two-column-layout' : ''}>
              {section.questions.map((q, qIdx) => (
                <div key={q.id} style={{ marginBottom: '10px', breakInside: 'avoid' }}>
                  {editingQuestion === q.id ? (
                    renderObjectiveEditor(q, sIdx, qIdx)
                  ) : (
                    <div className="group relative" style={{ paddingRight: '30px' }}>
                      <p style={{ fontSize: '16pt', margin: '0 0 6px 0', lineHeight: '1.4' }}>
                        <strong>{q.questionNumber}.</strong> <MathFormattedText text={q.question} />
                      </p>
                      {q.imageUrl && (
                        <div style={{ margin: '8px 0 8px 20px' }}>
                          <img src={q.imageUrl} alt="Diagram" style={{ maxWidth: '240px', border: '1px solid #ccc', borderRadius: '4px' }} />
                          {q.diagramLabels && q.diagramLabels.length > 0 && (
                            <div style={{ marginTop: '4px', fontSize: '10pt', color: '#334155' }}>
                              {q.diagramLabels.map((dl, dlIdx) => (
                                <span key={dlIdx} style={{ marginRight: '12px', fontWeight: 600 }}>
                                  {dl.label} — _______________
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                      {q.options && (
                        <div style={{ marginLeft: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 20px' }}>
                          {q.options.map((opt, oIdx) => (
                            <span key={oIdx} style={{ fontSize: '16pt', lineHeight: '1.4' }}>
                              {String.fromCharCode(65 + oIdx)}. <MathFormattedText text={opt} />
                            </span>
                          ))}
                        </div>
                      )}
                      <button
                        onClick={() => startEdit(q)}
                        className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition no-print"
                        style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '2px 8px', borderRadius: '4px', fontSize: '10px', cursor: 'pointer' }}
                      >
                        ✏️ Edit
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            /* Subjective Section - Single Column, No lines between */
            <div>
              {section.questions.map((q, qIdx) => (
                <div key={q.id} style={{ marginBottom: '20px', breakInside: 'avoid' }}>
                  {editingQuestion === q.id ? (
                    renderSubjectiveEditor(q, sIdx, qIdx)
                  ) : (
                    <div className="group relative" style={{ paddingRight: '30px' }}>
                      {q.isCompulsory && (
                        <p style={{ fontSize: '9pt', color: '#dc2626', fontWeight: 'bold', margin: '0 0 2px 0' }}>
                          ⭐ COMPULSORY
                        </p>
                      )}
                      {q.isPractical && (
                        <p style={{ fontSize: '9pt', color: '#2563eb', fontWeight: 'bold', margin: '0 0 2px 0' }}>
                          🔬 PRACTICAL
                        </p>
                      )}
                      <p style={{ fontSize: '16pt', fontWeight: 600, margin: '0 0 4px 0', lineHeight: '1.4' }}>
                        Question {q.questionNumber}. [{q.marks} marks]
                      </p>
                      <div style={{ fontSize: '16pt', whiteSpace: 'pre-wrap', margin: '0 0 8px 0', lineHeight: '1.4' }}>
                        <MathFormattedText text={q.question} />
                      </div>

                      {q.imageUrl && (
                        <div style={{ margin: '8px 0' }}>
                          <img src={q.imageUrl} alt="Question illustration" style={{ maxWidth: '300px', border: '1px solid #ccc', borderRadius: '4px' }} />
                          {q.diagramLabels && q.diagramLabels.length > 0 && (
                            <div style={{ marginTop: '6px', fontSize: '14pt', lineHeight: '1.6' }}>
                              <p style={{ fontWeight: 700, fontSize: '14pt', margin: '0 0 4px 0' }}>Identify the parts labelled below:</p>
                              {q.diagramLabels.map((dl, dlIdx) => (
                                <p key={dlIdx} style={{ margin: '2px 0 2px 20px', fontSize: '14pt' }}>
                                  <strong>{dl.label}</strong>: ___________________________________________
                                </p>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {q.subQuestions && q.subQuestions.map(sq => (
                        <div key={sq.id} style={{ marginLeft: '20px', marginBottom: '8px' }}>
                          <p style={{ fontSize: '16pt', lineHeight: '1.4' }}>
                            <strong>({sq.label})</strong> <MathFormattedText text={sq.question} /> <span style={{ fontSize: '12pt', color: '#666' }}>[{sq.marks} marks]</span>
                          </p>
                          {sq.imageUrl && (
                            <div style={{ margin: '4px 0' }}>
                              <img src={sq.imageUrl} alt="Sub-question illustration" style={{ maxWidth: '250px', border: '1px solid #ccc', borderRadius: '4px' }} />
                            </div>
                          )}
                          {isBasic1to3 && renderAnswerLines(3)}
                        </div>
                      ))}

                      {isBasic1to3 && !q.subQuestions && renderAnswerLines(5)}

                      <button
                        onClick={() => startEdit(q)}
                        className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition no-print"
                        style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '2px 8px', borderRadius: '4px', fontSize: '10px', cursor: 'pointer' }}
                      >
                        ✏️ Edit
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* End of Paper */}
      <div style={{ textAlign: 'center', borderTop: '2px solid #000', paddingTop: '12px', marginTop: '30px', fontSize: '10pt' }}>
        <p style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>END OF {exam.examType.toUpperCase()}</p>
        <p className="no-print" style={{ fontSize: '8pt', color: '#999', marginTop: '4px' }}>© {exam.academicYear} {exam.schoolName}</p>
      </div>

      {showShapeModal && (
        <CustomShapeBuilderModal
          onClose={() => setShowShapeModal(false)}
          onInsert={(res: CustomShapeResult) => {
            setEditImageUrl(res.svgDataUrl);
            if (res.suggestedQuestion && !editText) {
              setEditText(res.suggestedQuestion);
              setEditAnswer(res.suggestedAnswer);
              setEditMarks(res.suggestedMarks);
              if (res.subQuestions) {
                setEditSubQuestions(res.subQuestions.map((sq, i) => ({
                  id: `sq_${Date.now()}_${i}`,
                  label: sq.label,
                  question: sq.question,
                  answer: sq.answer,
                  marks: sq.marks,
                })));
              }
            }
            setShowShapeModal(false);
          }}
        />
      )}
    </div>
  );
}
