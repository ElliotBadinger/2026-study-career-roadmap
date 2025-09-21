export type Phase = {
  id: string;
  title: string;
  period: string;
  summary: string;
};

export type ChecklistItem = { id: string; label: string; checked?: boolean };
export type PhaseChecklists = Record<string, ChecklistItem[]>;

export const phases: Phase[] = [
  {
    id: "phase-1",
    title: "Phase 1: Focus & Self‑Discovery",
    period: "Now → late September 2025",
    summary:
      "Lock in your study system and start career discovery. Use social learning advantages: study groups and an accountability partner.",
  },
  {
    id: "phase-2",
    title: "Phase 2: Applications & Funding",
    period: "September → October 2025",
    summary:
      "Shortlist institutions and programmes, submit provisional applications, and complete NSFAS (and Funza if teaching).",
  },
  {
    id: "phase-3",
    title: "Phase 3: Final Exam Preparation",
    period: "October → November 2025",
    summary:
      "Go all‑in on exam prep. Timed past papers, focused revision, and weekly mocks with your group.",
  },
  {
    id: "phase-4",
    title: "Phase 4: Results & Offers",
    period: "January 2026",
    summary:
      "Get results, confirm/decline offers, update NSFAS, and use late application windows if needed.",
  },
  {
    id: "phase-5",
    title: "Phase 5: Orientation & Pre‑Start",
    period: "Feb → Mar 2026",
    summary:
      "Prepare logistics for day‑one readiness: devices, data, commute, and bridging resources for weak areas.",
  },
];

export const defaults: PhaseChecklists = {
  "phase-1": [
    { id: "p1-1", label: "Form a 2–4 person study group and set a weekly schedule (3–4 sessions)" },
    { id: "p1-2", label: "Choose an accountability partner and share weekly goals" },
    { id: "p1-3", label: "Complete 2–3 career assessments (Truity/O*NET/FundiConnect or DHET/CAO/123test)" },
    { id: "p1-4", label: "Start your Decision Matrix with 3–5 career options" },
    { id: "p1-5", label: "Collect programme admission requirements (APS, subject mins) for short‑listed options" },
  ],
  "phase-2": [
    { id: "p2-1", label: "Submit provisional applications (universities, UoTs, TVETs)" },
    { id: "p2-2", label: "Create myNSFAS and upload documents (IDs, income proof, consent form)" },
    { id: "p2-3", label: "Apply for Funza Lushaka if pursuing B.Ed (note service requirement)" },
    { id: "p2-4", label: "Track application references and closing dates in a single doc" },
  ],
  "phase-3": [
    { id: "p3-1", label: "Weekly mock: one full past paper under timed conditions" },
    { id: "p3-2", label: "Accounting recovery plan: targeted topics + extra practice blocks" },
    { id: "p3-3", label: "Group teach‑back sessions: rotate topics and mark together" },
    { id: "p3-4", label: "Protect deep‑work time daily (no phone, timer on)" },
  ],
  "phase-4": [
    { id: "p4-1", label: "Collect final results and check institutional portals" },
    { id: "p4-2", label: "Confirm/decline offers; pay registration deposit if required" },
    { id: "p4-3", label: "Update NSFAS with final placement; complete any outstanding steps" },
    { id: "p4-4", label: "Late applications contingency (TVET/UoT/university windows)" },
  ],
  "phase-5": [
    { id: "p5-1", label: "Arrange logistics: device, data plan, commute, accommodation (if needed)" },
    { id: "p5-2", label: "Join faculty/student channels and calendar key dates" },
    { id: "p5-3", label: "Bridge gaps: foundational Accounting refresher or academic literacy module" },
  ],
};