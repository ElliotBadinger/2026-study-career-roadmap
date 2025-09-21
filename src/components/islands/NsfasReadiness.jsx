import React, { useEffect, useMemo, useState } from "react";

/**
 * NSFAS Readiness island
 * A focused checklist that persists to localStorage and gives an at-a-glance status.
 *
 * Props:
 * - storageKey?: string
 * - title?: string
 * - defaultItems?: Array<{ id: string; label: string; checked?: boolean }>
 */
export default function NsfasReadiness({
  storageKey = "phoenix-nsfas-readiness-v1",
  title = "NSFAS Readiness Check",
  defaultItems = [
    { id: "r1", label: "Create myNSFAS account and verify email/phone" },
    { id: "r2", label: "SA ID or birth certificate (certified copy)" },
    { id: "r3", label: "Parent/guardian ID (certified copy)" },
    { id: "r4", label: "Proof of household income (salary slip / SASSA letter / affidavit)" },
    { id: "r5", label: "Completed and signed NSFAS consent form" },
    { id: "r6", label: "Proof of application/acceptance to a public institution (if available)" },
    { id: "r7", label: "Scan/photograph documents clearly (no cut‑off edges, readable)" },
    { id: "r8", label: "Apply as soon as the window opens (Sep/Oct for 2026 intake)" },
    { id: "r9", label: "Keep a single folder for PDFs/screenshots to re‑upload quickly" },
  ],
}) {
  const initial = useMemo(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          return parsed.map((i) => ({
            id: String(i.id),
            label: String(i.label),
            checked: !!i.checked,
          }));
        }
      }
    } catch {
      // ignore
    }
    return defaultItems.map((i) => ({ ...i, checked: !!i.checked }));
  }, [storageKey, defaultItems]);

  const [items, setItems] = useState(initial);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items, storageKey]);

  const stats = useMemo(() => {
    const total = items.length;
    const done = items.filter((i) => i.checked).length;
    const percent = total ? Math.round((done / total) * 100) : 0;
    let tier = "Not ready";
    let tierColor = "text-red-700";
    if (percent >= 100) {
      tier = "Ready to apply";
      tierColor = "text-green-700";
    } else if (percent >= 60) {
      tier = "Almost there";
      tierColor = "text-amber-700";
    } else if (percent >= 30) {
      tier = "In progress";
      tierColor = "text-blue-700";
    }
    return { total, done, percent, tier, tierColor };
  }, [items]);

  function toggle(id) {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, checked: !i.checked } : i)));
  }

  function reset() {
    setItems(defaultItems.map((i) => ({ ...i, checked: !!i.checked })));
  }

  function markAll() {
    setItems((prev) => prev.map((i) => ({ ...i, checked: true })));
  }

  return (
    <section className="rounded-xl border border-base-300 bg-white p-5 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div>
          <h2 className="font-display text-lg sm:text-xl font-semibold text-neutral">{title}</h2>
          <p className={`text-xs ${stats.tierColor}`}>
            {stats.tier} • {stats.done}/{stats.total} complete
          </p>
        </div>

        <div className="flex gap-2 text-xs">
          <button
            type="button"
            className="px-3 py-1.5 rounded border border-base-300 hover:bg-base-200"
            onClick={markAll}
            aria-label="Mark all readiness items as done"
          >
            Mark all
          </button>
          <button
            type="button"
            className="px-3 py-1.5 rounded border border-base-300 hover:bg-base-200"
            onClick={reset}
            aria-label="Reset readiness checklist to defaults"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-2 w-full bg-base-300 rounded mb-4 overflow-hidden" aria-label="Readiness progress">
        <div
          className="h-full rounded bg-gradient-to-r from-primary to-secondary transition-[width] duration-500 ease-out"
          style={{ width: `${stats.percent}%` }}
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={stats.percent}
          aria-valuetext={`${stats.percent}%`}
        />
      </div>

      {/* List */}
      <ul className="space-y-2">
        {items.length === 0 ? (
          <li className="text-sm text-neutral/60">No items.</li>
        ) : (
          items.map((i) => (
            <li key={i.id} className="flex items-start gap-3 rounded border border-base-300 bg-base-100 p-3">
              <input
                id={`nsfas-${i.id}`}
                type="checkbox"
                checked={!!i.checked}
                onChange={() => toggle(i.id)}
                className="mt-0.5 h-4 w-4 rounded border-base-300 text-primary focus:ring-primary/40"
              />
              <label
                htmlFor={`nsfas-${i.id}`}
                className={`flex-1 text-sm ${i.checked ? "line-through text-neutral/50" : "text-neutral/90"}`}
              >
                {i.label}
              </label>
            </li>
          ))
        )}
      </ul>

      {/* Guidance note */}
      <p className="mt-4 text-xs text-neutral/60">
        Tip: Keep scans as clear PDFs/JPGs. If an upload fails, try a smaller file size and make sure edges aren’t cut off.
      </p>
    </section>
  );
}