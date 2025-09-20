/**
 * Funding Wizard (NSFAS & Bursaries)
 * Lightweight question flow to check NSFAS eligibility and show next steps.
 * Also surfaces Funza Lushaka (teaching) when relevant.
 *
 * Public API:
 * - createFundingWizard({ root, output, store })
 *   returns: { start(), reset() }
 */

import { store } from './storage.js';

const NS = 'wizard';

const QUESTIONS = [
  {
    key: 'citizenship',
    text: 'Are you a South African citizen or permanent resident?',
    type: 'boolean'
  },
  {
    key: 'firstTime',
    text: 'Will you be a first-time entering student at a public University or TVET in 2026?',
    type: 'boolean'
  },
  {
    key: 'institution',
    text: 'Are you planning to study at a public University, University of Technology, or TVET College?',
    type: 'select',
    options: ['Public University', 'University of Technology', 'TVET College', 'Private College / Other']
  },
  {
    key: 'passedNSC',
    text: 'Will you have a valid NSC (matric) by January 2026?',
    help: 'If you are rewriting now, answer "Yes" if you expect to qualify.',
    type: 'boolean'
  },
  {
    key: 'householdIncome',
    text: 'Approximate combined household income per year (Rands)',
    type: 'number',
    placeholder: 'e.g. 120000'
  },
  {
    key: 'disability',
    text: 'Do you (the applicant) have a disability?',
    type: 'boolean'
  },
  {
    key: 'interestedTeaching',
    text: 'Are you considering a BEd (teaching), especially Foundation Phase?',
    type: 'boolean'
  }
];

function el(tag, attrs = {}, html = '') {
  const node = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => {
    if (k === 'class') node.className = v;
    else if (k === 'for') node.htmlFor = v;
    else node.setAttribute(k, v);
  });
  if (html) node.innerHTML = html;
  return node;
}

export function createFundingWizard({ root, output, store: storage = store }) {
  let idx = 0;
  let answers = storage.get(NS, 'answers', {}) || {};

  function save() {
    storage.set(NS, 'answers', answers);
  }

  function reset() {
    idx = 0;
    answers = {};
    save();
    renderQuestion();
    output.innerHTML = '';
  }

  function start() {
    renderQuestion();
  }

  function inputFor(question) {
    const wrap = el('div', { class: 'space-y-2' });

    if (question.type === 'boolean') {
      const yesId = `q_${question.key}_yes`;
      const noId = `q_${question.key}_no`;
      const current = answers[question.key];

      const row = el('div', { class: 'flex gap-4 items-center' });
      const yes = el('label', { class: 'inline-flex items-center gap-2', for: yesId },
        `<input type="radio" name="${question.key}" id="${yesId}" value="yes" ${current === true ? 'checked' : ''}/> Yes`);
      const no = el('label', { class: 'inline-flex items-center gap-2', for: noId },
        `<input type="radio" name="${question.key}" id="${noId}" value="no" ${current === false ? 'checked' : ''}/> No`);
      row.append(yes, no);
      wrap.append(row);
      return wrap;
    }

    if (question.type === 'select') {
      const select = el('select', { class: 'border rounded px-3 py-2 text-sm w-full', name: question.key });
      for (const opt of question.options) {
        const o = el('option', {}, opt);
        if (answers[question.key] === opt) o.selected = true;
        select.append(o);
      }
      wrap.append(select);
      return wrap;
    }

    if (question.type === 'number') {
      const input = el('input', {
        class: 'border rounded px-3 py-2 text-sm w-full',
        type: 'number',
        name: question.key,
        min: '0',
        step: '1000',
        placeholder: question.placeholder || ''
      });
      if (typeof answers[question.key] === 'number') input.value = String(answers[question.key]);
      wrap.append(input);
      return wrap;
    }

    return wrap;
  }

  function readAnswer(question) {
    if (question.type === 'boolean') {
      const yes = root.querySelector(`input[name="${question.key}"][value="yes"]`);
      const no = root.querySelector(`input[name="${question.key}"][value="no"]`);
      if (yes && yes.checked) return true;
      if (no && no.checked) return false;
      return null;
    }

    if (question.type === 'select') {
      const sel = root.querySelector(`select[name="${question.key}"]`);
      return sel ? sel.value : null;
    }

    if (question.type === 'number') {
      const inp = root.querySelector(`input[name="${question.key}"]`);
      if (!inp || !inp.value) return null;
      const n = Number(inp.value);
      return Number.isFinite(n) ? n : null;
    }

    return null;
  }

  function renderQuestion() {
    root.innerHTML = '';
    const q = QUESTIONS[idx];
    if (!q) {
      // done - show result
      return renderResult();
    }

    const title = el('h4', { class: 'font-semibold text-gray-800 mb-1' }, q.text);
    root.append(title);
    if (q.help) {
      root.append(el('p', { class: 'text-xs text-gray-500 mb-2' }, q.help));
    }

    root.append(inputFor(q));

    const actions = el('div', { class: 'mt-3 flex gap-2' });
    const next = el('button', { class: 'px-3 py-2 bg-blue-600 text-white rounded text-sm' }, 'Next');
    const back = el('button', { class: 'px-3 py-2 bg-gray-100 text-gray-800 rounded text-sm' }, 'Back');
    actions.append(next, back);
    root.append(actions);

    next.addEventListener('click', (e) => {
      e.preventDefault();
      const val = readAnswer(q);
      if (val === null || val === '') {
        // soft nudge
        next.classList.add('animate-pulse');
        setTimeout(() => next.classList.remove('animate-pulse'), 400);
        return;
      }
      answers[q.key] = val;
      save();
      idx++;
      renderQuestion();
    });

    back.addEventListener('click', (e) => {
      e.preventDefault();
      if (idx > 0) {
        idx--;
        renderQuestion();
      }
    });
  }

  function renderResult() {
    const {
      citizenship, firstTime, institution, passedNSC, householdIncome, disability, interestedTeaching
    } = answers;

    const isPublic = institution === 'Public University' || institution === 'University of Technology' || institution === 'TVET College';
    const income = Number(householdIncome || 0);
    const threshold = disability ? 600000 : 350000;

    const nsfasEligible =
      citizenship === true &&
      firstTime === true &&
      isPublic === true &&
      passedNSC === true &&
      income > 0 && income <= threshold;

    const verdictBadge = (ok) =>
      `<span class="px-2 py-1 rounded text-xs ${ok ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">${ok ? 'Likely Eligible' : 'Check Requirements'}</span>`;

    const checklist = [
      'South African ID / birth certificate (certified copy)',
      'Parent/guardian ID (certified copy)',
      'Proof of household income (salary slip, SASSA letter, or affidavit if unemployed)',
      'Completed and signed NSFAS consent form',
      'Proof of application / acceptance to a public university or TVET (when available)'
    ];

    const lines = [];
    lines.push(`<p class="text-sm text-gray-700"><strong>NSFAS Status:</strong> ${verdictBadge(nsfasEligible)}</p>`);
    lines.push(`<p class="text-sm text-gray-700 mt-2">Household income threshold used: R${threshold.toLocaleString('en-ZA')}. Your input: R${(income || 0).toLocaleString('en-ZA')}.</p>`);

    if (!nsfasEligible) {
      lines.push('<div class="mt-2 text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded p-3">');
      lines.push('<p class="font-medium">What to check or fix:</p>');
      lines.push('<ul class="list-disc ml-5">');
      if (!citizenship) lines.push('<li>NSFAS requires SA citizenship or permanent residency.</li>');
      if (!firstTime) lines.push('<li>Typically for first-time entering students in 2026.</li>');
      if (!isPublic) lines.push('<li>Institution must be a public University/UoT/TVET.</li>');
      if (!passedNSC) lines.push('<li>You must have a valid NSC by January 2026.</li>');
      if (!(income > 0)) lines.push('<li>Provide an estimated annual household income.</li>');
      if (income > threshold) lines.push(`<li>Income exceeds threshold (R${threshold.toLocaleString('en-ZA')}). Explore university bursaries or learnerships.</li>`);
      lines.push('</ul>');
      lines.push('</div>');
    }

    // Documents
    lines.push('<div class="mt-3"><p class="font-medium text-sm text-gray-800">NSFAS Document Checklist:</p>');
    lines.push('<ul class="list-disc ml-5 text-sm text-gray-700">');
    for (const item of checklist) lines.push(`<li>${item}</li>`);
    lines.push('</ul></div>');

    // Timelines
    lines.push('<div class="mt-3 text-sm text-gray-700"><p class="font-medium">Timeline:</p>');
    lines.push('<ul class="list-disc ml-5">');
    lines.push('<li>NSFAS applications typically open in September/October. Apply as soon as the window opens.</li>');
    lines.push('<li>Update your application with final NSC results in January 2026.</li>');
    lines.push('</ul></div>');

    // Funza Lushaka for teaching interest
    if (interestedTeaching) {
      lines.push('<div class="mt-3 text-sm text-emerald-800 bg-emerald-50 border border-emerald-200 rounded p-3">');
      lines.push('<p class="font-medium">Teaching Path (Funza Lushaka):</p>');
      lines.push('<ul class="list-disc ml-5">');
      lines.push('<li>Consider applying for the Funza Lushaka bursary if pursuing a BEd (Foundation Phase is prioritized).</li>');
      lines.push('<li>Covers tuition, accommodation, and stipend; recipients commit to teach in public schools.</li>');
      lines.push('<li>Check guidance and dates: <a class="citation-link" href="https://www.funzalushaka.doe.gov.za/" target="_blank" rel="noopener">Funza Lushaka</a>.</li>');
      lines.push('</ul>');
      lines.push('</div>');
    }

    // Helpful links
    lines.push('<div class="mt-3 text-sm">');
    lines.push('Useful: <a class="citation-link" href="https://www.nsfas.org.za/" target="_blank" rel="noopener">NSFAS</a> • <a class="citation-link" href="https://www.westerncape.gov.za/education/national-senior-certificate-nsc-exams-june" target="_blank" rel="noopener">WCED NSC</a>');
    lines.push('</div>');

    output.innerHTML = lines.join('\n');
  }

  return { start, reset };
}