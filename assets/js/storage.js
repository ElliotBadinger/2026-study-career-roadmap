/**
 * Minimal client-side storage and export utilities for the Roadmap site.
 * Namespaced localStorage with helpers for CSV/JSON export and clipboard.
 * 
 * Modules use logical namespaces:
 * - "matrix", "planner", "aps", "wizard", "checklist", "ui"
 */

const ROOT_NS = 'roadmap';

/* Internal helpers */
function nsKey(ns, key) {
  return `${ROOT_NS}:${ns}:${key}`;
}

function stringify(value) {
  try {
    return JSON.stringify(value);
  } catch {
    return JSON.stringify({ error: 'stringify_failed' });
  }
}

function parse(value, fallback = null) {
  try {
    return value == null ? fallback : JSON.parse(value);
  } catch {
    return fallback;
  }
}

/* Storage facade */
export const store = {
  /**
   * Read a value by namespace and key
   * @param {string} ns 
   * @param {string} key 
   * @param {*} fallback 
   * @returns {*}
   */
  get(ns, key, fallback = null) {
    const raw = localStorage.getItem(nsKey(ns, key));
    return parse(raw, fallback);
  },

  /**
   * Write a value by namespace and key
   * @param {string} ns 
   * @param {string} key 
   * @param {*} value 
   */
  set(ns, key, value) {
    localStorage.setItem(nsKey(ns, key), stringify(value));
  },

  /**
   * Remove a value by namespace and key
   * @param {string} ns 
   * @param {string} key 
   */
  remove(ns, key) {
    localStorage.removeItem(nsKey(ns, key));
  },

  /**
   * Clear an entire namespace
   * @param {string} ns 
   */
  clearNamespace(ns) {
    const prefix = `${ROOT_NS}:${ns}:`;
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(prefix)) keys.push(k);
    }
    keys.forEach((k) => localStorage.removeItem(k));
  },

  /**
   * Export all keys within a namespace as a JSON object
   * @param {string} ns 
   * @returns {Record<string, any>}
   */
  exportNamespace(ns) {
    const prefix = `${ROOT_NS}:${ns}:`;
    const out = {};
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(prefix)) {
        const shortKey = k.slice(prefix.length);
        out[shortKey] = parse(localStorage.getItem(k));
      }
    }
    return out;
  },

  /**
   * Export all Roadmap data across namespaces
   * @returns {Record<string, Record<string, any>>}
   */
  exportAll() {
    const out = {};
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (!k || !k.startsWith(`${ROOT_NS}:`)) continue;
      const rest = k.slice(`${ROOT_NS}:`.length);
      const ns = rest.split(':')[0];
      if (!out[ns]) out[ns] = {};
      const shortKey = rest.slice(ns.length + 1);
      out[ns][shortKey] = parse(localStorage.getItem(k));
    }
    return out;
  }
};

/* CSV Utilities */

/**
 * Convert an array of objects or arrays into CSV.
 * @param {string[]} headers - Column headers
 * @param {Array<Record<string, any>|any[]>} rows - Data rows
 * @returns {string} CSV string
 */
export function toCSV(headers, rows) {
  const escape = (val) => {
    if (val == null) return '';
    const s = String(val);
    if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
    return s;
  };

  const headerLine = headers.map(escape).join(',');
  const bodyLines = rows.map((row) => {
    if (Array.isArray(row)) {
      return row.map(escape).join(',');
    }
    // object
    return headers.map((h) => escape(row[h])).join(',');
  });

  return [headerLine, ...bodyLines].join('\n');
}

/* Download / Clipboard */

/**
 * Trigger a file download for the given content
 * @param {string} filename 
 * @param {string|Blob} content 
 * @param {string} mime 
 */
export function download(filename, content, mime = 'text/plain;charset=utf-8') {
  const blob = content instanceof Blob ? content : new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/**
 * Copy text to clipboard (best-effort)
 * @param {string} text 
 */
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      return true;
    } catch {
      return false;
    } finally {
      ta.remove();
    }
  }
}

/* Small utilities */

/**
 * Simple debounce
 * @param {(…args:any[]) => void} fn 
 * @param {number} wait 
 */
export function debounce(fn, wait = 250) {
  let t = null;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
}