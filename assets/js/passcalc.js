/**
 * APS Calculator & Pass Advisor (South Africa)
 * - Computes APS using standard 7-point NSC scale across 7 subjects
 * - Evaluates pass bands: Bachelor's, Diploma, Higher Certificate based on criteria
 * - Persists last inputs and result summary
 */

import { store, copyToClipboard } from './storage.js';

const NS = 'aps';

// NSC rating scale to APS points (typical SA scale)
function markToAPS(mark) {
  const m = Number(mark || 0);
  if (m >= 80) return 7;
  if (m >= 70) return 6;
  if (m >= 60) return 5;
  if (m >= 50) return 4;
  if (m >= 40) return 3;
  if (m >= 30) return 2;
  return 1;
}

function percent(v) {
  const n = Number(v || 0);
  return isNaN(n) ? 0 : Math.max(0, Math.min(100, Math.round(n)));
}

function sum(arr) {
  return arr.reduce((a, b) => a + b, 0);
}

// Evaluate NSC pass-level criteria (approximation; institutions may differ)
function evaluatePassLevels(values) {
  const {
    homeLanguage, fal, s3, s4, s5, s6, s7
  } = values;
  const marks = [percent(homeLanguage), percent(fal), percent(s3), percent(s4), percent(s5), percent(s6), percent(s7)];

  // Count thresholds
  const countGE = (thr) => marks.filter((m) => m >= thr).length;

  const pass6of7 = marks.filter((m) => m >= 30).length >= 6;
  const hasHL40 = percent(homeLanguage) >= 40;

  const ge50 = countGE(50); // count of subjects ≥50%
  const ge40 = countGE(40); // count of subjects ≥40%
  const ge30 = countGE(30); // count of subjects ≥30%

  const bachelors = pass6of7 && hasHL40 && ge50 >= 4 && ge30 >= 6;
  const diploma = pass6of7 && hasHL40 && ge40 >= 4 && ge30 >= 6;
  const higherCert = pass6of7 && hasHL40 && ge40 >= 2 && ge30 >= 5;

  let best = 'None';
  if (higherCert) best = 'Higher Certificate';
  if (diploma) best = 'Diploma';
  if (bachelors) best = 'Bachelor\'s';

  // Advice deltas (how many to raise to reach next level)
  const advice = [];

  if (!higherCert) {
    if (!hasHL40) advice.push('Raise Home Language to at least 40%');
    if (ge40 < 2) advice.push(`Have at least 2 subjects at 40%+ (currently ${ge40})`);
    if (!pass6of7) advice.push('Ensure at least 6 of 7 subjects are 30%+');
  } else if (!diploma) {
    if (ge40 < 4) advice.push(`Increase subjects at 40%+ to at least 4 (currently ${ge40})`);
  } else if (!bachelors) {
    if (ge50 < 4) advice.push(`Increase subjects at 50%+ to at least 4 (currently ${ge50})`);
  }

  return { best, bachelors, diploma, higherCert, advice };
}

function valuesFromForm(form) {
  const data = new FormData(form);
  return {
    homeLanguage: data.get('homeLanguage') || '',
    fal: data.get('fal') || '',
    s3: data.get('s3') || '',
    s4: data.get('s4') || '',
    s5: data.get('s5') || '',
    s6: data.get('s6') || '',
    s7: data.get('s7') || ''
  };
}

function apsFromValues(vals) {
  const marks = [
    percent(vals.homeLanguage), percent(vals.fal), percent(vals.s3),
    percent(vals.s4), percent(vals.s5), percent(vals.s6), percent(vals.s7)
  ];
  const points = marks.map(markToAPS);
  return {
    marks,
    points,
    totalAPS: sum(points)
  };
}

export function createAPSCalculator({ form, result, store: storage = store, copyToClipboard: copyFn = copyToClipboard }) {
  // Restore
  const saved = storage.get(NS, 'last', null);
  if (saved) {
    for (const [k, v] of Object.entries(saved.values || {})) {
      const input = form.querySelector(`[name="${k}"]`);
      if (input) input.value = v;
    }
  }

  function renderOutcome(outcome) {
    const badge = (ok, label, cls) => `
      <span class="px-2 py-1 rounded text-xs ${ok ? cls : 'bg-gray-200 text-gray-700'}">${label}</span>`;

    return `
      <div class="mt-2">
        <p class="text-sm text-gray-700"><strong>APS:</strong> ${outcome.totalAPS} (target bands: 23 Bachelor’s, 19 Diploma, 15 Higher Certificate)</p>
        <div class="mt-2 flex gap-2 items-center">
          ${badge(outcome.pass.higherCert, 'Higher Cert', 'bg-purple-100 text-purple-800')}
          ${badge(outcome.pass.diploma, 'Diploma', 'bg-green-100 text-green-800')}
          ${badge(outcome.pass.bachelors, 'Bachelor’s', 'bg-blue-100 text-blue-800')}
        </div>
        <p class="mt-2 text-sm"><strong>Best eligible:</strong> ${outcome.pass.best}</p>
        ${outcome.pass.advice.length ? `
          <div class="mt-2 text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded p-3">
            <p class="font-medium">What to raise next:</p>
            <ul class="list-disc ml-5">
              ${outcome.pass.advice.map((a) => `<li>${a}</li>`).join('')}
            </ul>
          </div>
        ` : ''}
      </div>
    `;
  }

  function calculate() {
    const values = valuesFromForm(form);
    const { marks, points, totalAPS } = apsFromValues(values);
    const pass = evaluatePassLevels(values);

    const outcome = { values, marks, points, totalAPS, pass };
    storage.set(NS, 'last', outcome);

    result.innerHTML = renderOutcome(outcome);
    return outcome;
  }

  async function copySummary() {
    const saved = storage.get(NS, 'last', null) || calculate();
    const { totalAPS, pass } = saved;
    const lines = [
      `APS total: ${totalAPS}`,
      `Best eligible pass level: ${pass.best}`,
      `Meets Bachelor’s: ${pass.bachelors ? 'Yes' : 'No'}`,
      `Meets Diploma: ${pass.diploma ? 'Yes' : 'No'}`,
      `Meets Higher Certificate: ${pass.higherCert ? 'Yes' : 'No'}`,
      ...(pass.advice.length ? ['Next steps:', ...pass.advice.map((a) => `- ${a}`)] : [])
    ];
    await copyFn(lines.join('\n'));
  }

  function clear() {
    ['homeLanguage','fal','s3','s4','s5','s6','s7'].forEach((k) => {
      const input = form.querySelector(`[name="${k}"]`);
      if (input) input.value = '';
    });
    result.textContent = '';
    store.clearNamespace(NS);
  }

  // If we had a saved outcome, render it
  if (saved && saved.values) {
    const { totalAPS, pass } = apsFromValues(saved.values);
    const outcome = { ...saved, totalAPS, pass: evaluatePassLevels(saved.values) };
    result.innerHTML = renderOutcome(outcome);
  }

  return { calculate, copySummary, clear };
}