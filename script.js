/* RAF RoadX & Fund Guide — script.js */
'use strict';

// ─── App State ───────────────────────────────────────────────────────────────
const state = {
  calcResults: { past: 0, future: 0, total: 0 },
  path: null,          // 'attorney' | 'direct'
  currentStep: 0,
};

const FLOW_IDS = [
  'entry', 'eligibility', 'claim_path',
  'attorney_info', 'direct_info',
  'documents', 'damages', 'calculator', 'summary', 'flowchart'
];

// Steps that appear in the linear progress (excluding branching options)
const PROGRESS_STEPS = [
  'entry', 'eligibility', 'claim_path',
  'path_info', 'documents', 'damages',
  'calculator', 'summary', 'flowchart'
];

// ─── DOM Refs ─────────────────────────────────────────────────────────────────
const disclaimerOverlay = document.getElementById('disclaimer-overlay');
const acceptBtn         = document.getElementById('accept-disclaimer');
const appEl             = document.getElementById('app');
const mainContent       = document.getElementById('main-content');
const progressBar       = document.getElementById('progress-bar');

// ─── Bootstrap ───────────────────────────────────────────────────────────────
acceptBtn.addEventListener('click', () => {
  disclaimerOverlay.classList.remove('active');
  appEl.classList.remove('hidden');
  renderStep('entry');
});

// ─── Progress ────────────────────────────────────────────────────────────────
function setProgress(pct) {
  progressBar.style.width = Math.min(100, Math.max(0, pct)) + '%';
}

function progressForStep(stepId) {
  const map = {
    entry: 5, eligibility: 15, claim_path: 28,
    attorney_info: 38, direct_info: 38,
    documents: 52, damages: 64, calculator: 76,
    summary: 88, flowchart: 100
  };
  return map[stepId] ?? 0;
}

// ─── Currency Helper ─────────────────────────────────────────────────────────
function fmt(n) {
  return 'R ' + Math.round(n).toLocaleString('en-ZA');
}

// ─── Render Router ───────────────────────────────────────────────────────────
function renderStep(id) {
  setProgress(progressForStep(id));
  const renderers = {
    entry:         renderEntry,
    eligibility:   renderEligibility,
    claim_path:    renderClaimPath,
    attorney_info: renderAttorneyInfo,
    direct_info:   renderDirectInfo,
    documents:     renderDocuments,
    damages:       renderDamages,
    calculator:    renderCalculator,
    summary:       renderSummary,
    flowchart:     renderFlowchart,
  };
  if (renderers[id]) renderers[id]();
}

// ─── Step: Entry ─────────────────────────────────────────────────────────────
function renderEntry() {
  mainContent.innerHTML = `
    <div class="card">
      <div class="card-header">
        <div class="card-step">Welcome</div>
        <h2>RAF RoadX &amp; Fund Guide</h2>
      </div>
      <div class="card-body">
        <p style="margin-bottom:1rem; font-size:0.96rem;">
          This tool helps you understand <strong>Road Accident Fund (RAF)</strong> claims,
          eligibility requirements, required documents, and potential compensation.
        </p>
        <ul class="info-list">
          <li>Check your eligibility</li>
          <li>Choose your claim path</li>
          <li>Review required documents</li>
          <li>Estimate loss of earnings</li>
          <li>Understand the RAF process</li>
        </ul>
        <div class="btn-group">
          <button class="btn btn-primary" onclick="renderStep('eligibility')">Get Started →</button>
        </div>
      </div>
    </div>`;
}

// ─── Step: Eligibility ───────────────────────────────────────────────────────
function renderEligibility() {
  mainContent.innerHTML = `
    <div class="card">
      <div class="card-header">
        <div class="card-step">Step 1 of 8 — Eligibility</div>
        <h2>Eligibility Check</h2>
      </div>
      <div class="card-body">

        <div class="question-block" id="q-motor">
          <label>1. Did the injury arise from a motor vehicle accident?</label>
          <div class="radio-group">
            <label><input type="radio" name="motor_vehicle" value="yes" /> Yes</label>
            <label><input type="radio" name="motor_vehicle" value="no"  /> No</label>
          </div>
        </div>

        <div class="question-block" id="q-fault">
          <label>2. Was another driver at least partly at fault?</label>
          <div class="radio-group">
            <label><input type="radio" name="fault" value="yes" /> Yes</label>
            <label><input type="radio" name="fault" value="no"  /> No / Unsure</label>
          </div>
        </div>

        <div id="elig-message" style="margin-top:0.75rem;"></div>

        <div class="btn-group">
          <button class="btn btn-outline"  onclick="renderStep('entry')">← Back</button>
          <button class="btn btn-primary"  id="elig-next" onclick="checkEligibility()">Continue →</button>
        </div>
      </div>
    </div>`;
}

function checkEligibility() {
  const motor = document.querySelector('input[name=motor_vehicle]:checked');
  const fault = document.querySelector('input[name=fault]:checked');
  const msg   = document.getElementById('elig-message');

  if (!motor || !fault) {
    msg.innerHTML = `<div class="summary-note-box">⚠️ Please answer both questions to continue.</div>`;
    return;
  }

  if (motor.value === 'no') {
    msg.innerHTML = `
      <div class="summary-note-box" style="background:#fdecea;border-color:#c0392b;color:#7a1010;">
        ❌ <strong>You may not be eligible.</strong><br/>
        RAF claims require the injury to arise from a motor vehicle accident on a public road.
        Please consult an attorney for further advice.
      </div>`;
    return;
  }

  // Eligible — proceed
  renderStep('claim_path');
}

// ─── Step: Claim Path ────────────────────────────────────────────────────────
function renderClaimPath() {
  mainContent.innerHTML = `
    <div class="card">
      <div class="card-header">
        <div class="card-step">Step 2 of 8 — Claim Path</div>
        <h2>How do you want to claim?</h2>
      </div>
      <div class="card-body">
        <p style="margin-bottom:0.75rem; font-size:0.93rem; color:var(--text-muted);">
          You have two options for submitting your RAF claim:
        </p>
        <div class="choice-grid">
          <div class="choice-card" onclick="selectPath('attorney')">
            <div class="choice-icon">👨‍⚖️</div>
            <div>Through an Attorney</div>
          </div>
          <div class="choice-card" onclick="selectPath('direct')">
            <div class="choice-icon">🏛️</div>
            <div>Directly with RAF</div>
          </div>
        </div>
        <div class="btn-group">
          <button class="btn btn-outline" onclick="renderStep('eligibility')">← Back</button>
        </div>
      </div>
    </div>`;
}

function selectPath(path) {
  state.path = path;
  renderStep(path === 'attorney' ? 'attorney_info' : 'direct_info');
}

// ─── Step: Attorney Info ─────────────────────────────────────────────────────
function renderAttorneyInfo() {
  mainContent.innerHTML = `
    <div class="card">
      <div class="card-header">
        <div class="card-step">Step 3 of 8 — Claim Path: Attorney</div>
        <h2>Using an Attorney</h2>
      </div>
      <div class="card-body">
        <ul class="info-list">
          <li>An attorney can assist with evidence gathering, expert reports, and negotiations.</li>
          <li>Fees may be deducted from your compensation.</li>
          <li>Attorneys are experienced with RAF's processes and timelines.</li>
          <li>Legal costs are regulated and cannot exceed prescribed limits.</li>
        </ul>
        <div class="btn-group">
          <button class="btn btn-outline" onclick="renderStep('claim_path')">← Back</button>
          <button class="btn btn-primary" onclick="renderStep('documents')">Continue →</button>
        </div>
      </div>
    </div>`;
}

// ─── Step: Direct Info ───────────────────────────────────────────────────────
function renderDirectInfo() {
  mainContent.innerHTML = `
    <div class="card">
      <div class="card-header">
        <div class="card-step">Step 3 of 8 — Claim Path: Direct</div>
        <h2>Direct Claim with RAF</h2>
      </div>
      <div class="card-body">
        <ul class="info-list">
          <li>You can submit your claim directly to RAF.</li>
          <li>You will be responsible for all documentation and follow-ups.</li>
          <li>RAF has offices across South Africa where you can submit claims in person.</li>
          <li>No attorney fees apply, but the process can be complex.</li>
        </ul>
        <div class="btn-group">
          <button class="btn btn-outline" onclick="renderStep('claim_path')">← Back</button>
          <button class="btn btn-primary" onclick="renderStep('documents')">Continue →</button>
        </div>
      </div>
    </div>`;
}

// ─── Step: Documents ─────────────────────────────────────────────────────────
const DOCUMENTS = [
  'ID Document',
  'Accident Report (SAPS)',
  'Medical Records',
  'Hospital Bills',
  'Proof of Income',
  'RAF 1 Form',
  'RAF 4 (Serious Injury Assessment)',
];

let checkedDocs = new Set();

function renderDocuments() {
  checkedDocs = new Set();
  const items = DOCUMENTS.map((doc, i) => `
    <li id="doc-${i}" onclick="toggleDoc(${i})">
      <input type="checkbox" id="chk-${i}" />
      ${doc}
    </li>`).join('');

  mainContent.innerHTML = `
    <div class="card">
      <div class="card-header">
        <div class="card-step">Step 4 of 8 — Documents</div>
        <h2>Required Documents</h2>
      </div>
      <div class="card-body">
        <p style="margin-bottom:0.75rem;font-size:0.93rem;color:var(--text-muted);">
          Tick each document as you gather it:
        </p>
        <ul class="checklist">${items}</ul>
        <div class="checklist-progress" id="doc-progress">0 / ${DOCUMENTS.length} gathered</div>
        <div class="btn-group">
          <button class="btn btn-outline" onclick="renderStep(state.path === 'attorney' ? 'attorney_info' : 'direct_info')">← Back</button>
          <button class="btn btn-primary" onclick="renderStep('damages')">Continue →</button>
        </div>
      </div>
    </div>`;
}

function toggleDoc(i) {
  const li  = document.getElementById(`doc-${i}`);
  const chk = document.getElementById(`chk-${i}`);
  if (checkedDocs.has(i)) {
    checkedDocs.delete(i);
    li.classList.remove('checked');
    chk.checked = false;
  } else {
    checkedDocs.add(i);
    li.classList.add('checked');
    chk.checked = true;
  }
  document.getElementById('doc-progress').textContent =
    `${checkedDocs.size} / ${DOCUMENTS.length} gathered`;
}

// ─── Step: Damages ───────────────────────────────────────────────────────────
function renderDamages() {
  mainContent.innerHTML = `
    <div class="card">
      <div class="card-header">
        <div class="card-step">Step 5 of 8 — Damages</div>
        <h2>Types of Damages</h2>
      </div>
      <div class="card-body">
        <ul class="info-list">
          <li><strong>Past Medical Expenses</strong> – costs already incurred</li>
          <li><strong>Future Medical Expenses</strong> – covered via RAF Undertaking (Section 17(4A))</li>
          <li><strong>Loss of Earnings (Past &amp; Future)</strong></li>
          <li><strong>General Damages</strong> (Pain &amp; Suffering – serious injuries only)</li>
        </ul>
        <div class="btn-group">
          <button class="btn btn-outline" onclick="renderStep('documents')">← Back</button>
          <button class="btn btn-primary" onclick="renderStep('calculator')">Continue →</button>
        </div>
      </div>
    </div>`;
}

// ─── Step: Calculator ────────────────────────────────────────────────────────
function renderCalculator() {
  mainContent.innerHTML = `
    <div class="card">
      <div class="card-header">
        <div class="card-step">Step 6 of 8 — Calculator</div>
        <h2>Loss of Earnings Calculator</h2>
      </div>
      <div class="card-body">

        <div class="calc-field">
          <label>Monthly Income <span id="val-income"></span></label>
          <input type="number" id="monthly_income" placeholder="e.g. 15000" min="0"
                 oninput="calcUpdate()" />
        </div>

        <div class="calc-field">
          <label>Months Off Work <span id="val-months">0</span></label>
          <input type="range" id="months_off" min="0" max="60" value="0" oninput="calcUpdate()" />
        </div>

        <div class="calc-field">
          <label>Years Affected (Future) <span id="val-years">0</span></label>
          <input type="range" id="future_years" min="0" max="40" value="0" oninput="calcUpdate()" />
        </div>

        <div class="calc-field">
          <label>Contingency Deduction <span id="val-cont">15%</span></label>
          <input type="range" id="contingency" min="5" max="50" value="15" oninput="calcUpdate()" />
        </div>

        <div class="calc-results" id="calc-results">
          <h4>Estimated Loss of Earnings</h4>
          <div class="calc-row"><span>Past Loss of Earnings</span><span id="res-past">R 0</span></div>
          <div class="calc-row"><span>Future Loss of Earnings</span><span id="res-future">R 0</span></div>
          <div class="calc-row total"><span>Total Estimate</span><span id="res-total">R 0</span></div>
          <p class="calc-note">
            ⚠️ These figures are indicative only. Actual values depend on actuarial reports and RAF assessment.
          </p>
        </div>

        <div class="btn-group">
          <button class="btn btn-outline" onclick="renderStep('damages')">← Back</button>
          <button class="btn btn-primary" onclick="saveAndSummary()">Continue →</button>
        </div>
      </div>
    </div>`;

  calcUpdate(); // initialise display
}

function calcUpdate() {
  const income  = parseFloat(document.getElementById('monthly_income').value) || 0;
  const months  = parseFloat(document.getElementById('months_off').value)     || 0;
  const years   = parseFloat(document.getElementById('future_years').value)   || 0;
  const cont    = parseFloat(document.getElementById('contingency').value)    || 15;

  document.getElementById('val-income').textContent = income ? fmt(income) : '';
  document.getElementById('val-months').textContent = months;
  document.getElementById('val-years').textContent  = years;
  document.getElementById('val-cont').textContent   = cont + '%';

  const past   = income * months;
  const future = (income * 12 * years) * (1 - cont / 100);
  const total  = past + future;

  state.calcResults = { past, future, total };

  document.getElementById('res-past').textContent   = fmt(past);
  document.getElementById('res-future').textContent = fmt(future);
  document.getElementById('res-total').textContent  = fmt(total);
}

function saveAndSummary() {
  calcUpdate(); // ensure latest values saved
  renderStep('summary');
}

// ─── Step: Summary ───────────────────────────────────────────────────────────
function renderSummary() {
  const { past, future, total } = state.calcResults;
  const pathLabel = state.path === 'attorney' ? 'Through an Attorney' : 'Direct with RAF';

  mainContent.innerHTML = `
    <div class="card">
      <div class="card-header">
        <div class="card-step">Step 7 of 8 — Summary</div>
        <h2>Claim Summary</h2>
      </div>
      <div class="card-body">
        <div class="summary-grid">
          <div class="summary-item">
            <div class="si-label">Claim Path</div>
            <div class="si-value" style="font-size:1rem;">${pathLabel}</div>
          </div>
          <div class="summary-item">
            <div class="si-label">Docs Collected</div>
            <div class="si-value">${checkedDocs.size} / ${DOCUMENTS.length}</div>
          </div>
          <div class="summary-item">
            <div class="si-label">Past Loss</div>
            <div class="si-value">${fmt(past)}</div>
          </div>
          <div class="summary-item">
            <div class="si-label">Future Loss</div>
            <div class="si-value">${fmt(future)}</div>
          </div>
        </div>
        <div class="summary-item" style="margin-top:0.75rem; text-align:center; background:var(--raf-green); color:#fff; border-radius:10px; padding:1rem;">
          <div class="si-label" style="color:rgba(255,255,255,0.75);">Total Estimated Loss</div>
          <div style="font-size:1.75rem; font-weight:800;">${fmt(total)}</div>
        </div>
        <div class="summary-note-box">
          ℹ️ Estimated loss of earnings displayed above. Actual claim values depend on expert/actuarial reports and RAF assessment.
        </div>
        <div class="btn-group">
          <button class="btn btn-outline" onclick="renderStep('calculator')">← Back</button>
          <button class="btn btn-primary" onclick="renderStep('flowchart')">View RAF Process →</button>
        </div>
      </div>
    </div>`;
}

// ─── Step: Flowchart ─────────────────────────────────────────────────────────
const FLOW_STEPS = [
  'Accident Occurs',
  'Medical Treatment',
  'Gather Documents',
  'Submit RAF Claim',
  'RAF Investigation',
  'Medical Assessments',
  'Settlement / Court',
  'Payment / Undertaking Issued',
];

function renderFlowchart() {
  const steps = FLOW_STEPS.map((s, i) => {
    const isLast = i === FLOW_STEPS.length - 1;
    return `
      <div class="flow-step${isLast ? ' active-step' : ''}" style="animation-delay:${i * 0.06}s">${s}</div>
      ${!isLast ? '<div class="flow-arrow"></div>' : ''}`;
  }).join('');

  mainContent.innerHTML = `
    <div class="card">
      <div class="card-header">
        <div class="card-step">Step 8 of 8 — RAF Process</div>
        <h2>RAF Process Overview</h2>
      </div>
      <div class="card-body">
        <div class="flowchart">${steps}</div>
        <div class="summary-note-box" style="margin-top:1.25rem;">
          ℹ️ Timelines vary. RAF matters can take months to years depending on complexity and whether the matter proceeds to litigation.
        </div>
        <div class="btn-group start-over-btn">
          <button class="btn btn-outline" onclick="renderStep('summary')">← Back</button>
          <button class="btn btn-primary" onclick="startOver()">🔄 Start Over</button>
        </div>
      </div>
    </div>`;
}

// ─── Start Over ───────────────────────────────────────────────────────────────
function startOver() {
  state.calcResults = { past: 0, future: 0, total: 0 };
  state.path = null;
  checkedDocs = new Set();
  renderStep('entry');
}
