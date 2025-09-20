export type StatTileConfig = {
  value: string;
  label: string;
  icon?: "calendar" | "target" | "spark" | "book" | "clock" | "shield";
  accent?: "blue" | "green" | "purple" | "amber";
};

export type QuickLink = {
  title: string;
  href: string;
  accent?: "blue" | "green" | "purple" | "amber" | "neutral";
  body: string;
};

export type HomeContent = {
  heroTitle: string;
  heroSubtitle: string;
  critical: {
    title: string;
    body: string;
    refs: number[]; // map to homeRefs in references.ts
  };
  stats: StatTileConfig[];
  countdown: { label: string; target: string };
  quickLinksPrimary: QuickLink[];
  quickLinksBento: QuickLink[];
};

export const home: HomeContent = {
  heroTitle: "Simphiwe, your 2026 launchpad starts here",
  heroSubtitle:
    "From uncertainty to opportunity: a calm, clear plan to win November and choose your next step with confidence.",
  critical: {
    title: "Critical Reality Check",
    body:
      "Your previous NSC statement cannot be used for applications. June 2025 results show strengths in languages but a failing Accounting mark blocks provisional offers. Your final exams in November 2025 determine your options for 2026—aim for a Diploma Pass (APS 19) as a realistic and valuable goal.",
    refs: [1, 2],
  },
  stats: [
    { value: "53%", label: "Your current average", icon: "spark", accent: "blue" },
    { value: "19", label: "Target APS for Diploma Pass", icon: "target", accent: "green" }
  ],
  countdown: {
    label: "Exam Sprint countdown",
    // SAST (UTC+02:00)
    target: "2025-10-01T08:00:00+02:00",
  },
  quickLinksPrimary: [
    {
      title: "Start your Decision Matrix",
      href: "/compass",
      accent: "amber",
      body:
        "Turn test results into a clear choice. Add 3–5 careers, score them on Interest, Skills Match, and Demand, then sort by best fit.",
    },
    {
      title: "Follow the 5‑Phase Roadmap",
      href: "/roadmap",
      accent: "blue",
      body:
        "Expand each phase to reveal a checklist. Tick items as you complete them—your progress is saved on this device.",
    },
  ],
  quickLinksBento: [
    {
      title: "Study Hub",
      href: "/study-hub",
      accent: "purple",
      body:
        "Social learning playbook: study groups, accountability partnerships, timed past papers, and curated SA resources.",
    },
    {
      title: "Funding Guide",
      href: "/funding",
      accent: "green",
      body:
        "NSFAS vs Funza Lushaka vs University bursaries—what you qualify for, what documents you need, and when to apply.",
    },
    {
      title: "Know the Goal Posts",
      href: "/roadmap",
      accent: "blue",
      body:
        "Understand NSC pass types and how your November marks unlock 2026 opportunities. See refs [1] and [2] on the home page.",
    },
    {
      title: "Career Tools",
      href: "/compass",
      accent: "amber",
      body:
        "Truity (RIASEC), O*NET Interest Profiler, and FundiConnect—use more than one and cross‑reference for themes.",
    },
  ],
};