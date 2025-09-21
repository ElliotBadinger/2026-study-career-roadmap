import React, { useEffect, useMemo, useRef, useState } from "react";

const STORAGE_KEY = "phoenix-decision-matrix-v1";

function clampScore(n) {
  const x = Number(n);
  if (!Number.isFinite(x)) return 0;
  return Math.max(1, Math.min(5, Math.round(x)));
}

function computeTotal(row) {
  return clampScore(row.interest) + clampScore(row.skills) + clampScore(row.demand);
}

function exampleRows() {
  return [
    {
      id: "ex-1",
      name: "Foundation Phase Teacher",
      interest: 4,
      skills: 4, // Languages
      demand: 5, // High demand
      qualification: "B.Ed Degree",
      funding: "Funza Lushaka",
    },
    {
      id: "ex-2",
      name: "Human Resources Officer",
      interest: 3,
      skills: 3, // People Skills
      demand: 4, // Moderate demand
      qualification: "Diploma/Degree",
      funding: "NSFAS",
    },
  ].map((r) => ({ ...r, total: computeTotal(r) }));
}

/**
 * Decision Matrix Tool
 * @typedef {{ id?: string; name: string; interest: number; skills: number; demand: number; qualification?: string; funding?: string; total?: number }} Row
 * @typedef {{ storageKey?: string; title?: string; defaultRows?: Row[] }} Props
 * @param {Props} props
 */
export default function DecisionMatrixTool({
  storageKey = STORAGE_KEY,
  title = "Career Decision Matrix",
  defaultRows = /** @type {Row[]} */ ([]),
}) {
  const [rows, setRows] = useState(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          return parsed.map((r) => ({ ...r, total: computeTotal(r) }));
        }
      }
    } catch {
      // ignore
    }
    if (Array.isArray(defaultRows) && defaultRows.length) {
      return defaultRows.map((r, idx) => {
        const id = r.id || `seed-${idx}`;
        const base = {
          id,
          name: r.name || "Your Option",
          interest: Number.isFinite(r.interest) ? r.interest : 3,
          skills: Number.isFinite(r.skills) ? r.skills : 3,
          demand: Number.isFinite(r.demand) ? r.demand : 3,
          qualification: r.qualification ?? "",
          funding: r.funding ?? "",
        };
        return { ...base, total: computeTotal(base) };
      });
    }
    return exampleRows();
  });

  const [sortKey, setSortKey] = useState("total"); // total | name
  const [sortDir, setSortDir] = useState("desc"); // desc | asc
  const [filter, setFilter] = useState("all"); // all | top
  const [importText, setImportText] = useState("");
  const fileRef = useRef(null);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(rows));
    } catch {
      // ignore
    }
  }, [rows, storageKey]);

  const view = useMemo(() => {
    let v = [...rows];
    v.sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;
      if (sortKey === "name") {
        return a.name.localeCompare(b.name) * dir;
      }
      // default total
      return (a.total - b.total) * dir;
    });
    if (filter === "top") {
      const max = v.length ? Math.max(...v.map((r) => r.total)) : 0;
      v = v.filter((r) => r.total === max);
    }
    return v;
  }, [rows, sortKey, sortDir, filter]);

  function updateRow(id, patch) {
    setRows((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        const next = { ...r, ...patch };
        next.total = computeTotal(next);
        return next;
      })
    );
  }

  function removeRow(id) {
    setRows((prev) => prev.filter((r) => r.id !== id));
  }

  function addRow() {
    const id =
      (globalThis.crypto && crypto.randomUUID && crypto.randomUUID()) ||
      `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setRows((prev) => [
      ...prev,
      {
        id,
        name: "Your Option",
        interest: 3,
        skills: 3,
        demand: 3,
        qualification: "",
        funding: "",
        total: 9,
      },
    ]);
  }

  async function copyJSON() {
    try {
      const data = JSON.stringify(rows, null, 2);
      await navigator.clipboard.writeText(data);
      alert("Decision Matrix copied to clipboard.");
    } catch {
      alert("Copy failed. Use Export Download instead.");
    }
  }

  function downloadJSON() {
    const data = JSON.stringify(rows, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "decision-matrix.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  function importFromText() {
    try {
      const parsed = JSON.parse(importText);
      if (!Array.isArray(parsed)) throw new Error("Invalid format");
      setRows(parsed.map((r) => ({ ...r, total: computeTotal(r) })));
      setImportText("");
      alert("Imported successfully.");
    } catch (e) {
      alert("Import failed: " + (e?.message || "Invalid JSON"));
    }
  }

  function onFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        if (!Array.isArray(parsed)) throw new Error("Invalid format");
        setRows(parsed.map((r) => ({ ...r, total: computeTotal(r) })));
        fileRef.current.value = "";
      } catch (err) {
        alert("Import failed: " + (err?.message || "Invalid JSON"));
      }
    };
    reader.readAsText(file);
  }

  function resetExamples() {
    if (Array.isArray(defaultRows) && defaultRows.length) {
      setRows(defaultRows.map((r, idx) => {
        const id = r.id || `seed-${idx}`;
        const base = {
          id,
          name: r.name || "Your Option",
          interest: Number.isFinite(r.interest) ? r.interest : 3,
          skills: Number.isFinite(r.skills) ? r.skills : 3,
          demand: Number.isFinite(r.demand) ? r.demand : 3,
          qualification: r.qualification ?? "",
          funding: r.funding ?? "",
        };
        return { ...base, total: computeTotal(base) };
      }));
    } else {
      setRows(exampleRows());
    }
  }

  return (
    <section className="rounded-xl border border-border-light bg-bg-light-primary dark:border-border-dark dark:bg-bg-dark-surface p-5 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <h2 className="font-display text-lg sm:text-xl font-semibold text-text-light-primary dark:text-text-dark-primary">{title}</h2>
        <div className="flex flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-1 border border-border-light dark:border-border-dark rounded px-2 py-1">
            <label className="text-text-light-secondary dark:text-text-dark-secondary">Sort</label>
            <select
              className="bg-bg-light-primary dark:bg-bg-dark-surface outline-none"
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value)}
              aria-label="Sort column"
            >
              <option value="total">Total</option>
              <option value="name">Name</option>
            </select>
            <button
              type="button"
              className="px-2 py-0.5 rounded border border-border-light hover:bg-bg-light-secondary dark:border-border-dark dark:hover:bg-bg-dark-primary"
              onClick={() => setSortDir((d) => (d === "asc" ? "desc" : "asc"))}
              aria-label="Toggle sort direction"
              title="Toggle sort direction"
            >
              {sortDir === "asc" ? "↑" : "↓"}
            </button>
          </div>

          <div className="flex items-center gap-1 border border-border-light dark:border-border-dark rounded px-2 py-1">
            <label className="text-text-light-secondary dark:text-text-dark-secondary">Filter</label>
            <select
              className="bg-bg-light-primary dark:bg-bg-dark-surface outline-none"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              aria-label="Filter rows"
            >
              <option value="all">All</option>
              <option value="top">Top score</option>
            </select>
          </div>

          <button
            type="button"
            className="px-3 py-1.5 rounded border border-border-light hover:bg-bg-light-secondary dark:border-border-dark dark:hover:bg-bg-dark-primary"
            onClick={addRow}
          >
            Add row
          </button>
          <button
            type="button"
            className="px-3 py-1.5 rounded border border-border-light hover:bg-bg-light-secondary dark:border-border-dark dark:hover:bg-bg-dark-primary"
            onClick={copyJSON}
          >
            Copy JSON
          </button>
          <button
            type="button"
            className="px-3 py-1.5 rounded border border-border-light hover:bg-bg-light-secondary dark:border-border-dark dark:hover:bg-bg-dark-primary"
            onClick={downloadJSON}
          >
            Export
          </button>
          <label className="px-3 py-1.5 rounded border border-border-light hover:bg-bg-light-secondary dark:border-border-dark dark:hover:bg-bg-dark-primary cursor-pointer">
            Import
            <input
              ref={fileRef}
              onChange={onFileChange}
              type="file"
              accept="application/json"
              className="hidden"
              aria-label="Import Decision Matrix JSON"
            />
          </label>
          <button
            type="button"
            className="px-3 py-1.5 rounded border border-border-light hover:bg-bg-light-secondary dark:border-border-dark dark:hover:bg-bg-dark-primary"
            onClick={resetExamples}
          >
            Reset examples
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-border-light dark:border-border-dark text-sm">
          <thead>
            <tr className="bg-bg-light-secondary dark:bg-bg-dark-primary">
              <th scope="col" className="border border-border-light dark:border-border-dark p-2 text-left font-semibold">
                Career Option
              </th>
              <th scope="col" className="border border-border-light dark:border-border-dark p-2 text-center font-semibold">
                Interest (1-5)
              </th>
              <th scope="col" className="border border-border-light dark:border-border-dark p-2 text-center font-semibold">
                Skills Match (1-5)
              </th>
              <th scope="col" className="border border-border-light dark:border-border-dark p-2 text-center font-semibold">
                Job Demand (1-5)
              </th>
              <th scope="col" className="border border-border-light dark:border-border-dark p-2 text-left font-semibold">
                Qualification
              </th>
              <th scope="col" className="border border-border-light dark:border-border-dark p-2 text-center font-semibold">
                Funding
              </th>
              <th scope="col" className="border border-border-light dark:border-border-dark p-2 text-center font-semibold">
                Total
              </th>
              <th scope="col" className="border border-border-light dark:border-border-dark p-2 text-center font-semibold">
                Remove
              </th>
            </tr>
          </thead>
          <tbody>
            {view.map((r) => (
              <tr key={r.id} className="odd:bg-bg-light-primary even:bg-bg-light-secondary dark:odd:bg-bg-dark-surface dark:even:bg-bg-dark-primary">
                <td className="border border-border-light dark:border-border-dark p-2">
                  <input
                    type="text"
                    value={r.name}
                    onChange={(e) => updateRow(r.id, { name: e.target.value })}
                    className="w-full bg-transparent outline-none"
                    aria-label="Career Option"
                  />
                </td>
                <td className="border border-border-light dark:border-border-dark p-2 text-center">
                  <input
                    type="number"
                    min={1}
                    max={5}
                    value={r.interest}
                    onChange={(e) => updateRow(r.id, { interest: clampScore(e.target.value) })}
                    className="w-16 text-center bg-bg-light-primary dark:bg-bg-dark-surface border border-border-light dark:border-border-dark rounded"
                    aria-label="Interest score"
                  />
                </td>
                <td className="border border-border-light dark:border-border-dark p-2 text-center">
                  <input
                    type="number"
                    min={1}
                    max={5}
                    value={r.skills}
                    onChange={(e) => updateRow(r.id, { skills: clampScore(e.target.value) })}
                    className="w-16 text-center bg-bg-light-primary dark:bg-bg-dark-surface border border-border-light dark:border-border-dark rounded"
                    aria-label="Skills Match score"
                  />
                </td>
                <td className="border border-border-light dark:border-border-dark p-2 text-center">
                  <input
                    type="number"
                    min={1}
                    max={5}
                    value={r.demand}
                    onChange={(e) => updateRow(r.id, { demand: clampScore(e.target.value) })}
                    className="w-16 text-center bg-bg-light-primary dark:bg-bg-dark-surface border border-border-light dark:border-border-dark rounded"
                    aria-label="Job Demand score"
                  />
                </td>
                <td className="border border-border-light dark:border-border-dark p-2">
                  <input
                    type="text"
                    value={r.qualification ?? ""}
                    onChange={(e) => updateRow(r.id, { qualification: e.target.value })}
                    className="w-full bg-transparent outline-none"
                    aria-label="Qualification"
                    placeholder="e.g., Diploma, B.Ed"
                  />
                </td>
                <td className="border border-border-light dark:border-border-dark p-2 text-center">
                  <input
                    type="text"
                    value={r.funding ?? ""}
                    onChange={(e) => updateRow(r.id, { funding: e.target.value })}
                    className="w-full bg-transparent outline-none text-center"
                    aria-label="Funding"
                    placeholder="NSFAS / Funza"
                  />
                </td>
                <td className="border border-border-light dark:border-border-dark p-2 text-center font-semibold text-primary">
                  {r.total}
                </td>
                <td className="border border-border-light dark:border-border-dark p-2 text-center">
                  <button
                    type="button"
                    onClick={() => removeRow(r.id)}
                    aria-label={`Remove ${r.name}`}
                    className="text-xs px-2 py-1 rounded border border-border-light hover:bg-bg-light-secondary dark:border-border-dark dark:hover:bg-bg-dark-primary"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
            {view.length === 0 && (
              <tr>
                <td className="border border-border-light dark:border-border-dark p-3 text-center text-text-light-secondary dark:text-text-dark-secondary" colSpan={8}>
                  No rows. Click “Add row” to begin.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <details className="mt-4">
        <summary className="text-sm cursor-pointer select-none">Paste JSON to import</summary>
        <div className="mt-2">
          <textarea
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            className="w-full h-28 text-xs border border-border-light dark:border-border-dark rounded p-2 bg-bg-light-secondary dark:bg-bg-dark-primary"
            placeholder='[{"id":"1","name":"Example","interest":4,"skills":4,"demand":5,"qualification":"","funding":""}]'
          />
          <div className="mt-2 flex gap-2">
            <button
              type="button"
              onClick={importFromText}
              className="px-3 py-1.5 rounded border border-border-light hover:bg-bg-light-secondary dark:border-border-dark dark:hover:bg-bg-dark-primary text-xs"
            >
              Import from text
            </button>
            <button
              type="button"
              onClick={() => setImportText("")}
              className="px-3 py-1.5 rounded border border-border-light hover:bg-bg-light-secondary dark:border-border-dark dark:hover:bg-bg-dark-primary text-xs"
            >
              Clear
            </button>
          </div>
        </div>
      </details>
    </section>
  );
}
