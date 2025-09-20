export type Reference = {
  id: number;
  title: string;
  url: string;
  note?: string;
};

/**
 * Page-scoped reference maps so footnote ids 1..N remain consistent per page.
 * Usage idea (optional):
 *   import { homeRefs } from "../content/references";
 *   const r1 = homeRefs[1]; // SACAP
 */

export const homeRefs: Record<number, Reference> = {
  1: {
    id: 1,
    title: "SACAP — What are the different types of matric passes?",
    url: "https://www.sacap.edu.za/blog/applied-psychology/what-are-the-different-types-of-matric-passes/",
  },
  2: {
    id: 2,
    title: "Online Career Guidance — Grade 12 Pass Requirements 2025",
    url: "https://www.onlinecareerguidance.co.za/2025/01/14/grade-12-pass-requirements/",
  },
};

export const compassRefs: Record<number, Reference> = {
  1: {
    id: 1,
    title: "Truity — Holland Code Career Test (RIASEC)",
    url: "https://www.truity.com/test/holland-code-career-test",
  },
  2: {
    id: 2,
    title: "O*NET Interest Profiler (My Next Move)",
    url: "https://www.mynextmove.org/explore/ip",
  },
  3: {
    id: 3,
    title: "FundiConnect — Career Tests for South African Students",
    url: "https://fundiconnect.co.za/career-tests-for-south-african-students/",
  },
  4: {
    id: 4,
    title: "Career Help (Khetha) — Department of Higher Education & Training",
    url: "https://www.careerhelp.org.za",
  },
  5: {
    id: 5,
    title: "CAO — Self assessment quiz",
    url: "https://www.cao.ac.za/Quiz.aspx",
  },
  6: {
    id: 6,
    title: "123test — Career test (RIASEC)",
    url: "https://www.123test.com/career-test/",
  },
  7: {
    id: 7,
    title: "Alison — Free Aptitude Test",
    url: "https://alison.com/psychometric-test/aptitude",
  },
};

export const studyRefs: Record<number, Reference> = {
  1: {
    id: 1,
    title: "Western Cape Government — NSC exams and resources",
    url: "https://www.westerncape.gov.za/education/national-senior-certificate-nsc-exams-june",
  },
  2: {
    id: 2,
    title: "Siyavula — Past papers & practice",
    url: "https://www.siyavula.com/products/past-papers",
  },
  3: {
    id: 3,
    title: "PaperVideo — Educational tutorial site",
    url: "https://www.papervideo.co.za/",
  },
};

export const roadmapRefs: Record<number, Reference> = {
  1: {
    id: 1,
    title: "SACAP — What are the different types of matric passes?",
    url: "https://www.sacap.edu.za/blog/applied-psychology/what-are-the-different-types-of-matric-passes/",
  },
  2: {
    id: 2,
    title: "Career Help (Khetha) — Department of Higher Education & Training",
    url: "https://www.careerhelp.org.za",
  },
};

export const fundingRefs: Record<number, Reference> = {
  1: {
    id: 1,
    title: "What’s On Gauteng — NSFAS 2026 application requirements & eligibility",
    url: "https://whatson.gauteng.net/nsfas-2026-application-requirements-eligibility/",
  },
  2: {
    id: 2,
    title: "Funza Lushaka — Bursary Application Notes 2025",
    url: "https://www.funzalushaka.doe.gov.za/Content/Documents/Funza%20Lushaka%20Bursary%20Application%20Notes%202025.pdf",
  },
};

/**
 * Optional helper to flatten a map into an array for rendering lists.
 */
export function toList(map: Record<number, Reference>): Reference[] {
  return Object.keys(map)
    .map((k) => Number(k))
    .sort((a, b) => a - b)
    .map((id) => map[id]);
}