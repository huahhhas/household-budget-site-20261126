// Budgets: one monthly limit per category. Set a number, see at a glance how
// much of it is already spent, and adjust when life changes.

import { budgetStatus, setBudget, totalBudgeted } from './store.js';
import { escapeHtml, money, monthLabel } from './format.js';

let notice = '';

function statusText(b) {
  if (b.status === 'over') return `Over by ${money(b.spent - b.budget)}`;
  if (b.status === 'near') return `${money(b.budget - b.spent)} left — nearly there`;
  return `${money(b.budget - b.spent)} left`;
}

export function render(month) {
  const rows = budgetStatus(month);
  const totalSpent = rows.reduce((s, r) => s + r.spent, 0);
  const total = totalBudgeted();
  const pct = total > 0 ? Math.round((totalSpent / total) * 100) : 0;

  return `
  <div class="page-head">
    <h1>Budgets — ${escapeHtml(monthLabel(month))}</h1>
    <p>Give every dollar a job before the month starts. You have budgeted ${money(total)} and spent ${money(totalSpent)} of it so far — ${pct}% of the plan.</p>
  </div>
  ${notice ? `<div class="notice" role="status">${escapeHtml(notice)}</div>` : ''}

  <div class="card">
    <h2>Monthly limits</h2>
    <p class="muted small">Change a number and press Save — the dashboard and reports update at once. Set a category to $0 to stop budgeting it.</p>
    ${rows.map((b) => `
      <form class="budget-row" data-budget-form="${b.id}">
        <div class="row-top">
          <strong><span class="cat-dot" style="background:${b.color}"></span>${escapeHtml(b.name)}</strong>
          <span class="pill ${b.status}">${b.status === 'over' ? 'Over budget' : b.status === 'near' ? 'Nearly there' : 'On track'}</span>
        </div>
        <div class="bar-track"><div class="bar-fill ${b.status === 'over' ? 'over' : b.status === 'near' ? 'near' : ''}" style="width:${Math.min(100, b.pct)}%"></div></div>
        <div class="row-sub"><span>${money(b.spent)} spent (${b.pct}%)</span><span>${escapeHtml(statusText(b))}</span></div>
        <div class="form-row" style="margin-top:0.55rem;">
          <div class="field" style="margin-bottom:0;">
            <label for="budget-${b.id}">Monthly budget ($)</label>
            <input id="budget-${b.id}" name="budget" type="number" min="0" step="1" inputmode="decimal" value="${(b.budget / 100).toFixed(0)}">
          </div>
          <div class="field" style="margin-bottom:0; align-self:end;">
            <button class="btn" type="submit">Save ${escapeHtml(b.name)}</button>
          </div>
        </div>
      </form>`).join('')}
  </div>

  <section class="card">
    <h2>How to set a good budget</h2>
    <p>Start with last month's real spending — the Reports page shows it — then trim one category by 10% rather than slashing everything at once. Fixed costs (rent, insurance, internet) rarely move; groceries, dining and fun are where a household finds money.</p>
    <p>When a category goes over, move money from another one instead of pretending it did not happen: a budget that bends is a budget you keep.</p>
    <p><a href="#/reports">See last month's real spending &rarr;</a></p>
  </section>`;
}

export function mount(app, month, rerender) {
  app.querySelectorAll('[data-budget-form]').forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const id = form.getAttribute('data-budget-form');
      const dollars = Number(new FormData(form).get('budget'));
      if (!Number.isFinite(dollars) || dollars < 0) {
        notice = 'Enter a budget of $0 or more.';
        rerender();
        return;
      }
      setBudget(id, dollars * 100);
      notice = `Budget saved.`;
      rerender();
    });
  });
}
