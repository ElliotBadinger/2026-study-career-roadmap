/**
 * Weekly Study Planner
 * - 7 columns (Mon-Sun), 6 slots per day
 * - Templates: balanced, exam, light
 * - Persists to localStorage
 */

import { store } from './storage.js';

const NS = 'planner';
const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
const SLOTS = 6;

function gridKey(dayIdx, slotIdx) {
  return `${dayIdx}:${slotIdx}`;
}

function defaultState() {
  const data = {};
  for (let d = 0; d < 7; d++) {
    for (let s = 0; s < SLOTS; s++) data[gridKey(d, s)] = '';
  }
  return data;
}

function stateToMatrix(state) {
  const m = Array.from({ length: 7 }, () => Array.from({ length: SLOTS }, () => ''));
  for (let d = 0; d < 7; d++) {
    for (let s = 0; s < SLOTS; s++) {
      m[d][s] = state[gridKey(d, s)] || '';
    }
  }
  return m;
}

function matrixToState(matrix) {
  const state = {};
  for (let d = 0; d < 7; d++) {
    for (let s = 0; s < SLOTS; s++) {
      state[gridKey(d, s)] = matrix[d][s] || '';
    }
  }
  return state;
}

function load() {
  return store.get(NS, 'grid', defaultState());
}

function save(state) {
  store.set(NS, 'grid', state);
}

function cellInput(value = '') {
  const ta = document.createElement('textarea');
  ta.className = 'w-full min-h-[3.25rem] border rounded px-2 py-1 text-sm resize-y';
  ta.placeholder = 'Subject / Topic';
  ta.value = value || '';
  return ta;
}

function dayHeader(day) {
  const h = document.createElement('div');
  h.className = 'px-2 py-2 font-medium text-gray-700 border-b';
  h.textContent = day;
  return h;
}

function column() {
  const col = document.createElement('div');
  col.className = 'border rounded-xl overflow-hidden bg-white';
  return col;
}

function gridContainer() {
  const wrap = document.createElement('div');
  wrap.className = 'grid grid-cols-1 md:grid-cols-7 gap-3';
  return wrap;
}

function suggestionsBadge(text) {
  const span = document.createElement('span');
  span.className = 'inline-block text-xs px-2 py-1 rounded bg-blue-50 text-blue-700 border border-blue-200';
  span.textContent = text;
  return span;
}

export function createPlanner({ grid, templateSel, store: storage = store }) {
  // Render grid
  const state = load();
  const matrix = stateToMatrix(state);

  const wrap = gridContainer();
  grid.innerHTML = '';
  grid.appendChild(wrap);

  const inputs = []; // parallel structure [day][slot] => textarea

  for (let d = 0; d < 7; d++) {
    const col = column();
    col.appendChild(dayHeader(DAYS[d]));

    // quick note
    const tip = document.createElement('div');
    tip.className = 'px-2 py-1 text-[11px] text-gray-500 border-b bg-gray-50';
    tip.appendChild(suggestionsBadge('Tip: Use one cell = one 45–60 min block'));
    col.appendChild(tip);

    for (let s = 0; s < SLOTS; s++) {
      const holder = document.createElement('div');
      holder.className = 'p-2';
      const ta = cellInput(matrix[d][s]);
      holder.appendChild(ta);
      col.appendChild(holder);

      if (!inputs[d]) inputs[d] = [];
      inputs[d][s] = ta;

      // Persist on change
      ta.addEventListener('input', () => {
        const curr = load();
        curr[gridKey(d, s)] = ta.value;
        save(curr);
      });
    }

    wrap.appendChild(col);
  }

  function applyTemplate(name) {
    const curr = defaultState();

    const fill = (pairs) => {
      for (const p of pairs) {
        const [d, s, text] = p;
        curr[gridKey(d, s)] = text;
      }
    };

    if (name === 'exam') {
      // Heavy on past papers, daily revision, accountability meets
      fill([
        [0,0,'Accounting: Past Paper 1 (Timed)'],
        [0,1,'English HL: Essay planning'],
        [1,0,'Math Lit: Functions practice (Siyavula)'],
        [1,1,'Accounting: Corrections'],
        [2,0,'Business Studies: Definitions + Mindmaps'],
        [2,1,'Zulu FAL: Comprehension'],
        [3,0,'Accounting: Past Paper 2 (Timed)'],
        [3,1,'English HL: Literature revision'],
        [4,0,'Math Lit: Data handling (Siyavula)'],
        [4,1,'Business Studies: Case study'],
        [5,0,'Study group: Teach-back session'],
        [6,0,'Accountability check + plan adjustments']
      ]);
    } else if (name === 'light') {
      // Gentle ramp
      fill([
        [0,0,'English HL: Summary practice'],
        [1,0,'Zulu FAL: Language exercises'],
        [2,0,'Math Lit: Basic revision'],
        [3,0,'Business: Reading + notes'],
        [4,0,'Accounting: Concepts recap'],
        [6,0,'Plan next week']
      ]);
    } else {
      // balanced
      fill([
        [0,0,'Math Lit: Worksheets (Siyavula)'],
        [0,1,'English HL: Past paper Qs'],
        [1,0,'Accounting: Ledger basics'],
        [1,1,'Business: Essay plan'],
        [2,0,'Zulu FAL: Grammar drills'],
        [2,1,'LO: Portfolio tasks'],
        [3,0,'Accounting: Past Paper (untimed)'],
        [4,0,'Business: Key terms revision'],
        [4,1,'English HL: Literature'],
        [5,0,'Group call: peer marking'],
        [6,0,'Weekly review + prep']
      ]);
    }

    // Write to storage and update UI
    save(curr);
    for (let d = 0; d < 7; d++) {
      for (let s = 0; s < SLOTS; s++) {
        inputs[d][s].value = curr[gridKey(d, s)] || '';
      }
    }
  }

  function clearWeek() {
    const blank = defaultState();
    save(blank);
    for (let d = 0; d < 7; d++) for (let s = 0; s < SLOTS; s++) inputs[d][s].value = '';
  }

  return { applyTemplate, clearWeek };
}