import { useState } from 'react';
import { printElementsClean } from '../utils/printDocument';

export default function GraphPaper() {
  const [gridSize, setGridSize] = useState<'small' | 'medium' | 'large'>('small');
  const [showAxes, setShowAxes] = useState(true);
  const [pageCount, setPageCount] = useState(1);
  const [generated, setGenerated] = useState(false);

  const cellSizes = { small: 5, medium: 8, large: 10 }; // mm
  const cellPx = { small: 14, medium: 22, large: 28 }; // px for screen rendering

  if (generated) {
    const cell = cellPx[gridSize];
    const cols = Math.floor(680 / cell);
    const rows = Math.floor(900 / cell);

    return (
      <div className="animate-fade-in">
        <div className="bg-white rounded-xl p-4 mb-4 flex flex-wrap gap-3 items-center no-print border border-gray-100">
          <button onClick={() => setGenerated(false)} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition">
            ← Back
          </button>
          <button onClick={() => printElementsClean('.graph-paper-page')} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition">
            🖨️ Print Graph Paper
          </button>
        </div>

        {Array.from({ length: pageCount }).map((_, pageIdx) => (
          <div key={pageIdx} className="graph-paper-page" style={{
            width: '210mm', minHeight: '297mm', padding: '12mm 15mm',
            background: 'white', margin: '0 auto 8px auto', boxSizing: 'border-box',
            fontFamily: 'Arial, sans-serif', pageBreakAfter: 'always',
            boxShadow: '0 0 10px rgba(0,0,0,0.08)',
          }}>
            {/* Header */}
            <div style={{ textAlign: 'center', borderBottom: '2px solid #000', paddingBottom: '6px', marginBottom: '8px' }}>
              <p style={{ fontSize: '16px', fontWeight: 900, letterSpacing: '2px', margin: '0 0 2px 0' }}>ALEYART ACADEMY</p>
              <p style={{ fontSize: '9px', fontStyle: 'italic', color: '#555', margin: '0 0 3px 0' }}>Motto: Seeking Wisdom</p>
              <p style={{ fontSize: '12px', fontWeight: 700, margin: 0 }}>GRAPH PAPER — {gridSize.toUpperCase()} GRID ({cellSizes[gridSize]}mm)</p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', marginBottom: '6px' }}>
              <span><strong>Name:</strong> ________________________________</span>
              <span><strong>Class:</strong> _____________ <strong>Date:</strong> ____________</span>
            </div>

            {/* Graph Grid */}
            <div style={{ position: 'relative', overflow: 'hidden' }}>
              <svg
                width={cols * cell}
                height={rows * cell}
                viewBox={`0 0 ${cols * cell} ${rows * cell}`}
                style={{ display: 'block', margin: '0 auto' }}
              >
                {/* Grid lines */}
                {Array.from({ length: cols + 1 }).map((_, i) => (
                  <line
                    key={`v${i}`}
                    x1={i * cell} y1={0} x2={i * cell} y2={rows * cell}
                    stroke={showAxes && i === Math.floor(cols / 2) ? '#1d4ed8' : '#93c5fd'}
                    strokeWidth={showAxes && i === Math.floor(cols / 2) ? 2 : 0.5}
                  />
                ))}
                {Array.from({ length: rows + 1 }).map((_, i) => (
                  <line
                    key={`h${i}`}
                    x1={0} y1={i * cell} x2={cols * cell} y2={i * cell}
                    stroke={showAxes && i === Math.floor(rows / 2) ? '#1d4ed8' : '#93c5fd'}
                    strokeWidth={showAxes && i === Math.floor(rows / 2) ? 2 : 0.5}
                  />
                ))}
                {/* Major grid lines every 5 cells */}
                {Array.from({ length: Math.floor(cols / 5) + 1 }).map((_, i) => (
                  <line
                    key={`mv${i}`}
                    x1={i * 5 * cell} y1={0} x2={i * 5 * cell} y2={rows * cell}
                    stroke="#60a5fa"
                    strokeWidth={1}
                  />
                ))}
                {Array.from({ length: Math.floor(rows / 5) + 1 }).map((_, i) => (
                  <line
                    key={`mh${i}`}
                    x1={0} y1={i * 5 * cell} x2={cols * cell} y2={i * 5 * cell}
                    stroke="#60a5fa"
                    strokeWidth={1}
                  />
                ))}
                {/* Axis labels if axes shown */}
                {showAxes && (
                  <>
                    <text x={Math.floor(cols / 2) * cell + 4} y={14} fontSize="10" fill="#1d4ed8" fontWeight="bold">y</text>
                    <text x={cols * cell - 12} y={Math.floor(rows / 2) * cell - 4} fontSize="10" fill="#1d4ed8" fontWeight="bold">x</text>
                    <text x={Math.floor(cols / 2) * cell + 4} y={Math.floor(rows / 2) * cell + 12} fontSize="9" fill="#1d4ed8">O</text>
                  </>
                )}
              </svg>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto animate-fade-in">
      <div className="bg-white rounded-xl p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">📊 Generate Graph Paper (A4)</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Grid Size</label>
            <div className="grid grid-cols-3 gap-3">
              {(['small', 'medium', 'large'] as const).map(size => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setGridSize(size)}
                  className={`py-3 px-4 rounded-xl font-bold text-sm border transition capitalize ${
                    gridSize === size
                      ? 'bg-blue-600 text-white border-blue-700 shadow'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-blue-400'
                  }`}
                >
                  {size} ({cellSizes[size]}mm)
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-6">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={showAxes} onChange={e => setShowAxes(e.target.checked)} className="w-4 h-4 rounded" />
              <span className="text-sm text-gray-600">Show X & Y Axes</span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Number of Pages</label>
            <input
              type="number"
              value={pageCount}
              onChange={e => setPageCount(parseInt(e.target.value) || 1)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
              min="1" max="10"
            />
          </div>

          <button
            onClick={() => setGenerated(true)}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition"
          >
            📊 Generate Graph Paper
          </button>
        </div>
      </div>
    </div>
  );
}
