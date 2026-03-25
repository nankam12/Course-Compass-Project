/**
 * Seed script — populates the database with sample courses.
 * Run with:  npm run seed
 */

require('dotenv').config();

const mongoose = require('mongoose');
const Course = require('./models/Course');

const courses = [
  // ── Computer Science ──────────────────────────────────────────────────────
  {
    code: 'CS101',
    name: 'Introduction to Computer Science',
    department: 'Computer Science',
    description:
      'Fundamentals of programming, algorithms, and problem-solving. Covers variables, loops, functions, and data types using Python.',
    professor: {
      name: 'Dr. Sarah Johnson',
      email: 'sjohnson@university.edu',
      officeHours: 'Mon & Wed 2:00–4:00 PM',
      officeLocation: 'CS Building, Room 302',
    },
    teachingAssistants: [
      { name: 'Alex Chen', email: 'achen@university.edu', officeHours: 'Tue & Thu 3:00–5:00 PM' },
      { name: 'Maria Davis', email: 'mdavis@university.edu', officeHours: 'Fri 10:00 AM–12:00 PM' },
    ],
    semester: 'Spring 2026',
    credits: 3,
  },
  {
    code: 'CS201',
    name: 'Data Structures & Algorithms',
    department: 'Computer Science',
    description:
      'Study of fundamental data structures (arrays, linked lists, trees, graphs, hash tables) and algorithm design techniques including sorting, searching, and dynamic programming.',
    professor: {
      name: 'Prof. Michael Torres',
      email: 'mtorres@university.edu',
      officeHours: 'Tue & Thu 1:00–3:00 PM',
      officeLocation: 'CS Building, Room 215',
    },
    teachingAssistants: [
      { name: 'Priya Patel', email: 'ppatel@university.edu', officeHours: 'Mon 4:00–6:00 PM' },
    ],
    semester: 'Spring 2026',
    credits: 3,
  },
  {
    code: 'CS301',
    name: 'Operating Systems',
    department: 'Computer Science',
    description:
      'Principles of modern operating systems: processes, threads, memory management, file systems, and concurrency. Emphasis on the Unix/Linux environment.',
    professor: {
      name: 'Dr. Emily Carter',
      email: 'ecarter@university.edu',
      officeHours: 'Wed & Fri 11:00 AM–1:00 PM',
      officeLocation: 'CS Building, Room 408',
    },
    teachingAssistants: [
      { name: 'James Liu', email: 'jliu@university.edu', officeHours: 'Thu 2:00–4:00 PM' },
      { name: 'Nina Okonkwo', email: 'nokonkwo@university.edu', officeHours: 'Fri 1:00–3:00 PM' },
    ],
    semester: 'Spring 2026',
    credits: 3,
  },
  {
    code: 'CS401',
    name: 'Database Systems',
    department: 'Computer Science',
    description:
      'Relational database design, SQL, transactions, indexing, and query optimization. Introduction to NoSQL databases and data modeling.',
    professor: {
      name: 'Dr. Robert Kim',
      email: 'rkim@university.edu',
      officeHours: 'Mon & Wed 10:00 AM–12:00 PM',
      officeLocation: 'CS Building, Room 120',
    },
    teachingAssistants: [
      { name: 'Sofia Martinez', email: 'smartinez@university.edu', officeHours: 'Tue 5:00–7:00 PM' },
    ],
    semester: 'Spring 2026',
    credits: 3,
  },
  {
    code: 'CS450',
    name: 'Software Engineering',
    department: 'Computer Science',
    description:
      'Software development lifecycle, agile methodologies, design patterns, testing strategies, version control, and team-based project development.',
    professor: {
      name: 'Prof. Linda Zhao',
      email: 'lzhao@university.edu',
      officeHours: 'Tue & Thu 3:00–5:00 PM',
      officeLocation: 'CS Building, Room 310',
    },
    teachingAssistants: [],
    semester: 'Spring 2026',
    credits: 3,
  },

  // ── Mathematics ───────────────────────────────────────────────────────────
  {
    code: 'MATH101',
    name: 'Calculus I',
    department: 'Mathematics',
    description:
      'Limits, continuity, differentiation, and an introduction to integration. Applications include curve sketching, optimization, and related rates.',
    professor: {
      name: 'Dr. Andrew Nguyen',
      email: 'anguyen@university.edu',
      officeHours: 'Mon & Wed 1:00–3:00 PM',
      officeLocation: 'Math Hall, Room 201',
    },
    teachingAssistants: [
      { name: 'Rachel Green', email: 'rgreen@university.edu', officeHours: 'Tue 2:00–4:00 PM' },
      { name: 'Carlos Ruiz', email: 'cruiz@university.edu', officeHours: 'Thu 4:00–6:00 PM' },
    ],
    semester: 'Spring 2026',
    credits: 4,
  },
  {
    code: 'MATH201',
    name: 'Calculus II',
    department: 'Mathematics',
    description:
      'Techniques of integration, improper integrals, infinite series, Taylor series, and an introduction to differential equations.',
    professor: {
      name: 'Dr. Patricia Walsh',
      email: 'pwalsh@university.edu',
      officeHours: 'Tue & Thu 11:00 AM–1:00 PM',
      officeLocation: 'Math Hall, Room 205',
    },
    teachingAssistants: [
      { name: 'Omar Hassan', email: 'ohassan@university.edu', officeHours: 'Wed 3:00–5:00 PM' },
    ],
    semester: 'Spring 2026',
    credits: 4,
  },
  {
    code: 'MATH301',
    name: 'Linear Algebra',
    department: 'Mathematics',
    description:
      'Systems of linear equations, matrix operations, determinants, vector spaces, eigenvalues, and eigenvectors. Applications in science and engineering.',
    professor: {
      name: 'Prof. David Park',
      email: 'dpark@university.edu',
      officeHours: 'Mon & Fri 10:00 AM–12:00 PM',
      officeLocation: 'Math Hall, Room 310',
    },
    teachingAssistants: [],
    semester: 'Spring 2026',
    credits: 3,
  },

  // ── Physics ───────────────────────────────────────────────────────────────
  {
    code: 'PHYS101',
    name: 'General Physics I',
    department: 'Physics',
    description:
      'Classical mechanics: kinematics, Newton\'s laws, work, energy, momentum, rotation, and gravitation. Laboratory component included.',
    professor: {
      name: 'Dr. Helen Marsh',
      email: 'hmarsh@university.edu',
      officeHours: 'Mon & Wed 3:00–5:00 PM',
      officeLocation: 'Physics Building, Room 101',
    },
    teachingAssistants: [
      { name: 'Ben Foster', email: 'bfoster@university.edu', officeHours: 'Tue & Thu 12:00–2:00 PM' },
    ],
    semester: 'Spring 2026',
    credits: 4,
  },
  {
    code: 'PHYS201',
    name: 'General Physics II',
    department: 'Physics',
    description:
      'Electrostatics, electric circuits, magnetism, electromagnetic waves, optics, and modern physics. Laboratory component included.',
    professor: {
      name: 'Dr. Thomas Reed',
      email: 'treed@university.edu',
      officeHours: 'Wed & Fri 1:00–3:00 PM',
      officeLocation: 'Physics Building, Room 205',
    },
    teachingAssistants: [
      { name: 'Aisha Obi', email: 'aobi@university.edu', officeHours: 'Mon 5:00–7:00 PM' },
    ],
    semester: 'Spring 2026',
    credits: 4,
  },

  // ── Psychology ────────────────────────────────────────────────────────────
  {
    code: 'PSYC101',
    name: 'Introduction to Psychology',
    department: 'Psychology',
    description:
      'Survey of major topics in psychology including biological basis of behavior, sensation, perception, learning, memory, cognition, motivation, emotion, personality, and social behavior.',
    professor: {
      name: 'Dr. Jennifer Brooks',
      email: 'jbrooks@university.edu',
      officeHours: 'Tue & Thu 2:00–4:00 PM',
      officeLocation: 'Social Sciences Hall, Room 415',
    },
    teachingAssistants: [
      { name: 'Lucas White', email: 'lwhite@university.edu', officeHours: 'Wed 10:00 AM–12:00 PM' },
    ],
    semester: 'Spring 2026',
    credits: 3,
  },
  {
    code: 'PSYC201',
    name: 'Research Methods in Psychology',
    department: 'Psychology',
    description:
      'Scientific method applied to psychological research: experimental design, data collection, statistical analysis, and APA-style writing.',
    professor: {
      name: 'Prof. Mark Stevens',
      email: 'mstevens@university.edu',
      officeHours: 'Mon & Wed 11:00 AM–1:00 PM',
      officeLocation: 'Social Sciences Hall, Room 320',
    },
    teachingAssistants: [],
    semester: 'Spring 2026',
    credits: 3,
  },

  // ── English ───────────────────────────────────────────────────────────────
  {
    code: 'ENGL101',
    name: 'English Composition I',
    department: 'English',
    description:
      'Develops skills in expository and argumentative writing, critical thinking, and academic research. Emphasis on paragraph and essay structure.',
    professor: {
      name: 'Prof. Amanda Clarke',
      email: 'aclarke@university.edu',
      officeHours: 'Mon & Fri 2:00–4:00 PM',
      officeLocation: 'Humanities Building, Room 112',
    },
    teachingAssistants: [],
    semester: 'Spring 2026',
    credits: 3,
  },
  {
    code: 'ENGL201',
    name: 'Introduction to Literature',
    department: 'English',
    description:
      'Survey of literary genres — fiction, poetry, and drama — with emphasis on close reading, literary analysis, and critical interpretation.',
    professor: {
      name: 'Dr. Jonathan Holt',
      email: 'jholt@university.edu',
      officeHours: 'Tue & Thu 1:00–3:00 PM',
      officeLocation: 'Humanities Building, Room 230',
    },
    teachingAssistants: [
      { name: 'Grace Evans', email: 'gevans@university.edu', officeHours: 'Wed 2:00–4:00 PM' },
    ],
    semester: 'Spring 2026',
    credits: 3,
  },

  // ── Business ──────────────────────────────────────────────────────────────
  {
    code: 'BUS101',
    name: 'Principles of Business',
    department: 'Business',
    description:
      'Introduction to the functional areas of business: management, marketing, finance, operations, and entrepreneurship in a global economy.',
    professor: {
      name: 'Prof. Christine Yuen',
      email: 'cyuen@university.edu',
      officeHours: 'Mon & Wed 9:00–11:00 AM',
      officeLocation: 'Business School, Room 205',
    },
    teachingAssistants: [
      { name: 'Daniel Morris', email: 'dmorris@university.edu', officeHours: 'Thu 3:00–5:00 PM' },
    ],
    semester: 'Spring 2026',
    credits: 3,
  },
  {
    code: 'BUS201',
    name: 'Accounting Fundamentals',
    department: 'Business',
    description:
      'Basics of financial accounting: the accounting cycle, financial statements, assets, liabilities, equity, and introductory managerial accounting.',
    professor: {
      name: 'Dr. Paul Bennett',
      email: 'pbennett@university.edu',
      officeHours: 'Tue & Thu 10:00 AM–12:00 PM',
      officeLocation: 'Business School, Room 310',
    },
    teachingAssistants: [],
    semester: 'Spring 2026',
    credits: 3,
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing courses
    await Course.deleteMany({});
    console.log('Cleared existing courses');

    // Insert new courses
    const inserted = await Course.insertMany(courses);
    console.log(`Seeded ${inserted.length} courses successfully`);

    await mongoose.disconnect();
    console.log('Done. Disconnected from MongoDB.');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err.message);
    process.exit(1);
  }
}

seed();
