import { useState } from 'react';
import type { User, ClassLevel } from '../types';
import { KG_ASSESSMENT_AREAS, EARLY_CHILDHOOD_LEVELS } from '../data/constants';

interface Props {
  user: User;
}

type Rating = 'Excellent' | 'Good' | 'Developing' | 'Needs Support';

interface AssessmentEntry {
  skill: string;
  rating: Rating;
  comment: string;
}

interface ChildAssessment {
  id: string;
  childName: string;
  classLevel: ClassLevel;
  assessmentDate: string;
  assessedBy: string;
  areas: {
    name: string;
    entries: AssessmentEntry[];
  }[];
}

export default function EarlyChildhood({ user }: Props) {
  const [selectedLevel, setSelectedLevel] = useState<ClassLevel | ''>('');
  const [childName, setChildName] = useState('');
  const [assessmentDate, setAssessmentDate] = useState(new Date().toISOString().split('T')[0]);
  const [assessment, setAssessment] = useState<ChildAssessment | null>(null);
  const [savedAssessments, setSavedAssessments] = useState<ChildAssessment[]>(() => {
    const stored = localStorage.getItem('aleyart_ec_assessments');
    return stored ? JSON.parse(stored) : [];
  });
  const [viewMode, setViewMode] = useState<'create' | 'list'>('create');

  const getAssessmentAreas = (level: ClassLevel) => {
    if (level === 'Creche') {
      return [
        { name: 'Physical Development', criteria: ['Movement', 'Walking', 'Grasping', 'Crawling', 'Sitting'] },
        { name: 'Social Behaviour', criteria: ['Smiling', 'Responding to sounds', 'Eye contact', 'Interaction with others'] },
        { name: 'Basic Communication', criteria: ['Babbling', 'Responding to name', 'Making sounds', 'Facial expressions'] },
      ];
    }
    if (level === 'N1') {
      return [
        { name: 'Colour & Shape Recognition', criteria: ['Red', 'Blue', 'Yellow', 'Green', 'Circle', 'Square', 'Triangle'] },
        { name: 'Counting', criteria: ['Counting 1-5', 'Counting objects', 'Number songs'] },
        { name: 'Songs & Rhymes', criteria: ['Singing along', 'Remembering lyrics', 'Actions with songs'] },
        { name: 'Motor Skills', criteria: ['Holding pencil', 'Scribbling', 'Cutting with scissors', 'Pasting'] },
        { name: 'Social Skills', criteria: ['Sharing', 'Taking turns', 'Following simple instructions'] },
      ];
    }
    if (level === 'N2') {
      return [
        { name: 'Colour & Shape Recognition', criteria: ['All basic colours', 'Circle', 'Square', 'Triangle', 'Rectangle'] },
        { name: 'Counting', criteria: ['Counting 1-10', 'Number recognition 1-5', 'Counting objects'] },
        { name: 'Songs, Rhymes & Stories', criteria: ['Singing songs', 'Reciting rhymes', 'Listening to stories', 'Retelling simple stories'] },
        { name: 'Drawing & Colouring', criteria: ['Drawing shapes', 'Colouring within lines', 'Creative drawing'] },
        { name: 'Motor Skills', criteria: ['Pencil holding', 'Cutting', 'Pasting', 'Lacing'] },
      ];
    }
    if (level === 'KG1' || level === 'KG2') {
      return (KG_ASSESSMENT_AREAS as Record<string, { name: string; criteria: string[] }[]>)[level] || [];
    }
    return [];
  };

  const generateAssessment = () => {
    if (!selectedLevel || !childName) return;
    
    const areas = getAssessmentAreas(selectedLevel as ClassLevel);
    const newAssessment: ChildAssessment = {
      id: `eca_${Date.now()}`,
      childName,
      classLevel: selectedLevel as ClassLevel,
      assessmentDate,
      assessedBy: user.name,
      areas: areas.map(area => ({
        name: area.name,
        entries: area.criteria.map(skill => ({
          skill,
          rating: 'Developing' as Rating,
          comment: '',
        })),
      })),
    };
    setAssessment(newAssessment);
  };

  const updateRating = (areaIdx: number, entryIdx: number, rating: Rating) => {
    if (!assessment) return;
    const updated = { ...assessment };
    updated.areas[areaIdx].entries[entryIdx].rating = rating;
    setAssessment(updated);
  };

  const updateComment = (areaIdx: number, entryIdx: number, comment: string) => {
    if (!assessment) return;
    const updated = { ...assessment };
    updated.areas[areaIdx].entries[entryIdx].comment = comment;
    setAssessment(updated);
  };

  const saveAssessment = () => {
    if (!assessment) return;
    const updated = [...savedAssessments, assessment];
    setSavedAssessments(updated);
    localStorage.setItem('aleyart_ec_assessments', JSON.stringify(updated));
    alert('Assessment saved successfully!');
    setAssessment(null);
  };

  const ratingColors: Record<Rating, string> = {
    'Excellent': 'bg-green-100 text-green-700 border-green-300',
    'Good': 'bg-blue-100 text-blue-700 border-blue-300',
    'Developing': 'bg-yellow-100 text-yellow-700 border-yellow-300',
    'Needs Support': 'bg-red-100 text-red-700 border-red-300',
  };

  if (assessment) {
    return (
      <div className="animate-fade-in">
        <div className="bg-white rounded-xl p-4 mb-4 flex flex-wrap gap-3 items-center no-print border border-gray-100">
          <button onClick={() => setAssessment(null)} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition">
            ← Back
          </button>
          <button onClick={saveAssessment} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition">
            💾 Save Assessment
          </button>
          <button onClick={() => { document.title = ' '; window.print(); }} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition">
            🖨️ Print
          </button>
        </div>

        <div className="exam-paper">
          <div className="text-center border-b-2 border-black pb-4 mb-6">
            <h1 className="text-xl font-bold uppercase">ALEYART ACADEMY</h1>
            <p className="text-xs italic text-gray-500 mt-0.5">Motto: Seeking Wisdom</p>
            <h2 className="text-base font-semibold mt-1">EARLY CHILDHOOD ASSESSMENT REPORT</h2>
            <div className="grid grid-cols-2 gap-2 mt-3 text-sm text-left">
              <p><strong>Child's Name:</strong> {assessment.childName}</p>
              <p><strong>Class:</strong> {assessment.classLevel}</p>
              <p><strong>Date:</strong> {assessment.assessmentDate}</p>
              <p><strong>Assessed By:</strong> {assessment.assessedBy}</p>
            </div>
          </div>

          {['Creche', 'N1', 'N2'].includes(assessment.classLevel) && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 text-xs text-blue-700">
              📝 <strong>Note:</strong> This is an observation-based assessment. No formal written exams are conducted at this level. 
              Assessment is done through teacher observation, oral questions, and practical activities.
            </div>
          )}

          {assessment.areas.map((area, aIdx) => (
            <div key={aIdx} className="mb-6">
              <h3 className="font-bold text-sm bg-gray-100 px-3 py-2 border border-gray-300 mb-3 uppercase">
                {area.name}
              </h3>
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 px-3 py-2 text-left w-1/3">Skill/Area</th>
                    <th className="border border-gray-300 px-3 py-2 text-center">Rating</th>
                    <th className="border border-gray-300 px-3 py-2 text-left">Teacher's Comment</th>
                  </tr>
                </thead>
                <tbody>
                  {area.entries.map((entry, eIdx) => (
                    <tr key={eIdx}>
                      <td className="border border-gray-300 px-3 py-2 font-medium">{entry.skill}</td>
                      <td className="border border-gray-300 px-3 py-2">
                        <select
                          value={entry.rating}
                          onChange={e => updateRating(aIdx, eIdx, e.target.value as Rating)}
                          className={`w-full px-2 py-1 rounded border text-xs font-medium ${ratingColors[entry.rating]} no-print`}
                        >
                          <option value="Excellent">⭐ Excellent</option>
                          <option value="Good">👍 Good</option>
                          <option value="Developing">🔄 Developing</option>
                          <option value="Needs Support">🆘 Needs Support</option>
                        </select>
                        <span className={`print-only text-xs font-medium px-2 py-1 rounded ${ratingColors[entry.rating]}`}>
                          {entry.rating}
                        </span>
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        <input
                          value={entry.comment}
                          onChange={e => updateComment(aIdx, eIdx, e.target.value)}
                          className="w-full px-2 py-1 border border-gray-200 rounded text-xs no-print"
                          placeholder="Add comment..."
                        />
                        <span className="print-only text-xs">{entry.comment}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}

          <div className="mt-8 border-t border-gray-300 pt-4">
            <p className="text-sm"><strong>Teacher's General Observation:</strong></p>
            <div className="border border-gray-300 min-h-20 mt-2 p-2" />
            <div className="grid grid-cols-2 gap-8 mt-6 text-sm">
              <div>
                <p className="border-b border-gray-400 pb-8 mb-2" />
                <p className="text-center text-xs text-gray-500">Teacher's Signature</p>
              </div>
              <div>
                <p className="border-b border-gray-400 pb-8 mb-2" />
                <p className="text-center text-xs text-gray-500">Parent's Signature</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setViewMode('create')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            viewMode === 'create' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          ➕ Create Assessment
        </button>
        <button
          onClick={() => setViewMode('list')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          📋 Saved Assessments ({savedAssessments.length})
        </button>
      </div>

      {viewMode === 'create' ? (
        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">🧒 Early Childhood Assessment</h3>
          
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6">
            <h4 className="font-medium text-orange-800 text-sm mb-2">📌 NaCCA Assessment Guidelines</h4>
            <ul className="text-xs text-orange-700 space-y-1">
              <li>• <strong>Crèche:</strong> No exams. Observation-based tracking only.</li>
              <li>• <strong>N1 & N2:</strong> No formal exams. Activities, oral questions, teacher observation.</li>
              <li>• <strong>KG1 & KG2:</strong> No BECE-style exams. Oral questioning, practical activities, teacher observation.</li>
            </ul>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Class Level</label>
              <select
                value={selectedLevel}
                onChange={e => setSelectedLevel(e.target.value as ClassLevel)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
              >
                <option value="">Select level...</option>
                {EARLY_CHILDHOOD_LEVELS.map(l => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Child's Name</label>
              <input
                value={childName}
                onChange={e => setChildName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                placeholder="Enter child's name"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600 mb-2">Assessment Date</label>
            <input
              type="date"
              value={assessmentDate}
              onChange={e => setAssessmentDate(e.target.value)}
              className="w-full sm:w-64 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
            />
          </div>

          <button
            onClick={generateAssessment}
            disabled={!selectedLevel || !childName}
            className="px-6 py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white rounded-xl font-medium transition"
          >
            📋 Generate Assessment Form
          </button>

          {/* NaCCA Sample Assessment Questions Per Level */}
          {selectedLevel && (
            <div className="mt-6 bg-white rounded-xl p-5 border border-blue-100">
              <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                <span>📝</span> NaCCA Sample Assessment Activities — {selectedLevel}
              </h4>
              <div className="space-y-3 text-sm">
                {selectedLevel === 'Creche' && (
                  <div className="space-y-2">
                    <p className="text-xs text-gray-500 italic">Assessment through observation only. No written questions.</p>
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                      <p className="font-bold text-xs text-blue-900 mb-1">Physical Development Observations:</p>
                      <ul className="text-xs space-y-0.5 text-gray-700">
                        <li>• Can the child sit upright without support?</li>
                        <li>• Does the child grasp objects placed in their hand?</li>
                        <li>• Does the child crawl or attempt to stand?</li>
                        <li>• Does the child respond when called by name?</li>
                      </ul>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                      <p className="font-bold text-xs text-green-900 mb-1">Social & Communication Observations:</p>
                      <ul className="text-xs space-y-0.5 text-gray-700">
                        <li>• Does the child smile when spoken to?</li>
                        <li>• Does the child babble or make sounds?</li>
                        <li>• Does the child make eye contact with caregivers?</li>
                      </ul>
                    </div>
                  </div>
                )}
                {selectedLevel === 'N1' && (
                  <div className="space-y-2">
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                      <p className="font-bold text-xs text-blue-900 mb-1">Oral & Practical Activities:</p>
                      <ul className="text-xs space-y-0.5 text-gray-700">
                        <li>• Ask: "What colour is this?" (Show red, blue, yellow objects)</li>
                        <li>• Ask: "Can you count these blocks?" (1–5)</li>
                        <li>• Activity: Sing "Twinkle Twinkle Little Star" together</li>
                        <li>• Activity: Sort objects by colour (red group, blue group)</li>
                        <li>• Activity: Hold a pencil and draw a line</li>
                      </ul>
                    </div>
                  </div>
                )}
                {selectedLevel === 'N2' && (
                  <div className="space-y-2">
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                      <p className="font-bold text-xs text-blue-900 mb-1">Oral & Practical Activities:</p>
                      <ul className="text-xs space-y-0.5 text-gray-700">
                        <li>• Ask: "What shape is this?" (Show circle, square, triangle)</li>
                        <li>• Ask: "Can you count from 1 to 10?"</li>
                        <li>• Activity: Tell a short story and ask child to retell it</li>
                        <li>• Activity: Colour inside a circle without going outside the lines</li>
                        <li>• Activity: Cut along a straight line with scissors</li>
                        <li>• Activity: Identify 5 animals by their pictures</li>
                      </ul>
                    </div>
                  </div>
                )}
                {selectedLevel === 'KG1' && (
                  <div className="space-y-2">
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                      <p className="font-bold text-xs text-blue-900 mb-1">Literacy & Language (Oral):</p>
                      <ul className="text-xs space-y-0.5 text-gray-700">
                        <li>• "What letter is this?" (Show A, B, C... flash cards)</li>
                        <li>• "What sound does the letter S make?"</li>
                        <li>• "Can you recite the alphabet from A to Z?"</li>
                        <li>• Read a short story aloud and ask: "Who is the main character?"</li>
                      </ul>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                      <p className="font-bold text-xs text-green-900 mb-1">Numeracy (Practical):</p>
                      <ul className="text-xs space-y-0.5 text-gray-700">
                        <li>• "Count these pencils." (up to 20)</li>
                        <li>• "If I give you 2 sweets and 1 more, how many do you have?"</li>
                        <li>• Activity: Sort shapes (circles, squares, triangles)</li>
                        <li>• Activity: Arrange objects from smallest to largest</li>
                      </ul>
                    </div>
                    <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                      <p className="font-bold text-xs text-yellow-900 mb-1">Environmental Studies (Oral):</p>
                      <ul className="text-xs space-y-0.5 text-gray-700">
                        <li>• "Who are the members of your family?"</li>
                        <li>• "What is the name of your school?"</li>
                        <li>• "Name two animals you know."</li>
                        <li>• "What happens when it rains?"</li>
                      </ul>
                    </div>
                  </div>
                )}
                {selectedLevel === 'KG2' && (
                  <div className="space-y-2">
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                      <p className="font-bold text-xs text-blue-900 mb-1">Literacy & Language (Oral + Writing Readiness):</p>
                      <ul className="text-xs space-y-0.5 text-gray-700">
                        <li>• "Write the letter M." / "Write your name."</li>
                        <li>• "What word begins with the sound 'B'?"</li>
                        <li>• "Blend these sounds: C-A-T. What word is it?"</li>
                        <li>• Read a passage and ask: "What happened in the story?"</li>
                      </ul>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                      <p className="font-bold text-xs text-green-900 mb-1">Numeracy (Practical + Oral):</p>
                      <ul className="text-xs space-y-0.5 text-gray-700">
                        <li>• "Count from 1 to 50."</li>
                        <li>• "Write the number 15."</li>
                        <li>• "3 + 2 = ?" (Use objects to help)</li>
                        <li>• "5 - 1 = ?" (Take away 1 block from 5)</li>
                        <li>• Activity: Identify and name these shapes (rectangle, oval)</li>
                      </ul>
                    </div>
                    <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                      <p className="font-bold text-xs text-yellow-900 mb-1">Environmental Studies (Oral):</p>
                      <ul className="text-xs space-y-0.5 text-gray-700">
                        <li>• "What season are we in now — rainy or dry?"</li>
                        <li>• "Name three things we do to stay healthy."</li>
                        <li>• "Name two plants in our school compound."</li>
                        <li>• "Why do we wash our hands before eating?"</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div>
          {savedAssessments.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center border border-gray-100">
              <span className="text-5xl block mb-4">📂</span>
              <h3 className="text-lg font-semibold text-gray-700">No Saved Assessments</h3>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedAssessments.map(a => (
                <div key={a.id} className="bg-white rounded-xl p-5 border border-gray-100">
                  <h4 className="font-semibold text-gray-800">{a.childName}</h4>
                  <p className="text-xs text-gray-500">{a.classLevel} • {a.assessmentDate}</p>
                  <p className="text-xs text-gray-400 mt-1">By: {a.assessedBy}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
