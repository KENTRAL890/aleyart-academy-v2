import { useState } from 'react';
import { NACCA_DIAGRAMS } from '../data/constants';

export interface CustomShapeResult {
  shapeName: string;
  svgDataUrl: string;
  suggestedQuestion: string;
  suggestedAnswer: string;
  suggestedMarks: number;
  subQuestions?: {
    label: string;
    question: string;
    answer: string;
    marks: number;
  }[];
}

interface Props {
  onInsert: (result: CustomShapeResult) => void;
  onClose: () => void;
}

type BuilderTab = 'geometric' | 'fraction_shaded' | 'custom_named' | 'webpage_diagram';
type GeometricType = 'rectangle' | 'triangle' | 'circle' | 'cylinder' | 'trapezium' | 'cube' | 'cone';

export default function CustomShapeBuilderModal({ onInsert, onClose }: Props) {
  const [activeTab, setActiveTab] = useState<BuilderTab>('geometric');
  
  // Tab 1: Geometric params
  const [shapeType, setShapeType] = useState<GeometricType>('rectangle');
  const [rectLength, setRectLength] = useState(12);
  const [rectWidth, setRectWidth] = useState(8);
  const [triBase, setTriBase] = useState(6);
  const [triHeight, setTriHeight] = useState(8);
  const [circleRadius, setCircleRadius] = useState(7);
  const [cylRadius, setCylRadius] = useState(7);
  const [cylHeight, setCylHeight] = useState(10);
  const [trapTop, setTrapTop] = useState(6);
  const [trapBase, setTrapBase] = useState(12);
  const [trapHeight, setTrapHeight] = useState(5);
  const [cubeSide, setCubeSide] = useState(5);
  const [coneRadius, setConeRadius] = useState(6);
  const [coneHeight, setConeHeight] = useState(8);
  const [unit, setUnit] = useState<'cm' | 'm'>('cm');

  // Tab 2: Shaded Fraction params
  const [fracType, setFracType] = useState<'circle' | 'rectangle'>('circle');
  const [totalParts, setTotalParts] = useState(8);
  const [shadedParts, setShadedParts] = useState(3);

  // Tab 3: Custom Named Shape params
  const [customShapeName, setCustomShapeName] = useState('Regular Hexagon');
  const [customSideLength, setCustomSideLength] = useState('6cm');
  const [customVertexCount, setCustomVertexCount] = useState(6);

  // Tab 4: Webpage Diagram Link params
  const [webUrl, setWebUrl] = useState('');
  const [webTopic, setWebTopic] = useState('Computing: Flowchart Structure');
  const [webQuestion, setWebQuestion] = useState('Study the Computing flowchart diagram shown above. Explain the function of each symbol displayed and write down the complete algorithm step-by-step.');
  const [webAnswer, setWebAnswer] = useState('Step 1: Start symbol initiates process.\nStep 2: Input symbol reads data.\nStep 3: Decision symbol evaluates condition.\nStep 4: Output symbol displays result.\nStep 5: End symbol terminates algorithm.');

  // Helper to simplify fraction for marking scheme
  const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);

  // Generate SVG string
  const generateSvgString = (): string => {
    if (activeTab === 'geometric') {
      if (shapeType === 'rectangle') {
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 200" width="100%" height="100%">
          <rect x="40" y="40" width="220" height="120" fill="#f8fafc" stroke="#1e293b" stroke-width="3" />
          <text x="150" y="30" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle" fill="#0f172a">${rectLength}${unit}</text>
          <text x="270" y="105" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="start" fill="#0f172a">${rectWidth}${unit}</text>
        </svg>`;
      }
      if (shapeType === 'triangle') {
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 220" width="100%" height="100%">
          <polygon points="60,180 240,180 60,40" fill="#f8fafc" stroke="#1e293b" stroke-width="3" />
          <polyline points="60,160 80,160 80,180" fill="none" stroke="#1e293b" stroke-width="2" />
          <text x="150" y="205" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle" fill="#0f172a">Base = ${triBase}${unit}</text>
          <text x="25" y="115" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle" fill="#0f172a">${triHeight}${unit}</text>
        </svg>`;
      }
      if (shapeType === 'circle') {
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 220" width="100%" height="100%">
          <circle cx="150" cy="110" r="80" fill="#f8fafc" stroke="#1e293b" stroke-width="3" />
          <circle cx="150" cy="110" r="3" fill="#1e293b" />
          <line x1="150" y1="110" x2="230" y2="110" stroke="#1e293b" stroke-width="2" stroke-dasharray="5,5" />
          <text x="190" y="100" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle" fill="#0f172a">r = ${circleRadius}${unit}</text>
          <text x="145" y="125" font-family="sans-serif" font-size="12" font-weight="bold" fill="#0f172a">O</text>
        </svg>`;
      }
      if (shapeType === 'cylinder') {
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 240" width="100%" height="100%">
          <ellipse cx="150" cy="50" rx="70" ry="25" fill="#f8fafc" stroke="#1e293b" stroke-width="3" />
          <line x1="80" y1="50" x2="80" y2="180" stroke="#1e293b" stroke-width="3" />
          <line x1="220" y1="50" x2="220" y2="180" stroke="#1e293b" stroke-width="3" />
          <path d="M 80,180 A 70,25 0 0,0 220,180" fill="none" stroke="#1e293b" stroke-width="3" />
          <path d="M 80,180 A 70,25 0 0,1 220,180" fill="none" stroke="#64748b" stroke-width="2" stroke-dasharray="5,5" />
          <circle cx="150" cy="50" r="2" fill="#1e293b" />
          <line x1="150" y1="50" x2="220" y2="50" stroke="#1e293b" stroke-width="2" stroke-dasharray="4,4" />
          <text x="185" y="42" font-family="sans-serif" font-size="13" font-weight="bold" fill="#0f172a">r=${cylRadius}${unit}</text>
          <text x="235" y="120" font-family="sans-serif" font-size="14" font-weight="bold" fill="#0f172a">h=${cylHeight}${unit}</text>
        </svg>`;
      }
      if (shapeType === 'cube') {
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 220" width="100%" height="100%">
          <rect x="60" y="80" width="100" height="100" fill="none" stroke="#1e293b" stroke-width="3"/>
          <rect x="100" y="40" width="100" height="100" fill="none" stroke="#64748b" stroke-width="2" stroke-dasharray="4,4"/>
          <line x1="60" y1="80" x2="100" y2="40" stroke="#1e293b" stroke-width="3"/>
          <line x1="160" y1="80" x2="200" y2="40" stroke="#1e293b" stroke-width="3"/>
          <line x1="160" y1="180" x2="200" y2="140" stroke="#1e293b" stroke-width="3"/>
          <line x1="60" y1="180" x2="100" y2="140" stroke="#64748b" stroke-width="2" stroke-dasharray="4,4"/>
          <text x="110" y="200" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle" fill="#0f172a">side = ${cubeSide}${unit}</text>
        </svg>`;
      }
      if (shapeType === 'cone') {
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 230" width="100%" height="100%">
          <ellipse cx="150" cy="180" rx="80" ry="25" fill="#f8fafc" stroke="#1e293b" stroke-width="3" />
          <line x1="70" y1="180" x2="150" y2="40" stroke="#1e293b" stroke-width="3" />
          <line x1="230" y1="180" x2="150" y2="40" stroke="#1e293b" stroke-width="3" />
          <line x1="150" y1="40" x2="150" y2="180" stroke="#64748b" stroke-width="2" stroke-dasharray="4,4" />
          <line x1="150" y1="180" x2="230" y2="180" stroke="#64748b" stroke-width="2" stroke-dasharray="4,4" />
          <text x="190" y="175" font-family="sans-serif" font-size="13" font-weight="bold" fill="#0f172a">r=${coneRadius}${unit}</text>
          <text x="110" y="115" font-family="sans-serif" font-size="13" font-weight="bold" fill="#0f172a">h=${coneHeight}${unit}</text>
        </svg>`;
      }
      // Trapezium
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 200" width="100%" height="100%">
        <polygon points="90,50 210,50 250,150 50,150" fill="#f8fafc" stroke="#1e293b" stroke-width="3" />
        <line x1="90" y1="50" x2="90" y2="150" stroke="#64748b" stroke-width="2" stroke-dasharray="4,4" />
        <text x="150" y="38" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle" fill="#0f172a">a = ${trapTop}${unit}</text>
        <text x="150" y="175" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle" fill="#0f172a">b = ${trapBase}${unit}</text>
        <text x="72" y="105" font-family="sans-serif" font-size="13" font-weight="bold" fill="#0f172a">h=${trapHeight}${unit}</text>
      </svg>`;
    }

    if (activeTab === 'fraction_shaded') {
      if (fracType === 'circle') {
        const parts = Math.max(2, Math.min(16, totalParts));
        const shaded = Math.max(0, Math.min(parts, shadedParts));
        let sectorsSvg = '';
        for (let i = 0; i < parts; i++) {
          const startAngle = (i * 360) / parts - 90;
          const endAngle = ((i + 1) * 360) / parts - 90;
          const rad = Math.PI / 180;
          const x1 = 150 + 85 * Math.cos(startAngle * rad);
          const y1 = 110 + 85 * Math.sin(startAngle * rad);
          const x2 = 150 + 85 * Math.cos(endAngle * rad);
          const y2 = 110 + 85 * Math.sin(endAngle * rad);
          const largeArc = 360 / parts > 180 ? 1 : 0;
          const fill = i < shaded ? '#93c5fd' : '#ffffff';
          sectorsSvg += `<path d="M 150 110 L ${x1} ${y1} A 85 85 0 ${largeArc} 1 ${x2} ${y2} Z" fill="${fill}" stroke="#1e293b" stroke-width="2" />`;
        }
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 220" width="100%" height="100%">
          ${sectorsSvg}
          <circle cx="150" cy="110" r="85" fill="none" stroke="#1e293b" stroke-width="3" />
        </svg>`;
      } else {
        // Rectangle grid
        const cols = Math.ceil(Math.sqrt(totalParts));
        const rows = Math.ceil(totalParts / cols);
        const cellW = 200 / cols;
        const cellH = 130 / rows;
        let cellsSvg = '';
        let count = 0;
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            if (count < totalParts) {
              const fill = count < shadedParts ? '#93c5fd' : '#ffffff';
              cellsSvg += `<rect x="${50 + c * cellW}" y="${45 + r * cellH}" width="${cellW}" height="${cellH}" fill="${fill}" stroke="#1e293b" stroke-width="2" />`;
              count++;
            }
          }
        }
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 220" width="100%" height="100%">
          ${cellsSvg}
        </svg>`;
      }
    }

    if (activeTab === 'custom_named') {
      const v = Math.max(3, Math.min(12, customVertexCount));
      let points = '';
      for (let i = 0; i < v; i++) {
        const angle = (i * 2 * Math.PI) / v - Math.PI / 2;
        const x = 150 + 75 * Math.cos(angle);
        const y = 110 + 75 * Math.sin(angle);
        points += `${Math.round(x)},${Math.round(y)} `;
      }
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 220" width="100%" height="100%">
        <polygon points="${points.trim()}" fill="#f8fafc" stroke="#1e293b" stroke-width="3" />
        <text x="150" y="208" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle" fill="#0f172a">${customShapeName} (${customSideLength})</text>
      </svg>`;
    }

    // Webpage diagram placeholder fallback
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 220" width="100%" height="100%">
      <rect x="20" y="20" width="260" height="180" fill="#f1f5f9" stroke="#334155" stroke-width="2" stroke-dasharray="6,6" />
      <text x="150" y="115" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle" fill="#334155">Diagram Link: ${webTopic}</text>
    </svg>`;
  };

  const getSvgDataUrl = () => {
    if (activeTab === 'webpage_diagram' && webUrl) {
      return webUrl;
    }
    const svg = generateSvgString();
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  };

  // Generate NaCCA compliant Section B question and solution
  const getResultDetails = (): CustomShapeResult => {
    const imgUrl = getSvgDataUrl();

    if (activeTab === 'fraction_shaded') {
      const div = gcd(shadedParts, totalParts);
      const simpNum = shadedParts / div;
      const simpDen = totalParts / div;
      const unshaded = totalParts - shadedParts;
      const divU = gcd(unshaded, totalParts);
      const uNum = unshaded / divU;
      const uDen = totalParts / divU;

      return {
        shapeName: `${fracType === 'circle' ? 'Divided Circle' : 'Divided Rectangle'} (${shadedParts} of ${totalParts} shaded)`,
        svgDataUrl: imgUrl,
        suggestedQuestion: `Study the geometric shape shown below which has been divided into equal parts.\n\n[See Diagram]`,
        suggestedAnswer: `Full solution in sub-questions.`,
        suggestedMarks: 10,
        subQuestions: [
          {
            label: 'a',
            question: `How many equal parts is the shape divided into altogether?`,
            answer: `Total number of equal parts = ${totalParts}.`,
            marks: 2,
          },
          {
            label: 'b',
            question: `What fraction of the shape is shaded? Express your answer in its simplest form.`,
            answer: `Number of shaded parts = ${shadedParts}\nTotal equal parts = ${totalParts}\nFraction shaded = ${shadedParts}/${totalParts}\nIn simplest form: ${simpNum}/${simpDen}`,
            marks: 4,
          },
          {
            label: 'c',
            question: `What fraction of the shape is unshaded? Express your answer in its simplest form.`,
            answer: `Number of unshaded parts = ${unshaded}\nFraction unshaded = ${unshaded}/${totalParts}\nIn simplest form: ${uNum}/${uDen}`,
            marks: 4,
          }
        ]
      };
    }

    if (activeTab === 'custom_named') {
      return {
        shapeName: customShapeName,
        svgDataUrl: imgUrl,
        suggestedQuestion: `Study the ${customShapeName} diagram shown below.\n\n[See Diagram]`,
        suggestedAnswer: `Full solution in sub-questions.`,
        suggestedMarks: 10,
        subQuestions: [
          {
            label: 'a',
            question: `Identify the name of the shape shown above and state its number of sides/vertices.`,
            answer: `Shape name: ${customShapeName}. Number of vertices/sides = ${customVertexCount}.`,
            marks: 4,
          },
          {
            label: 'b',
            question: `Explain two geometric properties of a ${customShapeName}.`,
            answer: `Accept valid geometric properties (e.g., side lengths equal, interior angles, line symmetry).`,
            marks: 6,
          }
        ]
      };
    }

    if (activeTab === 'webpage_diagram') {
      return {
        shapeName: webTopic,
        svgDataUrl: imgUrl,
        suggestedQuestion: `${webQuestion}\n\n[See Diagram]`,
        suggestedAnswer: webAnswer,
        suggestedMarks: 10,
      };
    }

    // Standard Geometric Shapes
    if (shapeType === 'rectangle') {
      const perimeter = 2 * (rectLength + rectWidth);
      const area = rectLength * rectWidth;
      return {
        shapeName: `Rectangle (${rectLength}${unit} by ${rectWidth}${unit})`,
        svgDataUrl: imgUrl,
        suggestedQuestion: `The diagram below shows a rectangular school garden with length ${rectLength}${unit} and width ${rectWidth}${unit}.\n\n[See Diagram]`,
        suggestedAnswer: `Full solution given in sub-questions.`,
        suggestedMarks: 10,
        subQuestions: [
          {
            label: 'a',
            question: `Calculate the perimeter of the rectangular garden.`,
            answer: `Perimeter of rectangle = 2(Length + Width)\n= 2(${rectLength} + ${rectWidth})\n= 2(${rectLength + rectWidth})\n= ${perimeter}${unit}`,
            marks: 4,
          },
          {
            label: 'b',
            question: `Calculate the area of the rectangular garden.`,
            answer: `Area of rectangle = Length × Width\n= ${rectLength} × ${rectWidth}\n= ${area}${unit}²`,
            marks: 6,
          }
        ]
      };
    }

    if (shapeType === 'triangle') {
      const area = 0.5 * triBase * triHeight;
      const hyp = Math.sqrt(triBase * triBase + triHeight * triHeight);
      const hypRounded = Math.round(hyp * 10) / 10;
      return {
        shapeName: `Right-Angled Triangle (Base ${triBase}${unit}, Height ${triHeight}${unit})`,
        svgDataUrl: imgUrl,
        suggestedQuestion: `Study the right-angled triangle shown below carefully.\n\n[See Diagram]`,
        suggestedAnswer: `Full solution given in sub-questions.`,
        suggestedMarks: 10,
        subQuestions: [
          {
            label: 'a',
            question: `Calculate the area of the right-angled triangle.`,
            answer: `Area of triangle = 1/2 × base × height\n= 1/2 × ${triBase} × ${triHeight}\n= ${area}${unit}²`,
            marks: 5,
          },
          {
            label: 'b',
            question: `Using Pythagoras' theorem, calculate the length of the hypotenuse (to 1 decimal place).`,
            answer: `By Pythagoras' theorem:\nHypotenuse² = Base² + Height²\n= ${triBase}² + ${triHeight}² = ${triBase * triBase + triHeight * triHeight}\nHypotenuse = √(${triBase * triBase + triHeight * triHeight}) = ${hypRounded}${unit}`,
            marks: 5,
          }
        ]
      };
    }

    if (shapeType === 'circle') {
      const circ = Math.round((2 * (22 / 7) * circleRadius) * 100) / 100;
      const area = Math.round(((22 / 7) * circleRadius * circleRadius) * 100) / 100;
      return {
        shapeName: `Circle (Radius ${circleRadius}${unit})`,
        svgDataUrl: imgUrl,
        suggestedQuestion: `The diagram below shows a circle with center O and radius r = ${circleRadius}${unit}. (Take π = 22/7).\n\n[See Diagram]`,
        suggestedAnswer: `Full solution given in sub-questions.`,
        suggestedMarks: 10,
        subQuestions: [
          {
            label: 'a',
            question: `Calculate the circumference of the circle.`,
            answer: `Circumference = 2πr\n= 2 × 22/7 × ${circleRadius}\n= ${circ}${unit}`,
            marks: 5,
          },
          {
            label: 'b',
            question: `Calculate the area of the circle.`,
            answer: `Area = πr²\n= 22/7 × ${circleRadius} × ${circleRadius}\n= ${area}${unit}²`,
            marks: 5,
          }
        ]
      };
    }

    if (shapeType === 'cylinder') {
      const baseArea = Math.round(((22 / 7) * cylRadius * cylRadius) * 100) / 100;
      const vol = Math.round((baseArea * cylHeight) * 100) / 100;
      return {
        shapeName: `Cylinder (Radius ${cylRadius}${unit}, Height ${cylHeight}${unit})`,
        svgDataUrl: imgUrl,
        suggestedQuestion: `The diagram below shows a cylindrical water container of radius r = ${cylRadius}${unit} and vertical height h = ${cylHeight}${unit}. (Take π = 22/7).\n\n[See Diagram]`,
        suggestedAnswer: `Full solution given in sub-questions.`,
        suggestedMarks: 10,
        subQuestions: [
          {
            label: 'a',
            question: `Calculate the base area of the cylinder.`,
            answer: `Base Area = πr²\n= 22/7 × ${cylRadius} × ${cylRadius}\n= ${baseArea}${unit}²`,
            marks: 4,
          },
          {
            label: 'b',
            question: `Calculate the total volume of the cylinder.`,
            answer: `Volume = Base Area × height = πr²h\n= ${baseArea} × ${cylHeight}\n= ${vol}${unit}³`,
            marks: 6,
          }
        ]
      };
    }

    if (shapeType === 'cube') {
      const vol = cubeSide * cubeSide * cubeSide;
      return {
        shapeName: `Cube (Side ${cubeSide}${unit})`,
        svgDataUrl: imgUrl,
        suggestedQuestion: `The diagram below shows a solid wooden cube of side length ${cubeSide}${unit}.\n\n[See Diagram]`,
        suggestedAnswer: `Volume = side × side × side = ${cubeSide} × ${cubeSide} × ${cubeSide} = ${vol}${unit}³`,
        suggestedMarks: 10,
        subQuestions: [
          { label: 'a', question: `How many faces does a cube have?`, answer: `A cube has 6 equal square faces.`, marks: 3 },
          { label: 'b', question: `Calculate the volume of the cube shown above.`, answer: `Volume = side³ = ${cubeSide} × ${cubeSide} × ${cubeSide} = ${vol}${unit}³`, marks: 7 }
        ]
      };
    }

    if (shapeType === 'cone') {
      const vol = Math.round(((1/3) * (22/7) * coneRadius * coneRadius * coneHeight) * 10) / 10;
      return {
        shapeName: `Cone (Radius ${coneRadius}${unit}, Height ${coneHeight}${unit})`,
        svgDataUrl: imgUrl,
        suggestedQuestion: `The diagram below shows a right circular cone of base radius r = ${coneRadius}${unit} and vertical height h = ${coneHeight}${unit}. (Take π = 22/7).\n\n[See Diagram]`,
        suggestedAnswer: `Volume = 1/3 πr²h = ${vol}${unit}³`,
        suggestedMarks: 10,
        subQuestions: [
          { label: 'a', question: `State the formula for calculating the volume of a cone.`, answer: `Volume = 1/3 πr²h`, marks: 4 },
          { label: 'b', question: `Calculate the volume of the cone to 1 decimal place.`, answer: `Volume = 1/3 × 22/7 × ${coneRadius}² × ${coneHeight} = ${vol}${unit}³`, marks: 6 }
        ]
      };
    }

    // Trapezium
    const trapArea = 0.5 * (trapTop + trapBase) * trapHeight;
    return {
      shapeName: `Trapezium (Top ${trapTop}${unit}, Base ${trapBase}${unit}, Height ${trapHeight}${unit})`,
      svgDataUrl: imgUrl,
      suggestedQuestion: `The diagram below shows a trapezium with parallel sides a = ${trapTop}${unit} and b = ${trapBase}${unit}, and vertical height h = ${trapHeight}${unit}.\n\n[See Diagram]`,
      suggestedAnswer: `Area of trapezium = 1/2(a + b)h\n= 1/2(${trapTop} + ${trapBase}) × ${trapHeight} = ${trapArea}${unit}²`,
      suggestedMarks: 10,
      subQuestions: [
        {
          label: 'a',
          question: `State the formula for calculating the area of a trapezium.`,
          answer: `Area = 1/2(a + b)h, where a and b are the parallel sides and h is the vertical height.`,
          marks: 3,
        },
        {
          label: 'b',
          question: `Calculate the exact area of the trapezium shown above. Show all working.`,
          answer: `Area = 1/2(${trapTop} + ${trapBase}) × ${trapHeight} = ${trapArea}${unit}²`,
          marks: 7,
        }
      ]
    };
  };

  const details = getResultDetails();

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] overflow-auto p-6 shadow-2xl animate-fade-in">
        <div className="flex items-center justify-between border-b pb-3 mb-4">
          <h3 className="text-lg font-bold text-blue-900 flex items-center gap-2">
            <span>📐</span> Custom Math Shape, Shaded Fractions & Webpage Diagram Studio
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-xl font-bold">✕</button>
        </div>

        {/* Top Category Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4 bg-gray-100 p-1.5 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveTab('geometric')}
            className={`py-2 px-3 rounded-lg text-xs font-bold transition ${activeTab === 'geometric' ? 'bg-blue-600 text-white shadow' : 'text-gray-700 hover:bg-white'}`}
          >
            📐 Standard Geometric
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('fraction_shaded')}
            className={`py-2 px-3 rounded-lg text-xs font-bold transition ${activeTab === 'fraction_shaded' ? 'bg-blue-600 text-white shadow' : 'text-gray-700 hover:bg-white'}`}
          >
            🍰 Shaded Fractions
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('custom_named')}
            className={`py-2 px-3 rounded-lg text-xs font-bold transition ${activeTab === 'custom_named' ? 'bg-blue-600 text-white shadow' : 'text-gray-700 hover:bg-white'}`}
          >
            ✏️ Custom Named Shape
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('webpage_diagram')}
            className={`py-2 px-3 rounded-lg text-xs font-bold transition ${activeTab === 'webpage_diagram' ? 'bg-blue-600 text-white shadow' : 'text-gray-700 hover:bg-white'}`}
          >
            🌐 Webpage Diagram Link
          </button>
        </div>

        <div className="space-y-4">
          {/* TAB 1: GEOMETRIC */}
          {activeTab === 'geometric' && (
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Select Geometric Shape:</label>
              <div className="grid grid-cols-3 sm:grid-cols-7 gap-2 mb-3">
                {(['rectangle', 'triangle', 'circle', 'cylinder', 'trapezium', 'cube', 'cone'] as GeometricType[]).map(st => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setShapeType(st)}
                    className={`py-2 px-2 rounded-lg text-xs font-bold capitalize border transition ${
                      shapeType === st ? 'bg-blue-600 text-white border-blue-700 shadow' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              <div className="bg-gray-50 p-3 rounded-xl border grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block font-medium text-gray-600 mb-1">Unit</label>
                  <select value={unit} onChange={e => setUnit(e.target.value as any)} className="w-full p-2 border rounded bg-white">
                    <option value="cm">cm</option>
                    <option value="m">m</option>
                  </select>
                </div>

                {shapeType === 'rectangle' && (
                  <>
                    <div>
                      <label className="block font-medium text-gray-600 mb-1">Length</label>
                      <input type="number" value={rectLength} onChange={e => setRectLength(Number(e.target.value) || 1)} className="w-full p-2 border rounded" />
                    </div>
                    <div>
                      <label className="block font-medium text-gray-600 mb-1">Width</label>
                      <input type="number" value={rectWidth} onChange={e => setRectWidth(Number(e.target.value) || 1)} className="w-full p-2 border rounded" />
                    </div>
                  </>
                )}

                {shapeType === 'triangle' && (
                  <>
                    <div>
                      <label className="block font-medium text-gray-600 mb-1">Base</label>
                      <input type="number" value={triBase} onChange={e => setTriBase(Number(e.target.value) || 1)} className="w-full p-2 border rounded" />
                    </div>
                    <div>
                      <label className="block font-medium text-gray-600 mb-1">Height</label>
                      <input type="number" value={triHeight} onChange={e => setTriHeight(Number(e.target.value) || 1)} className="w-full p-2 border rounded" />
                    </div>
                  </>
                )}

                {shapeType === 'circle' && (
                  <div>
                    <label className="block font-medium text-gray-600 mb-1">Radius (r)</label>
                    <input type="number" value={circleRadius} onChange={e => setCircleRadius(Number(e.target.value) || 1)} className="w-full p-2 border rounded" />
                  </div>
                )}

                {shapeType === 'cylinder' && (
                  <>
                    <div>
                      <label className="block font-medium text-gray-600 mb-1">Radius (r)</label>
                      <input type="number" value={cylRadius} onChange={e => setCylRadius(Number(e.target.value) || 1)} className="w-full p-2 border rounded" />
                    </div>
                    <div>
                      <label className="block font-medium text-gray-600 mb-1">Height (h)</label>
                      <input type="number" value={cylHeight} onChange={e => setCylHeight(Number(e.target.value) || 1)} className="w-full p-2 border rounded" />
                    </div>
                  </>
                )}

                {shapeType === 'cube' && (
                  <div>
                    <label className="block font-medium text-gray-600 mb-1">Side Length</label>
                    <input type="number" value={cubeSide} onChange={e => setCubeSide(Number(e.target.value) || 1)} className="w-full p-2 border rounded" />
                  </div>
                )}

                {shapeType === 'cone' && (
                  <>
                    <div>
                      <label className="block font-medium text-gray-600 mb-1">Base Radius (r)</label>
                      <input type="number" value={coneRadius} onChange={e => setConeRadius(Number(e.target.value) || 1)} className="w-full p-2 border rounded" />
                    </div>
                    <div>
                      <label className="block font-medium text-gray-600 mb-1">Vertical Height (h)</label>
                      <input type="number" value={coneHeight} onChange={e => setConeHeight(Number(e.target.value) || 1)} className="w-full p-2 border rounded" />
                    </div>
                  </>
                )}

                {shapeType === 'trapezium' && (
                  <>
                    <div>
                      <label className="block font-medium text-gray-600 mb-1">Top Side (a)</label>
                      <input type="number" value={trapTop} onChange={e => setTrapTop(Number(e.target.value) || 1)} className="w-full p-2 border rounded" />
                    </div>
                    <div>
                      <label className="block font-medium text-gray-600 mb-1">Base Side (b)</label>
                      <input type="number" value={trapBase} onChange={e => setTrapBase(Number(e.target.value) || 1)} className="w-full p-2 border rounded" />
                    </div>
                    <div>
                      <label className="block font-medium text-gray-600 mb-1">Height (h)</label>
                      <input type="number" value={trapHeight} onChange={e => setTrapHeight(Number(e.target.value) || 1)} className="w-full p-2 border rounded" />
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: SHADED FRACTIONS */}
          {activeTab === 'fraction_shaded' && (
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-200 space-y-3 text-xs">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Shape Type</label>
                  <select value={fracType} onChange={e => setFracType(e.target.value as any)} className="w-full p-2 border rounded bg-white font-bold">
                    <option value="circle">Divided Circle (Sectors)</option>
                    <option value="rectangle">Divided Rectangle (Grid)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Total Equal Parts (N)</label>
                  <input type="number" value={totalParts} onChange={e => setTotalParts(Number(e.target.value) || 2)} className="w-full p-2 border rounded font-bold" min="2" max="20" />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Shaded Parts (S)</label>
                  <input type="number" value={shadedParts} onChange={e => setShadedParts(Number(e.target.value) || 1)} className="w-full p-2 border rounded font-bold text-blue-700" min="0" max={totalParts} />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CUSTOM NAMED SHAPE */}
          {activeTab === 'custom_named' && (
            <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200 space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Enter Shape Name</label>
                  <input type="text" value={customShapeName} onChange={e => setCustomShapeName(e.target.value)} placeholder="e.g. Regular Octagon" className="w-full p-2 border rounded" />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Side Length / Label</label>
                  <input type="text" value={customSideLength} onChange={e => setCustomSideLength(e.target.value)} placeholder="e.g. 8cm" className="w-full p-2 border rounded" />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Number of Vertices/Sides</label>
                  <input type="number" value={customVertexCount} onChange={e => setCustomVertexCount(Number(e.target.value) || 3)} className="w-full p-2 border rounded" min="3" max="12" />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: WEBPAGE DIAGRAM LINK */}
          {activeTab === 'webpage_diagram' && (
            <div className="bg-purple-50 p-4 rounded-xl border border-purple-200 space-y-3 text-xs">
              <div>
                <label className="block font-bold text-purple-900 mb-1">Paste Diagram Webpage / Image URL (or Pick Sample):</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={webUrl}
                    onChange={e => setWebUrl(e.target.value)}
                    placeholder="https://example.com/diagram.png or pick from list ->"
                    className="flex-1 p-2 border rounded bg-white"
                  />
                  <select onChange={e => setWebUrl(e.target.value)} className="p-2 border rounded bg-white font-medium">
                    <option value="">Pick Topic Diagram...</option>
                    {Object.entries(NACCA_DIAGRAMS).map(([subj, list]) => (
                      <optgroup key={subj} label={`NaCCA ${subj}`}>
                        {(list as {label:string;url:string}[]).map((item, i) => (
                          <option key={i} value={item.url}>📌 {item.label}</option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div>
                  <label className="block font-medium text-gray-700 mb-1">Diagram Topic Title</label>
                  <input type="text" value={webTopic} onChange={e => setWebTopic(e.target.value)} className="w-full p-2 border rounded" />
                </div>
                <div>
                  <label className="block font-medium text-gray-700 mb-1">Question on Diagram</label>
                  <textarea value={webQuestion} onChange={e => setWebQuestion(e.target.value)} rows={2} className="w-full p-2 border rounded" />
                </div>
                <div>
                  <label className="block font-medium text-gray-700 mb-1">Exact Marking Scheme Answer</label>
                  <textarea value={webAnswer} onChange={e => setWebAnswer(e.target.value)} rows={2} className="w-full p-2 border rounded text-green-700 font-medium" />
                </div>
              </div>
            </div>
          )}

          {/* Live Diagram & Question Preview */}
          <div className="border rounded-xl p-4 bg-white grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col items-center justify-center p-3 bg-slate-50 rounded-lg border min-h-[160px]">
              <span className="text-xs font-bold text-gray-500 mb-2">Live Diagram Preview:</span>
              {activeTab === 'webpage_diagram' && webUrl ? (
                <img src={webUrl} alt="Webpage diagram" className="max-h-36 rounded border shadow-sm" />
              ) : (
                <div className="w-56 h-40 flex items-center justify-center" dangerouslySetInnerHTML={{ __html: generateSvgString() }} />
              )}
            </div>

            <div className="text-xs space-y-2">
              <span className="font-bold text-blue-900 block">Suggested NaCCA Section B Question:</span>
              <p className="p-2 bg-blue-50 rounded border border-blue-200 whitespace-pre-line text-gray-800 font-medium">{details.suggestedQuestion}</p>
              {details.subQuestions && (
                <div className="space-y-1">
                  {details.subQuestions.map(sq => (
                    <div key={sq.label} className="p-1.5 bg-green-50 rounded border border-green-200">
                      <p className="font-bold text-green-900">({sq.label}) {sq.question} [{sq.marks}m]</p>
                      <p className="text-green-800 whitespace-pre-line mt-0.5">Ans: {sq.answer}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-xl font-medium text-sm">Cancel</button>
            <button
              type="button"
              onClick={() => onInsert(details)}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm shadow-md"
            >
              🚀 Attach Diagram & Create Question
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}