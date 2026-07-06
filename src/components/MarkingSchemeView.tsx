import type { ExamPaper } from '../types';
import MathFormattedText from './MathFormattedText';

interface Props {
  exam: ExamPaper;
}

export default function MarkingSchemeView({ exam }: Props) {
  return (
    <div className="exam-paper" style={{ fontFamily: "'Times New Roman', Times, serif", fontSize: '11pt' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', borderBottom: '3px double #000', paddingBottom: '12px', marginBottom: '16px' }}>
        <h1 style={{ fontSize: '16pt', fontWeight: 'bold', letterSpacing: '2px', textTransform: 'uppercase', margin: 0 }}>
          {exam.schoolName}
        </h1>
        <p style={{ fontSize: '9pt', fontStyle: 'italic', color: '#555', margin: '2px 0 0 0' }}>Motto: Seeking Wisdom</p>
        <h2 style={{ fontSize: '13pt', fontWeight: 'bold', color: '#c62828', margin: '8px 0 0 0' }}>
          MARKING SCHEME — CONFIDENTIAL
        </h2>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10pt', marginTop: '10px' }}>
          <span><strong>Subject:</strong> {exam.subject}</span>
          <span><strong>Class:</strong> {exam.classLevel}</span>
          <span><strong>Exam:</strong> {exam.examType}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10pt', marginTop: '4px' }}>
          <span><strong>Term:</strong> {exam.term}</span>
          <span><strong>Year:</strong> {exam.academicYear}</span>
          <span><strong>Total Marks:</strong> {exam.totalMarks}</span>
        </div>
      </div>

      {/* Sections — Objective answers on page 1, subjective flows to page 2+ */}
      {exam.sections.map((section, sectionIdx) => (
        <div key={section.id} style={{ marginBottom: '24px', pageBreakAfter: section.isObjective && sectionIdx < exam.sections.length - 1 ? 'always' : 'auto' }}>
          <div style={{
            background: '#f0f0f0',
            border: '1px solid #999',
            padding: '6px 12px',
            fontWeight: 'bold',
            fontSize: '11pt',
            textTransform: 'uppercase',
            marginBottom: '12px',
          }}>
            {section.title} — MARKING SCHEME [{section.totalMarks} marks]
          </div>

          {section.isObjective ? (
            /* Objective Answers - Two Column Table */
            <div className="two-column-layout">
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10pt' }}>
                <thead>
                  <tr style={{ background: '#e8e8e8' }}>
                    <th style={{ border: '1px solid #999', padding: '4px 8px', textAlign: 'center', width: '40px' }}>Q</th>
                    <th style={{ border: '1px solid #999', padding: '4px 8px', textAlign: 'center', width: '40px' }}>Ans</th>
                    <th style={{ border: '1px solid #999', padding: '4px 8px', textAlign: 'left' }}>Full Answer</th>
                    <th style={{ border: '1px solid #999', padding: '4px 8px', textAlign: 'center', width: '40px' }}>Mk</th>
                  </tr>
                </thead>
                <tbody>
                  {section.questions.map(q => {
                    const optIdx = q.options?.indexOf(q.correctAnswer) ?? -1;
                    const letter = optIdx >= 0 ? String.fromCharCode(65 + optIdx) : '';
                    return (
                      <tr key={q.id} style={{ breakInside: 'avoid' }}>
                        <td style={{ border: '1px solid #999', padding: '3px 8px', textAlign: 'center', fontWeight: 'bold' }}>{q.questionNumber}</td>
                        <td style={{ border: '1px solid #999', padding: '3px 8px', textAlign: 'center', fontWeight: 'bold', color: '#16a34a' }}>{letter}</td>
                        <td style={{ border: '1px solid #999', padding: '3px 8px', color: '#166534' }}>
                          <MathFormattedText text={q.correctAnswer} />
                          {q.imageUrl && (
                            <img src={q.imageUrl} alt="Ref" style={{ maxHeight: '36px', marginLeft: '8px', verticalAlign: 'middle', display: 'inline-block', border: '1px solid #ccc' }} />
                          )}
                        </td>
                        <td style={{ border: '1px solid #999', padding: '3px 8px', textAlign: 'center' }}>{q.marks}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            /* Subjective Answers */
            <div>
              {section.questions.map(q => (
                <div key={q.id} style={{ marginBottom: '20px', borderBottom: '1px solid #ddd', paddingBottom: '16px', breakInside: 'avoid' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <p style={{ fontWeight: 'bold', fontSize: '11pt', margin: 0 }}>
                      Question {q.questionNumber} {q.isCompulsory ? '⭐ (COMPULSORY)' : ''} {q.isPractical ? '🔬 (PRACTICAL)' : ''}
                    </p>
                    <span style={{ fontSize: '10pt', background: '#e8e8e8', padding: '2px 8px', borderRadius: '4px' }}>
                      [{q.marks} marks]
                    </span>
                  </div>

                  <div style={{ fontSize: '10pt', color: '#555', marginBottom: '8px' }}>
                    {q.question.length > 150 ? q.question.substring(0, 150) + '...' : q.question}
                  </div>

                  {q.imageUrl && (
                    <div style={{ margin: '8px 0', padding: '6px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '4px', display: 'inline-block' }}>
                      <span style={{ fontSize: '8pt', fontWeight: 'bold', color: '#475569', display: 'block', marginBottom: '4px' }}>📌 Diagram Reference:</span>
                      <img src={q.imageUrl} alt="Marking scheme reference diagram" style={{ maxWidth: '100%', width: '220px', maxHeight: '160px', objectFit: 'contain', display: 'block', borderRadius: '2px', background: '#fff' }} />
                    </div>
                  )}

                  {/* Diagram Label Answers for Marking */}
                  {q.diagramLabels && q.diagramLabels.length > 0 && (
                    <div style={{ background: '#eef2ff', border: '1px solid #a5b4fc', borderRadius: '6px', padding: '10px', marginBottom: '8px' }}>
                      <p style={{ fontSize: '9pt', fontWeight: 'bold', color: '#3730a3', margin: '0 0 6px 0' }}>🏷️ DIAGRAM LABEL ANSWERS:</p>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10pt' }}>
                        <thead>
                          <tr style={{ background: '#c7d2fe' }}>
                            <th style={{ border: '1px solid #818cf8', padding: '3px 8px', textAlign: 'center', width: '50px' }}>Label</th>
                            <th style={{ border: '1px solid #818cf8', padding: '3px 8px', textAlign: 'left' }}>Part Name (Correct Answer)</th>
                            <th style={{ border: '1px solid #818cf8', padding: '3px 8px', textAlign: 'left' }}>Use / Function</th>
                          </tr>
                        </thead>
                        <tbody>
                          {q.diagramLabels.map((dl, dlIdx) => (
                            <tr key={dlIdx}>
                              <td style={{ border: '1px solid #818cf8', padding: '3px 8px', textAlign: 'center', fontWeight: 'bold', color: '#4338ca' }}>{dl.label}</td>
                              <td style={{ border: '1px solid #818cf8', padding: '3px 8px', color: '#166534', fontWeight: 600 }}>{dl.part}</td>
                              <td style={{ border: '1px solid #818cf8', padding: '3px 8px', color: '#1e40af' }}>{dl.use || '—'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {q.correctAnswer && !q.subQuestions?.length && (
                    <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '6px', padding: '10px', marginBottom: '8px' }}>
                      <p style={{ fontSize: '9pt', fontWeight: 'bold', color: '#166534', margin: '0 0 4px 0' }}>✅ CORRECT ANSWER:</p>
                      <p style={{ fontSize: '10pt', color: '#14532d', whiteSpace: 'pre-wrap', margin: 0 }}><MathFormattedText text={q.correctAnswer} /></p>
                    </div>
                  )}

                  {q.subQuestions && q.subQuestions.map(sq => (
                    <div key={sq.id} style={{ marginLeft: '20px', marginBottom: '10px' }}>
                      <p style={{ fontWeight: '600', fontSize: '10pt', margin: '0 0 4px 0' }}>
                        ({sq.label}) <MathFormattedText text={sq.question} /> <span style={{ color: '#888', fontSize: '9pt' }}>[{sq.marks} marks]</span>
                      </p>
                      <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '6px', padding: '8px' }}>
                        <p style={{ fontSize: '9pt', fontWeight: 'bold', color: '#166534', margin: '0 0 4px 0' }}>✅ ANSWER:</p>
                        <p style={{ fontSize: '10pt', color: '#14532d', whiteSpace: 'pre-wrap', margin: 0 }}><MathFormattedText text={sq.answer} /></p>
                        <p style={{ fontSize: '8pt', color: '#16a34a', margin: '4px 0 0 0' }}>Award: {sq.marks} mark(s)</p>
                      </div>
                    </div>
                  ))}

                  {q.working && (
                    <div style={{ background: '#eff6ff', border: '1px solid #93c5fd', borderRadius: '6px', padding: '10px', marginTop: '8px', marginLeft: '20px' }}>
                      <p style={{ fontSize: '9pt', fontWeight: 'bold', color: '#1e40af', margin: '0 0 4px 0' }}>📐 FULL WORKING / SOLUTION:</p>
                      <p style={{ fontSize: '10pt', color: '#1e3a5f', whiteSpace: 'pre-wrap', margin: 0 }}><MathFormattedText text={q.working} /></p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Footer — only the CONFIDENTIAL label prints, rest hidden */}
      <div style={{ textAlign: 'center', borderTop: '2px solid #c62828', paddingTop: '10px', marginTop: '30px' }}>
        <p style={{ fontWeight: 'bold', color: '#c62828', fontSize: '10pt', textTransform: 'uppercase' }}>
          THIS MARKING SCHEME IS STRICTLY CONFIDENTIAL
        </p>
        <p className="no-print" style={{ fontSize: '9pt', color: '#999', marginTop: '4px' }}>
          Contains exact correct answers, full solutions, calculations, working, and marks allocation.
        </p>
        <p className="no-print" style={{ fontSize: '8pt', color: '#999', marginTop: '4px' }}>
          © {exam.academicYear} {exam.schoolName}
        </p>
      </div>
    </div>
  );
}
