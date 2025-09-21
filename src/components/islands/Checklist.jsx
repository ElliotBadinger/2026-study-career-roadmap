import React, { useEffect, useMemo, useRef, useState } from "react";

/**
 * Checklist Island
 *
 * @typedef {{ id: string; label: string; checked?: boolean }} Item
 * @typedef {{ storageKey?: string; title?: string; defaultItems?: Item[]; allowAdd?: boolean }} Props
 * Props:
 * - storageKey: string (required) localStorage key for persistence
 * - title?: string
 * - defaultItems?: Array<{ id: string; label: string; checked?: boolean }>
 * - allowAdd?: boolean (default true)
 * @param {Props} props
 */
export default function Checklist({
  storageKey = "phoenix-checklist",
  title = "Checklist",
  defaultItems = /** @type {Item[]} */ ([]),
  allowAdd = true,
}) {
  const initial = useMemo(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore
    }
    // Ensure each default has a checked boolean
    return defaultItems.map((d) => ({ ...d, checked: !!d.checked }));
  }, [storageKey, defaultItems]);

  const [items, setItems] = useState(initial);
  const [filter, setFilter] = useState("all"); // all | open | done
  const [input, setInput] = useState("");
  const inputRef = useRef(null);

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
    return { total, done, open: total - done };
  }, [items]);

  const view = useMemo(() => {
    switch (filter) {
      case "open":
        return items.filter((i) => !i.checked);
      case "done":
        return items.filter((i) => i.checked);
      default:
        return items;
    }
  }, [items, filter]);

  function toggle(id) {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, checked: !i.checked } : i)));
  }

  function remove(id) {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  function addItem(e) {
    e?.preventDefault?.();
    const label = input.trim();
    if (!label) return;
    const id = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
    setItems((prev) => [...prev, { id, label, checked: false }]);
    setInput("");
    inputRef.current?.focus();
  }

  function clearCompleted() {
    setItems((prev) => prev.filter((i) => !i.checked));
  }

  function resetToDefaults() {
    setItems(defaultItems.map((d) => ({ ...d, checked: !!d.checked })));
  }

  return (
    <section className="rounded-xl border border-border-light bg-bg-light-primary dark:border-border-dark dark:bg-bg-dark-surface p-5 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <h3 className="font-display text-lg sm:text-xl font-semibold text-text-light-primary dark:text-text-dark-primary">{title}</h3>
        <div className="flex items-center gap-2 text-xs">
          <span className="px-2 py-1 rounded bg-bg-light-secondary border border-border-light dark:bg-bg-dark-primary dark:border-border-dark">
            {stats.done}/{stats.total} done
          </span>
          <div role="group" aria-label="Filter">
            <button
              type="button"
              onClick={() => setFilter("all")}
              className={`px-2 py-1 rounded-l border border-border-light dark:border-border-dark ${filter === "all" ? "bg-bg-light-secondary dark:bg-bg-dark-primary" : "hover:bg-bg-light-secondary/50 dark:hover:bg-bg-dark-primary/50"}`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setFilter("open")}
              className={`px-2 py-1 border-t border-b border-border-light dark:border-border-dark ${filter === "open" ? "bg-bg-light-secondary dark:bg-bg-dark-primary" : "hover:bg-bg-light-secondary/50 dark:hover:bg-bg-dark-primary/50"}`}
            >
              Open
            </button>
            <button
              type="button"
              onClick={() => setFilter("done")}
              className={`px-2 py-1 rounded-r border border-border-light dark:border-border-dark ${filter === "done" ? "bg-bg-light-secondary dark:bg-bg-dark-primary" : "hover:bg-bg-light-secondary/50 dark:hover:bg-bg-dark-primary/50"}`}
            >
              Done
            </button>
          </div>
        </div>
      </div>

      {allowAdd && (
        <form onSubmit={addItem} className="mb-4 flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Add a task…"
            className="flex-1 text-sm px-3 py-2 rounded border border-border-light bg-bg-light-primary dark:border-border-dark dark:bg-bg-dark-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            aria-label="Add a task"
          />
          <button
            type="submit"
            className="text-sm px-3 py-2 rounded bg-primary text-white hover:bg-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          >
            Add
          </button>
        </form>
      )}

      <ul className="space-y-2">
        {view.length === 0 ? (
          <li className="text-sm text-text-light-secondary dark:text-text-dark-secondary">Nothing here yet.</li>
        ) : (
          view.map((i) => (
            <li key={i.id} className="flex items-start gap-3 rounded border border-border-light bg-bg-light-secondary dark:border-border-dark dark:bg-bg-dark-primary p-3">
              <input
                id={`${storageKey}-${i.id}`}
                type="checkbox"
                checked={!!i.checked}
                onChange={() => toggle(i.id)}
                className="mt-0.5 h-4 w-4 rounded border-border-light dark:border-border-dark text-primary focus:ring-primary/40"
              />
              <label
                htmlFor={`${storageKey}-${i.id}`}
                className={`flex-1 text-sm ${i.checked ? "line-through text-text-light-secondary/80 dark:text-text-dark-secondary/80" : "text-text-light-primary dark:text-text-dark-primary"}`}
              >
                {i.label}
              </label>
              <button
                type="button"
                onClick={() => remove(i.id)}
                aria-label="Remove item"
                className="text-xs px-2 py-1 rounded border border-border-light hover:bg-bg-light-primary dark:border-border-dark dark:hover:bg-bg-dark-surface"
              >
                Remove
              </button>
            </li>
          ))
        )}
      </ul>

      <div className="mt-4 flex flex-wrap gap-2 text-xs">
        <button
          type="button"
          onClick={clearCompleted}
          disabled={stats.done === 0}
          className="px-3 py-1.5 rounded border border-border-light hover:bg-bg-light-secondary dark:border-border-dark dark:hover:bg-bg-dark-surface disabled:opacity-50"
        >
          Clear completed
        </button>
        <button
          type="button"
          onClick={resetToDefaults}
          className="px-3 py-1.5 rounded border border-border-light hover:bg-bg-light-secondary dark:border-border-dark dark:hover:bg-bg-dark-surface"
        >
          Reset to defaults
        </button>
      </div>
    </section>
  );
}
