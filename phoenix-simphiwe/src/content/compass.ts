export type ToolCard = {
  title: string;
  href: string;
  description: string;
  accent?: "blue" | "green" | "amber" | "purple";
  refId?: number; // maps to compassRefs in references.ts
};

export type MethodStep = {
  index: number;
  text: string;
};

export type MatrixSeed = {
  name: string;
  interest: number; // 1..5
  skills: number;   // 1..5
  demand: number;   // 1..5
  qualification?: string;
  funding?: string;
};

export type CompassContent = {
  toolsPrimary: ToolCard[];
  toolsAdditional: ToolCard[];
  method: MethodStep[];
  matrixSeed: MatrixSeed[];
};

export const compass: CompassContent = {
  toolsPrimary: [
    {
      title: "Truity Holland Code (RIASEC)",
      href: "https://www.truity.com/test/holland-code-career-test",
      description: "Scientifically‑grounded model (RIASEC) that maps interests to work environments. ~10–15 minutes.",
      accent: "blue",
      refId: 1,
    },
    {
      title: "O*NET Interest Profiler",
      href: "https://www.mynextmove.org/explore/ip",
      description: "U.S. Dept of Labor profiler with deep occupation database and job outlook links.",
      accent: "green",
      refId: 2,
    },
    {
      title: "FundiConnect Career Quiz",
      href: "https://fundiconnect.co.za/career-tests-for-south-african-students/",
      description: "South Africa‑focused quiz linking suggestions to local study options and bursaries.",
      accent: "amber",
      refId: 3,
    },
  ],
  toolsAdditional: [
    {
      title: "DHET Khetha / Career Help",
      href: "https://www.careerhelp.org.za",
      description: "SA context: guidance, understanding results, and planning next steps.",
      accent: "blue",
      refId: 4,
    },
    {
      title: "CAO Self‑assessment Quiz",
      href: "https://www.cao.ac.za/Quiz.aspx",
      description: "Quick working‑personality and interest snapshot for SA applicants.",
      accent: "green",
      refId: 5,
    },
    {
      title: "123test (RIASEC)",
      href: "https://www.123test.com/career-test/",
      description: "Independent RIASEC test to triangulate your interests and strengths.",
      accent: "purple",
      refId: 6,
    },
    {
      title: "Alison Aptitude Test",
      href: "https://alison.com/psychometric-test/aptitude",
      description: "Free aptitude screening to complement interest‑based results.",
      accent: "purple",
      refId: 7,
    },
  ],
  method: [
    { index: 1, text: "Complete 2–3 assessments and save the results (PDF or screenshots)." },
    { index: 2, text: "List the top careers and skills each test mentions (5–10 items each)." },
    { index: 3, text: "Highlight overlaps: repeated fields, common skills, typical work environments." },
    { index: 4, text: "Check realistic entry requirements (APS, subject minimums) for each option." },
    { index: 5, text: "Move your 3–5 strongest options into the Decision Matrix and score them." },
  ],
  matrixSeed: [
    {
      name: "Foundation Phase Teacher",
      interest: 4,
      skills: 4,
      demand: 5,
      qualification: "B.Ed Degree",
      funding: "Funza Lushaka",
    },
    {
      name: "Human Resources Officer",
      interest: 3,
      skills: 3,
      demand: 4,
      qualification: "Diploma/Degree",
      funding: "NSFAS",
    },
  ],
};