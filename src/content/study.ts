export type StudyStrategy = {
  title: string;
  bullets: string[];
  accent?: "blue" | "green" | "purple" | "amber";
};

export type ResourceLink = {
  title: string;
  href: string;
  refId?: number; // maps to studyRefs in references.ts
  description?: string;
};

export type StudyContent = {
  introTitle: string;
  introSubtitle: string;
  strategies: StudyStrategy[];
  officialResources: ResourceLink[];
  supplementaryResources: ResourceLink[];
  efficiencyTips: string[];
};

export const study: StudyContent = {
  introTitle: "Your Study Hub",
  introSubtitle:
    "You learn best with people. Use that advantage: study groups, accountability, and consistent practice with past papers.",
  strategies: [
    {
      title: "Virtual Study Groups",
      accent: "blue",
      bullets: [
        "Meet on WhatsApp, Teams, or Zoom; set a recurring schedule (3–4 times/week).",
        "Alternate subjects to maintain engagement (e.g., language → Maths Lit).",
        "End each session by listing 2–3 micro-goals before the next meeting."
      ]
    },
    {
      title: "Accountability Partnership",
      accent: "green",
      bullets: [
        "Share a weekly plan (e.g., “two chapters per day” or “one past paper per week”).",
        "Track progress with screenshots or a shared doc; celebrate small wins.",
        "When stuck, ask your partner to teach the topic back in 5 minutes."
      ]
    },
    {
      title: "Timed Past Papers",
      accent: "purple",
      bullets: [
        "Simulate exam conditions (timer on, no phone) once per week per subject.",
        "Mark with memos; list three mistakes and how to avoid them next time.",
        "Repeat weak topics in short daily drills (15–25 minutes)."
      ]
    },
    {
      title: "Subject Triage (Oct–Nov)",
      accent: "amber",
      bullets: [
        "Protect strengths (languages, LO) while running an Accounting recovery plan.",
        "Schedule daily quiet blocks for problem practice and essay outlines.",
        "Use group time for explanation and feedback; keep sessions purposeful."
      ]
    }
  ],
  officialResources: [
    {
      title: "Western Cape Education Department — NSC Exams & Resources",
      href: "https://www.westerncape.gov.za/education/national-senior-certificate-nsc-exams-june",
      refId: 1,
      description: "Question papers and memos; good official reference."
    },
    {
      title: "Siyavula — Past Papers & Practice",
      href: "https://www.siyavula.com/products/past-papers",
      refId: 2,
      description: "Free open textbooks and interactive practice; immediate feedback."
    }
  ],
  supplementaryResources: [
    {
      title: "PaperVideo — Tutorial Videos",
      href: "https://www.papervideo.co.za/",
      refId: 3,
      description: "Short, exam‑focused explainers (useful for Accounting catch‑up)."
    },
    {
      title: "Khan Academy — Accounting, Business, Maths",
      href: "https://www.khanacademy.org/",
      description: "Global library; pair with SA past papers for context."
    }
  ],
  efficiencyTips: [
    "Pre‑watch 10–15 minutes of videos before group sessions; use the session for questions and application.",
    "Convert errors into flashcards or a “mistake log”; revisit twice per week.",
    "For languages, practice timed summaries and essay outlines; mark with rubrics as a group."
  ]
};