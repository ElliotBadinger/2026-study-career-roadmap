/**
 * Decision Matrix module
 * Enhances the static table into an editable, persistent matrix with totals and CSV export.
 *
 * Public API:
 * - attachDecisionMatrix(tableElement, { addBtn, clearBtn, exportBtn, store, toCSV, download })
 *   returns: { recalculate() }
 */

const NS = 'matrix';

function getHeaders(table) {
  const ths = Array.from(table.querySelectorAll('thead th'));
  return ths.map((th) => th.textContent.trim());
}

function firstNumber(s) {
  const m = String(s).match(/-?\d+(\.\d+)?/);
  return m ? Number(m[0]) : 0;
}

function createInput(value = '', type = 'text', classes = 'w-full border rounded px-2 py-1 text-sm') {
  const input = document.createElement('input');
  input.type = type;
  input.value = value;
  input.className = classes;
  if (type === 'number') {
    input.min = '0';
    input.max = '5';
    input.step = '1';
    input.inputMode = 'numeric';
  }
  return input;
}

function cellToInteractive(td, type, placeholder = '') {
  const current = td.textContent.trim();
  td.textContent = '';
  const input = createInput(current === '?' ? '' : current, type);
  if (placeholder) input.placeholder = placeholder;
  td.appendChild(input);
  return input;
}

function makeRowInteractive(tr) {
  const tds = Array.from(tr.querySelectorAll('td'));
  if (tds.length < 7) return null;

  const obj = {};

  // Career Option (text)
  obj.career = cellToInteractive(tds[0], 'text', 'e.g., Foundation Phase Teacher');

  // Interest (1-5)
  obj.interest = cellToInteractive(tds[1], 'number', '1-5');

  // Skills Match (1-5) - accept text but prefer number
  obj.skills = cellToInteractive(tds[2], 'text', 'e.g., 4 (Languages)');

  // Job Demand (1-5)
  obj.demand = cellToInteractive(tds[3], 'number', '1-5');

  // Qualification (text)
  obj.qualification = cellToInteractive(tds[4], 'text', 'e.g., B.Ed.');

  // Funding (text)
  obj.funding = cellToInteractive(tds[5], 'text', 'e.g., NSFAS/Funza');

  // Total (computed, read-only)
  const totalCell = tds[6];
  totalCell.innerHTML = '<span class="font-bold">0</span>';
  obj.total = totalCell.querySelector('span');

  return obj;
}

function serializeRow(row) {
  return {
    career: row.career.value.trim(),
    interest: Number(row.interest.value || 0),
    skills: row.skills.value.trim(),
    demand: Number(row.demand.value || 0),
    qualification: row.qualification.value.trim(),
    funding: row.funding.value.trim(),
    total: Number(row.total.textContent || 0),
  };
}

function deserializeRow(tbody, data) {
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td class="border border-gray-300 p-3 font-medium">${escapeHTML(data.career || '')}</td>
    <td class="border border-gray-300 p-3 text-center">${escapeHTML(String(data.interest ?? ''))}</td>
    <td class="border border-gray-300 p-3 text-center">${escapeHTML(data.skills || '')}</td>
    <td class="border border-gray-300 p-3 text-center">${escapeHTML(String(data.demand ?? ''))}</td>
    <td class="border border-gray-300 p-3">${escapeHTML(data.qualification || '')}</td>
    <td class="border border-gray-300 p-3 text-center">${escapeHTML(data.funding || '')}</td>
    <td class="border border-gray-300 p-3 text-center font-bold">${escapeHTML(String(data.total ?? ''))}</td>
  `;
  tbody.appendChild(tr);
  return tr;
}

function escapeHTML(s) {
  return String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}

export function attachDecisionMatrix(table, { addBtn, clearBtn, exportBtn, store, toCSV, download }) {
  const headers = getHeaders(table);
  const tbody = table.querySelector('tbody');
  let rows = [];

  function recalculate() {
    rows.forEach((row) => {
      const interest = Number(row.interest.value || 0);
      const skills = firstNumber(row.skills.value);
      const demand = Number(row.demand.value || 0);
      const total = interest + skills + demand;
      row.total.textContent = String(total);
    });
    persist();
  }

  function persist() {
    const data = rows.map(serializeRow);
    store.set(NS, 'rows', data);
  }

  function restore() {
    const saved = store.get(NS, 'rows', null);
    if (!saved || !Array.isArray(saved) || !saved.length) return false;

    // Clear tbody and recreate from saved
    tbody.innerHTML = '';
    saved.forEach((r) => deserializeRow(tbody, r));
    // Make interactive
    rows = Array.from(tbody.querySelectorAll('tr')).map(makeRowInteractive);
    recalculate();
    return true;
  }

  function makeAllInteractive() {
    rows = Array.from(tbody.querySelectorAll('tr')).map(makeRowInteractive).filter(Boolean);
    recalculate();
  }

  function addRow() {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="border border-gray-300 p-3 font-medium"></td>
      <td class="border border-gray-300 p-3 text-center"></td>
      <td class="border border-gray-300 p-3 text-center"></td>
      <td class="border border-gray-300 p-3 text-center"></td>
      <td class="border border-gray-300 p-3"></td>
      <td class="border border-gray-300 p-3 text-center"></td>
      <td class="border border-gray-300 p-3 text-center font-bold">0</td>
    `;
    tbody.appendChild(tr);
    const interactive = makeRowInteractive(tr);
    rows.push(interactive);
    persist();
  }

  function clearAll() {
    // Keep header, wipe body
    tbody.innerHTML = '';
    rows = [];
    persist();
  }

  function exportCSV() {
    const data = rows.map(serializeRow);
    const csvHeaders = ['Career Option', 'Interest (1-5)', 'Skills Match (1-5)', 'Job Demand (1-5)', 'Qualification', 'Funding', 'Total'];
    const csvRows = data.map((r) => ({
      [csvHeaders[0]]: r.career,
      [csvHeaders[1]]: r.interest,
      [csvHeaders[2]]: firstNumber(r.skills),
      [csvHeaders[3]]: r.demand,
      [csvHeaders[4]]: r.qualification,
      [csvHeaders[5]]: r.funding,
      [csvHeaders[6]]: r.total,
    }));
    const csv = toCSV(csvHeaders, csvRows);
    download('decision-matrix.csv', csv, 'text/csv;charset=utf-8');
  }

  // Initialize
  if (!restore()) {
    makeAllInteractive();
  }

  if (addBtn) addBtn.addEventListener('click', (e) => { e.preventDefault(); addRow(); });
  if (clearBtn) clearBtn.addEventListener('click', (e) => { e.preventDefault(); clearAll(); });
  if (exportBtn) exportBtn.addEventListener('click', (e) => { e.preventDefault(); exportCSV(); });

  // Delegate input changes to recalc
  table.addEventListener('input', (e) => {
    const target = e.target;
    if (target.tagName === 'INPUT') {
      recalculate();
    }
  });

  return { recalculate };
}