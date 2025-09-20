export type EligibilityItem = { text: string; refId?: number };
export type ChecklistItem = { id: string; label: string };
export type TableRow = {
  type: "University" | "TVET College" | "University of Technology";
  focus: string;
  qualifications: string;
  learningStyle: string;
  bestFor: string;
};

export type FundingContent = {
  introTitle: string;
  introSubtitle: string;

  nsfas: {
    title: string;
    eligibility: EligibilityItem[];
    goodNewsNote: string;
    goodNewsRef?: number;
  };

  otherAvenues: {
    funza: { title: string; description: string; refId?: number };
    universityBursaries: { title: string; description: string };
    learnerships: { title: string; description: string };
  };

  institutionComparison: {
    title: string;
    rows: TableRow[];
  };

  nsfasChecklist: {
    left: ChecklistItem[];
    right: ChecklistItem[];
  };
};

export const funding: FundingContent = {
  introTitle: "Your Financial Guide",
  introSubtitle:
    "Understand funding pathways and prepare an application that’s complete, early, and stress‑free.",

  nsfas: {
    title: "NSFAS Overview (2026)",
    eligibility: [
      { text: "South African citizen (or permanent resident)", refId: 1 },
      { text: "Household income ≤ R350,000 per year (≤ R600,000 if disabled)", refId: 1 },
      { text: "First‑time entering student at a public University/UoT/TVET", refId: 1 },
      { text: "Passed Grade 12 and meet the admission requirements", refId: 1 },
      { text: "Enrolled in an NSFAS‑approved qualification", refId: 1 }
    ],
    goodNewsNote:
      "Having Mathematical Literacy does not disqualify you from NSFAS. NSFAS is based on financial need and admission into an approved public qualification, not on specific matric subjects.",
    goodNewsRef: 1
  },

  otherAvenues: {
    funza: {
      title: "Funza Lushaka Bursary (Teaching)",
      description:
        "Covers tuition, accommodation, and a living allowance for B.Ed students. Requires teaching in a public school after graduation (service commitment). Priority area for Foundation Phase teaching.",
      refId: 2
    },
    universityBursaries: {
      title: "University‑specific Bursaries",
      description:
        "Most public institutions offer merit‑ and need‑based bursaries. Check each target institution’s Financial Aid page after results release."
    },
    learnerships: {
      title: "Learnerships & Apprenticeships",
      description:
        "Work‑based training with a stipend. Valuable for vocational or applied paths that prefer practical experience."
    }
  },

  institutionComparison: {
    title: "Choosing Your Institution: At a Glance",
    rows: [
      {
        type: "University",
        focus: "Academic and theoretical",
        qualifications: "Degrees, some Higher Certificates",
        learningStyle: "Lectures, research, independent study",
        bestFor: "Professional careers requiring degrees"
      },
      {
        type: "TVET College",
        focus: "Vocational and practical",
        qualifications: "National Certificates, Diplomas",
        learningStyle: "Hands‑on, workshop‑based",
        bestFor: "Specific trades and occupations"
      },
      {
        type: "University of Technology",
        focus: "Career‑focused and applied",
        qualifications: "Diplomas and Degrees",
        learningStyle: "Theory + practical (work‑integrated learning)",
        bestFor: "Applied routes with industry links"
      }
    ]
  },

  nsfasChecklist: {
    left: [
      { id: "c1", label: "Create your myNSFAS account and verify your contact details" },
      { id: "c2", label: "SA ID or birth certificate (certified copy)" },
      { id: "c3", label: "Parent/guardian ID (certified copy)" },
      { id: "c4", label: "Proof of household income (salary slip, SASSA letter, or affidavit)" },
      { id: "c5", label: "Completed and signed NSFAS consent form" },
      { id: "c6", label: "Proof of application/acceptance to a public institution" }
    ],
    right: [
      { id: "c7", label: "Apply as soon as the window opens (expected Sep/Oct for 2026)" },
      { id: "c8", label: "Double‑check document clarity (no cut‑off edges; readable IDs)" },
      { id: "c9", label: "Track your status in myNSFAS and your institution portal" },
      { id: "c10", label: "Keep a single folder with all PDFs/screenshots for quick re‑upload" }
    ]
  }
};