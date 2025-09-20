import React, { useEffect, useMemo, useState } from "react";

/**
 * FilterableCareerCards
 * Props:
 * - items?: Array<{
 *     id: string; title: string; cluster: "Education" | "Business & Logistics" | "HR & Public Admin";
 *     description: string; tags: string[]; link?: string
 *   }>
 * - storageKey?: string (persist last-selected tag and search)
 *
 * If no items are passed, sensible defaults are used (aligned to the three clusters on the site).
 */
export default function FilterableCareerCards({
  items = [],
  storageKey = "phoenix-career-cards",
}) {
  const defaults = useMemo(
    () => [
      {
        id: "edu-1",
        title: "Foundation Phase Teacher",
        cluster: "Education",
        description:
          "High demand for teachers proficient in indigenous African languages; strong language marks are an advantage.",
        tags: ["Teaching", "Languages", "Funza Lushaka", "Public Sector"],
        link:
          "https://www.uj.ac.za/university-courses/bed-in-foundation-phase-teaching-grade-r-3/",
      },
      {
        id: "biz-1",
        title: "Logistics & Supply Chain",
        cluster: "Business & Logistics",
        description:
          "Career-focused diploma routes; strong job market due to e-commerce and complex supply chains.",
        tags: ["Operations", "Diploma", "UoT", "Industry Links"],
        link:
          "https://mydigitalpublication.co.za/uj/undergraduate-prospectus-2026/62/",
      },
      {
        id: "hr-1",
        title: "Human Resources Officer",
        cluster: "HR & Public Admin",
        description:
          "People-centric roles across public and private sectors; diplomatic communication and organization are key.",
        tags: ["People", "Business", "Diploma", "NSFAS"],
      },
      {
        id: "hr-2",
        title: "Public Administration",
        cluster: "HR & Public Admin",
        description:
          "Broad scope in government and non-profit organizations; service impact; pathways via diplomas/degrees.",
        tags: ["Policy", "Government", "Service", "Diploma"],
      },
      {
        id: "biz-2",
        title: "Management Services",
        cluster: "Business & Logistics",
        description:
          "Applied business and operations focus; good entry via diplomas; progression to analyst/manager.",
        tags: ["Business", "Operations", "Applied", "UoT"],
      },
    ],
    []
  );

  const [search, setSearch] = useState(() => {
    try {
      const raw = localStorage.getItem(storageKey + ":search");
      return raw ?? "";
    } catch {
      return "";
    }
  });
  const [activeTag, setActiveTag] = useState(() => {
    try {
      const raw = localStorage.getItem(storageKey + ":tag");
      return raw ?? "All";
    } catch {
      return "All";
    }
  });
  const data = items && items.length ? items : defaults;

  useEffect(() => {
    try {
      localStorage.setItem(storageKey + ":search", search);
    } catch {
      // ignore
    }
  }, [search, storageKey]);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey + ":tag", activeTag);
    } catch {
      // ignore
    }
  }, [activeTag, storageKey]);

  const allTags = useMemo(() => {
    const set = new Set();
    data.forEach((d) => d.tags.forEach((t) => set.add(t)));
    return ["All", ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, [data]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return data.filter((d) => {
      const tagOk = activeTag === "All" || d.tags.includes(activeTag);
      const text =
        (d.title + " " + d.description + " " + d.cluster + " " + d.tags.join(" "))
          .toLowerCase();
      const qOk = q.length === 0 || text.includes(q);
      return tagOk && qOk;
    });
  }, [data, activeTag, search]);

  const countsByTag = useMemo(() => {
    const counts = {};
    for (const tag of allTags) counts[tag] = 0;
    for (const d of data) {
      counts["All"]++;
      for (const t of d.tags) counts[t] = (counts[t] ?? 0) + 1;
    }
    return counts;
  }, [allTags, data]);

  return (
    <section className="rounded-xl border border-base-300 bg-white p-5 sm:p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-4">
        <h2 className="font-display text-lg sm:text-xl font-semibold text-neutral">
          Explore Career Cards
        </h2>
        <div className="flex items-center gap-2">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search careers, skills, tags…"
            className="text-sm px-3 py-2 rounded border border-base-300 bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 w-64"
            aria-label="Search careers"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {allTags.map((t) => {
          const active = t === activeTag;
          return (
            <button
              key={t}
              type="button"
              onClick={() => setActiveTag(t)}
              className={`text-xs px-3 py-1.5 rounded border ${
                active
                  ? "border-primary text-primary bg-blue-50"
                  : "border-base-300 text-neutral/80 hover:bg-base-100"
              }`}
              aria-pressed={active}
            >
              {t} <span className="ml-1 text-neutral/50">{countsByTag[t] ?? 0}</span>
            </button>
          );
        })}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.length === 0 ? (
          <p className="text-sm text-neutral/60">No careers match your filters.</p>
        ) : (
          filtered.map((c) => (
            <article
              key={c.id}
              className="rounded-xl border border-base-300 bg-white p-5 card-hover"
            >
              <header className="mb-2 flex items-start justify-between gap-3">
                <h3 className="font-display text-neutral font-semibold">{c.title}</h3>
                <span className="text-xs rounded bg-base-200 border border-base-300 px-2 py-0.5 text-neutral/70">
                  {c.cluster}
                </span>
              </header>
              <p className="text-sm text-neutral/80">{c.description}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {c.tags.map((t) => (
                  <span
                    key={t}
                    className="text-[10px] uppercase tracking-wide px-2 py-0.5 rounded bg-base-200 border border-base-300 text-neutral/70"
                  >
                    {t}
                  </span>
                ))}
              </div>
              {c.link && (
                <div className="mt-4">
                  <a
                    href={c.link}
                    className="inline-flex text-sm text-primary hover:underline underline-offset-4"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Learn more →
                  </a>
                </div>
              )}
            </article>
          ))
        )}
      </div>
    </section>
  );
}