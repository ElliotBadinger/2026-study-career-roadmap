import React, { useEffect, useMemo, useState } from "react";

function parseTarget(target) {
  // Default: 2025-10-01 08:00 SAST (+02:00)
  const fallback = "2025-10-01T08:00:00+02:00";
  try {
    const t = target || fallback;
    const d = new Date(t);
    if (isNaN(d.getTime())) {
      // Try to coerce "YYYY-MM-DD HH:mm" into ISO with local offset
      const coerced = t.replace(" ", "T");
      const d2 = new Date(coerced);
      if (isNaN(d2.getTime())) return new Date(fallback);
      return d2;
    }
    return d;
  } catch {
    return new Date(fallback);
  }
}

function diffParts(ms) {
  const clamp = Math.max(0, ms);
  const totalSeconds = Math.floor(clamp / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return { days, hours, minutes, seconds, totalSeconds };
}

export default function Countdown({ target, label = "Next milestone" }) {
  const targetDate = useMemo(() => parseTarget(target), [target]);
  const [now, setNow] = useState(() => Date.now());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const { days, hours, minutes, seconds, totalSeconds } = useMemo(() => {
    return diffParts(targetDate.getTime() - now);
  }, [targetDate, now]);

  const complete = totalSeconds === 0;

  return (
    <div className="rounded-xl border border-base-300 bg-white p-5">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs sm:text-sm text-neutral/70">{label}</div>
          {!mounted ? (
            <div className="mt-1 text-2xl sm:text-3xl font-bold text-neutral tabular-nums">
              --d --h --m --s
            </div>
          ) : complete ? (
            <div className="mt-1 text-2xl sm:text-3xl font-bold text-primary">Go time</div>
          ) : (
            <div className="mt-1 text-2xl sm:text-3xl font-bold text-neutral tabular-nums">
              {days}d {hours}h {minutes}m {seconds}s
            </div>
          )}
        </div>
        <div className="hidden sm:block text-right text-xs text-neutral/60">
          <div className="font-medium text-neutral/70">Target</div>
          <div>
            {targetDate.toLocaleString(undefined, {
              year: "numeric",
              month: "short",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>
      </div>
      <div className="mt-3 h-2 rounded bg-base-300 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary to-secondary transition-[width] duration-700 ease-out"
          style={{
            width: (() => {
              const total = Math.max(1, targetDate.getTime() - (targetDate.getTime() - 90 * 24 * 3600 * 1000));
              const elapsed = Math.min(total, Math.max(0, targetDate.getTime() - now));
              // Reverse progress to show time remaining (visual filler shrinking would be odd),
              // instead compute a pseudo-progress where 0% is far away, 100% is imminent.
              const pct = 100 - Math.min(99, Math.floor((elapsed / total) * 100));
              return `${pct}%`;
            })(),
          }}
        />
      </div>
    </div>
  );
}