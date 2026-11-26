// Reports: six months side by side, the categories that cost the most over the
// last three months, and what the numbers suggest doing next.

import { lastSixMonths, monthTotals, spendingByCategory } from './store.js';
import { escapeHtml, money, monthLabel, shortMonthLabel } from './format.js';
import { monthlyBars } from './charts.js';
import { TIPS } from './data.js';

export function render(month) {
  const months = lastSixMonths().map((m) => ({ ...m, label: shortMonthLabel(m.month) }));
  const current = monthTotals(month);
  const threeMonths = ['2026-09', '2026-10', '2026-11'];
  const totals = {};
  for (const m of threeMonths) {
    for (const c of spendingByCategory(m)) {
      totals[c.id] = (totals[c.id] || { ...c, spent: 0 });
      totals[c.id].spent += c.spent;
    }
  }
  const top = Object.values(totals).sort((a, b) => b.spent - a.spent).slice(0, 5);
  const threeMonthSpend = top.reduce((s, c) => s + c.spent, 0);
  const avgMonthlySpend = months.reduce((s, m) => s + m.expenses, 0) / months.filter((m) => m.expenses > 0).length;

  return `
  <div class="page-head">
    <h1>Reports</h1>
    <p>Six months of income against spending, the categories that cost the most, and what to do about them. Figures are for the household's own records, stored only in this browser.</p>
  </div>

  <section class="card">
    <h2>Income vs spending — last six months</h2>
    <div class="chart-wrap">${monthlyBars(months)}</div>
    <p class="legend"><span><span class="cat-dot" style="background:#2e7d4f"></span>Income</span><span><span class="cat-dot" style="background:#b3372e"></span>Spending</span></p>
    <table>
      <thead><tr><th>Month</th><th class="num">Income</th><th class="num">Spending</th><th class="num">Left over</th><th class="num">Savings rate</th></tr></thead>
      <tbody>
        ${[...months].reverse().map((m) => `<tr><td>${escapeHtml(monthLabel(m.month))}</td><td class="num">${money(m.income)}</td><td class="num">${money(m.expenses)}</td><td class="num">${money(m.remaining)}</td><td class="num">${m.savingsRate}%</td></tr>`).join('')}
      </tbody>
    </table>
  </section>

  <section class="grid grid-2">
    <div class="card">
      <h2>Biggest costs — Sep to Nov</h2>
      ${top.map((c) => `
        <div class="budget-row">
          <div class="row-top"><strong><span class="cat-dot" style="background:${c.color}"></span>${escapeHtml(c.name)}</strong><span>${money(c.spent)}</span></div>
          <div class="bar-track"><div class="bar-fill" style="width:${Math.round((c.spent / (top[0]?.spent || 1)) * 100)}%"></div></div>
          <div class="row-sub"><span>${Math.round((c.spent / threeMonthSpend) * 100)}% of the top five</span><span>${money(Math.round(c.spent / 3))} a month</span></div>
        </div>`).join('')}
      <p class="muted small" style="margin-top:0.8rem;">Housing leads, as it does for most households — the next three are where a change actually moves the needle.</p>
    </div>

    <div class="card">
      <h2>What the numbers say</h2>
      <p><strong>Average monthly spending:</strong> ${money(Math.round(avgMonthlySpend))} over the months with spending recorded.</p>
      <p><strong>This month so far:</strong> ${money(current.expenses)} spent against ${money(current.income)} in — ${money(current.remaining)} left with the month still open.</p>
      ${TIPS.map((tip) => `<h3>${escapeHtml(tip.title)}</h3><p class="muted small" style="margin-top:0;">${escapeHtml(tip.body)}</p>`).join('')}
    </div>
  </section>`;
}

export function mount() {
  // Reports has no controls of its own.
}
