import React, { useEffect, useMemo, useState } from "react";

/**
 * Interactive Timeline
 * @typedef {{id: string; title?: string; period?: string; summary?: string}} Phase
 * @typedef {{ phases?: Phase[]; storageKey?: string; title?: string }} Props
 * @param {Props} props
 */
export default function InteractiveTimeline({
  phases = /** @type {Phase[]} */ ([]),
  storageKey = "phoenix-timeline-state",
  title = "Your 5-Phase Plan",
}) {
  const ids = useMemo(() => phases.map((p) => p.id), [phases]);

  const [open, setOpen] = useState(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return {};
      const parsed = JSON.parse(raw);
      return typeof parsed === "object" && parsed ? parsed : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(open));
    } catch {
      // ignore
    }
  }, [open, storageKey]);

  const allOpen = useMemo(() => ids.length > 0 && ids.every((id) => open[id]), [ids, open]);

  function toggle(id) {
    setOpen((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function setAll(value) {
    const next = {};
    for (const id of ids) next[id] = value;
    setOpen(next);
  }

  return (
    <section className="rounded-xl border border-base-300 bg-white p-5 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <h2 className="font-display text-lg sm:text-xl font-semibold text-neutral">{title}</h2>
        <div className="flex gap-2">
          <button
            type="button"
            className="text-xs px-3 py-1.5 rounded border border-base-300 hover:bg-base-200"
            onClick={() => setAll(true)}
          >
            Expand all
          </button>
          <button
            type="button"
            className="text-xs px-3 py-1.5 rounded border border-base-300 hover:bg-base-200"
            onClick={() => setAll(false)}
            disabled={!allOpen && ids.every((id) => !open[id])}
          >
            Collapse all
          </button>
        </div>
      </div>

      <ol className="relative border-l-2 border-base-300 pl-5 space-y-4">
        {phases.map((p, idx) => {
          const isOpen = !!open[p.id];
          return (
            <li key={p.id} className="relative">
              <span
                aria-hidden="true"
                className="absolute -left-[9px] top-2 h-3 w-3 rounded-full bg-gradient-to-br from-primary to-secondary"
              />

              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-medium text-neutral">
                    {p.title ?? `Phase ${idx + 1}`}
                  </h3>
                  {p.period && (
                    <p className="text-xs text-neutral/60 mt-0.5">{p.period}</p>
                  )}
                </div>
                <div>
                  <button
                    type="button"
                    className="text-xs px-2 py-1 rounded border border-base-300 hover:bg-base-200"
                    aria-expanded={isOpen}
                    aria-controls={`${p.id}-panel`}
                    onClick={() => toggle(p.id)}
                  >
                    {isOpen ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <div
                id={`${p.id}-panel`}
                role="region"
                aria-label={p.title ?? `Phase ${idx + 1} details`}
                className={`mt-2 overflow-hidden transition-[max-height,opacity] duration-300 ease-out ${
                  isOpen ? "opacity-100" : "opacity-0"
                }`}
                style={{
                  maxHeight: isOpen ? "260px" : "0px",
                }}
              >
                {p.summary ? (
                  <p className="text-sm text-neutral/80 bg-base-200 border border-base-300 rounded-lg p-3">
                    {p.summary}
                  </p>
                ) : (
                  <p className="text-sm text-neutral/60">
                    No summary provided. Use the checklist below to track actions for this phase.
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}