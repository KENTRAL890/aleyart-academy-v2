import type { ClassLevel, Subject, ExamType } from '../types';

export const CLASS_LEVELS: ClassLevel[] = [
  'Creche', 'N1', 'N2', 'KG1', 'KG2',
  'Basic 1', 'Basic 2', 'Basic 3', 'Basic 4', 'Basic 5', 'Basic 6',
  'Basic 7', 'Basic 8', 'Basic 9'
];

export const EARLY_CHILDHOOD_LEVELS: ClassLevel[] = ['Creche', 'N1', 'N2', 'KG1', 'KG2'];
export const PRIMARY_LEVELS: ClassLevel[] = ['Basic 1', 'Basic 2', 'Basic 3', 'Basic 4', 'Basic 5', 'Basic 6'];
export const JHS_LEVELS: ClassLevel[] = ['Basic 7', 'Basic 8', 'Basic 9'];

export const SUBJECTS_BY_LEVEL: Record<string, Subject[]> = {
  'Creche': ['Literacy & Language', 'Numeracy', 'Environmental Studies', 'Physical & Psychosocial Development'],
  'N1': ['Literacy & Language', 'Numeracy', 'Environmental Studies', 'Physical & Psychosocial Development'],
  'N2': ['Literacy & Language', 'Numeracy', 'Environmental Studies', 'Physical & Psychosocial Development'],
  'KG1': ['Literacy & Language', 'Numeracy', 'Environmental Studies', 'Physical & Psychosocial Development'],
  'KG2': ['Literacy & Language', 'Numeracy', 'Environmental Studies', 'Physical & Psychosocial Development'],
  'Basic 1': ['English Language', 'Mathematics', 'Science', 'Social Studies', 'Computing', 'Creative Arts', 'RME', 'History', 'French', 'Ga/Twi', 'Career Technology'],
  'Basic 2': ['English Language', 'Mathematics', 'Science', 'Social Studies', 'Computing', 'Creative Arts', 'RME', 'History', 'French', 'Ga/Twi', 'Career Technology'],
  'Basic 3': ['English Language', 'Mathematics', 'Science', 'Social Studies', 'Computing', 'Creative Arts', 'RME', 'History', 'French', 'Ga/Twi', 'Career Technology'],
  'Basic 4': ['English Language', 'Mathematics', 'Science', 'Social Studies', 'Computing', 'Creative Arts', 'RME', 'History', 'French', 'Ga/Twi', 'Career Technology'],
  'Basic 5': ['English Language', 'Mathematics', 'Science', 'Social Studies', 'Computing', 'Creative Arts', 'RME', 'History', 'French', 'Ga/Twi', 'Career Technology'],
  'Basic 6': ['English Language', 'Mathematics', 'Science', 'Social Studies', 'Computing', 'Creative Arts', 'RME', 'History', 'French', 'Ga/Twi', 'Career Technology'],
  'Basic 7': ['English Language', 'Mathematics', 'Science', 'Social Studies', 'Computing', 'Creative Arts', 'RME', 'History', 'French', 'Ga/Twi', 'Career Technology'],
  'Basic 8': ['English Language', 'Mathematics', 'Science', 'Social Studies', 'Computing', 'Creative Arts', 'RME', 'History', 'French', 'Ga/Twi', 'Career Technology'],
  'Basic 9': ['English Language', 'Mathematics', 'Science', 'Social Studies', 'Computing', 'Creative Arts', 'RME', 'History', 'French', 'Ga/Twi', 'Career Technology'],
};

export const EXAM_TYPES: ExamType[] = [
  'End of Month Test',
  'End of Term Examination',
  'Mid-Term Test',
  'Class Test',
];

export const SPECIAL_EXAM_TYPES: Record<ClassLevel, ExamType[]> = {
  'Creche': [],
  'N1': [],
  'N2': [],
  'KG1': [],
  'KG2': [],
  'Basic 1': [],
  'Basic 2': [],
  'Basic 3': [],
  'Basic 4': [],
  'Basic 5': [],
  'Basic 6': ['Entrance Exam'],
  'Basic 7': [],
  'Basic 8': ['Transitional Exam'],
  'Basic 9': ['B.E.C.E Standard Exam'],
};

export const PRACTICAL_SUBJECTS_B7_B9: Subject[] = ['Computing', 'Science', 'Creative Arts', 'Career Technology'];
export const PRACTICAL_SUBJECTS_B6: Subject[] = ['Computing'];

export const PRACTICAL_QUESTION_TYPES: Record<Subject, string[]> = {
  'Computing': ['Programming Tasks', 'Flowchart Design', 'Algorithm Development', 'Web Page Design', 'Spreadsheet Activities', 'Database Activities', 'ICT Problem Solving Tasks', 'Data Handling Activities'],
  'Science': ['Experiments', 'Observation Activities', 'Scientific Investigations', 'Data Analysis', 'Interpretation of Results', 'Experimental Procedures', 'Scientific Problem Solving'],
  'Career Technology': ['Design Activities', 'Product Development Tasks', 'Entrepreneurship Activities', 'Home Management Tasks', 'Technical Drawing', 'Production Activities', 'Problem Solving Activities'],
  'Creative Arts': ['Drawing', 'Craft Work', 'Design Tasks', 'Visual Communication Activities', 'Art Appreciation Activities', 'Creative Production Tasks'],
  'RME': ['Stories', 'Moral Scenarios', 'Religious Scenarios', 'Case Studies', 'Passages', 'Real-Life Situations'],
  'English Language': [],
  'Mathematics': [],
  'Social Studies': [],
  'History': [],
  'French': [],
  'Ga/Twi': [],
  'Literacy & Language': [],
  'Numeracy': [],
  'Environmental Studies': [],
  'Physical & Psychosocial Development': [],
};

export const TOPICS_BY_SUBJECT_LEVEL: Record<string, Record<string, string[]>> = {
  'English Language': {
    'Basic 1': ['Nouns', 'Pronouns', 'Verbs', 'Simple Sentences', 'Reading Comprehension', 'Letter Recognition', 'Phonics', 'Vocabulary', 'Spelling', 'Capitalization', 'Punctuation'],
    'Basic 2': ['Nouns', 'Pronouns', 'Verbs', 'Adjectives', 'Simple Sentences', 'Reading Comprehension', 'Vocabulary', 'Spelling', 'Capitalization', 'Punctuation', 'Composition Writing'],
    'Basic 3': ['Parts of Speech', 'Tenses', 'Singular and Plural', 'Reading Comprehension', 'Vocabulary', 'Spelling', 'Composition Writing', 'Letter Writing', 'Punctuation'],
    'Basic 4': ['Parts of Speech', 'Tenses', 'Articles', 'Prepositions', 'Reading Comprehension', 'Vocabulary', 'Composition Writing', 'Letter Writing', 'Punctuation', 'Direct and Indirect Speech'],
    'Basic 5': ['Parts of Speech', 'Tenses', 'Clauses', 'Phrases', 'Reading Comprehension', 'Vocabulary', 'Composition Writing', 'Letter Writing', 'Punctuation', 'Direct and Indirect Speech', 'Active and Passive Voice'],
    'Basic 6': ['Parts of Speech', 'Tenses', 'Clauses', 'Phrases', 'Reading Comprehension', 'Vocabulary', 'Composition Writing', 'Formal Letter Writing', 'Informal Letter Writing', 'Punctuation', 'Direct and Indirect Speech', 'Active and Passive Voice', 'Concord'],
    'Basic 7': ['Grammar', 'Comprehension', 'Summary Writing', 'Composition - Narrative Essay', 'Composition - Descriptive Essay', 'Composition - Argumentative Essay', 'Composition - Formal Letter', 'Composition - Informal Letter', 'Literature - The Beacon of Light', 'Vocabulary', 'Punctuation', 'Tenses', 'Parts of Speech', 'Clauses and Phrases'],
    'Basic 8': ['Grammar', 'Comprehension', 'Summary Writing', 'Composition - Narrative Essay', 'Composition - Descriptive Essay', 'Composition - Argumentative Essay', 'Composition - Formal Letter', 'Composition - Informal Letter', 'Literature - The Beacon of Light', 'Vocabulary', 'Punctuation', 'Tenses', 'Parts of Speech', 'Figures of Speech', 'Clauses and Phrases'],
    'Basic 9': ['Grammar', 'Comprehension', 'Summary Writing', 'Composition - Narrative Essay', 'Composition - Descriptive Essay', 'Composition - Argumentative Essay', 'Composition - Formal Letter', 'Composition - Informal Letter', 'Literature - The Beacon of Light', 'Vocabulary', 'Punctuation', 'Tenses', 'Parts of Speech', 'Figures of Speech', 'Clauses and Phrases', 'Concord', 'Idioms and Proverbs'],
  },
  'Mathematics': {
    'Basic 1': ['Counting 1-100', 'Addition', 'Subtraction', 'Shapes', 'Patterns', 'Measurement', 'Money', 'Time'],
    'Basic 2': ['Addition', 'Subtraction', 'Multiplication', 'Shapes', 'Measurement', 'Money', 'Time', 'Fractions', 'Patterns'],
    'Basic 3': ['Addition', 'Subtraction', 'Multiplication', 'Division', 'Fractions', 'Measurement', 'Money', 'Time', 'Geometry', 'Data Handling'],
    'Basic 4': ['Whole Numbers', 'Fractions', 'Decimals', 'Measurement', 'Geometry', 'Data Handling', 'Money', 'Time', 'Multiplication', 'Division'],
    'Basic 5': ['Whole Numbers', 'Fractions', 'Decimals', 'Percentages', 'Measurement', 'Geometry', 'Data Handling', 'Ratio', 'Algebra'],
    'Basic 6': ['Whole Numbers', 'Fractions', 'Decimals', 'Percentages', 'Measurement', 'Geometry', 'Data Handling', 'Ratio', 'Proportion', 'Algebra', 'Integers'],
    'Basic 7': ['Number and Numeration', 'Fractions', 'Decimals', 'Percentages', 'Integers', 'Algebra', 'Geometry', 'Measurement', 'Statistics', 'Probability', 'Ratio and Proportion', 'Sets'],
    'Basic 8': ['Number and Numeration', 'Fractions', 'Decimals', 'Percentages', 'Integers', 'Algebra', 'Geometry', 'Measurement', 'Statistics', 'Probability', 'Linear Equations', 'Sets', 'Trigonometry'],
    'Basic 9': ['Number and Numeration', 'Fractions', 'Decimals', 'Percentages', 'Integers', 'Algebra', 'Geometry', 'Measurement', 'Statistics', 'Probability', 'Linear Equations', 'Quadratic Equations', 'Sets', 'Trigonometry', 'Vectors'],
  },
  'Science': {
    'Basic 1': ['Living Things', 'Plants', 'Animals', 'Water', 'Air', 'Weather', 'Our Body', 'Health'],
    'Basic 2': ['Living Things', 'Plants', 'Animals', 'Water', 'Air', 'Weather', 'Our Body', 'Health', 'Energy'],
    'Basic 3': ['Living Things', 'Plants', 'Animals', 'Soil', 'Water', 'Air', 'Energy', 'Matter', 'Health'],
    'Basic 4': ['Living Things', 'Plants', 'Animals', 'Soil', 'Water', 'Energy', 'Matter', 'Health', 'Forces', 'Machines'],
    'Basic 5': ['Living Things', 'Ecosystems', 'Energy', 'Matter', 'Health', 'Forces', 'Machines', 'Electricity', 'Human Body Systems'],
    'Basic 6': ['Living Things', 'Ecosystems', 'Energy', 'Matter', 'Health', 'Forces', 'Machines', 'Electricity', 'Human Body Systems', 'Reproduction'],
    'Basic 7': ['Diversity of Matter', 'Cycles', 'Systems', 'Energy', 'Interactions of Matter', 'Humans and the Environment', 'Practical Activities'],
    'Basic 8': ['Diversity of Matter', 'Cycles', 'Systems', 'Energy', 'Interactions of Matter', 'Humans and the Environment', 'Practical Activities', 'Chemical Reactions'],
    'Basic 9': ['Diversity of Matter', 'Cycles', 'Systems', 'Energy', 'Interactions of Matter', 'Humans and the Environment', 'Practical Activities', 'Chemical Reactions', 'Electricity and Magnetism'],
  },
  'Social Studies': {
    'Basic 1': ['Family', 'School', 'Community', 'National Symbols', 'Rules and Laws'],
    'Basic 2': ['Family', 'School', 'Community', 'National Symbols', 'Rules and Laws', 'Our Environment'],
    'Basic 3': ['Family', 'Community', 'Our Environment', 'National Symbols', 'Government', 'Culture'],
    'Basic 4': ['Family', 'Community', 'Our Environment', 'Government', 'Culture', 'History of Ghana', 'Maps'],
    'Basic 5': ['Government', 'Culture', 'History of Ghana', 'Maps', 'Population', 'Resources', 'Environment'],
    'Basic 6': ['Government', 'Culture', 'History of Ghana', 'Maps', 'Population', 'Resources', 'Environment', 'Human Rights'],
    'Basic 7': ['Our Environment', 'Governance', 'Culture', 'Population', 'Resources', 'Human Rights', 'National Development'],
    'Basic 8': ['Our Environment', 'Governance', 'Culture', 'Population', 'Resources', 'Human Rights', 'National Development', 'International Relations'],
    'Basic 9': ['Our Environment', 'Governance', 'Culture', 'Population', 'Resources', 'Human Rights', 'National Development', 'International Relations', 'Sustainable Development'],
  },
  'Computing': {
    'Basic 1': ['Parts of a Computer', 'Uses of Computer', 'Keyboard', 'Mouse'],
    'Basic 2': ['Parts of a Computer', 'Uses of Computer', 'Keyboard', 'Mouse', 'Drawing with Computer'],
    'Basic 3': ['Computer Hardware', 'Computer Software', 'Keyboard Skills', 'Word Processing'],
    'Basic 4': ['Computer Hardware', 'Computer Software', 'Word Processing', 'Internet Basics'],
    'Basic 5': ['Computer Hardware', 'Computer Software', 'Word Processing', 'Spreadsheets', 'Internet'],
    'Basic 6': ['Computer Hardware', 'Computer Software', 'Word Processing', 'Spreadsheets', 'Internet', 'Programming Basics', 'Flowcharts'],
    'Basic 7': ['Introduction to Computing', 'Computer Hardware', 'Computer Software', 'Word Processing', 'Spreadsheets', 'Internet and Web', 'Programming', 'Algorithms', 'Flowcharts', 'Web Design', 'Database'],
    'Basic 8': ['Computer Systems', 'Networking', 'Word Processing', 'Spreadsheets', 'Programming', 'Algorithms', 'Web Design', 'Database', 'Data Handling', 'Cyber Security'],
    'Basic 9': ['Computer Systems', 'Networking', 'Programming', 'Algorithms', 'Web Design', 'Database', 'Data Handling', 'Cyber Security', 'Emerging Technologies', 'Problem Solving'],
  },
  'Creative Arts': {
    'Basic 1': ['Drawing', 'Colouring', 'Craft Work', 'Music', 'Dance'],
    'Basic 2': ['Drawing', 'Colouring', 'Craft Work', 'Music', 'Dance', 'Patterns'],
    'Basic 3': ['Drawing', 'Painting', 'Craft Work', 'Music', 'Dance', 'Patterns', 'Design'],
    'Basic 4': ['Drawing', 'Painting', 'Craft Work', 'Music', 'Dance', 'Patterns', 'Design', 'Textiles'],
    'Basic 5': ['Drawing', 'Painting', 'Craft Work', 'Music', 'Dance', 'Design', 'Textiles', 'Ceramics'],
    'Basic 6': ['Drawing', 'Painting', 'Craft Work', 'Music', 'Dance', 'Design', 'Textiles', 'Ceramics', 'Visual Communication'],
    'Basic 7': ['Visual Art', 'Performing Arts', 'Design', 'Textiles', 'Ceramics', 'Drawing', 'Craft Work', 'Visual Communication'],
    'Basic 8': ['Visual Art', 'Performing Arts', 'Design', 'Textiles', 'Ceramics', 'Drawing', 'Craft Work', 'Visual Communication', 'Art Appreciation'],
    'Basic 9': ['Visual Art', 'Performing Arts', 'Design', 'Textiles', 'Ceramics', 'Drawing', 'Craft Work', 'Visual Communication', 'Art Appreciation', 'Creative Production'],
  },
  'RME': {
    'Basic 1': ['God the Creator', 'Moral Lessons', 'Good Behaviour', 'Prayer'],
    'Basic 2': ['God the Creator', 'Moral Lessons', 'Good Behaviour', 'Prayer', 'Religious Leaders'],
    'Basic 3': ['God the Creator', 'Moral Lessons', 'Religious Festivals', 'Prayer', 'Religious Leaders'],
    'Basic 4': ['God the Creator', 'Moral Values', 'Religious Festivals', 'Religious Leaders', 'Commandments'],
    'Basic 5': ['God the Creator', 'Moral Values', 'Religious Festivals', 'Religious Leaders', 'Commandments', 'Civic Responsibility'],
    'Basic 6': ['God the Creator', 'Moral Values', 'Religious Festivals', 'Religious Leaders', 'Commandments', 'Civic Responsibility', 'Tolerance'],
    'Basic 7': ['God and Creation', 'Moral Values', 'Religious Teachings', 'Family Values', 'Community Living', 'Tolerance', 'Peace Building', 'Civic Responsibility', 'Honesty', 'Integrity'],
    'Basic 8': ['God and Creation', 'Moral Values', 'Religious Teachings', 'Family Values', 'Community Living', 'Tolerance', 'Peace Building', 'Civic Responsibility', 'Leadership', 'Citizenship'],
    'Basic 9': ['God and Creation', 'Moral Values', 'Religious Teachings', 'Family Values', 'Community Living', 'Tolerance', 'Peace Building', 'Civic Responsibility', 'Leadership', 'Citizenship', 'Respect', 'Responsibility'],
  },
  'History': {
    'Basic 1': ['My Family History', 'My School', 'My Community'],
    'Basic 2': ['My Family History', 'My School', 'My Community', 'Our Town'],
    'Basic 3': ['Our Town', 'Our Region', 'Traditional Leaders', 'Cultural Practices'],
    'Basic 4': ['Our Region', 'Traditional Leaders', 'Cultural Practices', 'Early Kingdoms'],
    'Basic 5': ['Early Kingdoms', 'European Contact', 'Trade', 'Independence'],
    'Basic 6': ['Independence of Ghana', 'Government', 'National Heroes', 'Economic Development'],
    'Basic 7': ['Pre-Colonial Ghana', 'European Contact', 'Trade and Commerce', 'Colonialism', 'Nationalism', 'Independence'],
    'Basic 8': ['Post-Independence Ghana', 'Governments of Ghana', 'Economic Development', 'African History', 'World History'],
    'Basic 9': ['Ghana History', 'African History', 'World History', 'International Organizations', 'Human Rights', 'Sustainable Development'],
  },
  'French': {
    'Basic 1': ['Greetings', 'Numbers 1-10', 'Colours', 'Family'],
    'Basic 2': ['Greetings', 'Numbers 1-20', 'Colours', 'Family', 'Days of the Week'],
    'Basic 3': ['Greetings', 'Numbers', 'Colours', 'Family', 'Days and Months', 'Animals'],
    'Basic 4': ['Greetings', 'Numbers', 'Family', 'School', 'Food', 'Animals', 'Parts of Body'],
    'Basic 5': ['Greetings', 'Numbers', 'Family', 'School', 'Food', 'Weather', 'Daily Activities'],
    'Basic 6': ['Greetings', 'Numbers', 'Family', 'School', 'Food', 'Weather', 'Daily Activities', 'Directions'],
    'Basic 7': ['La Famille', 'L\'école', 'Les Aliments', 'Le Temps', 'Les Activités Quotidiennes', 'La Ville', 'Les Vêtements', 'Les Professions'],
    'Basic 8': ['La Famille', 'L\'école', 'Les Aliments', 'Le Temps', 'Les Activités Quotidiennes', 'La Ville', 'Les Vêtements', 'Les Professions', 'Les Voyages'],
    'Basic 9': ['La Famille', 'L\'école', 'Les Aliments', 'Le Temps', 'Les Activités Quotidiennes', 'La Ville', 'Les Vêtements', 'Les Professions', 'Les Voyages', 'La Culture'],
  },
  'Ga/Twi': {
    'Basic 1': ['Greetings', 'Numbers', 'Family', 'Colours'],
    'Basic 2': ['Greetings', 'Numbers', 'Family', 'Colours', 'Days of the Week'],
    'Basic 3': ['Greetings', 'Numbers', 'Family', 'Animals', 'Food'],
    'Basic 4': ['Greetings', 'Numbers', 'Family', 'Animals', 'Food', 'Body Parts'],
    'Basic 5': ['Culture', 'Proverbs', 'Storytelling', 'Vocabulary', 'Grammar'],
    'Basic 6': ['Culture', 'Proverbs', 'Storytelling', 'Vocabulary', 'Grammar', 'Composition'],
    'Basic 7': ['Culture', 'Proverbs', 'Storytelling', 'Vocabulary', 'Grammar', 'Composition', 'Comprehension'],
    'Basic 8': ['Culture', 'Proverbs', 'Storytelling', 'Vocabulary', 'Grammar', 'Composition', 'Comprehension', 'Translation'],
    'Basic 9': ['Culture', 'Proverbs', 'Storytelling', 'Vocabulary', 'Grammar', 'Composition', 'Comprehension', 'Translation', 'Literature'],
  },
  'Career Technology': {
    'Basic 1': ['Tools and Materials', 'Safety', 'Simple Projects'],
    'Basic 2': ['Tools and Materials', 'Safety', 'Simple Projects', 'Home Management'],
    'Basic 3': ['Tools and Materials', 'Safety', 'Projects', 'Home Management', 'Sewing'],
    'Basic 4': ['Tools and Materials', 'Safety', 'Projects', 'Home Management', 'Sewing', 'Woodwork'],
    'Basic 5': ['Tools and Materials', 'Safety', 'Projects', 'Home Management', 'Sewing', 'Woodwork', 'Entrepreneurship'],
    'Basic 6': ['Tools and Materials', 'Safety', 'Projects', 'Home Management', 'Sewing', 'Woodwork', 'Entrepreneurship', 'Design'],
    'Basic 7': ['Design and Technology', 'Home Management', 'Entrepreneurship', 'Technical Drawing', 'Textiles', 'Woodwork', 'Problem Solving'],
    'Basic 8': ['Design and Technology', 'Home Management', 'Entrepreneurship', 'Technical Drawing', 'Textiles', 'Woodwork', 'Problem Solving', 'Product Development'],
    'Basic 9': ['Design and Technology', 'Home Management', 'Entrepreneurship', 'Technical Drawing', 'Textiles', 'Woodwork', 'Problem Solving', 'Product Development', 'Production Activities'],
  },
  'Literacy & Language': {
    'Creche': ['Basic Communication', 'Responding to Sounds', 'Eye Contact'],
    'N1': ['Songs and Rhymes', 'Storytelling', 'Colour Recognition', 'Shape Recognition'],
    'N2': ['Songs and Rhymes', 'Storytelling', 'Colour Recognition', 'Shape Recognition', 'Letter Recognition'],
    'KG1': ['Letter Recognition', 'Phonics', 'Simple Reading', 'Oral Language', 'Songs and Rhymes'],
    'KG2': ['Letter Recognition', 'Phonics', 'Simple Reading', 'Oral Language', 'Songs and Rhymes', 'Writing Readiness'],
  },
  'Numeracy': {
    'Creche': ['Grasping Objects', 'Sorting'],
    'N1': ['Counting 1-5', 'Sorting Objects', 'Colours', 'Shapes'],
    'N2': ['Counting 1-10', 'Sorting Objects', 'Colours', 'Shapes', 'Patterns'],
    'KG1': ['Counting 1-20', 'Basic Addition', 'Shapes', 'Sorting', 'Patterns'],
    'KG2': ['Counting 1-50', 'Addition', 'Subtraction', 'Shapes', 'Sorting', 'Patterns', 'Measurement'],
  },
  'Environmental Studies': {
    'Creche': ['Physical Environment'],
    'N1': ['Family', 'School', 'Animals', 'Plants'],
    'N2': ['Family', 'School', 'Community', 'Animals', 'Plants', 'Weather'],
    'KG1': ['Family', 'School', 'Community', 'Animals', 'Plants', 'Weather'],
    'KG2': ['Family', 'School', 'Community', 'Animals', 'Plants', 'Weather', 'Seasons'],
  },
  'Physical & Psychosocial Development': {
    'Creche': ['Movement', 'Walking', 'Grasping', 'Social Behaviour'],
    'N1': ['Motor Skills', 'Games', 'Coordination', 'Social Interaction'],
    'N2': ['Motor Skills', 'Games', 'Coordination', 'Social Interaction', 'Pencil Holding'],
    'KG1': ['Motor Skills', 'Games', 'Coordination', 'Social Interaction', 'Writing Skills'],
    'KG2': ['Motor Skills', 'Games', 'Coordination', 'Social Interaction', 'Writing Skills', 'Behaviour'],
  },
};

export const RME_STORY_THEMES = [
  'Honesty', 'Respect', 'Responsibility', 'Tolerance', 'Integrity',
  'Peace Building', 'Leadership', 'Citizenship', 'Family Values',
  'Community Living', 'Religious Teachings', 'Moral Values'
];

export const ENGLISH_B7_B9_SECTION_B = {
  grammar: { title: 'Grammar', defaultMarks: 15 },
  comprehension: { title: 'Comprehension', defaultMarks: 15 },
  summary: { title: 'Summary', defaultMarks: 10 },
  composition: { title: 'Composition', defaultMarks: 10 },
  literature: { title: 'Literature (The Beacon of Light)', defaultMarks: 10 },
};

export const ENGLISH_B1_B6_AREAS = [
  'Grammar',
  'Comprehension (Reading)',
  'Composition/Writing',
  'Vocabulary and Writing Conventions',
  'Oral Language',
];

export const COMPOSITION_TYPES = [
  'Narrative Essay', 'Descriptive Essay', 'Argumentative Essay',
  'Formal Letter', 'Informal Letter',
];

export const LITERARY_DEVICES = [
  'Simile', 'Metaphor', 'Personification', 'Hyperbole',
  'Alliteration', 'Repetition', 'Imagery',
];

export const DEFAULT_USERS: { id: string; name: string; role: 'admin' | 'teacher'; password: string; subject?: string }[] = [
  { id: 'admin1', name: 'Admin', role: 'admin', password: 'admin123' },
  { id: 'teacher1', name: 'Mr. Mensah', role: 'teacher', password: 'teacher123', subject: 'Mathematics' },
  { id: 'teacher2', name: 'Mrs. Addo', role: 'teacher', password: 'teacher123', subject: 'English Language' },
];

export const KG_ASSESSMENT_AREAS = {
  'KG1': [
    {
      name: 'Literacy & Language',
      criteria: ['Letter Recognition (A-Z)', 'Phonics (Letter Sounds)', 'Oral Language Skills', 'Listening Comprehension', 'Recitation of Rhymes/Songs']
    },
    {
      name: 'Numeracy',
      criteria: ['Counting 1-20', 'Number Recognition', 'Basic Addition with Objects', 'Shape Recognition', 'Sorting and Grouping']
    },
    {
      name: 'Environmental Studies',
      criteria: ['Identifying Family Members', 'School Community', 'Animals and Plants', 'Weather Recognition']
    },
    {
      name: 'Physical & Psychosocial Development',
      criteria: ['Fine Motor Skills', 'Gross Motor Skills', 'Social Interaction', 'Following Instructions', 'Coordination in Games']
    }
  ],
  'KG2': [
    {
      name: 'Literacy & Language',
      criteria: ['Letter Recognition and Writing', 'Phonics and Blending', 'Simple Reading', 'Oral Communication', 'Story Comprehension', 'Writing Readiness']
    },
    {
      name: 'Numeracy',
      criteria: ['Counting 1-50', 'Number Writing', 'Basic Addition', 'Basic Subtraction', 'Shape and Pattern Recognition', 'Simple Measurement']
    },
    {
      name: 'Environmental Studies',
      criteria: ['Family and Community', 'Animals and Plants', 'Weather and Seasons', 'Health and Hygiene']
    },
    {
      name: 'Physical & Psychosocial Development',
      criteria: ['Fine Motor Skills', 'Gross Motor Skills', 'Social Skills', 'Emotional Development', 'Creative Expression']
    }
  ]
};

export const MATH_SHAPE_OPTIONS = [
  { label: 'Right-Angled Triangle (Base 4cm, Height 3cm)', url: '/images/math-triangle.jpg' },
  { label: 'Circle (Radius r = 7cm)', url: '/images/math-circle.jpg' },
  { label: 'Cylinder (Radius r = 5cm, Height 10cm)', url: '/images/math-cylinder.jpg' },
  { label: 'Rectangle (Length 8cm, Width 5cm)', url: '/images/math-rectangle.jpg' },
  { label: 'Acute Angle (Theta = 60°)', url: '/images/math-angle.jpg' },
];

export const BEACON_OF_LIGHT_EXCERPTS = [
  {
    title: 'Chapter 1: The Storm at Sea',
    excerpt: 'The dark clouds gathered over the coastal town of Anomabo as young Kwame stared out into the turbulent waves. His father had set sail before dawn, seeking the daily catch that sustained their family. Kwame knew the sea was both a generous provider and a fierce master. As the wind howled through the palm fronds, he remembered his father\'s advice: "A beacon of light guides the steady sailor through the darkest night."',
    questions: [
      { q: 'Where does the story take place?', answer: 'The story takes place in the coastal town of Anomabo.' },
      { q: 'Why did Kwame\'s father set sail before dawn?', answer: 'He set sail seeking the daily catch to sustain their family.' },
      { q: 'What advice did Kwame\'s father give him?', answer: 'He advised that "A beacon of light guides the steady sailor through the darkest night."' },
    ]
  },
  {
    title: 'Chapter 2: The Quest for Knowledge',
    excerpt: 'Despite the financial struggles following the storm, Kwame never gave up his dream of attending the academy. Every evening, by the flickering light of an oil lamp, he devoured old textbooks borrowed from the village teacher, Mr. Ansah. Kwame realized that education was the true lighthouse that would dispel the fog of ignorance and poverty.',
    questions: [
      { q: 'How did Kwame study every evening?', answer: 'He studied by the flickering light of an oil lamp using textbooks borrowed from Mr. Ansah.' },
      { q: 'What metaphor is used to describe education in the passage?', answer: 'Education is described as "the true lighthouse that would dispel the fog of ignorance and poverty."' },
    ]
  },
  {
    title: 'Chapter 3: The Beacon of Hope',
    excerpt: 'On the day of the national examination, Kwame walked into the examination hall with steady confidence. When the results were announced weeks later, his name stood at the very top of the regional list. The entire community gathered to celebrate, recognizing that Kwame had become their very own beacon of light.',
    questions: [
      { q: 'What happened when the national examination results were announced?', answer: 'Kwame\'s name stood at the very top of the regional list.' },
      { q: 'Why did the community gather to celebrate?', answer: 'They gathered to celebrate because Kwame had succeeded and become their beacon of light.' },
    ]
  }
];

// Universal NaCCA Diagram Library — available across ALL classes and subjects
export const NACCA_DIAGRAMS: Record<string, { label: string; url: string; topic: string }[]> = {
  'Mathematics': [
    { label: 'Right-Angled Triangle', url: '/images/math-triangle.jpg', topic: 'Geometry' },
    { label: 'Circle with Radius', url: '/images/math-circle.jpg', topic: 'Measurement' },
    { label: 'Cylinder', url: '/images/math-cylinder.jpg', topic: 'Mensuration' },
    { label: 'Rectangle', url: '/images/math-rectangle.jpg', topic: 'Shapes & Space' },
    { label: 'Angle Diagram', url: '/images/math-angle.jpg', topic: 'Angles & Bearings' },
  ],
  'Computing': [
    { label: 'Algorithm Flowchart', url: '/images/computing-flowchart-1.jpg', topic: 'Algorithms & Flowcharts' },
    { label: 'Computer Block Diagram (Input→CPU→Output)', url: 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 180"><rect x="10" y="70" width="70" height="40" fill="#e2e8f0" stroke="#0f172a" stroke-width="2"/><text x="45" y="94" font-size="12" font-weight="bold" text-anchor="middle">INPUT</text><rect x="120" y="40" width="90" height="100" fill="#bfdbfe" stroke="#1d4ed8" stroke-width="2"/><text x="165" y="75" font-size="13" font-weight="bold" text-anchor="middle">CPU</text><text x="165" y="115" font-size="11" text-anchor="middle">Memory</text><rect x="240" y="70" width="70" height="40" fill="#e2e8f0" stroke="#0f172a" stroke-width="2"/><text x="275" y="94" font-size="12" font-weight="bold" text-anchor="middle">OUTPUT</text><line x1="80" y1="90" x2="120" y2="90" stroke="#0f172a" stroke-width="2"/><line x1="210" y1="90" x2="240" y2="90" stroke="#0f172a" stroke-width="2"/></svg>'), topic: 'Computer Hardware' },
    { label: 'Star Network Topology', url: 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 220"><circle cx="140" cy="110" r="20" fill="#bfdbfe" stroke="#1d4ed8" stroke-width="2"/><text x="140" y="115" font-size="10" font-weight="bold" text-anchor="middle">HUB</text><circle cx="60" cy="40" r="14" fill="#e2e8f0" stroke="#334155" stroke-width="2"/><text x="60" y="44" font-size="8" text-anchor="middle">PC1</text><circle cx="220" cy="40" r="14" fill="#e2e8f0" stroke="#334155" stroke-width="2"/><text x="220" y="44" font-size="8" text-anchor="middle">PC2</text><circle cx="60" cy="180" r="14" fill="#e2e8f0" stroke="#334155" stroke-width="2"/><text x="60" y="184" font-size="8" text-anchor="middle">PC3</text><circle cx="220" cy="180" r="14" fill="#e2e8f0" stroke="#334155" stroke-width="2"/><text x="220" y="184" font-size="8" text-anchor="middle">PC4</text><line x1="140" y1="90" x2="60" y2="54" stroke="#334155" stroke-width="1.5"/><line x1="140" y1="90" x2="220" y2="54" stroke="#334155" stroke-width="1.5"/><line x1="140" y1="130" x2="60" y2="166" stroke="#334155" stroke-width="1.5"/><line x1="140" y1="130" x2="220" y2="166" stroke="#334155" stroke-width="1.5"/></svg>'), topic: 'Networking' },
  ],
  'Science': [
    { label: 'Laboratory Experiment Setup', url: '/images/science-practical-1.jpg', topic: 'Practical Investigations' },
    { label: 'Filtration Apparatus', url: 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 220"><polygon points="110,60 190,60 150,130" fill="none" stroke="#0f172a" stroke-width="2"/><rect x="130" y="130" width="40" height="70" fill="none" stroke="#0f172a" stroke-width="2"/><line x1="130" y1="170" x2="170" y2="170" stroke="#3b82f6" stroke-width="2" stroke-dasharray="3,3"/><text x="200" y="80" font-size="12" font-weight="bold">Filter Funnel</text><text x="180" y="160" font-size="12" font-weight="bold">Filtrate</text></svg>'), topic: 'Diversity of Matter' },
    { label: 'Simple Plant Cell', url: 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 200"><rect x="30" y="20" width="220" height="160" rx="30" fill="#dcfce7" stroke="#166534" stroke-width="3"/><ellipse cx="140" cy="100" rx="50" ry="35" fill="#bbf7d0" stroke="#166534" stroke-width="2"/><text x="140" y="105" font-size="11" text-anchor="middle" font-weight="bold">Nucleus</text><text x="140" y="22" font-size="10" text-anchor="middle" fill="#166534">Cell Wall</text><text x="140" y="185" font-size="10" text-anchor="middle" fill="#166534">Cytoplasm</text></svg>'), topic: 'Living Things / Cells' },
  ],
  'Career Technology': [
    { label: 'Orthographic Technical Drawing', url: '/images/career-tech-design-1.jpg', topic: 'Technical Drawing' },
    { label: 'Woodwork Joint (Mortise & Tenon)', url: 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 200"><rect x="50" y="80" width="120" height="40" fill="#fef3c7" stroke="#854d0e" stroke-width="2"/><rect x="170" y="90" width="30" height="20" fill="#fde047" stroke="#854d0e" stroke-width="2"/><rect x="210" y="40" width="40" height="120" fill="#fef3c7" stroke="#854d0e" stroke-width="2"/><rect x="210" y="90" width="40" height="20" fill="none" stroke="#854d0e" stroke-width="2" stroke-dasharray="4,4"/><text x="110" y="70" font-size="12" font-weight="bold">Tenon</text><text x="230" y="30" font-size="12" font-weight="bold">Mortise</text></svg>'), topic: 'Materials & Tools' },
  ],
  'Creative Arts': [
    { label: 'Adinkra Symbol — Gye Nyame (Except God)', url: '/images/creative-arts-adinkra-1.jpg', topic: 'Ghanaian Cultural Heritage' },
    { label: 'Primary & Secondary Colour Wheel', url: 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240"><circle cx="120" cy="120" r="90" fill="none" stroke="#000" stroke-width="2"/><path d="M120 120L120 30A90 90 0 0 1 198 75Z" fill="#ef4444"/><path d="M120 120L198 75A90 90 0 0 1 198 165Z" fill="#f97316"/><path d="M120 120L198 165A90 90 0 0 1 120 210Z" fill="#eab308"/><path d="M120 120L120 210A90 90 0 0 1 42 165Z" fill="#22c55e"/><path d="M120 120L42 165A90 90 0 0 1 42 75Z" fill="#3b82f6"/><path d="M120 120L42 75A90 90 0 0 1 120 30Z" fill="#a855f7"/></svg>'), topic: 'Colour Theory (All Levels)' },
    { label: 'Kente Weaving Pattern', url: 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 160"><rect x="0" y="0" width="240" height="160" fill="#fef3c7"/><rect x="10" y="10" width="30" height="140" fill="#eab308" stroke="#854d0e" stroke-width="1"/><rect x="50" y="10" width="30" height="140" fill="#22c55e" stroke="#166534" stroke-width="1"/><rect x="90" y="10" width="30" height="140" fill="#ef4444" stroke="#991b1b" stroke-width="1"/><rect x="130" y="10" width="30" height="140" fill="#3b82f6" stroke="#1e40af" stroke-width="1"/><rect x="170" y="10" width="30" height="140" fill="#eab308" stroke="#854d0e" stroke-width="1"/><rect x="10" y="30" width="190" height="15" fill="rgba(0,0,0,0.1)"/><rect x="10" y="70" width="190" height="15" fill="rgba(0,0,0,0.1)"/><rect x="10" y="110" width="190" height="15" fill="rgba(0,0,0,0.1)"/><text x="210" y="85" font-size="11" font-weight="bold" fill="#854d0e">Kente</text></svg>'), topic: 'Textiles & Weaving (All Levels)' },
    { label: 'Elements of Design (Line, Shape, Colour)', url: 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 160"><line x1="20" y1="80" x2="90" y2="80" stroke="#1e293b" stroke-width="3"/><text x="55" y="100" font-size="10" text-anchor="middle" font-weight="bold">LINE</text><rect x="110" y="55" width="50" height="50" fill="#3b82f6" stroke="#1e293b" stroke-width="2"/><text x="135" y="125" font-size="10" text-anchor="middle" font-weight="bold">SHAPE</text><circle cx="230" cy="80" r="25" fill="#ef4444" stroke="#1e293b" stroke-width="2"/><text x="230" y="125" font-size="10" text-anchor="middle" font-weight="bold">COLOUR</text></svg>'), topic: 'Design Elements (All Levels)' },
  ],
  'Social Studies': [
    { label: 'Map of Ghana (Regions)', url: 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 260"><rect x="10" y="10" width="180" height="240" fill="#f0fdf4" stroke="#166534" stroke-width="2" rx="10"/><text x="100" y="40" font-size="16" font-weight="bold" text-anchor="middle" fill="#166534">GHANA</text><text x="100" y="65" font-size="10" text-anchor="middle" fill="#166534">16 Regions</text><line x1="30" y1="80" x2="170" y2="80" stroke="#86efac" stroke-width="1"/><text x="100" y="100" font-size="9" text-anchor="middle">Greater Accra</text><text x="100" y="120" font-size="9" text-anchor="middle">Ashanti Region</text><text x="100" y="140" font-size="9" text-anchor="middle">Northern Region</text><text x="100" y="160" font-size="9" text-anchor="middle">Western Region</text><text x="100" y="180" font-size="9" text-anchor="middle">Eastern Region</text><text x="100" y="200" font-size="9" text-anchor="middle">Volta Region</text><text x="100" y="220" font-size="9" text-anchor="middle" fill="#64748b">...and more</text></svg>'), topic: 'Our Environment / Maps' },
  ],
  'RME': [
    { label: 'Religious Symbols (Cross, Crescent, Star)', url: 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 120"><line x1="50" y1="10" x2="50" y2="100" stroke="#854d0e" stroke-width="4"/><line x1="25" y1="35" x2="75" y2="35" stroke="#854d0e" stroke-width="4"/><text x="50" y="115" font-size="9" text-anchor="middle" font-weight="bold">Christianity</text><path d="M140 20 A30 30 0 0 1 140 80" fill="none" stroke="#166534" stroke-width="3"/><circle cx="165" cy="35" r="5" fill="#166534"/><text x="150" y="115" font-size="9" text-anchor="middle" font-weight="bold">Islam</text><polygon points="250,15 257,40 280,40 262,55 268,80 250,65 232,80 238,55 220,40 243,40" fill="#eab308" stroke="#854d0e" stroke-width="1.5"/><text x="250" y="115" font-size="9" text-anchor="middle" font-weight="bold">Judaism</text></svg>'), topic: 'Religious Teachings' },
  ],
};

/**
 * Filter topics based on selected Term (Term 1, Term 2, Term 3).
 * By NaCCA guidelines, Term 3 covers cumulative mixture of Term 1, 2, and 3 topics.
 */
export function getTopicsForTerm(allTopics: string[], term: string): string[] {
  if (!allTopics || allTopics.length === 0) return [];
  if (term === 'Term 3') {
    return allTopics; // Mixture of all terms 1, 2, and 3
  }
  const mid = Math.ceil(allTopics.length / 2);
  if (term === 'Term 1') {
    return allTopics.slice(0, mid);
  }
  if (term === 'Term 2') {
    return allTopics.slice(mid);
  }
  return allTopics;
}
