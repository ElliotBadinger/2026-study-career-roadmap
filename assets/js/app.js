/**
 * App bootstrap for the Roadmap site.
 * - Binds UI controls
 * - Lazy-loads feature modules
 * - Manages the Action Checklist
 * - Renders Resource Library (if data present)
 */

import { store, toCSV, download, copyToClipboard, debounce } from './storage.js';

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

function on(el, evt, handler, opts) {
  if (!el) return;
  el.addEventListener(evt, handler, opts);
}

/* ---------------------------
   Decision Matrix
---------------------------- */
function initDecisionMatrix() {
  const addBtn = $('#matrix-add-row');
  const clearBtn = $('#matrix-clear');
  const exportBtn = $('#matrix-export');
  const table = $('#decision-matrix table');
  if (!table) return;

  import('./matrix.js').then((mod) => {
    const api = mod.attachDecisionMatrix(table, {
      addBtn,
      clearBtn,
      exportBtn,
      store,
      toCSV,
      download
    });
    // Auto-calc when user updates numbers
    table.addEventListener('input', debounce(() => api.recalculate(), 150));
  }).catch((e) => {
    console.warn('Matrix module unavailable:', e);
  });
}

/* ---------------------------
   APS Calculator & Pass Advisor
---------------------------- */
function initAPS() {
  const form = $('#aps-form');
  const calc = $('#aps-calc');
  const copy = $('#aps-copy');
  const clear = $('#aps-clear');
  const result = $('#aps-result');
  if (!form || !calc || !result) return;

  import('./passcalc.js').then((mod) => {
    const api = mod.createAPSCalculator({ form, result, store, copyToClipboard });

    on(calc, 'click', (e) => {
      e.preventDefault();
      api.calculate();
    });

    on(copy, 'click', async (e) => {
      e.preventDefault();
      await api.copySummary();
    });

    on(clear, 'click', (e) => {
      e.preventDefault();
      api.clear();
    });
  }).catch((e) => console.warn('APS module unavailable:', e));
}

/* ---------------------------
   Weekly Study Planner
---------------------------- */
function initPlanner() {
  const grid = $('#planner-grid');
  const applyBtn = $('#planner-apply-template');
  const clearBtn = $('#planner-clear');
  const printBtn = $('#planner-print');
  const templateSel = $('#planner-template');
  if (!grid || !applyBtn) return;

  import('./planner.js').then((mod) => {
    const api = mod.createPlanner({
      grid,
      templateSel,
      store
    });

    on(applyBtn, 'click', (e) => {
      e.preventDefault();
      api.applyTemplate(templateSel.value);
    });

    on(clearBtn, 'click', (e) => {
      e.preventDefault();
      api.clearWeek();
    });

    on(printBtn, 'click', (e) => {
      e.preventDefault();
      window.print();
    });
  }).catch((e) => console.warn('Planner module unavailable:', e));
}

/* ---------------------------
   Funding Wizard
---------------------------- */
function initWizard() {
  const startBtn = $('#wizard-start');
  const resetBtn = $('#wizard-reset');
  const qRoot = $('#wizard-questions');
  const out = $('#wizard-result');
  if (!startBtn || !qRoot || !out) return;

  import('./wizard.js').then((mod) => {
    const api = mod.createFundingWizard({ root: qRoot, output: out, store });

    on(startBtn, 'click', (e) => {
      e.preventDefault();
      api.start();
    });

    on(resetBtn, 'click', (e) => {
      e.preventDefault();
      api.reset();
    });
  }).catch((e) => console.warn('Wizard module unavailable:', e));
}

/* ---------------------------
   Action Checklist
---------------------------- */
function initChecklist() {
  const input = $('#checklist-input');
  const addBtn = $('#checklist-add');
  const clearBtn = $('#checklist-clear');
  const list = $('#checklist-list');

  if (!input || !addBtn || !list) return;

  const NS = 'checklist';
  let items = store.get(NS, 'items', []);

  function render() {
    list.innerHTML = '';
    items.forEach((it, idx) => {
      const li = document.createElement('li');
      li.className = 'flex items-center gap-3 p-2 border rounded';
      li.innerHTML = `
        <input type="checkbox" class="h-4 w-4" ${it.done ? 'checked' : ''} data-idx="${idx}" />
        <span class="flex-1 ${it.done ? 'line-through text-gray-400' : ''}">${escapeHTML(it.text)}</span>
        <button class="text-red-600 text-sm hover:underline" data-del="${idx}">Remove</button>
      `;
      list.appendChild(li);
    });
    store.set(NS, 'items', items);
  }

  function escapeHTML(s) {
    return String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  }

  on(addBtn, 'click', (e) => {
    e.preventDefault();
    const val = (input.value || '').trim();
    if (!val) return;
    items.push({ text: val, done: false });
    input.value = '';
    render();
  });

  on(list, 'click', (e) => {
    const tgt = e.target;
    if (tgt.matches('[data-del]')) {
      const idx = Number(tgt.getAttribute('data-del'));
      items.splice(idx, 1);
      render();
    }
  });

  on(list, 'change', (e) => {
    const tgt = e.target;
    if (tgt.matches('input[type="checkbox"][data-idx]')) {
      const idx = Number(tgt.getAttribute('data-idx'));
      items[idx].done = tgt.checked;
      render();
    }
  });

  on(clearBtn, 'click', (e) => {
    e.preventDefault();
    items = items.filter((x) => !x.done);
    render();
  });

  render();
}

/* ---------------------------
   Resources
---------------------------- */
async function initResources() {
  const root = $('#resource-list');
  if (!root) return;
  try {
    const res = await fetch('assets/data/resources.json', { cache: 'no-store' });
    if (!res.ok) throw new Error('resources.json not found');
    const data = await res.json();
    root.innerHTML = '';
    data.forEach((r) => {
      const card = document.createElement('div');
      card.className = 'bg-white border rounded-xl p-4';
      card.innerHTML = `
        <h4 class="font-semibold text-gray-800 mb-1">${escapeHTML(r.name)}</h4>
        <p class="text-sm text-gray-600 mb-2">${escapeHTML(r.description)}</p>
        <a class="citation-link break-all" href="${r.url}" target="_blank" rel="noopener">${r.url}</a>
        <p class="mt-2 text-xs text-gray-500">Category: ${escapeHTML(r.category)} | Region: ${escapeHTML(r.region || 'ZA')}</p>
      `;
      root.appendChild(card);
    });
  } catch (e) {
    // Graceful fallback
    root.innerHTML = '<p class="text-sm text-gray-600">Resources will appear here once data is available.</p>';
  }

  function escapeHTML(s) {
    return String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  }
}

/* ---------------------------
   Lazy-init on visibility
---------------------------- */
function initLazySections() {
  const map = new Map([
    ['#decision-matrix', initDecisionMatrix],
    ['#aps-calculator', initAPS],
    ['#study-planner', initPlanner],
    ['#funding-wizard', initWizard],
    ['#action-checklist', initChecklist],
    ['#resources', initResources],
  ]);

  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        const sel = '#' + entry.target.id;
        const fn = map.get(sel);
        if (fn) {
          fn();
          observer.unobserve(entry.target);
          map.delete(sel);
        }
      }
    }
  }, { rootMargin: '0px 0px 200px 0px' });

  for (const sel of map.keys()) {
    const el = document.querySelector(sel);
    if (el) observer.observe(el);
  }
}

/* ---------------------------
   Boot
---------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  // Init tools lazily
  initLazySections();

  // If user jumps directly to anchors via URL hash, try initialize immediately
  if (location.hash) {
    const immediate = document.querySelector(location.hash);
    if (immediate) {
      switch (location.hash) {
        case '#decision-matrix': initDecisionMatrix(); break;
        case '#aps-calculator': initAPS(); break;
        case '#study-planner': initPlanner(); break;
        case '#funding-wizard': initWizard(); break;
        case '#action-checklist': initChecklist(); break;
        case '#resources': initResources(); break;
      }
    }
  }
});