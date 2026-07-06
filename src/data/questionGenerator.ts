import type { Question, ExamSection, ExamPaper, MarkingSchemeItem, ClassLevel, Subject, ExamType } from '../types';

let questionCounter = 0;

// Global set that tracks ALL questions ever generated in this session
// Prevents any question from repeating across ANY subject, class, or generation
const globalUsedQuestions = new Set<string>();

function uid(): string {
  return `q_${Date.now()}_${++questionCounter}_${Math.random().toString(36).substr(2,6)}`;
}

// Fisher-Yates shuffle for true randomness
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type QItem = { q: string; options: string[]; answer: string; type: string };

// Generate Venn diagram SVG based on set values
function generateVennDiagramSvg(setA: string, setB: string, aOnly: number, both: number, bOnly: number, neither: number, total: number): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 380 240">
    <rect x="5" y="5" width="370" height="230" fill="#f8fafc" stroke="#1e293b" stroke-width="2" rx="8"/>
    <text x="350" y="25" font-size="13" font-weight="bold" text-anchor="end" fill="#1e293b">U = ${total}</text>
    <circle cx="140" cy="125" r="75" fill="rgba(59,130,246,0.15)" stroke="#2563eb" stroke-width="2.5"/>
    <circle cx="240" cy="125" r="75" fill="rgba(239,68,68,0.15)" stroke="#dc2626" stroke-width="2.5"/>
    <text x="100" y="50" font-size="14" font-weight="bold" fill="#1d4ed8" text-anchor="middle">${setA}</text>
    <text x="280" y="50" font-size="14" font-weight="bold" fill="#dc2626" text-anchor="middle">${setB}</text>
    <text x="110" y="130" font-size="18" font-weight="bold" fill="#1e293b" text-anchor="middle">${aOnly}</text>
    <text x="190" y="130" font-size="18" font-weight="bold" fill="#7c3aed" text-anchor="middle">${both}</text>
    <text x="270" y="130" font-size="18" font-weight="bold" fill="#1e293b" text-anchor="middle">${bOnly}</text>
    <text x="340" y="215" font-size="15" font-weight="bold" fill="#64748b">${neither}</text>
  </svg>`)}`;
}

// Generate construction diagram SVG
function generateConstructionSvg(type: 'angle_bisector' | 'perpendicular' | 'triangle_60'): string {
  if (type === 'angle_bisector') {
    return `data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 220">
      <line x1="30" y1="180" x2="270" y2="180" stroke="#1e293b" stroke-width="2"/>
      <line x1="30" y1="180" x2="200" y2="40" stroke="#1e293b" stroke-width="2"/>
      <path d="M 80,180 A 50,50 0 0,1 67,145" fill="none" stroke="#2563eb" stroke-width="1.5" stroke-dasharray="5,4"/>
      <line x1="30" y1="180" x2="240" y2="100" stroke="#dc2626" stroke-width="1.5" stroke-dasharray="6,4"/>
      <text x="90" y="175" font-size="11" fill="#1e293b">60°</text>
      <text x="60" y="155" font-size="10" fill="#dc2626">30°</text>
      <text x="100" y="190" font-size="10" fill="#dc2626">30°</text>
      <text x="250" y="95" font-size="11" fill="#dc2626" font-weight="bold">Bisector</text>
      <circle cx="72" cy="162" r="2.5" fill="#2563eb"/>
      <circle cx="82" cy="170" r="2.5" fill="#2563eb"/>
      <text x="15" y="195" font-size="12" font-weight="bold" fill="#1e293b">O</text>
    </svg>`)}`;
  }
  if (type === 'perpendicular') {
    return `data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 220">
      <line x1="30" y1="150" x2="270" y2="150" stroke="#1e293b" stroke-width="2"/>
      <line x1="150" y1="150" x2="150" y2="30" stroke="#dc2626" stroke-width="2"/>
      <rect x="150" y="138" width="12" height="12" fill="none" stroke="#1e293b" stroke-width="1.5"/>
      <path d="M 100,150 A 50,50 0 0,1 150,100" fill="none" stroke="#2563eb" stroke-width="1.5" stroke-dasharray="5,4"/>
      <path d="M 200,150 A 50,50 0 0,0 150,100" fill="none" stroke="#2563eb" stroke-width="1.5" stroke-dasharray="5,4"/>
      <circle cx="100" cy="150" r="3" fill="#2563eb"/>
      <circle cx="200" cy="150" r="3" fill="#2563eb"/>
      <circle cx="150" cy="100" r="3" fill="#dc2626"/>
      <text x="145" y="170" font-size="11" font-weight="bold" fill="#1e293b">P</text>
      <text x="25" y="165" font-size="11" fill="#1e293b">A</text>
      <text x="265" y="165" font-size="11" fill="#1e293b">B</text>
      <text x="155" y="25" font-size="11" fill="#dc2626" font-weight="bold">⊥</text>
      <text x="160" y="130" font-size="9" fill="#1e293b">90°</text>
    </svg>`)}`;
  }
  // triangle_60
  return `data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 240">
    <line x1="50" y1="200" x2="250" y2="200" stroke="#1e293b" stroke-width="2"/>
    <line x1="50" y1="200" x2="150" y2="27" stroke="#1e293b" stroke-width="2"/>
    <line x1="250" y1="200" x2="150" y2="27" stroke="#1e293b" stroke-width="2"/>
    <path d="M 80,200 A 30,30 0 0,1 65,180" fill="none" stroke="#2563eb" stroke-width="1.5"/>
    <text x="80" y="192" font-size="11" fill="#2563eb">60°</text>
    <text x="40" y="215" font-size="12" font-weight="bold" fill="#1e293b">A</text>
    <text x="250" y="215" font-size="12" font-weight="bold" fill="#1e293b">B</text>
    <text x="145" y="20" font-size="12" font-weight="bold" fill="#1e293b">C</text>
    <text x="130" y="220" font-size="11" fill="#64748b">8 cm</text>
    <circle cx="50" cy="200" r="3" fill="#2563eb"/>
    <circle cx="250" cy="200" r="3" fill="#2563eb"/>
    <circle cx="150" cy="27" r="3" fill="#dc2626"/>
  </svg>`)}`;
}

// NaCCA class level ranges
const LOWER_PRIMARY: ClassLevel[] = ['Basic 1', 'Basic 2', 'Basic 3'];
const UPPER_PRIMARY: ClassLevel[] = ['Basic 4', 'Basic 5', 'Basic 6'];
const JHS: ClassLevel[] = ['Basic 7', 'Basic 8', 'Basic 9'];

function isLevel(cl: ClassLevel, levels: ClassLevel[]): boolean { return levels.includes(cl); }

// Generate dynamic NaCCA-aligned math questions appropriate to class level
function generateMathVariations(classLevel: ClassLevel, topics: string[]): QItem[] {
  const v: QItem[] = [];
  const r = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
  const w = (ans: number, spread: number) => {
    const s = new Set<number>([ans]);
    while (s.size < 4) s.add(ans + r(-spread, spread) || ans + s.size);
    return shuffle(Array.from(s)).map(String);
  };

  if (isLevel(classLevel, LOWER_PRIMARY)) {
    // Basic 1-3: simple arithmetic, counting, shapes NaCCA SBC
    for (let i = 0; i < 8; i++) { const a = r(1, 20); const b = r(1, 20); v.push({ q: `${a} + ${b} = ___`, options: w(a+b, 5), answer: String(a+b), type: 'mc' }); }
    for (let i = 0; i < 5; i++) { const a = r(10, 30); const b = r(1, a-1); v.push({ q: `${a} - ${b} = ___`, options: w(a-b, 4), answer: String(a-b), type: 'mc' }); }
    if (topics.some(t => t.includes('Multipl'))) { for (let i = 0; i < 5; i++) { const a = r(2, 5); const b = r(2, 5); v.push({ q: `${a} × ${b} = ___`, options: w(a*b, 5), answer: String(a*b), type: 'mc' }); } }
    v.push({ q: 'How many sides does a rectangle have?', options: ['3', '4', '5', '6'], answer: '4', type: 'mc' });
    v.push({ q: 'Which shape has 3 sides?', options: ['Square', 'Triangle', 'Circle', 'Rectangle'], answer: 'Triangle', type: 'mc' });
    v.push({ q: 'Count: 5, 10, 15, ___', options: ['16', '18', '20', '25'], answer: '20', type: 'mc' });
    v.push({ q: 'What is the value of the digit 3 in 35?', options: ['3', '30', '35', '5'], answer: '30', type: 'mc' });
    v.push({ q: 'Kofi has GH₵5. He buys a pen for GH₵2. How much change does he get?', options: ['GH₵1', 'GH₵2', 'GH₵3', 'GH₵7'], answer: 'GH₵3', type: 'mc' });
  }

  if (isLevel(classLevel, UPPER_PRIMARY)) {
    // Basic 4-6: fractions, decimals, geometry, data handling NaCCA SBC
    for (let i = 0; i < 6; i++) { const a = r(10, 99); const b = r(10, 99); v.push({ q: `${a} × ${b} = ___`, options: w(a*b, 50), answer: String(a*b), type: 'mc' }); }
    v.push({ q: 'What is 1/2 of 48?', options: ['20', '22', '24', '28'], answer: '24', type: 'mc' });
    v.push({ q: 'What is 3/4 of 60?', options: ['40', '45', '50', '55'], answer: '45', type: 'mc' });
    v.push({ q: 'Simplify 8/12 to its lowest term.', options: ['4/6', '2/3', '3/4', '1/2'], answer: '2/3', type: 'mc' });
    v.push({ q: 'Convert 0.75 to a fraction.', options: ['3/5', '7/10', '3/4', '1/4'], answer: '3/4', type: 'mc' });
    v.push({ q: 'What is 25% of GH₵200?', options: ['GH₵25', 'GH₵50', 'GH₵75', 'GH₵100'], answer: 'GH₵50', type: 'mc' });
    v.push({ q: 'The perimeter of a square with side 6cm is ___', options: ['12cm', '18cm', '24cm', '36cm'], answer: '24cm', type: 'mc' });
    v.push({ q: 'Express the ratio 6:9 in its simplest form.', options: ['1:2', '2:3', '3:4', '6:9'], answer: '2:3', type: 'mc' });
    v.push({ q: 'If x + 7 = 15, find x.', options: ['6', '7', '8', '9'], answer: '8', type: 'mc' });
    v.push({ q: 'Arrange in ascending order: 0.5, 0.25, 0.75, 0.1', options: ['0.1, 0.25, 0.5, 0.75', '0.75, 0.5, 0.25, 0.1', '0.25, 0.1, 0.5, 0.75', '0.5, 0.1, 0.25, 0.75'], answer: '0.1, 0.25, 0.5, 0.75', type: 'mc' });
  }

  if (isLevel(classLevel, JHS)) {
    // Basic 7-9: algebra, sets, trigonometry, statistics, graphs, pie chart, circumference NaCCA CCP
    for (let i = 0; i < 4; i++) { const a = r(2, 8); const b = r(3, 15); const c = a*r(2,6)+b; v.push({ q: `Solve: ${a}x + ${b} = ${c}`, options: w((c-b)/a, 3), answer: String((c-b)/a), type: 'mc' }); }
    v.push({ q: 'If A = {1,2,3,4} and B = {3,4,5,6}, find A ∩ B.', options: ['{1,2}', '{3,4}', '{5,6}', '{1,2,3,4,5,6}'], answer: '{3,4}', type: 'mc' });
    v.push({ q: 'If A = {a,b,c,d,e}, find n(A).', options: ['3', '4', '5', '6'], answer: '5', type: 'mc' });
    v.push({ q: 'Find the median of 3, 7, 2, 9, 5.', options: ['3', '5', '7', '9'], answer: '5', type: 'mc' });
    v.push({ q: 'The gradient of the line y = 3x - 5 is ___', options: ['-5', '-3', '3', '5'], answer: '3', type: 'mc' });
    v.push({ q: 'Calculate the area of a triangle with base 10cm and height 6cm.', options: ['16cm²', '30cm²', '60cm²', '20cm²'], answer: '30cm²', type: 'mc' });
    v.push({ q: 'The volume of a cuboid is length × width × ___', options: ['length', 'width', 'height', 'area'], answer: 'height', type: 'mc' });
    v.push({ q: 'Express 45% as a decimal.', options: ['0.045', '0.45', '4.5', '45.0'], answer: '0.45', type: 'mc' });
    v.push({ q: 'Factorise: x² - 9', options: ['(x-3)(x-3)', '(x+9)(x-1)', '(x+3)(x-3)', '(x-9)(x+1)'], answer: '(x+3)(x-3)', type: 'mc' });
    v.push({ q: 'If sin θ = 3/5, what is cos θ?', options: ['3/5', '4/5', '5/3', '3/4'], answer: '4/5', type: 'mc' });
    v.push({ q: 'A bag contains 3 red and 5 blue balls. What is the probability of picking a red ball?', options: ['1/8', '3/8', '5/8', '3/5'], answer: '3/8', type: 'mc' });
    v.push({ q: 'Simplify: 2(3x + 4) - 5x', options: ['x + 8', '11x + 8', 'x + 4', '6x + 4'], answer: 'x + 8', type: 'mc' });

    // ========== SETS (NaCCA CCP) ==========
    v.push({ q: 'If P = {2,4,6,8} and Q = {1,2,3,4}, find P ∪ Q.', options: ['{2,4}', '{1,2,3,4,6,8}', '{6,8}', '{1,3}'], answer: '{1,2,3,4,6,8}', type: 'mc' });
    v.push({ q: 'If n(A) = 10, n(B) = 8 and n(A ∩ B) = 3, find n(A ∪ B).', options: ['15', '18', '21', '5'], answer: '15', type: 'mc' });
    v.push({ q: 'The complement of set A is written as ___', options: ['A∪B', 'A∩B', "A'", 'A×B'], answer: "A'", type: 'mc' });
    v.push({ q: 'In a class of 40, 25 play football and 20 play volleyball. If 10 play both, how many play neither?', options: ['5', '10', '15', '0'], answer: '5', type: 'mc' });
    v.push({ q: 'If U = {1,2,3,4,5,6,7,8,9,10} and A = {2,4,6,8,10}, find n(A\').', options: ['3', '4', '5', '6'], answer: '5', type: 'mc' });
    v.push({ q: 'The set with no element is called ___', options: ['Universal set', 'Empty set', 'Subset', 'Finite set'], answer: 'Empty set', type: 'mc' });

    // ========== CIRCUMFERENCE & CIRCLE (NaCCA CCP — Take π = 22/7) ==========
    const radii = [7, 14, 21, 3.5];
    const ri = radii[r(0, radii.length - 1)];
    const circ = Math.round(2 * (22/7) * ri * 100) / 100;
    v.push({ q: `Calculate the circumference of a circle with radius ${ri}cm. (Take π = 22/7)`, options: w(circ, 10).map(x => x + 'cm'), answer: circ + 'cm', type: 'mc' });
    v.push({ q: 'The formula for the circumference of a circle is ___', options: ['πr²', '2πr', 'πd²', '2πr²'], answer: '2πr', type: 'mc' });
    const di = [14, 28, 42, 7];
    const dd = di[r(0, di.length - 1)];
    const circD = Math.round((22/7) * dd * 100) / 100;
    v.push({ q: `Find the circumference of a circle with diameter ${dd}cm. (Take π = 22/7)`, options: w(circD, 8).map(x => x + 'cm'), answer: circD + 'cm', type: 'mc' });
    const areaR = radii[r(0, radii.length - 1)];
    const areaAns = Math.round((22/7) * areaR * areaR * 100) / 100;
    v.push({ q: `Calculate the area of a circle with radius ${areaR}cm. (Take π = 22/7)`, options: w(areaAns, 20).map(x => x + 'cm²'), answer: areaAns + 'cm²', type: 'mc' });
    v.push({ q: 'The area of a circle is given by the formula ___', options: ['2πr', 'πr²', 'πd', '2πr²'], answer: 'πr²', type: 'mc' });

    // ========== GRAPHS & COORDINATES (NaCCA CCP) ==========
    v.push({ q: 'The point where a line crosses the y-axis is called the ___', options: ['Gradient', 'x-intercept', 'y-intercept', 'Origin'], answer: 'y-intercept', type: 'mc' });
    v.push({ q: 'The coordinates of the origin on a Cartesian plane are ___', options: ['(1,1)', '(0,1)', '(1,0)', '(0,0)'], answer: '(0,0)', type: 'mc' });
    v.push({ q: 'What is the gradient of a horizontal line?', options: ['1', '-1', '0', 'Undefined'], answer: '0', type: 'mc' });
    v.push({ q: 'What is the gradient of a vertical line?', options: ['1', '-1', '0', 'Undefined'], answer: 'Undefined', type: 'mc' });
    v.push({ q: 'The equation y = 2x + 3 is a ___ equation.', options: ['Quadratic', 'Linear', 'Cubic', 'Simultaneous'], answer: 'Linear', type: 'mc' });
    v.push({ q: 'Find the y-intercept of the line y = 4x - 7.', options: ['4', '-4', '7', '-7'], answer: '-7', type: 'mc' });
    v.push({ q: 'The point (3, 5) means x = ___ and y = ___.', options: ['x=5, y=3', 'x=3, y=5', 'x=8, y=2', 'x=3, y=3'], answer: 'x=3, y=5', type: 'mc' });

    // ========== PIE CHART / DATA HANDLING (NaCCA CCP) ==========
    v.push({ q: 'A pie chart is drawn using a ___', options: ['Ruler', 'Protractor', 'Set square', 'Compass'], answer: 'Protractor', type: 'mc' });
    v.push({ q: 'The total angle in a pie chart is ___', options: ['90°', '180°', '270°', '360°'], answer: '360°', type: 'mc' });
    v.push({ q: 'In a pie chart, if a sector represents 25% of the data, its angle is ___', options: ['25°', '45°', '90°', '180°'], answer: '90°', type: 'mc' });
    v.push({ q: 'If 60 students chose Mathematics out of 180 students in a survey, what angle represents Mathematics on a pie chart?', options: ['60°', '90°', '120°', '180°'], answer: '120°', type: 'mc' });
    v.push({ q: 'A bar graph uses ___ to represent data.', options: ['Lines', 'Bars', 'Dots', 'Curves'], answer: 'Bars', type: 'mc' });
    v.push({ q: 'The mean of 4, 6, 8, 10 and 12 is ___', options: ['6', '7', '8', '10'], answer: '8', type: 'mc' });
    v.push({ q: 'The range of the data set {3, 7, 12, 5, 9} is ___', options: ['5', '7', '9', '12'], answer: '9', type: 'mc' });
    v.push({ q: 'The mode of the data 2, 3, 3, 5, 7, 3, 8 is ___', options: ['2', '3', '5', '7'], answer: '3', type: 'mc' });
  }

  return v;
}

// Generate NaCCA-aligned dynamic questions for non-math subjects based on class level
function generateLevelQuestions(subject: string, classLevel: ClassLevel, topics: string[]): QItem[] {
  const v: QItem[] = [];
  const isLower = isLevel(classLevel, LOWER_PRIMARY);
  const isUpper = isLevel(classLevel, UPPER_PRIMARY);
  const isJhs = isLevel(classLevel, JHS);

  if (subject === 'Science') {
    if (isLower) {
      v.push({ q: 'Which of these is a source of light?', options: ['Stone', 'Sun', 'Soil', 'Water'], answer: 'Sun', type: 'mc' });
      v.push({ q: 'We use our ___ to see.', options: ['Ears', 'Nose', 'Eyes', 'Mouth'], answer: 'Eyes', type: 'mc' });
      v.push({ q: 'Which of these is NOT a living thing?', options: ['Dog', 'Tree', 'Stone', 'Fish'], answer: 'Stone', type: 'mc' });
      v.push({ q: 'Rain comes from ___', options: ['The ground', 'Clouds', 'Trees', 'Rivers'], answer: 'Clouds', type: 'mc' });
      v.push({ q: 'Plants need ___ to grow.', options: ['Stones', 'Water and sunlight', 'Darkness', 'Sand only'], answer: 'Water and sunlight', type: 'mc' });
    }
    if (isUpper) {
      v.push({ q: 'The process of changing liquid to gas is called ___', options: ['Condensation', 'Freezing', 'Evaporation', 'Melting'], answer: 'Evaporation', type: 'mc' });
      v.push({ q: 'Soil that is good for farming is called ___ soil.', options: ['Sandy', 'Clay', 'Loamy', 'Gravel'], answer: 'Loamy', type: 'mc' });
      v.push({ q: 'The SI unit of force is ___', options: ['Joule', 'Newton', 'Watt', 'Pascal'], answer: 'Newton', type: 'mc' });
      v.push({ q: 'A circuit needs a ___ to be complete.', options: ['Switch', 'Magnet', 'Ruler', 'Pencil'], answer: 'Switch', type: 'mc' });
    }
    if (isJhs) {
      v.push({ q: 'Acids turn blue litmus paper ___', options: ['Blue', 'Green', 'Red', 'Yellow'], answer: 'Red', type: 'mc' });
      v.push({ q: 'The chemical symbol for water is ___', options: ['H₂O', 'CO₂', 'NaCl', 'O₂'], answer: 'H₂O', type: 'mc' });
      v.push({ q: 'Photosynthesis takes place in the ___', options: ['Root', 'Stem', 'Leaf', 'Flower'], answer: 'Leaf', type: 'mc' });
      v.push({ q: 'An element is made up of only one type of ___', options: ['Compound', 'Mixture', 'Atom', 'Molecule'], answer: 'Atom', type: 'mc' });
      v.push({ q: 'In an electric circuit, current is measured in ___', options: ['Volts', 'Ohms', 'Amperes', 'Watts'], answer: 'Amperes', type: 'mc' });
    }
  }

  if (subject === 'Social Studies') {
    if (isLower) {
      v.push({ q: 'The capital of Ghana is ___', options: ['Kumasi', 'Tamale', 'Accra', 'Cape Coast'], answer: 'Accra', type: 'mc' });
      v.push({ q: 'Who is the head of your family?', options: ['Teacher', 'Father or Mother', 'Friend', 'Doctor'], answer: 'Father or Mother', type: 'mc' });
      v.push({ q: 'We should ___ our environment.', options: ['Destroy', 'Pollute', 'Protect', 'Ignore'], answer: 'Protect', type: 'mc' });
    }
    if (isUpper || isJhs) {
      v.push({ q: 'Ghana gained independence on 6th March ___', options: ['1945', '1957', '1960', '1966'], answer: '1957', type: 'mc' });
      v.push({ q: 'The first President of Ghana was ___', options: ['J.B. Danquah', 'Kwame Nkrumah', 'K.A. Busia', 'J.J. Rawlings'], answer: 'Kwame Nkrumah', type: 'mc' });
      v.push({ q: 'The national flag of Ghana has ___ stars.', options: ['1', '2', '3', '5'], answer: '1', type: 'mc' });
    }
    if (isJhs) {
      v.push({ q: 'ECOWAS stands for ___', options: ['Economic Community of West African States', 'East Central Organisation of West African States', 'European Community of Western States', 'Economic Council of World States'], answer: 'Economic Community of West African States', type: 'mc' });
      v.push({ q: 'The Parliament of Ghana is located in ___', options: ['Kumasi', 'Accra', 'Tamale', 'Takoradi'], answer: 'Accra', type: 'mc' });
    }
  }

  if (subject === 'Computing') {
    if (isLower) {
      v.push({ q: 'Which part of the computer do you type with?', options: ['Mouse', 'Monitor', 'Keyboard', 'Speaker'], answer: 'Keyboard', type: 'mc' });
      v.push({ q: 'The ___ shows pictures and text on the computer.', options: ['Keyboard', 'Mouse', 'Monitor', 'CPU'], answer: 'Monitor', type: 'mc' });
    }
    if (isUpper) {
      v.push({ q: 'Microsoft Word is used for ___', options: ['Drawing', 'Typing documents', 'Playing music', 'Browsing'], answer: 'Typing documents', type: 'mc' });
      v.push({ q: 'Which key do you press to make a capital letter?', options: ['Enter', 'Shift', 'Space', 'Tab'], answer: 'Shift', type: 'mc' });
      v.push({ q: 'A flowchart uses a ___ shape for decisions.', options: ['Rectangle', 'Oval', 'Diamond', 'Circle'], answer: 'Diamond', type: 'mc' });
    }
    if (isJhs) {
      v.push({ q: 'HTML is used for creating ___', options: ['Spreadsheets', 'Databases', 'Web pages', 'Presentations'], answer: 'Web pages', type: 'mc' });
      v.push({ q: 'Which of the following is an example of system software?', options: ['Microsoft Word', 'Google Chrome', 'Windows Operating System', 'Adobe Photoshop'], answer: 'Windows Operating System', type: 'mc' });
      v.push({ q: 'A computer virus is a type of ___', options: ['Hardware', 'Malware', 'Software update', 'Network'], answer: 'Malware', type: 'mc' });
      v.push({ q: 'In programming, a loop is used to ___', options: ['Delete files', 'Repeat instructions', 'Print documents', 'Connect to internet'], answer: 'Repeat instructions', type: 'mc' });
    }
  }

  if (subject === 'RME') {
    if (isLower) {
      v.push({ q: 'Who created the world according to Christians?', options: ['Angels', 'Humans', 'God', 'Animals'], answer: 'God', type: 'mc' });
      v.push({ q: 'We should show ___ to our parents.', options: ['Disrespect', 'Respect', 'Hatred', 'Anger'], answer: 'Respect', type: 'mc' });
    }
    if (isUpper || isJhs) {
      v.push({ q: 'The holy book of Muslims is the ___', options: ['Bible', 'Torah', 'Quran', 'Vedas'], answer: 'Quran', type: 'mc' });
      v.push({ q: 'Easter celebrates the ___ of Jesus Christ.', options: ['Birth', 'Death', 'Resurrection', 'Baptism'], answer: 'Resurrection', type: 'mc' });
    }
  }

  if (subject === 'Creative Arts') {
    v.push({ q: 'Red, blue and yellow are called ___ colours.', options: ['Secondary', 'Tertiary', 'Primary', 'Neutral'], answer: 'Primary', type: 'mc' });
    v.push({ q: 'Mixing red and blue gives ___', options: ['Green', 'Orange', 'Purple', 'Brown'], answer: 'Purple', type: 'mc' });
    if (isJhs) {
      v.push({ q: 'Kente cloth is associated with the ___ people of Ghana.', options: ['Ga', 'Ewe', 'Ashanti', 'Dagomba'], answer: 'Ashanti', type: 'mc' });
      v.push({ q: 'The Adinkra symbol "Sankofa" means ___', options: ['Bravery', 'Go back and get it', 'Unity', 'Strength'], answer: 'Go back and get it', type: 'mc' });
    }
  }

  if (subject === 'Career Technology') {
    if (isLower || isUpper) {
      v.push({ q: 'A screwdriver is used for ___', options: ['Cutting wood', 'Driving screws', 'Measuring', 'Painting'], answer: 'Driving screws', type: 'mc' });
    }
    if (isJhs) {
      v.push({ q: 'An entrepreneur is a person who ___', options: ['Works for government', 'Starts and manages a business', 'Teaches in school', 'Drives a taxi'], answer: 'Starts and manages a business', type: 'mc' });
      v.push({ q: 'The first step in the design process is ___', options: ['Testing', 'Making', 'Identifying the problem', 'Evaluating'], answer: 'Identifying the problem', type: 'mc' });
    }
  }

  void topics; // topics param used for context
  return v;
}

// Practical question images for B7-B9
const PRACTICAL_IMAGES: Record<string, string[]> = {
  'Science': [
    '/images/science-practical-1.jpg',
  ],
  'Computing': [
    '/images/computing-flowchart-1.jpg',
  ],
  'Creative Arts': [
    '/images/creative-arts-adinkra-1.jpg',
  ],
  'Career Technology': [
    '/images/career-tech-design-1.jpg',
  ],
};

// Question banks organized by subject, level, topic
const QUESTION_BANKS: Record<string, Record<string, { q: string; options?: string[]; answer: string; type: string }[]>> = {
  'Mathematics': {
    'Counting 1-100': [
      { q: 'What number comes after 15?', options: ['14', '16', '17', '13'], answer: '16', type: 'mc' },
      { q: 'What number comes before 20?', options: ['18', '19', '21', '17'], answer: '19', type: 'mc' },
      { q: 'Count and write the next number: 5, 10, 15, ___', options: ['16', '20', '25', '18'], answer: '20', type: 'mc' },
      { q: 'Which number is the biggest?', options: ['45', '54', '34', '43'], answer: '54', type: 'mc' },
      { q: 'What is the number between 8 and 10?', options: ['7', '9', '11', '6'], answer: '9', type: 'mc' },
    ],
    'Addition': [
      { q: '5 + 3 = ___', options: ['6', '7', '8', '9'], answer: '8', type: 'mc' },
      { q: '12 + 7 = ___', options: ['17', '18', '19', '20'], answer: '19', type: 'mc' },
      { q: '25 + 15 = ___', options: ['35', '40', '45', '30'], answer: '40', type: 'mc' },
      { q: '8 + 9 = ___', options: ['15', '16', '17', '18'], answer: '17', type: 'mc' },
      { q: '34 + 26 = ___', options: ['50', '60', '58', '62'], answer: '60', type: 'mc' },
      { q: 'Add 45 and 35.', options: ['70', '75', '80', '85'], answer: '80', type: 'mc' },
      { q: '99 + 1 = ___', options: ['98', '99', '100', '101'], answer: '100', type: 'mc' },
    ],
    'Subtraction': [
      { q: '10 - 4 = ___', options: ['5', '6', '7', '8'], answer: '6', type: 'mc' },
      { q: '15 - 8 = ___', options: ['5', '6', '7', '8'], answer: '7', type: 'mc' },
      { q: '20 - 13 = ___', options: ['5', '6', '7', '8'], answer: '7', type: 'mc' },
      { q: '50 - 25 = ___', options: ['20', '25', '30', '35'], answer: '25', type: 'mc' },
    ],
    'Multiplication': [
      { q: '3 × 4 = ___', options: ['10', '11', '12', '13'], answer: '12', type: 'mc' },
      { q: '5 × 6 = ___', options: ['25', '30', '35', '40'], answer: '30', type: 'mc' },
      { q: '7 × 8 = ___', options: ['54', '56', '58', '60'], answer: '56', type: 'mc' },
      { q: '9 × 9 = ___', options: ['72', '81', '90', '79'], answer: '81', type: 'mc' },
    ],
    'Division': [
      { q: '12 ÷ 3 = ___', options: ['3', '4', '5', '6'], answer: '4', type: 'mc' },
      { q: '20 ÷ 5 = ___', options: ['3', '4', '5', '6'], answer: '4', type: 'mc' },
      { q: '36 ÷ 6 = ___', options: ['5', '6', '7', '8'], answer: '6', type: 'mc' },
    ],
    'Fractions': [
      { q: 'What is ½ of 10?', options: ['3', '4', '5', '6'], answer: '5', type: 'mc' },
      { q: 'Which fraction is bigger: ½ or ¼?', options: ['½', '¼', 'They are equal', 'Cannot tell'], answer: '½', type: 'mc' },
      { q: '¼ + ¼ = ___', options: ['¼', '½', '¾', '1'], answer: '½', type: 'mc' },
    ],
    'Algebra': [
      { q: 'Solve: x + 5 = 12', options: ['5', '6', '7', '8'], answer: '7', type: 'mc' },
      { q: 'Solve: 2x = 10', options: ['3', '4', '5', '6'], answer: '5', type: 'mc' },
      { q: 'If y - 3 = 7, find y.', options: ['8', '9', '10', '11'], answer: '10', type: 'mc' },
    ],
    'Geometry': [
      { q: 'How many sides does a triangle have?', options: ['2', '3', '4', '5'], answer: '3', type: 'mc' },
      { q: 'A rectangle has ___ right angles.', options: ['2', '3', '4', '5'], answer: '4', type: 'mc' },
      { q: 'What is the name of a shape with 6 sides?', options: ['Pentagon', 'Hexagon', 'Octagon', 'Heptagon'], answer: 'Hexagon', type: 'mc' },
    ],
    'Integers': [
      { q: 'What is -3 + 5?', options: ['-2', '2', '8', '-8'], answer: '2', type: 'mc' },
      { q: 'Which is smaller: -5 or -2?', options: ['-5', '-2', 'Both are equal', '0'], answer: '-5', type: 'mc' },
    ],
    'Number and Numeration': [
      { q: 'Express 45,678 in words.', options: ['Forty-five thousand six hundred and seventy-eight', 'Four thousand five hundred and sixty-seven eight', 'Forty-five six seven eight', 'Four hundred fifty-six thousand seventy-eight'], answer: 'Forty-five thousand six hundred and seventy-eight', type: 'mc' },
      { q: 'What is the place value of 7 in 3,745?', options: ['7', '70', '700', '7000'], answer: '700', type: 'mc' },
    ],
    'Statistics': [
      { q: 'Find the mean of 4, 6, 8, 10.', options: ['5', '6', '7', '8'], answer: '7', type: 'mc' },
      { q: 'What is the mode of 2, 3, 3, 5, 7?', options: ['2', '3', '5', '7'], answer: '3', type: 'mc' },
    ],
    'Percentages': [
      { q: 'What is 25% of 80?', options: ['15', '20', '25', '30'], answer: '20', type: 'mc' },
      { q: 'Convert ½ to a percentage.', options: ['25%', '40%', '50%', '75%'], answer: '50%', type: 'mc' },
    ],
    'Ratio and Proportion': [
      { q: 'Simplify the ratio 12:8.', options: ['2:3', '3:2', '4:3', '6:4'], answer: '3:2', type: 'mc' },
    ],
    'Sets': [
      { q: 'If A = {1,2,3} and B = {2,3,4}, find A ∩ B.', options: ['{1,2}', '{2,3}', '{3,4}', '{1,4}'], answer: '{2,3}', type: 'mc' },
    ],
    'Shapes': [
      { q: 'How many sides does a square have?', options: ['3', '4', '5', '6'], answer: '4', type: 'mc' },
      { q: 'A circle has ___ corners.', options: ['0', '1', '2', '4'], answer: '0', type: 'mc' },
    ],
    'Patterns': [
      { q: 'What comes next: 2, 4, 6, 8, ___?', options: ['9', '10', '11', '12'], answer: '10', type: 'mc' },
    ],
    'Measurement': [
      { q: 'How many centimeters are in 1 meter?', options: ['10', '100', '1000', '50'], answer: '100', type: 'mc' },
    ],
    'Money': [
      { q: 'If you have GH₵5 and you buy a book for GH₵3, how much change do you get?', options: ['GH₵1', 'GH₵2', 'GH₵3', 'GH₵4'], answer: 'GH₵2', type: 'mc' },
    ],
    'Time': [
      { q: 'How many minutes are in one hour?', options: ['30', '45', '60', '100'], answer: '60', type: 'mc' },
    ],
    'Decimals': [
      { q: '0.5 + 0.3 = ___', options: ['0.2', '0.8', '0.53', '8'], answer: '0.8', type: 'mc' },
    ],
    'Probability': [
      { q: 'A coin is tossed. What is the probability of getting a head?', options: ['¼', '½', '¾', '1'], answer: '½', type: 'mc' },
    ],
    'Whole Numbers': [
      { q: 'What is the sum of 234 and 567?', options: ['701', '801', '791', '811'], answer: '801', type: 'mc' },
    ],
    'Ratio': [
      { q: 'Express the ratio 4:6 in its simplest form.', options: ['1:2', '2:3', '3:4', '4:6'], answer: '2:3', type: 'mc' },
    ],
    'Proportion': [
      { q: 'If 3 books cost GH₵15, how much will 5 books cost?', options: ['GH₵20', 'GH₵25', 'GH₵30', 'GH₵35'], answer: 'GH₵25', type: 'mc' },
    ],
    'Linear Equations': [
      { q: 'Solve: 3x + 2 = 14', options: ['2', '3', '4', '5'], answer: '4', type: 'mc' },
    ],
    'Quadratic Equations': [
      { q: 'Solve: x² = 25', options: ['±3', '±4', '±5', '±6'], answer: '±5', type: 'mc' },
    ],
    'Trigonometry': [
      { q: 'In a right triangle, the ratio of opposite to hypotenuse is called ___', options: ['Cosine', 'Tangent', 'Sine', 'Cotangent'], answer: 'Sine', type: 'mc' },
    ],
    'Vectors': [
      { q: 'A vector has both ___ and ___', options: ['Size and shape', 'Magnitude and direction', 'Length and width', 'Area and volume'], answer: 'Magnitude and direction', type: 'mc' },
    ],
    'Data Handling': [
      { q: 'Which graph uses bars to represent data?', options: ['Line graph', 'Bar graph', 'Pie chart', 'Histogram'], answer: 'Bar graph', type: 'mc' },
    ],
  },
  'English Language': {
    'Nouns': [
      { q: 'Which of the following is a noun?', options: ['Run', 'Beautiful', 'Table', 'Quickly'], answer: 'Table', type: 'mc' },
      { q: 'A ___ is the name of a person, place, or thing.', options: ['Verb', 'Adjective', 'Noun', 'Adverb'], answer: 'Noun', type: 'mc' },
      { q: 'Which is a proper noun?', options: ['boy', 'city', 'Accra', 'river'], answer: 'Accra', type: 'mc' },
    ],
    'Verbs': [
      { q: 'Which word is a verb?', options: ['Chair', 'Sing', 'Beautiful', 'Tall'], answer: 'Sing', type: 'mc' },
      { q: 'The past tense of "go" is ___', options: ['goes', 'going', 'went', 'gone'], answer: 'went', type: 'mc' },
    ],
    'Pronouns': [
      { q: 'Which is a pronoun?', options: ['Dog', 'She', 'Big', 'Walk'], answer: 'She', type: 'mc' },
      { q: '___ is my friend. (Choose the correct pronoun)', options: ['Him', 'He', 'His', 'Her'], answer: 'He', type: 'mc' },
    ],
    'Adjectives': [
      { q: 'Which word is an adjective?', options: ['Run', 'Beautiful', 'Quickly', 'Sing'], answer: 'Beautiful', type: 'mc' },
      { q: 'The ___ girl won the race.', options: ['tall', 'ran', 'quick', 'slowly'], answer: 'tall', type: 'mc' },
    ],
    'Tenses': [
      { q: 'She ___ to school every day. (Present tense)', options: ['go', 'goes', 'went', 'gone'], answer: 'goes', type: 'mc' },
      { q: 'They ___ football yesterday.', options: ['play', 'plays', 'played', 'playing'], answer: 'played', type: 'mc' },
    ],
    'Parts of Speech': [
      { q: 'An adverb modifies a ___', options: ['Noun', 'Pronoun', 'Verb', 'Conjunction'], answer: 'Verb', type: 'mc' },
      { q: 'Which is a conjunction?', options: ['and', 'big', 'run', 'the'], answer: 'and', type: 'mc' },
      { q: '"The" is an example of a/an ___', options: ['Noun', 'Article', 'Verb', 'Adjective'], answer: 'Article', type: 'mc' },
    ],
    'Vocabulary': [
      { q: 'The word "enormous" means ___', options: ['Small', 'Very big', 'Fast', 'Slow'], answer: 'Very big', type: 'mc' },
      { q: 'The opposite of "happy" is ___', options: ['Glad', 'Sad', 'Angry', 'Excited'], answer: 'Sad', type: 'mc' },
    ],
    'Grammar': [
      { q: 'Which sentence is correct?', options: ['She don\'t like it.', 'She doesn\'t like it.', 'She not like it.', 'She no like it.'], answer: 'She doesn\'t like it.', type: 'mc' },
      { q: 'Choose the correct form: The children ___ playing.', options: ['is', 'are', 'was', 'am'], answer: 'are', type: 'mc' },
    ],
    'Punctuation': [
      { q: 'Which punctuation mark ends a question?', options: ['.', '!', '?', ','], answer: '?', type: 'mc' },
      { q: 'A sentence always begins with a ___', options: ['small letter', 'capital letter', 'number', 'symbol'], answer: 'capital letter', type: 'mc' },
    ],
    'Simple Sentences': [
      { q: 'Which is a complete sentence?', options: ['The big dog', 'Running fast', 'She eats rice.', 'Very tall'], answer: 'She eats rice.', type: 'mc' },
    ],
    'Reading Comprehension': [
      { q: 'When we read a passage and answer questions from it, we are doing ___', options: ['Composition', 'Comprehension', 'Summary', 'Grammar'], answer: 'Comprehension', type: 'mc' },
    ],
    'Spelling': [
      { q: 'Which word is spelled correctly?', options: ['Beautyful', 'Beautiful', 'Beautifull', 'Beatiful'], answer: 'Beautiful', type: 'mc' },
    ],
    'Capitalization': [
      { q: 'Which word should be capitalized?', options: ['dog', 'ghana', 'table', 'book'], answer: 'ghana', type: 'mc' },
    ],
    'Letter Recognition': [
      { q: 'Which letter comes after "M"?', options: ['L', 'N', 'O', 'K'], answer: 'N', type: 'mc' },
    ],
    'Phonics': [
      { q: 'Which word begins with the "sh" sound?', options: ['Cat', 'Ship', 'Top', 'Fan'], answer: 'Ship', type: 'mc' },
    ],
    'Comprehension': [
      { q: 'In comprehension, "inference" means ___', options: ['Copying from the passage', 'Reading meaning from clues', 'Writing a summary', 'Correcting grammar'], answer: 'Reading meaning from clues', type: 'mc' },
    ],
    'Summary Writing': [
      { q: 'A summary should be ___', options: ['Longer than the passage', 'Shorter than the passage', 'The same length', 'Written in French'], answer: 'Shorter than the passage', type: 'mc' },
    ],
    'Figures of Speech': [
      { q: '"He is as tall as a giraffe" is an example of ___', options: ['Metaphor', 'Simile', 'Personification', 'Hyperbole'], answer: 'Simile', type: 'mc' },
      { q: '"The wind whispered through the trees" is an example of ___', options: ['Simile', 'Metaphor', 'Personification', 'Alliteration'], answer: 'Personification', type: 'mc' },
    ],
    'Clauses and Phrases': [
      { q: 'A clause contains a ___ and a ___', options: ['Noun and adjective', 'Subject and verb', 'Adverb and preposition', 'Article and noun'], answer: 'Subject and verb', type: 'mc' },
    ],
    'Concord': [
      { q: 'The boys ___ playing football.', options: ['is', 'are', 'was', 'am'], answer: 'are', type: 'mc' },
    ],
    'Idioms and Proverbs': [
      { q: '"To let the cat out of the bag" means ___', options: ['To free a cat', 'To reveal a secret', 'To buy a bag', 'To catch a cat'], answer: 'To reveal a secret', type: 'mc' },
    ],
    'Articles': [
      { q: 'We use "an" before words beginning with ___', options: ['Consonant sound', 'Vowel sound', 'Any letter', 'Capital letter'], answer: 'Vowel sound', type: 'mc' },
    ],
    'Prepositions': [
      { q: 'The cat is ___ the table.', options: ['in', 'on', 'under', 'All of the above'], answer: 'All of the above', type: 'mc' },
    ],
    'Direct and Indirect Speech': [
      { q: 'He said, "I am happy." In indirect speech:', options: ['He said he is happy.', 'He said that he was happy.', 'He say he happy.', 'He said I am happy.'], answer: 'He said that he was happy.', type: 'mc' },
    ],
    'Active and Passive Voice': [
      { q: '"The ball was kicked by Kofi" is in ___ voice.', options: ['Active', 'Passive', 'Simple', 'Progressive'], answer: 'Passive', type: 'mc' },
    ],
    'Singular and Plural': [
      { q: 'The plural of "child" is ___', options: ['childs', 'children', 'childrens', 'child'], answer: 'children', type: 'mc' },
    ],
    'Composition Writing': [
      { q: 'A narrative essay tells a ___', options: ['description', 'story', 'argument', 'letter'], answer: 'story', type: 'mc' },
    ],
    'Letter Writing': [
      { q: 'A formal letter should include ___', options: ['Slang words', 'Sender\'s address', 'Drawings', 'Jokes'], answer: 'Sender\'s address', type: 'mc' },
    ],
    'Literature - The Beacon of Light': [
      { q: 'In "The Beacon of Light", what does the lighthouse symbolize?', options: ['Wealth and gold', 'Education and hope', 'Danger at sea', 'Colonial power'], answer: 'Education and hope', type: 'mc' },
      { q: 'Who is the village teacher that supports Kwame\'s dream in "The Beacon of Light"?', options: ['Mr. Ansah', 'Mr. Mensah', 'Chief Osei', 'Kofi'], answer: 'Mr. Ansah', type: 'mc' },
      { q: 'What coastal town forms the primary setting of "The Beacon of Light"?', options: ['Elmina', 'Cape Coast', 'Anomabo', 'Winneba'], answer: 'Anomabo', type: 'mc' },
      { q: 'What major event at sea early in the novel teaches Kwame about resilience?', options: ['A pirate attack', 'A severe ocean storm', 'A ship wreckage', 'A great tsunami'], answer: 'A severe ocean storm', type: 'mc' },
      { q: 'Why did Kwame study by the flickering light of an oil lamp every evening?', options: ['His family lacked electricity and wealth', 'He preferred dark rooms', 'He was hiding from his friends', 'The school was closed during daytime'], answer: 'His family lacked electricity and wealth', type: 'mc' },
    ],
  },
  'Science': {
    'Living Things': [
      { q: 'Which of the following is a living thing?', options: ['Stone', 'Water', 'Cat', 'Chair'], answer: 'Cat', type: 'mc' },
      { q: 'Living things need ___ to survive.', options: ['Food, water, air', 'Stones, sand, metals', 'Books, pens, paper', 'Cars, bikes, trains'], answer: 'Food, water, air', type: 'mc' },
    ],
    'Plants': [
      { q: 'Plants make their food through ___', options: ['Digestion', 'Respiration', 'Photosynthesis', 'Excretion'], answer: 'Photosynthesis', type: 'mc' },
      { q: 'Which part of the plant absorbs water?', options: ['Leaf', 'Stem', 'Root', 'Flower'], answer: 'Root', type: 'mc' },
    ],
    'Animals': [
      { q: 'Animals that eat only plants are called ___', options: ['Carnivores', 'Herbivores', 'Omnivores', 'Decomposers'], answer: 'Herbivores', type: 'mc' },
    ],
    'Water': [
      { q: 'Water boils at ___ degrees Celsius.', options: ['50', '75', '100', '200'], answer: '100', type: 'mc' },
    ],
    'Energy': [
      { q: 'The sun is a source of ___ energy.', options: ['Sound', 'Light', 'Chemical', 'Nuclear'], answer: 'Light', type: 'mc' },
    ],
    'Matter': [
      { q: 'The three states of matter are ___', options: ['Gas, plasma, solid', 'Solid, liquid, gas', 'Water, air, fire', 'Hard, soft, rough'], answer: 'Solid, liquid, gas', type: 'mc' },
    ],
    'Health': [
      { q: 'Washing hands helps to prevent ___', options: ['Happiness', 'Growth', 'Diseases', 'Hunger'], answer: 'Diseases', type: 'mc' },
    ],
    'Our Body': [
      { q: 'The organ that pumps blood is the ___', options: ['Liver', 'Lung', 'Heart', 'Kidney'], answer: 'Heart', type: 'mc' },
    ],
    'Weather': [
      { q: 'An instrument used to measure temperature is called a ___', options: ['Barometer', 'Thermometer', 'Anemometer', 'Rain gauge'], answer: 'Thermometer', type: 'mc' },
    ],
    'Forces': [
      { q: 'Gravity is a force that pulls objects towards the ___', options: ['Sky', 'Moon', 'Earth', 'Sun'], answer: 'Earth', type: 'mc' },
    ],
    'Machines': [
      { q: 'A lever is an example of a simple ___', options: ['Tool', 'Machine', 'Device', 'Instrument'], answer: 'Machine', type: 'mc' },
    ],
    'Electricity': [
      { q: 'Materials that allow electricity to pass through them are called ___', options: ['Insulators', 'Conductors', 'Semiconductors', 'Resistors'], answer: 'Conductors', type: 'mc' },
    ],
    'Ecosystems': [
      { q: 'A food chain starts with a ___', options: ['Consumer', 'Decomposer', 'Producer', 'Predator'], answer: 'Producer', type: 'mc' },
    ],
    'Human Body Systems': [
      { q: 'The skeletal system is made up of ___', options: ['Muscles', 'Bones', 'Blood', 'Nerves'], answer: 'Bones', type: 'mc' },
    ],
    'Reproduction': [
      { q: 'The process by which organisms produce offspring is called ___', options: ['Growth', 'Reproduction', 'Respiration', 'Excretion'], answer: 'Reproduction', type: 'mc' },
    ],
    'Diversity of Matter': [
      { q: 'A mixture can be separated by ___', options: ['Burning', 'Filtering', 'Melting', 'Breaking'], answer: 'Filtering', type: 'mc' },
    ],
    'Cycles': [
      { q: 'The water cycle involves evaporation, condensation, and ___', options: ['Burning', 'Freezing', 'Precipitation', 'Melting'], answer: 'Precipitation', type: 'mc' },
    ],
    'Systems': [
      { q: 'The digestive system breaks down ___', options: ['Water', 'Air', 'Food', 'Light'], answer: 'Food', type: 'mc' },
    ],
    'Interactions of Matter': [
      { q: 'When an acid reacts with a base, it forms ___', options: ['An acid', 'A base', 'Salt and water', 'Gas'], answer: 'Salt and water', type: 'mc' },
    ],
    'Humans and the Environment': [
      { q: 'Deforestation leads to ___', options: ['More trees', 'Soil erosion', 'More rain', 'Cooler weather'], answer: 'Soil erosion', type: 'mc' },
    ],
    'Practical Activities': [
      { q: 'In a science experiment, the variable you change is called the ___', options: ['Dependent variable', 'Independent variable', 'Controlled variable', 'Constant'], answer: 'Independent variable', type: 'mc' },
    ],
    'Chemical Reactions': [
      { q: 'Rusting is an example of a ___ reaction.', options: ['Physical', 'Chemical', 'Nuclear', 'Mechanical'], answer: 'Chemical', type: 'mc' },
    ],
    'Electricity and Magnetism': [
      { q: 'Like poles of a magnet ___', options: ['Attract', 'Repel', 'Do nothing', 'Join together'], answer: 'Repel', type: 'mc' },
    ],
    'Soil': [
      { q: 'The type of soil that holds the most water is ___', options: ['Sandy soil', 'Clay soil', 'Loamy soil', 'Gravel'], answer: 'Clay soil', type: 'mc' },
    ],
    'Air': [
      { q: 'The gas we breathe in is ___', options: ['Carbon dioxide', 'Nitrogen', 'Oxygen', 'Hydrogen'], answer: 'Oxygen', type: 'mc' },
    ],
  },
  'Social Studies': {
    'Family': [
      { q: 'The nuclear family consists of ___', options: ['Father, mother, and children', 'Grandparents and uncles', 'Cousins and nephews', 'Friends and neighbours'], answer: 'Father, mother, and children', type: 'mc' },
    ],
    'Community': [
      { q: 'A community is a group of people who ___', options: ['Fight each other', 'Live and work together', 'Travel constantly', 'Never meet'], answer: 'Live and work together', type: 'mc' },
    ],
    'Government': [
      { q: 'The head of state of Ghana is the ___', options: ['Prime Minister', 'King', 'President', 'Governor'], answer: 'President', type: 'mc' },
    ],
    'National Symbols': [
      { q: 'The national flag of Ghana has ___ colours.', options: ['2', '3', '4', '5'], answer: '3', type: 'mc' },
    ],
    'Rules and Laws': [
      { q: 'Rules are made to maintain ___ in the community.', options: ['Chaos', 'Order', 'Confusion', 'Fighting'], answer: 'Order', type: 'mc' },
    ],
    'Our Environment': [
      { q: 'Planting trees helps to prevent ___', options: ['Rainfall', 'Soil erosion', 'Sunshine', 'Moonlight'], answer: 'Soil erosion', type: 'mc' },
    ],
    'Culture': [
      { q: 'Culture includes the ___ of a people.', options: ['Beliefs, customs, and traditions', 'Only food', 'Only language', 'Only clothes'], answer: 'Beliefs, customs, and traditions', type: 'mc' },
    ],
    'History of Ghana': [
      { q: 'Ghana gained independence in ___', options: ['1945', '1957', '1960', '1966'], answer: '1957', type: 'mc' },
    ],
    'Maps': [
      { q: 'A map legend explains the ___ used on a map.', options: ['Colours', 'Symbols', 'Numbers', 'Lines'], answer: 'Symbols', type: 'mc' },
    ],
    'Population': [
      { q: 'A census is used to count the ___', options: ['Animals', 'Trees', 'People', 'Buildings'], answer: 'People', type: 'mc' },
    ],
    'Resources': [
      { q: 'Gold is an example of a ___ resource.', options: ['Renewable', 'Non-renewable', 'Human', 'Artificial'], answer: 'Non-renewable', type: 'mc' },
    ],
    'Human Rights': [
      { q: 'Every child has the right to ___', options: ['Drive a car', 'Education', 'Vote', 'Work in a factory'], answer: 'Education', type: 'mc' },
    ],
    'Governance': [
      { q: 'Democracy means government by the ___', options: ['Military', 'King', 'People', 'Chief'], answer: 'People', type: 'mc' },
    ],
    'National Development': [
      { q: 'Paying taxes helps in the ___ of the country.', options: ['Destruction', 'Development', 'Division', 'Decline'], answer: 'Development', type: 'mc' },
    ],
    'International Relations': [
      { q: 'Ghana is a member of the ___', options: ['European Union', 'United Nations', 'NATO', 'ASEAN'], answer: 'United Nations', type: 'mc' },
    ],
    'Sustainable Development': [
      { q: 'Sustainable development meets the needs of the present without compromising the ___', options: ['Past', 'Present', 'Future', 'Government'], answer: 'Future', type: 'mc' },
    ],
    'School': [
      { q: 'The head of a school is the ___', options: ['President', 'Headteacher', 'Governor', 'Manager'], answer: 'Headteacher', type: 'mc' },
    ],
    'Environment': [
      { q: 'Pollution can be caused by ___', options: ['Clean water', 'Fresh air', 'Burning waste', 'Planting trees'], answer: 'Burning waste', type: 'mc' },
    ],
  },
  'Computing': {
    'Parts of a Computer': [
      { q: 'The ___ is the brain of the computer.', options: ['Monitor', 'Keyboard', 'CPU', 'Mouse'], answer: 'CPU', type: 'mc' },
      { q: 'Which is an output device?', options: ['Keyboard', 'Mouse', 'Monitor', 'Scanner'], answer: 'Monitor', type: 'mc' },
    ],
    'Uses of Computer': [
      { q: 'Computers can be used for ___', options: ['Cooking food', 'Typing documents', 'Washing clothes', 'Sweeping floors'], answer: 'Typing documents', type: 'mc' },
    ],
    'Computer Hardware': [
      { q: 'RAM stands for ___', options: ['Read Access Memory', 'Random Access Memory', 'Run Application Module', 'Real Active Memory'], answer: 'Random Access Memory', type: 'mc' },
    ],
    'Computer Software': [
      { q: 'An operating system is an example of ___ software.', options: ['Application', 'System', 'Utility', 'Game'], answer: 'System', type: 'mc' },
    ],
    'Programming': [
      { q: 'A set of instructions given to a computer is called a ___', options: ['Document', 'Program', 'Folder', 'File'], answer: 'Program', type: 'mc' },
    ],
    'Algorithms': [
      { q: 'An algorithm is a step-by-step ___', options: ['Picture', 'Procedure', 'Calculation', 'Drawing'], answer: 'Procedure', type: 'mc' },
    ],
    'Flowcharts': [
      { q: 'In a flowchart, a diamond shape represents a ___', options: ['Process', 'Start/End', 'Decision', 'Input'], answer: 'Decision', type: 'mc' },
    ],
    'Word Processing': [
      { q: 'Microsoft Word is an example of a ___ application.', options: ['Spreadsheet', 'Word processing', 'Database', 'Presentation'], answer: 'Word processing', type: 'mc' },
    ],
    'Spreadsheets': [
      { q: 'In a spreadsheet, the intersection of a row and column is called a ___', options: ['Table', 'Cell', 'Sheet', 'Book'], answer: 'Cell', type: 'mc' },
    ],
    'Internet': [
      { q: 'WWW stands for ___', options: ['World Wide Web', 'World Wire Web', 'Wide World Web', 'Web Wide World'], answer: 'World Wide Web', type: 'mc' },
    ],
    'Internet Basics': [
      { q: 'A web browser is used to ___', options: ['Play music', 'Access the internet', 'Print documents', 'Draw pictures'], answer: 'Access the internet', type: 'mc' },
    ],
    'Web Design': [
      { q: 'HTML stands for ___', options: ['Hyper Text Markup Language', 'High Text Making Language', 'Hyper Tool Markup Language', 'Home Text Markup Language'], answer: 'Hyper Text Markup Language', type: 'mc' },
    ],
    'Database': [
      { q: 'A database is a collection of organized ___', options: ['Pictures', 'Data', 'Games', 'Programs'], answer: 'Data', type: 'mc' },
    ],
    'Data Handling': [
      { q: 'Data can be processed to produce ___', options: ['Noise', 'Information', 'Hardware', 'Software'], answer: 'Information', type: 'mc' },
    ],
    'Cyber Security': [
      { q: 'A strong password should include ___', options: ['Only numbers', 'Only letters', 'Letters, numbers, and symbols', 'Your name'], answer: 'Letters, numbers, and symbols', type: 'mc' },
    ],
    'Networking': [
      { q: 'LAN stands for ___', options: ['Local Area Network', 'Large Area Network', 'Long Access Network', 'Low Area Network'], answer: 'Local Area Network', type: 'mc' },
    ],
    'Computer Systems': [
      { q: 'The two main types of computer memory are ___', options: ['ROM and CPU', 'RAM and ROM', 'CPU and GPU', 'HDD and SSD'], answer: 'RAM and ROM', type: 'mc' },
    ],
    'Keyboard': [
      { q: 'The longest key on the keyboard is the ___', options: ['Enter key', 'Shift key', 'Space bar', 'Tab key'], answer: 'Space bar', type: 'mc' },
    ],
    'Keyboard Skills': [
      { q: 'The home row keys for the right hand start with ___', options: ['A S D F', 'J K L ;', 'Q W E R', 'Z X C V'], answer: 'J K L ;', type: 'mc' },
    ],
    'Mouse': [
      { q: 'Pressing and releasing the mouse button quickly is called a ___', options: ['Double click', 'Click', 'Drag', 'Scroll'], answer: 'Click', type: 'mc' },
    ],
    'Programming Basics': [
      { q: 'Scratch is an example of a ___ programming language.', options: ['Text-based', 'Visual/Block-based', 'Machine', 'Assembly'], answer: 'Visual/Block-based', type: 'mc' },
    ],
    'Drawing with Computer': [
      { q: 'MS Paint is used for ___', options: ['Writing letters', 'Drawing pictures', 'Playing games', 'Browsing internet'], answer: 'Drawing pictures', type: 'mc' },
    ],
    'Internet and Web': [
      { q: 'A search engine is used to ___', options: ['Create websites', 'Find information online', 'Send emails', 'Play games'], answer: 'Find information online', type: 'mc' },
    ],
    'Introduction to Computing': [
      { q: 'Computing involves the use of ___ to process data.', options: ['Books', 'Computers', 'Pencils', 'Rulers'], answer: 'Computers', type: 'mc' },
    ],
    'Emerging Technologies': [
      { q: 'Artificial Intelligence (AI) enables computers to ___', options: ['Sleep', 'Think and learn', 'Eat', 'Walk'], answer: 'Think and learn', type: 'mc' },
    ],
    'Problem Solving': [
      { q: 'The first step in problem solving is to ___', options: ['Write code', 'Understand the problem', 'Test the solution', 'Debug'], answer: 'Understand the problem', type: 'mc' },
    ],
  },
  'RME': {
    'God the Creator': [
      { q: 'According to Christianity, God created the world in ___ days.', options: ['3', '5', '6', '7'], answer: '6', type: 'mc' },
    ],
    'Moral Lessons': [
      { q: 'Telling the truth at all times is called ___', options: ['Hatred', 'Honesty', 'Greed', 'Pride'], answer: 'Honesty', type: 'mc' },
    ],
    'Good Behaviour': [
      { q: 'Showing respect to elders is a sign of ___', options: ['Weakness', 'Good manners', 'Fear', 'Foolishness'], answer: 'Good manners', type: 'mc' },
    ],
    'Moral Values': [
      { q: 'A person who shows integrity is ___', options: ['Dishonest', 'Trustworthy', 'Lazy', 'Selfish'], answer: 'Trustworthy', type: 'mc' },
    ],
    'Religious Teachings': [
      { q: 'The Holy Book of Christians is the ___', options: ['Quran', 'Bible', 'Torah', 'Vedas'], answer: 'Bible', type: 'mc' },
    ],
    'Family Values': [
      { q: 'Respecting your parents is an example of a ___', options: ['Bad habit', 'Family value', 'Crime', 'Weakness'], answer: 'Family value', type: 'mc' },
    ],
    'Community Living': [
      { q: 'Helping your neighbours shows ___', options: ['Greed', 'Hatred', 'Love and care', 'Fear'], answer: 'Love and care', type: 'mc' },
    ],
    'Tolerance': [
      { q: 'Tolerance means ___', options: ['Fighting others', 'Accepting differences', 'Ignoring people', 'Being rude'], answer: 'Accepting differences', type: 'mc' },
    ],
    'Peace Building': [
      { q: 'Peace can be maintained through ___', options: ['Fighting', 'Dialogue', 'War', 'Insults'], answer: 'Dialogue', type: 'mc' },
    ],
    'Civic Responsibility': [
      { q: 'Voting during elections is a ___ responsibility.', options: ['Criminal', 'Civic', 'Private', 'Religious'], answer: 'Civic', type: 'mc' },
    ],
    'Prayer': [
      { q: 'Prayer is a way of communicating with ___', options: ['Friends', 'God', 'Animals', 'Strangers'], answer: 'God', type: 'mc' },
    ],
    'Religious Leaders': [
      { q: 'Prophet Muhammad is the founder of ___', options: ['Christianity', 'Islam', 'Hinduism', 'Buddhism'], answer: 'Islam', type: 'mc' },
    ],
    'Religious Festivals': [
      { q: 'Christmas celebrates the birth of ___', options: ['Moses', 'Abraham', 'Jesus Christ', 'Muhammad'], answer: 'Jesus Christ', type: 'mc' },
    ],
    'Commandments': [
      { q: 'The Ten Commandments were given to ___', options: ['Abraham', 'Moses', 'David', 'Solomon'], answer: 'Moses', type: 'mc' },
    ],
    'God and Creation': [
      { q: 'The belief that God created everything is called ___', options: ['Evolution', 'Creation', 'Science', 'History'], answer: 'Creation', type: 'mc' },
    ],
    'Honesty': [
      { q: 'An honest person always tells the ___', options: ['Lies', 'Truth', 'Stories', 'Excuses'], answer: 'Truth', type: 'mc' },
    ],
    'Integrity': [
      { q: 'Integrity means doing the right thing even when ___', options: ['Everyone is watching', 'No one is watching', 'You are forced', 'You are paid'], answer: 'No one is watching', type: 'mc' },
    ],
    'Leadership': [
      { q: 'A good leader should be ___', options: ['Selfish', 'Humble and fair', 'Proud', 'Lazy'], answer: 'Humble and fair', type: 'mc' },
    ],
    'Citizenship': [
      { q: 'A good citizen obeys the ___', options: ['Criminals', 'Laws of the land', 'Rich people', 'Foreigners'], answer: 'Laws of the land', type: 'mc' },
    ],
    'Respect': [
      { q: 'Respect means treating others with ___', options: ['Contempt', 'Dignity', 'Hatred', 'Indifference'], answer: 'Dignity', type: 'mc' },
    ],
    'Responsibility': [
      { q: 'Being responsible means ___', options: ['Blaming others', 'Taking ownership of your actions', 'Running away', 'Making excuses'], answer: 'Taking ownership of your actions', type: 'mc' },
    ],
  },
  'Creative Arts': {
    'Drawing': [
      { q: 'The tool used for drawing is called a ___', options: ['Brush', 'Pencil', 'Scissors', 'Hammer'], answer: 'Pencil', type: 'mc' },
    ],
    'Colouring': [
      { q: 'Primary colours include red, blue, and ___', options: ['Green', 'Yellow', 'Purple', 'Orange'], answer: 'Yellow', type: 'mc' },
    ],
    'Craft Work': [
      { q: 'Weaving is an example of ___', options: ['Drawing', 'Craft work', 'Music', 'Dance'], answer: 'Craft work', type: 'mc' },
    ],
    'Music': [
      { q: 'A drum is an example of a ___ instrument.', options: ['String', 'Wind', 'Percussion', 'Keyboard'], answer: 'Percussion', type: 'mc' },
    ],
    'Dance': [
      { q: 'Adowa is a traditional ___ dance.', options: ['Nigerian', 'Ghanaian', 'South African', 'Kenyan'], answer: 'Ghanaian', type: 'mc' },
    ],
    'Design': [
      { q: 'The elements of design include line, shape, colour, and ___', options: ['Sound', 'Texture', 'Smell', 'Taste'], answer: 'Texture', type: 'mc' },
    ],
    'Textiles': [
      { q: 'Kente cloth is made through ___', options: ['Painting', 'Weaving', 'Carving', 'Moulding'], answer: 'Weaving', type: 'mc' },
    ],
    'Painting': [
      { q: 'Mixing red and yellow gives ___', options: ['Green', 'Purple', 'Orange', 'Brown'], answer: 'Orange', type: 'mc' },
    ],
    'Ceramics': [
      { q: 'Ceramics involves working with ___', options: ['Wood', 'Metal', 'Clay', 'Fabric'], answer: 'Clay', type: 'mc' },
    ],
    'Visual Art': [
      { q: 'Visual art includes painting, sculpture, and ___', options: ['Dancing', 'Singing', 'Photography', 'Running'], answer: 'Photography', type: 'mc' },
    ],
    'Performing Arts': [
      { q: 'Drama, music, and dance are types of ___ arts.', options: ['Visual', 'Literary', 'Performing', 'Applied'], answer: 'Performing', type: 'mc' },
    ],
    'Visual Communication': [
      { q: 'A poster is used for ___', options: ['Cooking', 'Visual communication', 'Building', 'Swimming'], answer: 'Visual communication', type: 'mc' },
    ],
    'Art Appreciation': [
      { q: 'Art appreciation involves ___ and understanding artworks.', options: ['Destroying', 'Observing', 'Ignoring', 'Selling'], answer: 'Observing', type: 'mc' },
    ],
    'Creative Production': [
      { q: 'Creative production involves ___', options: ['Copying exactly', 'Creating original work', 'Destroying art', 'Ignoring art'], answer: 'Creating original work', type: 'mc' },
    ],
    'Patterns': [
      { q: 'A pattern is a repeated ___', options: ['Mistake', 'Design', 'Problem', 'Error'], answer: 'Design', type: 'mc' },
    ],
  },
  'History': {
    'My Family History': [
      { q: 'Family history tells us about our ___', options: ['Future', 'Ancestors', 'Enemies', 'Strangers'], answer: 'Ancestors', type: 'mc' },
    ],
    'Independence of Ghana': [
      { q: 'Dr. Kwame Nkrumah led Ghana to independence in ___', options: ['1945', '1957', '1960', '1966'], answer: '1957', type: 'mc' },
    ],
    'Pre-Colonial Ghana': [
      { q: 'Before colonialism, Ghana had powerful ___', options: ['Companies', 'Kingdoms', 'Factories', 'Schools'], answer: 'Kingdoms', type: 'mc' },
    ],
    'European Contact': [
      { q: 'The first Europeans to arrive at the Gold Coast were the ___', options: ['British', 'French', 'Portuguese', 'Dutch'], answer: 'Portuguese', type: 'mc' },
    ],
    'Colonialism': [
      { q: 'Ghana was colonized by the ___', options: ['French', 'British', 'Portuguese', 'Spanish'], answer: 'British', type: 'mc' },
    ],
    'Nationalism': [
      { q: 'Nationalism is the desire for ___', options: ['Colonial rule', 'Self-governance', 'Foreign control', 'Slavery'], answer: 'Self-governance', type: 'mc' },
    ],
    'Independence': [
      { q: 'Ghana was the first sub-Saharan African country to gain ___', options: ['Slavery', 'Independence', 'Colonialism', 'War'], answer: 'Independence', type: 'mc' },
    ],
    'National Heroes': [
      { q: 'Yaa Asantewaa was known for ___', options: ['Cooking', 'Leading a war against the British', 'Singing', 'Trading'], answer: 'Leading a war against the British', type: 'mc' },
    ],
    'Trade and Commerce': [
      { q: 'The Gold Coast was named after the trade in ___', options: ['Salt', 'Gold', 'Oil', 'Diamonds'], answer: 'Gold', type: 'mc' },
    ],
    'My School': [
      { q: 'School helps us to ___', options: ['Sleep', 'Learn', 'Fight', 'Play all day'], answer: 'Learn', type: 'mc' },
    ],
    'My Community': [
      { q: 'A community is where people ___', options: ['Fight', 'Live together', 'Steal', 'Hide'], answer: 'Live together', type: 'mc' },
    ],
    'Our Town': [
      { q: 'The leader of a town in Ghana is usually called the ___', options: ['President', 'Chief', 'Governor', 'Mayor'], answer: 'Chief', type: 'mc' },
    ],
    'Our Region': [
      { q: 'Ghana currently has ___ regions.', options: ['10', '12', '14', '16'], answer: '16', type: 'mc' },
    ],
    'Traditional Leaders': [
      { q: 'A paramount chief is the ___ chief in a traditional area.', options: ['Lowest', 'Highest', 'Middle', 'Youngest'], answer: 'Highest', type: 'mc' },
    ],
    'Cultural Practices': [
      { q: 'Festivals are celebrated to ___', options: ['Waste money', 'Remember traditions', 'Fight enemies', 'Sleep all day'], answer: 'Remember traditions', type: 'mc' },
    ],
    'Early Kingdoms': [
      { q: 'The Ashanti Kingdom was known for its ___', options: ['Silver', 'Gold', 'Oil', 'Coal'], answer: 'Gold', type: 'mc' },
    ],
    'Government': [
      { q: 'Ghana practices ___ system of government.', options: ['Military', 'Monarchy', 'Democratic', 'Dictatorial'], answer: 'Democratic', type: 'mc' },
    ],
    'Economic Development': [
      { q: 'Cocoa is a major ___ crop in Ghana.', options: ['Import', 'Export', 'Local', 'Forbidden'], answer: 'Export', type: 'mc' },
    ],
    'Post-Independence Ghana': [
      { q: 'After independence, Ghana\'s first president was ___', options: ['J.B. Danquah', 'Kwame Nkrumah', 'Kofi Busia', 'J.J. Rawlings'], answer: 'Kwame Nkrumah', type: 'mc' },
    ],
    'Governments of Ghana': [
      { q: 'Ghana has experienced both military and ___ governments.', options: ['Royal', 'Civilian', 'Colonial', 'Foreign'], answer: 'Civilian', type: 'mc' },
    ],
    'African History': [
      { q: 'The Organization of African Unity (OAU) was formed in ___', options: ['1945', '1957', '1963', '1975'], answer: '1963', type: 'mc' },
    ],
    'World History': [
      { q: 'World War II ended in ___', options: ['1939', '1942', '1945', '1950'], answer: '1945', type: 'mc' },
    ],
    'International Organizations': [
      { q: 'The United Nations was founded in ___', options: ['1935', '1945', '1955', '1965'], answer: '1945', type: 'mc' },
    ],
    'Human Rights': [
      { q: 'Every human being has the right to ___', options: ['Steal', 'Life', 'Fight', 'Cheat'], answer: 'Life', type: 'mc' },
    ],
    'Sustainable Development': [
      { q: 'Sustainable development aims to meet present needs without harming the ___', options: ['Past', 'Present', 'Future', 'Government'], answer: 'Future', type: 'mc' },
    ],
    'Trade': [
      { q: 'The trans-Saharan trade involved the exchange of ___ and salt.', options: ['Gold', 'Oil', 'Fish', 'Timber'], answer: 'Gold', type: 'mc' },
    ],
  },
  'French': {
    'Greetings': [
      { q: '"Bonjour" means ___', options: ['Goodbye', 'Good morning', 'Good night', 'Thank you'], answer: 'Good morning', type: 'mc' },
    ],
    'Numbers 1-10': [
      { q: 'The French word for "five" is ___', options: ['Trois', 'Quatre', 'Cinq', 'Six'], answer: 'Cinq', type: 'mc' },
    ],
    'Numbers 1-20': [
      { q: '"Vingt" in English is ___', options: ['Ten', 'Fifteen', 'Twenty', 'Twelve'], answer: 'Twenty', type: 'mc' },
    ],
    'Colours': [
      { q: '"Rouge" means ___', options: ['Blue', 'Green', 'Red', 'Yellow'], answer: 'Red', type: 'mc' },
    ],
    'Family': [
      { q: '"Père" means ___', options: ['Mother', 'Father', 'Brother', 'Sister'], answer: 'Father', type: 'mc' },
    ],
    'Numbers': [
      { q: '"Dix" means ___', options: ['Five', 'Eight', 'Ten', 'Twelve'], answer: 'Ten', type: 'mc' },
    ],
    'Days of the Week': [
      { q: '"Lundi" means ___', options: ['Sunday', 'Monday', 'Tuesday', 'Wednesday'], answer: 'Monday', type: 'mc' },
    ],
    'Animals': [
      { q: '"Chat" means ___', options: ['Dog', 'Cat', 'Bird', 'Fish'], answer: 'Cat', type: 'mc' },
    ],
    'School': [
      { q: '"École" means ___', options: ['Church', 'Market', 'School', 'Hospital'], answer: 'School', type: 'mc' },
    ],
    'Food': [
      { q: '"Pain" means ___', options: ['Rice', 'Meat', 'Bread', 'Fish'], answer: 'Bread', type: 'mc' },
    ],
    'Weather': [
      { q: '"Il fait chaud" means ___', options: ['It is cold', 'It is hot', 'It is raining', 'It is windy'], answer: 'It is hot', type: 'mc' },
    ],
  },
  'Ga/Twi': {
    'Greetings': [
      { q: '"Ete sen?" means ___ in Twi.', options: ['Good morning', 'How are you?', 'Good evening', 'Thank you'], answer: 'How are you?', type: 'mc' },
    ],
    'Numbers': [
      { q: '"Anum" in Twi means ___', options: ['Three', 'Four', 'Five', 'Six'], answer: 'Five', type: 'mc' },
    ],
    'Family': [
      { q: '"Agya" in Twi means ___', options: ['Mother', 'Father', 'Sister', 'Brother'], answer: 'Father', type: 'mc' },
    ],
    'Culture': [
      { q: 'Festivals are part of our ___', options: ['Science', 'Culture', 'Mathematics', 'Computing'], answer: 'Culture', type: 'mc' },
    ],
    'Proverbs': [
      { q: 'Twi proverbs teach us ___', options: ['Foolishness', 'Wisdom', 'Fighting', 'Stealing'], answer: 'Wisdom', type: 'mc' },
    ],
    'Storytelling': [
      { q: '"Anansesem" means ___ in Twi.', options: ['Song', 'Folktale/Story', 'Dance', 'Prayer'], answer: 'Folktale/Story', type: 'mc' },
    ],
  },
  'Career Technology': {
    'Tools and Materials': [
      { q: 'A hammer is used for ___', options: ['Cutting', 'Hitting nails', 'Sewing', 'Painting'], answer: 'Hitting nails', type: 'mc' },
    ],
    'Safety': [
      { q: 'Safety goggles protect the ___', options: ['Ears', 'Eyes', 'Hands', 'Feet'], answer: 'Eyes', type: 'mc' },
    ],
    'Design and Technology': [
      { q: 'The design process begins with identifying a ___', options: ['Solution', 'Problem', 'Material', 'Tool'], answer: 'Problem', type: 'mc' },
    ],
    'Entrepreneurship': [
      { q: 'An entrepreneur is someone who ___', options: ['Works for others', 'Starts a business', 'Sleeps all day', 'Plays games'], answer: 'Starts a business', type: 'mc' },
    ],
    'Home Management': [
      { q: 'Budgeting helps in ___ money.', options: ['Wasting', 'Managing', 'Losing', 'Hiding'], answer: 'Managing', type: 'mc' },
    ],
    'Technical Drawing': [
      { q: 'A T-square is used in ___', options: ['Cooking', 'Technical drawing', 'Farming', 'Fishing'], answer: 'Technical drawing', type: 'mc' },
    ],
    'Problem Solving': [
      { q: 'The first step in problem solving is ___', options: ['Finding a solution', 'Understanding the problem', 'Testing', 'Implementing'], answer: 'Understanding the problem', type: 'mc' },
    ],
  },
};

// Subjective question banks with EXACT correct answers
const SUBJECTIVE_BANKS: Record<string, Record<string, { q: string; answer: string; marks: number; imageUrl?: string; subQs?: { label: string; q: string; answer: string; marks: number }[] }[]>> = {
  'Science': {
    'practical': [
      { 
        q: 'PRACTICAL QUESTION (COMPULSORY)\n\nStudy the diagram below showing a laboratory setup for heating water.\n\n[See diagram]\n\nYou are provided with: A beaker of water, a thermometer, a bunsen burner, and a stopwatch.\n\nPerform the following experiment:', 
        answer: '', 
        marks: 20, 
        imageUrl: '/images/science-practical-1.jpg',
        subQs: [
          { label: 'a', q: 'Measure and record the initial temperature of the water in the beaker.', answer: 'The initial temperature of the water is 25°C (room temperature). This was measured by placing the thermometer in the beaker before heating and reading the scale.', marks: 4 },
          { label: 'b', q: 'Heat the water for 5 minutes and record the temperature at every minute interval.', answer: 'Temperature readings:\nMinute 0: 25°C\nMinute 1: 35°C\nMinute 2: 48°C\nMinute 3: 62°C\nMinute 4: 78°C\nMinute 5: 92°C', marks: 6 },
          { label: 'c', q: 'Using the readings, plot a graph of temperature (vertical axis) against time (horizontal axis).', answer: 'The graph should have:\n- Title: "Graph of Temperature against Time"\n- X-axis labeled "Time (minutes)" with scale 0-5\n- Y-axis labeled "Temperature (°C)" with scale 0-100\n- Points plotted correctly and joined with a smooth curve\n- The curve shows an upward trend indicating temperature increase over time', marks: 6 },
          { label: 'd', q: 'State two conclusions from your experiment.', answer: '1. When heat energy is supplied to water, its temperature increases over time.\n2. The rate of temperature increase is not uniform; it slows down as the water gets hotter and approaches boiling point (100°C).', marks: 4 },
        ]
      },
    ],
    'default': [
      { q: 'Explain the process of photosynthesis completely.', answer: '', marks: 10, subQs: [
        { label: 'a', q: 'Define photosynthesis.', answer: 'Photosynthesis is the process by which green plants manufacture their own food (glucose) using carbon dioxide from the air, water from the soil, sunlight as energy, and chlorophyll as a catalyst.', marks: 3 },
        { label: 'b', q: 'Write the word equation for photosynthesis.', answer: 'Carbon dioxide + Water + Sunlight energy → (Chlorophyll) → Glucose + Oxygen\n\nOR\n\n6CO₂ + 6H₂O + Light Energy → C₆H₁₂O₆ + 6O₂', marks: 3 },
        { label: 'c', q: 'State two conditions necessary for photosynthesis to occur.', answer: '1. Sunlight - provides the energy needed for the reaction\n2. Chlorophyll - the green pigment in leaves that absorbs light energy\n(Also accept: Carbon dioxide, Water, Suitable temperature)', marks: 4 },
      ]},
    ],
  },
  'Computing': {
    'practical': [
      { 
        q: 'PRACTICAL QUESTION (COMPULSORY)\n\nStudy the flowchart diagram below carefully.\n\n[See diagram]\n\nThe flowchart shows an algorithm for checking if a number is positive, negative, or zero.',
        answer: '', 
        marks: 20,
        imageUrl: '/images/computing-flowchart-1.jpg',
        subQs: [
          { label: 'a', q: 'What does this flowchart do? Explain its purpose.', answer: 'This flowchart is used to determine whether a given number is positive, negative, or zero. It takes a number as input, checks if it is greater than zero (positive), less than zero (negative), or equal to zero, then outputs the appropriate result.', marks: 5 },
          { label: 'b', q: 'If the input number is 7, what will be the output? Show the path taken.', answer: 'Output: "The number is POSITIVE"\n\nPath taken:\n1. START\n2. Input number (7)\n3. Is number > 0? → YES (because 7 > 0)\n4. Output "The number is POSITIVE"\n5. STOP', marks: 5 },
          { label: 'c', q: 'Write the algorithm for this flowchart using numbered steps.', answer: 'ALGORITHM:\nStep 1: START\nStep 2: INPUT a number N\nStep 3: IF N > 0 THEN\n           OUTPUT "The number is POSITIVE"\n           GO TO Step 6\nStep 4: IF N < 0 THEN\n           OUTPUT "The number is NEGATIVE"\n           GO TO Step 6\nStep 5: OUTPUT "The number is ZERO"\nStep 6: STOP', marks: 5 },
          { label: 'd', q: 'Write a simple program code (in any language or pseudocode) that implements this flowchart.', answer: 'PSEUDOCODE:\nBEGIN\n   INPUT N\n   IF N > 0 THEN\n      PRINT "The number is POSITIVE"\n   ELSE IF N < 0 THEN\n      PRINT "The number is NEGATIVE"\n   ELSE\n      PRINT "The number is ZERO"\n   ENDIF\nEND\n\nOR in Python:\n\nn = int(input("Enter a number: "))\nif n > 0:\n    print("The number is POSITIVE")\nelif n < 0:\n    print("The number is NEGATIVE")\nelse:\n    print("The number is ZERO")', marks: 5 },
        ]
      },
    ],
  },
  'Creative Arts': {
    'practical': [
      { 
        q: 'PRACTICAL QUESTION (COMPULSORY)\n\nStudy the Adinkra symbol shown in the diagram below.\n\n[See diagram]\n\nThis is the "Gye Nyame" symbol, one of Ghana\'s most important cultural symbols.',
        answer: '', 
        marks: 20,
        imageUrl: '/images/creative-arts-adinkra-1.jpg',
        subQs: [
          { label: 'a', q: 'What does the "Gye Nyame" symbol mean? Explain its significance.', answer: '"Gye Nyame" means "Except God" in Akan. It symbolizes the supremacy and omnipotence of God. The symbol expresses the belief that God is the creator of all things, and nothing happens without His permission. It represents the deep faith of the Akan people in the power of the Almighty God.', marks: 6 },
          { label: 'b', q: 'Draw your own version of an Adinkra symbol (Gye Nyame or any other you know) and label it.', answer: 'Award marks for:\n- Correct shape and proportions (2 marks)\n- Clean lines and neat presentation (2 marks)\n- Correct labeling with the symbol name (2 marks)\n\nAcceptable symbols include: Gye Nyame, Sankofa, Adinkrahene, Dwennimmen, etc.', marks: 6 },
          { label: 'c', q: 'State two ways Adinkra symbols are used in modern Ghana.', answer: '1. Textile design - Adinkra symbols are printed or stamped on fabric (Adinkra cloth) worn during important occasions like funerals, festivals, and ceremonies.\n2. Architectural decoration - The symbols are used to decorate buildings, gates, and walls.\n(Also accept: Logo design, Jewelry making, Pottery decoration, Graphic design, Educational materials)', marks: 4 },
          { label: 'd', q: 'Identify two elements of design visible in the Gye Nyame symbol.', answer: '1. LINE - The symbol uses curved and straight lines to create its distinctive shape.\n2. SHAPE - The symbol has organic shapes that flow together to form the complete design.\n(Also accept: Form, Balance, Symmetry, Contrast)', marks: 4 },
        ]
      },
    ],
  },
  'Career Technology': {
    'practical': [
      { 
        q: 'PRACTICAL QUESTION (COMPULSORY)\n\nStudy the technical drawing below showing a simple wooden stool.\n\n[See diagram]\n\nYou are to design and plan the production of a similar wooden stool for your classroom.',
        answer: '', 
        marks: 20,
        imageUrl: '/images/career-tech-design-1.jpg',
        subQs: [
          { label: 'a', q: 'List four materials needed to construct this wooden stool.', answer: '1. Wood (timber) - for the seat and legs\n2. Nails or screws - for joining parts\n3. Sandpaper - for smoothing surfaces\n4. Wood glue - for strengthening joints\n(Also accept: Varnish/paint, Measuring tape, Saw, Hammer)', marks: 4 },
          { label: 'b', q: 'List four tools you would need to make this stool.', answer: '1. Hand saw or crosscut saw - for cutting wood to size\n2. Hammer - for driving nails\n3. Measuring tape or ruler - for accurate measurements\n4. Carpenter\'s square - for marking right angles\n(Also accept: Screwdriver, Chisel, Plane, Drill, Sandpaper block)', marks: 4 },
          { label: 'c', q: 'Describe the step-by-step process of making this stool.', answer: 'Step 1: Measure and mark the wood according to the design specifications.\nStep 2: Cut the seat piece (circular or square) to the required size.\nStep 3: Cut four legs to equal length.\nStep 4: Sand all cut pieces to smooth the surfaces and edges.\nStep 5: Mark the positions for the legs on the underside of the seat.\nStep 6: Attach the legs to the seat using nails, screws, or wood glue.\nStep 7: Check that all legs are equal and the stool is balanced.\nStep 8: Apply varnish or paint for finishing.', marks: 8 },
          { label: 'd', q: 'State two safety precautions to observe when making this stool.', answer: '1. Wear safety goggles to protect your eyes from wood chips and sawdust.\n2. Handle sharp tools like saws and chisels carefully to avoid cuts.\n(Also accept: Keep the work area clean, Use tools properly, Wear protective gloves, Secure workpiece before cutting)', marks: 4 },
        ]
      },
    ],
  },
  'RME': {
    'story': [
      { q: 'QUESTION 1 (COMPULSORY)\n\nRead the story below carefully and answer the questions that follow.\n\nKwame was a young boy who lived with his grandmother in a small village. One day, while walking to school, Kwame found a wallet containing GH₵500 on the road. His friends who were with him told him to keep the money and share it among themselves. They said, "No one will ever know. Let us use it to buy new school bags and shoes."\n\nBut Kwame remembered his grandmother\'s words: "My son, honesty is the best policy. What is not yours should never be yours. God sees everything we do, even when no one else is watching."\n\nKwame refused to listen to his friends. Instead, he took the wallet to the village chief. The chief was able to find the owner, who was a trader from the next town. The trader was so grateful that he gave Kwame GH₵100 as a reward and promised to pay for his school fees until he completed junior high school.', 
        answer: '', 
        marks: 20, 
        subQs: [
          { label: 'a', q: 'State the main moral lesson in the story.', answer: 'The main moral lesson is that HONESTY IS ALWAYS REWARDED. When we do the right thing, even when it is difficult or when no one is watching, we will eventually be blessed. Kwame\'s decision to return the wallet instead of keeping it resulted in an even greater reward - his school fees being paid.', marks: 5 },
          { label: 'b', q: 'Mention two values demonstrated by Kwame in the story.', answer: '1. HONESTY - Kwame returned the wallet with all the money instead of keeping it for himself.\n2. OBEDIENCE - Kwame listened to and followed his grandmother\'s teachings about doing the right thing.\n(Also accept: Integrity, Self-control, Respect for others\' property, Courage)', marks: 5 },
          { label: 'c', q: 'Explain how Kwame\'s actions promote good citizenship.', answer: 'Kwame\'s actions promote good citizenship in the following ways:\n1. He showed respect for other people\'s property by returning what did not belong to him.\n2. He demonstrated that citizens should be honest and trustworthy, which builds confidence in the community.\n3. He used proper channels (the village chief) to resolve the issue, showing respect for authority.\n4. His actions encourage others to also be honest, making the community a better place for everyone.', marks: 5 },
          { label: 'd', q: 'State two religious teachings related to the story.', answer: '1. CHRISTIANITY: "Do not steal" (Exodus 20:15) - The Ten Commandments teach that taking what belongs to others is wrong.\n2. ISLAM: The Prophet Muhammad (PBUH) said "Return the trust to those who entrusted you, and do not betray those who betrayed you" - Islam teaches that we must return what belongs to others.\n(Also accept: "Do unto others as you would have them do unto you" - The Golden Rule)', marks: 5 },
        ]
      },
    ],
    'default': [
      { q: 'Explain the importance of moral values in society.', answer: '', marks: 10, subQs: [
        { label: 'a', q: 'Define moral values.', answer: 'Moral values are the principles and standards that guide a person\'s behavior and help them distinguish between right and wrong. They are the beliefs that determine what is good, proper, and acceptable in society. Examples include honesty, respect, responsibility, kindness, and fairness.', marks: 3 },
        { label: 'b', q: 'State three examples of moral values.', answer: '1. HONESTY - Always telling the truth and being sincere in words and actions.\n2. RESPECT - Treating others with dignity and consideration regardless of their status.\n3. RESPONSIBILITY - Being accountable for one\'s actions and fulfilling one\'s duties.', marks: 3 },
        { label: 'c', q: 'Explain how moral values help in maintaining peace in the community.', answer: 'Moral values help maintain peace in the community by:\n1. Encouraging people to treat each other fairly and with respect, reducing conflicts.\n2. Promoting honesty in dealings, which builds trust among community members.\n3. Teaching people to resolve disputes peacefully through dialogue rather than violence.\n4. Fostering cooperation and unity as people work together for the common good.', marks: 4 },
      ]},
    ],
  },
  'Mathematics': {
    'default': [
      { q: 'Solve the following problems showing all working:', answer: '', marks: 10, subQs: [
        { label: 'a', q: 'If 3x + 7 = 22, find the value of x.', answer: 'Solution:\n3x + 7 = 22\n3x = 22 - 7  (Subtract 7 from both sides)\n3x = 15\nx = 15 ÷ 3  (Divide both sides by 3)\nx = 5\n\nTherefore, x = 5', marks: 5 },
        { label: 'b', q: 'Calculate the area of a rectangle with length 12 cm and width 8 cm.', answer: 'Solution:\nArea of rectangle = length × width\nArea = 12 cm × 8 cm\nArea = 96 cm²\n\nTherefore, the area of the rectangle is 96 cm²', marks: 5 },
      ]},
      { q: 'A trader bought 50 oranges at GH₵2.00 each and sold them at GH₵3.00 each.', answer: '', marks: 10, subQs: [
        { label: 'a', q: 'Find the total cost price.', answer: 'Solution:\nCost price of one orange = GH₵2.00\nNumber of oranges = 50\nTotal Cost Price = 50 × GH₵2.00\nTotal Cost Price = GH₵100.00', marks: 3 },
        { label: 'b', q: 'Find the total selling price.', answer: 'Solution:\nSelling price of one orange = GH₵3.00\nNumber of oranges = 50\nTotal Selling Price = 50 × GH₵3.00\nTotal Selling Price = GH₵150.00', marks: 3 },
        { label: 'c', q: 'Calculate the profit made.', answer: 'Solution:\nProfit = Total Selling Price - Total Cost Price\nProfit = GH₵150.00 - GH₵100.00\nProfit = GH₵50.00\n\nTherefore, the trader made a profit of GH₵50.00', marks: 4 },
      ]},
    ],
    'graph': [
      { q: 'The table below shows the marks obtained by students in a Mathematics test.\n\nMarks:  2  4  6  8  10\nFrequency: 3  5  8  4  2\n\nUsing the information above, answer the questions that follow. (Use the graph paper provided)', answer: '', marks: 15, subQs: [
        { label: 'a', q: 'Draw a bar graph to represent the information.', answer: 'Bar graph requirements:\n- Title: "Bar Graph of Marks Obtained by Students"\n- X-axis: Marks (2, 4, 6, 8, 10) with equal spacing\n- Y-axis: Frequency (0 to 10) with suitable scale\n- 5 bars drawn at correct heights: 3, 5, 8, 4, 2\n- Bars of equal width with gaps between them\n- Both axes clearly labelled', marks: 6 },
        { label: 'b', q: 'What is the modal mark?', answer: 'The modal mark is 6.\nReason: It has the highest frequency of 8.', marks: 2 },
        { label: 'c', q: 'Calculate the mean mark.', answer: 'Mean = Sum of (marks × frequency) ÷ Total frequency\n= (2×3 + 4×5 + 6×8 + 8×4 + 10×2) ÷ (3+5+8+4+2)\n= (6 + 20 + 48 + 32 + 20) ÷ 22\n= 126 ÷ 22\n= 5.73 (to 2 decimal places)', marks: 4 },
        { label: 'd', q: 'How many students took the test altogether?', answer: 'Total students = 3 + 5 + 8 + 4 + 2 = 22 students', marks: 3 },
      ]},
    ],
    'pie_chart': [
      { q: 'In a school of 360 students, their favourite subjects are shown below:\n\nMathematics: 120 students\nEnglish: 90 students\nScience: 80 students\nSocial Studies: 70 students\n\nUsing the data above, answer the following questions.', answer: '', marks: 15, subQs: [
        { label: 'a', q: 'Calculate the angle that represents each subject on a pie chart.', answer: 'Total = 360 students\nMathematics = (120/360) × 360° = 120°\nEnglish = (90/360) × 360° = 90°\nScience = (80/360) × 360° = 80°\nSocial Studies = (70/360) × 360° = 70°\n\nCheck: 120° + 90° + 80° + 70° = 360° ✓', marks: 5 },
        { label: 'b', q: 'Draw a pie chart to represent the data. (Use a protractor)', answer: 'Pie chart requirements:\n- Circle drawn with compass\n- Title: "Pie Chart showing Favourite Subjects"\n- Sectors drawn accurately with protractor:\n  Mathematics: 120°, English: 90°, Science: 80°, Social Studies: 70°\n- Each sector labelled with subject name\n- Key/Legend provided', marks: 6 },
        { label: 'c', q: 'What fraction of the students chose Science?', answer: 'Fraction = 80/360 = 2/9', marks: 2 },
        { label: 'd', q: 'What percentage of the students chose English?', answer: 'Percentage = (90/360) × 100% = 25%', marks: 2 },
      ]},
    ],
    'sets': [
      { q: 'In a class of 50 students, 30 study French (F) and 25 study Twi (T). 10 students study both French and Twi.\n\nStudy the Venn diagram below and answer the questions that follow.\n\n[See Diagram]', answer: '', marks: 15, imageUrl: generateVennDiagramSvg('F', 'T', 20, 10, 15, 5, 50), subQs: [
        { label: 'a', q: 'Draw a Venn diagram to illustrate the information.', answer: 'Venn Diagram:\n- Universal set rectangle labelled U = 50\n- Circle F (French): 30 total\n- Circle T (Twi): 25 total\n- Intersection F ∩ T = 10\n- F only = 30 - 10 = 20\n- T only = 25 - 10 = 15\n- Neither = 50 - (20 + 10 + 15) = 5', marks: 5 },
        { label: 'b', q: 'How many students study French only?', answer: 'French only = n(F) - n(F ∩ T) = 30 - 10 = 20 students', marks: 3 },
        { label: 'c', q: 'How many students study Twi only?', answer: 'Twi only = n(T) - n(F ∩ T) = 25 - 10 = 15 students', marks: 3 },
        { label: 'd', q: 'How many students study neither French nor Twi?', answer: 'Neither = Total - n(F ∪ T)\nn(F ∪ T) = n(F) + n(T) - n(F ∩ T) = 30 + 25 - 10 = 45\nNeither = 50 - 45 = 5 students', marks: 4 },
      ]},
    ],
    'circumference': [
      { q: 'A circular fish pond has a radius of 14m. (Take π = 22/7)', answer: '', marks: 15, subQs: [
        { label: 'a', q: 'Calculate the circumference of the fish pond.', answer: 'Circumference = 2πr\n= 2 × 22/7 × 14\n= 2 × 22 × 2\n= 88m\n\nThe circumference of the fish pond is 88m.', marks: 4 },
        { label: 'b', q: 'Calculate the area of the fish pond.', answer: 'Area = πr²\n= 22/7 × 14 × 14\n= 22/7 × 196\n= 22 × 28\n= 616m²\n\nThe area of the fish pond is 616m².', marks: 4 },
        { label: 'c', q: 'If the pond is to be fenced with wire at GH₵25 per metre, calculate the total cost of fencing.', answer: 'Length of fence = Circumference = 88m\nCost per metre = GH₵25\nTotal cost = 88 × GH₵25\n= GH₵2,200.00', marks: 4 },
        { label: 'd', q: 'What is the diameter of the fish pond?', answer: 'Diameter = 2 × radius\n= 2 × 14\n= 28m', marks: 3 },
      ]},
    ],
    'construction': [
      { q: 'Using a ruler, a pair of compasses and a pencil only, carry out the following constructions.\n\n[See Diagram for reference]', answer: '', marks: 15,
        imageUrl: generateConstructionSvg('angle_bisector'),
        subQs: [
        { label: 'a', q: 'Construct an angle of 60° at a point O on a straight line.', answer: 'Step 1: Draw a straight line and mark point O on it.\nStep 2: With O as centre and any convenient radius, draw an arc to cut the line at point A.\nStep 3: With A as centre and the same radius, draw an arc to cut the first arc at point B.\nStep 4: Draw a straight line from O through B.\nAngle AOB = 60°.', marks: 5 },
        { label: 'b', q: 'Bisect the 60° angle constructed in (a) above.', answer: 'Step 1: With A as centre and any convenient radius, draw an arc.\nStep 2: With B as centre and the same radius, draw an arc to cut the arc in Step 1 at point C.\nStep 3: Draw a straight line from O through C.\nLine OC is the bisector of the 60° angle.\nEach half = 30°.', marks: 5 },
        { label: 'c', q: 'What is the size of each of the two angles formed by the bisector?', answer: 'Each angle = 60° ÷ 2 = 30°', marks: 2 },
        { label: 'd', q: 'Measure and state the size of each angle with a protractor to verify your construction.', answer: 'Both angles should measure 30° each when measured with a protractor.\nTotal = 30° + 30° = 60° ✓', marks: 3 },
      ]},
      { q: 'Using a ruler and a pair of compasses only, carry out the following constructions.\n\n[See Diagram for reference]', answer: '', marks: 15,
        imageUrl: generateConstructionSvg('perpendicular'),
        subQs: [
        { label: 'a', q: 'Construct a line segment AB = 8cm.', answer: 'Using a ruler, draw a straight line and mark two points A and B such that AB = 8cm.', marks: 2 },
        { label: 'b', q: 'Construct the perpendicular bisector of line AB.', answer: 'Step 1: With A as centre and radius more than half of AB, draw arcs above and below the line.\nStep 2: With B as centre and the same radius, draw arcs to intersect the arcs in Step 1 at points P and Q.\nStep 3: Draw a straight line through P and Q.\nThis line PQ is the perpendicular bisector of AB.', marks: 6 },
        { label: 'c', q: 'Mark the midpoint of AB and label it M. State the length of AM.', answer: 'The perpendicular bisector crosses AB at its midpoint M.\nAM = AB ÷ 2 = 8 ÷ 2 = 4cm.', marks: 3 },
        { label: 'd', q: 'What angle does the perpendicular bisector make with line AB?', answer: 'The perpendicular bisector makes an angle of 90° with line AB.', marks: 4 },
      ]},
      { q: 'Using a ruler and a pair of compasses only, construct triangle ABC where AB = 8cm, angle BAC = 60° and AC = 6cm.\n\n[See Diagram for reference]', answer: '', marks: 15,
        imageUrl: generateConstructionSvg('triangle_60'),
        subQs: [
        { label: 'a', q: 'Construct the triangle ABC with the given measurements.', answer: 'Step 1: Draw line AB = 8cm using a ruler.\nStep 2: At point A, construct an angle of 60° using compasses.\nStep 3: Along the 60° line, measure AC = 6cm and mark point C.\nStep 4: Join B to C to complete triangle ABC.', marks: 6 },
        { label: 'b', q: 'Measure and state the length of BC.', answer: 'Using a ruler, measure BC from the constructed triangle.\nBC ≈ 7.2cm (accept values between 7.0cm and 7.4cm).', marks: 3 },
        { label: 'c', q: 'Measure angle ABC and angle ACB.', answer: 'Using a protractor:\nAngle ABC ≈ 46° (accept 44°-48°)\nAngle ACB ≈ 74° (accept 72°-76°)\nCheck: 60° + 46° + 74° = 180° ✓', marks: 3 },
        { label: 'd', q: 'Calculate the area of triangle ABC.', answer: 'Area = 1/2 × AB × AC × sin(BAC)\n= 1/2 × 8 × 6 × sin 60°\n= 1/2 × 8 × 6 × 0.866\n= 20.78cm²', marks: 3 },
      ]},
    ],
  },
  'English Language': {
    'composition': [
      { q: 'Write a composition of about 250 words on ONE of the following topics:', answer: 'MARKING GUIDE:\n\nContent (5 marks): Ideas should be relevant, well-developed, and interesting.\nOrganization (3 marks): Clear introduction, body paragraphs, and conclusion.\nGrammar (3 marks): Correct use of tenses, subject-verb agreement, sentence structure.\nVocabulary (2 marks): Appropriate word choice and variety.\nPunctuation (2 marks): Correct use of full stops, commas, capital letters.\n\nTotal: 15 marks', marks: 15, subQs: [
        { label: 'a', q: 'An unforgettable day in my life', answer: 'Accept any well-written narrative essay that:\n- Describes a specific memorable day\n- Uses first-person narrative\n- Includes sensory details (what the writer saw, heard, felt)\n- Has a clear beginning, middle, and end\n- Explains why the day was unforgettable', marks: 15 },
        { label: 'b', q: 'The importance of education', answer: 'Accept any well-written expository/argumentative essay that:\n- Defines what education is\n- Gives reasons why education is important (e.g., knowledge, better jobs, personal development)\n- Provides examples or evidence\n- Has logical organization\n- Concludes with the writer\'s opinion', marks: 15 },
      ]},
    ],
    'comprehension': [
      { q: 'Read the following passage carefully and answer the questions that follow:\n\nKofi lived in a small village near the coast. Every morning, he would wake up early and help his father with fishing. One day, a terrible storm hit the village. The winds were so strong that many houses were destroyed. Kofi and his family had to take shelter in the school building. After the storm, the villagers came together to rebuild their homes. They showed great unity and cooperation.', answer: '', marks: 15, subQs: [
        { label: 'a', q: 'Where did Kofi live?', answer: 'Kofi lived in a small village near the coast.', marks: 3 },
        { label: 'b', q: 'What did Kofi do every morning?', answer: 'Every morning, Kofi would wake up early and help his father with fishing.', marks: 3 },
        { label: 'c', q: 'What happened to the village?', answer: 'A terrible storm hit the village. The winds were so strong that many houses were destroyed.', marks: 3 },
        { label: 'd', q: 'Where did Kofi\'s family take shelter?', answer: 'Kofi\'s family took shelter in the school building.', marks: 3 },
        { label: 'e', q: 'What lesson can we learn from this passage?', answer: 'The lesson we can learn is the importance of unity and cooperation. When the villagers faced a disaster, they came together as a community to help each other rebuild their homes. This shows that working together makes difficult tasks easier and strengthens the community.', marks: 3 },
      ]},
    ],
    'summary': [
      { q: 'Read the passage below and summarize the main points in not more than 60 words:\n\nEducation is very important in our lives. It helps us to read and write. Education gives us knowledge to solve problems. It also helps us to get good jobs. People who are educated can take better care of their families. Education promotes national development. Every child should have access to quality education.', answer: 'SUMMARY:\nEducation enables reading, writing, and problem-solving skills. It provides opportunities for employment and better family care. Educated citizens contribute to national development. Access to quality education should be available to all children.\n\n(Word count: 36 words)\n\nAward full marks for any summary that:\n- Contains the main ideas\n- Is within 60 words\n- Is written in the student\'s own words\n- Is grammatically correct', marks: 10 },
    ],
    'grammar': [
      { q: 'Answer the following grammar questions:', answer: '', marks: 15, subQs: [
        { label: 'a', q: 'Identify the parts of speech of the underlined words: The TALL boy RAN quickly.', answer: 'TALL - Adjective (describes the noun "boy")\nRAN - Verb (shows the action performed by the subject)', marks: 4 },
        { label: 'b', q: 'Change the following sentence to passive voice: "The cat chased the mouse."', answer: 'Passive voice: The mouse was chased by the cat.\n\nExplanation: In passive voice, the object (mouse) becomes the subject, and the subject (cat) becomes the agent.', marks: 3 },
        { label: 'c', q: 'Rewrite the sentence using the correct tense: "She go to school yesterday."', answer: 'Correct sentence: She went to school yesterday.\n\nExplanation: "Yesterday" indicates past time, so the verb must be in past tense. "Go" becomes "went" in past tense.', marks: 4 },
        { label: 'd', q: 'Punctuate the following sentence correctly: "where is kofi going asked ama"', answer: 'Correctly punctuated: "Where is Kofi going?" asked Ama.\n\nExplanation:\n- "Where" starts a sentence, so it needs a capital letter\n- "Kofi" and "Ama" are proper nouns, so they need capital letters\n- The question needs a question mark\n- The reported speech needs quotation marks', marks: 4 },
      ]},
    ],
    'literature': [
      { q: 'Read the excerpt below from "The Beacon of Light" and answer the questions that follow:\n\n"The dark clouds gathered over the coastal town of Anomabo as young Kwame stared out into the turbulent waves. As the wind howled through the palm fronds, he remembered his father\'s advice: \'A beacon of light guides the steady sailor through the darkest night.\'"', answer: '', marks: 10, subQs: [
        { label: 'a', q: 'Where does the story take place?', answer: 'The story takes place in the coastal town of Anomabo.', marks: 2 },
        { label: 'b', q: 'What advice did Kwame\'s father give him?', answer: 'He advised that "A beacon of light guides the steady sailor through the darkest night."', marks: 3 },
        { label: 'c', q: 'Explain the symbolic meaning of "a beacon of light" as used in the novel.', answer: 'It symbolizes hope, education, and moral guidance amidst life\'s storms and hardships.', marks: 3 },
        { label: 'd', q: 'Identify one literary device used in "the wind howled through the palm fronds".', answer: 'Personification (giving human howling qualities to the wind).', marks: 2 },
      ]},
    ],
  },
  'Social Studies': {
    'default': [
      { q: 'Explain the importance of national development.', answer: '', marks: 10, subQs: [
        { label: 'a', q: 'Define national development.', answer: 'National development is the overall improvement in the economic, social, political, and cultural conditions of a country for the benefit and welfare of its citizens. It involves growth in areas such as education, healthcare, infrastructure, employment, and living standards.', marks: 3 },
        { label: 'b', q: 'State three factors that promote national development.', answer: '1. EDUCATION - When citizens are educated, they can contribute more effectively to the economy and society.\n2. GOOD GOVERNANCE - Honest and effective leaders make policies that benefit all citizens.\n3. NATURAL RESOURCES - Proper management of resources like gold, oil, and cocoa generates revenue for development.', marks: 3 },
        { label: 'c', q: 'Explain how citizens can contribute to national development.', answer: 'Citizens can contribute to national development by:\n1. Paying taxes honestly to provide government with revenue for development projects.\n2. Obeying the laws of the land to maintain peace and order.\n3. Participating in elections to choose good leaders.\n4. Engaging in productive work to boost the economy.\n5. Protecting public property and the environment.', marks: 4 },
      ]},
    ],
  },
};

function getQuestionsFromBank(subject: string, topics: string[], count: number, classLevel?: ClassLevel): Question[] {
  const subjectBank = QUESTION_BANKS[subject] || {};
  let allQuestions: { q: string; options?: string[]; answer: string; type: string }[] = [];
  
  // Collect questions from selected topics ONLY
  for (const topic of topics) {
    const topicQuestions = subjectBank[topic] || [];
    allQuestions.push(...topicQuestions);
  }
  
  // Add from other topics in the subject if needed
  if (allQuestions.length < count) {
    for (const [, qs] of Object.entries(subjectBank)) {
      for (const q of qs) {
        if (!allQuestions.find(aq => aq.q === q.q)) {
          allQuestions.push(q);
        }
      }
    }
  }
  
  // Add dynamic NaCCA class-level-appropriate questions
  const cl = classLevel || 'Basic 4' as ClassLevel;
  if (subject === 'Mathematics') {
    allQuestions = [...allQuestions, ...generateMathVariations(cl, topics)];
  }
  allQuestions = [...allQuestions, ...generateLevelQuestions(subject, cl, topics)];
  
  // Filter out any question already used globally (across ALL generations this session)
  const available = allQuestions.filter(q => !globalUsedQuestions.has(q.q));
  
  // If we've exhausted all questions, reset global tracker and use all
  const pool = available.length >= count ? available : allQuestions;
  if (available.length < count) {
    globalUsedQuestions.clear();
  }
  
  // Shuffle with Fisher-Yates for true randomness
  const shuffled = shuffle(pool);
  
  // Pick unique questions
  const selected: typeof allQuestions = [];
  for (const q of shuffled) {
    if (selected.length >= count) break;
    if (!selected.find(s => s.q === q.q)) {
      selected.push(q);
      globalUsedQuestions.add(q.q); // Mark as used globally
    }
  }
  
  return selected.map((item, idx) => ({
    id: uid(),
    questionNumber: idx + 1,
    type: 'Multiple Choice' as const,
    question: item.q,
    options: item.options ? shuffle(item.options) : ['A', 'B', 'C', 'D'],
    correctAnswer: item.answer,
    marks: 1,
    isCompulsory: false,
    isPractical: false,
  }));
}

function generateSubjectiveQuestions(
  subject: string,
  classLevel: ClassLevel,
  _topics: string[],
  count: number,
  marksPerQuestion: number,
): Question[] {
  const subjectBanks = SUBJECTIVE_BANKS[subject] || {};
  const questions: Question[] = [];
  
  const isB7toB9 = ['Basic 7', 'Basic 8', 'Basic 9'].includes(classLevel);
  const isB6toB9 = ['Basic 6', 'Basic 7', 'Basic 8', 'Basic 9'].includes(classLevel);
  
  // Check if practical Q1 is needed
  const needsPracticalQ1 = (
    (isB7toB9 && ['Computing', 'Science', 'Creative Arts', 'Career Technology', 'RME'].includes(subject)) ||
    (isB6toB9 && subject === 'Computing')
  );
  
  let startIdx = 0;
  
  if (needsPracticalQ1) {
    let practicalBank: typeof subjectBanks['practical'];
    if (subject === 'RME') {
      practicalBank = subjectBanks['story'] || subjectBanks['default'];
    } else {
      practicalBank = subjectBanks['practical'] || subjectBanks['default'];
    }
    
    if (practicalBank && practicalBank.length > 0) {
      const pq = practicalBank[Math.floor(Math.random() * practicalBank.length)];
      const imageUrl = pq.imageUrl || (PRACTICAL_IMAGES[subject] ? PRACTICAL_IMAGES[subject][0] : undefined);
      
      questions.push({
        id: uid(),
        questionNumber: 1,
        type: 'Subjective',
        question: pq.q,
        correctAnswer: pq.answer,
        marks: pq.marks || marksPerQuestion,
        isCompulsory: true,
        isPractical: true,
        imageUrl,
        subQuestions: pq.subQs?.map(sq => ({
          id: uid(),
          label: sq.label,
          question: sq.q,
          answer: sq.answer,
          marks: sq.marks,
        })),
      });
      startIdx = 1;
    }
  }
  
  // Generate remaining questions — filter out globally used ones
  const allBankQuestions = shuffle(Object.values(subjectBanks).flat().filter(q => 
    !questions.find(eq => eq.question === q.q) && !globalUsedQuestions.has(q.q)
  ));
  
  for (let i = startIdx; i < count; i++) {
    const bankQ = allBankQuestions[(i - startIdx) % allBankQuestions.length];
    if (bankQ) {
      questions.push({
        id: uid(),
        questionNumber: i + 1,
        type: 'Subjective',
        question: bankQ.q,
        correctAnswer: bankQ.answer,
        marks: bankQ.marks || marksPerQuestion,
        isCompulsory: false,
        isPractical: false,
        subQuestions: bankQ.subQs?.map(sq => ({
          id: uid(),
          label: sq.label,
          question: sq.q,
          answer: sq.answer,
          marks: sq.marks,
        })),
      });
    }
  }
  
  return questions;
}

function generateEnglishSectionB(
  classLevel: ClassLevel,
  _topics: string[],
  literatureExcerpt?: { title: string; excerpt: string; questions: { q: string; answer: string }[] },
): ExamSection[] {
  const isB7toB9 = ['Basic 7', 'Basic 8', 'Basic 9'].includes(classLevel);
  const sections: ExamSection[] = [];
  
  if (isB7toB9) {
    // Grammar - 15 marks
    const grammarBanks = SUBJECTIVE_BANKS['English Language']?.['grammar'] || [];
    const grammarQ = grammarBanks[0];
    sections.push({
      id: uid(),
      sectionLabel: 'B',
      title: 'SECTION B: GRAMMAR',
      instructions: 'Answer ALL questions in this section.',
      totalMarks: 15,
      isObjective: false,
      questions: grammarQ ? [{
        id: uid(),
        questionNumber: 1,
        type: 'Subjective',
        question: grammarQ.q,
        correctAnswer: grammarQ.answer,
        marks: 15,
        subQuestions: grammarQ.subQs?.map(sq => ({
          id: uid(),
          label: sq.label,
          question: sq.q,
          answer: sq.answer,
          marks: sq.marks,
        })),
      }] : [],
    });
    
    // Comprehension - 15 marks
    const compBanks = SUBJECTIVE_BANKS['English Language']?.['comprehension'] || [];
    const compQ = compBanks[0];
    sections.push({
      id: uid(),
      sectionLabel: 'C',
      title: 'SECTION C: COMPREHENSION',
      instructions: 'Read the passage carefully and answer the questions that follow.',
      totalMarks: 15,
      isObjective: false,
      questions: compQ ? [{
        id: uid(),
        questionNumber: 1,
        type: 'Subjective',
        question: compQ.q,
        correctAnswer: compQ.answer,
        marks: 15,
        subQuestions: compQ.subQs?.map(sq => ({
          id: uid(),
          label: sq.label,
          question: sq.q,
          answer: sq.answer,
          marks: sq.marks,
        })),
      }] : [],
    });
    
    // Summary - 10 marks
    const summaryBanks = SUBJECTIVE_BANKS['English Language']?.['summary'] || [];
    const summaryQ = summaryBanks[0];
    sections.push({
      id: uid(),
      sectionLabel: 'D',
      title: 'SECTION D: SUMMARY',
      instructions: 'Read the passage and answer the question.',
      totalMarks: 10,
      isObjective: false,
      questions: summaryQ ? [{
        id: uid(),
        questionNumber: 1,
        type: 'Subjective',
        question: summaryQ.q,
        correctAnswer: summaryQ.answer,
        marks: 10,
      }] : [],
    });
    
    // Composition - 10 marks
    const compoBanks = SUBJECTIVE_BANKS['English Language']?.['composition'] || [];
    const compoQ = compoBanks[0];
    sections.push({
      id: uid(),
      sectionLabel: 'E',
      title: 'SECTION E: COMPOSITION',
      instructions: 'Write a composition of about 250 words on ONE of the following topics.',
      totalMarks: 10,
      isObjective: false,
      questions: compoQ ? [{
        id: uid(),
        questionNumber: 1,
        type: 'Subjective',
        question: compoQ.q,
        correctAnswer: compoQ.answer,
        marks: 10,
        subQuestions: compoQ.subQs?.map(sq => ({
          id: uid(),
          label: sq.label,
          question: sq.q,
          answer: sq.answer,
          marks: sq.marks,
        })),
      }] : [],
    });

    // Literature (The Beacon of Light) - 10 marks
    const litBanks = SUBJECTIVE_BANKS['English Language']?.['literature'] || [];
    const litQ = litBanks[0];
    let litQuestionObj: Question;

    if (literatureExcerpt && literatureExcerpt.excerpt) {
      litQuestionObj = {
        id: uid(),
        questionNumber: 1,
        type: 'Subjective',
        question: `Read the excerpt below from "The Beacon of Light" (${literatureExcerpt.title}) and answer the questions that follow:\n\n"${literatureExcerpt.excerpt}"`,
        correctAnswer: '',
        marks: 10,
        subQuestions: literatureExcerpt.questions.map((qItem, idx) => ({
          id: uid(),
          label: String.fromCharCode(97 + idx),
          question: qItem.q,
          answer: qItem.answer,
          marks: Math.floor(10 / literatureExcerpt.questions.length) || 3,
        })),
      };
    } else if (litQ) {
      litQuestionObj = {
        id: uid(),
        questionNumber: 1,
        type: 'Subjective',
        question: litQ.q,
        correctAnswer: litQ.answer,
        marks: 10,
        subQuestions: litQ.subQs?.map(sq => ({
          id: uid(),
          label: sq.label,
          question: sq.q,
          answer: sq.answer,
          marks: sq.marks,
        })),
      };
    } else {
      litQuestionObj = {
        id: uid(),
        questionNumber: 1,
        type: 'Subjective',
        question: 'Answer the following literature questions based on "The Beacon of Light".',
        correctAnswer: '',
        marks: 10,
      };
    }

    sections.push({
      id: uid(),
      sectionLabel: 'F',
      title: 'SECTION F: LITERATURE (THE BEACON OF LIGHT)',
      instructions: 'Answer ALL questions in this section.',
      totalMarks: 10,
      isObjective: false,
      questions: [litQuestionObj],
    });
  }
  
  return sections;
}

export function generateExamPaper(config: {
  classLevel: ClassLevel;
  subject: Subject;
  examType: ExamType;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  term: string;
  academicYear: string;
  duration: string;
  topics: string[];
  additionalTopics: string[];
  objectiveCount: number;
  objectiveMarks: number;
  subjectiveCount: number;
  subjectiveMarks: number;
  subjectiveSections: string[];
  subjectiveInstructions?: string;
  customObjectives?: { question: string; options: string[]; correctAnswer: string; imageUrl?: string }[];
  customSubjectives?: { question: string; answer: string; marks: number; imageUrl?: string; subQuestions?: { label: string; question: string; answer: string; marks: number }[] }[];
  literatureExcerpt?: { title: string; excerpt: string; questions: { q: string; answer: string }[] };
  createdBy: string;
}): ExamPaper {
  const allTopics = [...config.topics, ...config.additionalTopics];
  // Do NOT clear globalUsedQuestions here — they persist across all generations to prevent repeats
  
  const sections: ExamSection[] = [];
  const markingScheme: MarkingSchemeItem[] = [];
  
  const isEndOfTerm = config.examType === 'End of Term Examination';
  const totalMarks = isEndOfTerm ? 100 : (config.objectiveMarks + config.subjectiveMarks);
  const isB7toB9 = ['Basic 7', 'Basic 8', 'Basic 9'].includes(config.classLevel);
  const isEnglish = config.subject === 'English Language';
  
  // Section A - Objectives
  if (config.objectiveCount > 0) {
    let objectiveQuestions: Question[] = [];
    if (config.customObjectives && config.customObjectives.length > 0) {
      objectiveQuestions = config.customObjectives.map((co, idx) => ({
        id: uid(),
        questionNumber: idx + 1,
        type: 'Multiple Choice' as const,
        question: co.question,
        options: co.options,
        correctAnswer: co.correctAnswer,
        marks: 1,
        imageUrl: co.imageUrl,
      }));
    }

    const needed = config.objectiveCount - objectiveQuestions.length;
    if (needed > 0) {
      const bankQs = getQuestionsFromBank(config.subject as string, allTopics, needed, config.classLevel);
      objectiveQuestions = [...objectiveQuestions, ...bankQs];
    } else {
      objectiveQuestions = objectiveQuestions.slice(0, config.objectiveCount);
    }

    const marksPerQ = Math.floor(config.objectiveMarks / config.objectiveCount) || 1;
    objectiveQuestions.forEach((q, i) => {
      q.marks = i < config.objectiveCount - 1 ? marksPerQ : config.objectiveMarks - marksPerQ * (config.objectiveCount - 1);
      q.questionNumber = i + 1;
    });
    
    sections.push({
      id: uid(),
      sectionLabel: 'A',
      title: `SECTION A: OBJECTIVE ${config.difficulty ? `[DIFFICULTY: ${config.difficulty.toUpperCase()}]` : ''}`,
      instructions: `Answer ALL questions. Each question carries ${marksPerQ} mark(s). Choose the correct answer from the options lettered A to D.`,
      questions: objectiveQuestions,
      totalMarks: config.objectiveMarks,
      isObjective: true,
    });
    
    objectiveQuestions.forEach(q => {
      markingScheme.push({
        questionId: q.id,
        questionNumber: q.questionNumber,
        sectionLabel: 'A',
        question: q.question,
        correctAnswer: q.correctAnswer,
        marks: q.marks,
        imageUrl: q.imageUrl,
      });
    });
  }
  
  // Section B - Subjective
  if (isEnglish && isB7toB9) {
    const englishSections = generateEnglishSectionB(config.classLevel, allTopics, config.literatureExcerpt);
    sections.push(...englishSections);
    
    englishSections.forEach(section => {
      section.questions.forEach(q => {
        markingScheme.push({
          questionId: q.id,
          questionNumber: q.questionNumber,
          sectionLabel: section.sectionLabel,
          question: q.question,
          correctAnswer: q.correctAnswer,
          marks: q.marks,
          imageUrl: q.imageUrl,
          subAnswers: q.subQuestions?.map(sq => ({
            label: sq.label,
            answer: sq.answer,
            marks: sq.marks,
          })),
        });
      });
    });
  } else if (config.subjectiveCount > 0) {
    const needsPracticalQ1 = (
      (isB7toB9 && ['Computing', 'Science', 'Creative Arts', 'Career Technology', 'RME'].includes(config.subject as string)) ||
      (['Basic 6', ...['Basic 7', 'Basic 8', 'Basic 9']].includes(config.classLevel) && config.subject === 'Computing')
    );
    
    const marksPerSubjQ = Math.floor(config.subjectiveMarks / config.subjectiveCount) || 10;
    let subjectiveQuestions: Question[] = [];
    
    if (config.customSubjectives && config.customSubjectives.length > 0) {
      subjectiveQuestions = config.customSubjectives.map((cs, idx) => ({
        id: uid(),
        questionNumber: idx + 1,
        type: 'Subjective',
        question: cs.question,
        correctAnswer: cs.answer,
        marks: cs.marks || marksPerSubjQ,
        imageUrl: cs.imageUrl,
        subQuestions: cs.subQuestions?.map(sq => ({
          id: uid(),
          label: sq.label,
          question: sq.question,
          answer: sq.answer,
          marks: sq.marks,
        })),
      }));
    }

    const neededSubj = config.subjectiveCount - subjectiveQuestions.length;
    if (neededSubj > 0) {
      const genSubj = generateSubjectiveQuestions(
        config.subject as string,
        config.classLevel,
        allTopics,
        neededSubj,
        marksPerSubjQ,
      );
      subjectiveQuestions = [...subjectiveQuestions, ...genSubj];
    } else {
      subjectiveQuestions = subjectiveQuestions.slice(0, config.subjectiveCount);
    }
    subjectiveQuestions.forEach((q, idx) => { q.questionNumber = idx + 1; });
    
    // Use custom instructions or generate default
    let sectionInstructions = config.subjectiveInstructions || '';
    if (!sectionInstructions) {
      if (needsPracticalQ1) {
        sectionInstructions = 'Answer Question 1 (COMPULSORY) and any other THREE questions.';
      } else {
        sectionInstructions = 'Answer ALL questions in this section.';
      }
    }
    
    sections.push({
      id: uid(),
      sectionLabel: 'B',
      title: 'SECTION B: THEORY/ESSAY',
      instructions: sectionInstructions,
      questions: subjectiveQuestions,
      totalMarks: config.subjectiveMarks,
      isObjective: false,
    });
    
    subjectiveQuestions.forEach(q => {
      markingScheme.push({
        questionId: q.id,
        questionNumber: q.questionNumber,
        sectionLabel: 'B',
        question: q.question,
        correctAnswer: q.correctAnswer,
        marks: q.marks,
        imageUrl: q.imageUrl,
        subAnswers: q.subQuestions?.map(sq => ({
          label: sq.label,
          answer: sq.answer,
          marks: sq.marks,
        })),
      });
    });
  }
  
  return {
    id: uid(),
    schoolName: 'ALEYART ACADEMY',
    classLevel: config.classLevel,
    subject: config.subject,
    examType: config.examType,
    difficulty: config.difficulty,
    term: config.term,
    academicYear: config.academicYear,
    duration: config.duration,
    totalMarks,
    sections,
    createdBy: config.createdBy,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    topics: config.topics,
    additionalTopics: config.additionalTopics,
    markingScheme,
  };
}

export function generateMarkingScheme(exam: ExamPaper): MarkingSchemeItem[] {
  return exam.markingScheme;
}

export function updateMarkingSchemeForQuestion(
  markingScheme: MarkingSchemeItem[],
  questionId: string,
  updates: Partial<MarkingSchemeItem>
): MarkingSchemeItem[] {
  return markingScheme.map(item => 
    item.questionId === questionId ? { ...item, ...updates } : item
  );
}
