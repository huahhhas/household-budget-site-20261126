// Dashboard: the month at a glance — income, spending, what is left, where the
// money went, which budgets are tight, the latest transactions and the next bills.

import { budgetStatus, billsFor, monthTotals, spendingByCategory, transactionsFor } from './store.js';
import { dayLabel, escapeHtml, money, monthLabel } from './format.js';
import { donut, horizontalBars } from './charts.js';
import { TIPS } from './data.js';

export function render(month) {
  const totals = monthTotals(month);
  const byCat = spendingByCategory(month);
  const topCats = byCat.filter((c) => c.spent > 0);
  const budgets = budgetStatus(month).sort((a, b) => b.pct - a.pct).slice(0, 4);
  const recent = transactionsFor(month).slice(0, 6);
  const bills = billsFor(month, 26).filter((b) => !b.paid).slice(0, 3);
  const remainingClass = totals.remaining >= 0 ? 'good' : 'bad';
  const topSpend = byCat[0];

  return `
  <div class="page-head">
    <h1>Your household budget, ${escapeHtml(monthLabel(month))}</h1>
    <p>Income, spending and bills for the month — with ${topSpend ? `${escapeHtml(topSpend.name)} the biggest spend so far at ${money(topSpend.spent)}` : 'no spending recorded yet'}.</p>
  </div>

  <div class="grid grid-4">
    <div class="card stat income"><div class="label">Income</div><div class="value">${money(totals.income)}</div><div class="sub">Paychecks, freelance &amp; refunds</div></div>
    <div class="card stat expense"><div class="label">Spending</div><div class="value">${money(totals.expenses)}</div><div class="sub">Across ${byCat.length} categories</div></div>
    <div class="card stat ${remainingClass}"><div class="label">Left over</div><div class="value">${money(totals.remaining)}</div><div class="sub">${totals.remaining >= 0 ? 'Still in the month\'s pocket' : 'Over income — time to trim'}</div></div>
    <div class="card stat ${totals.savingsRate >= 10 ? 'good' : 'warn'}"><div class="label">Savings rate</div><div class="value">${totals.savingsRate}%</div><div class="sub">Aim for 10% or more</div></div>
  </div>

  <section class="grid grid-2">
    <div class="card">
      <h2>Where the money went</h2>
      <div style="display:flex; gap:1rem; flex-wrap:wrap; align-items:center;">
        ${donut(topCats.map((c) => ({ label: c.name, value: c.spent, color: c.color })))}
        <div class="legend" style="flex:1; min-width:180px;">
          ${topCats.map((c) => `<span><span class="cat-dot" style="background:${c.color}"></span>${escapeHtml(c.name)} — ${money(c.spent)}</span>`).join('')}
        </div>
      </div>
      <div class="chart-wrap">${horizontalBars(byCat.filter((c) => c.spent > 0).slice(0, 6).map((c) => ({ label: c.name, value: c.spent, color: c.color })))}</div>
    </div>

    <div class="card">
      <h2>Budgets to watch</h2>
      ${budgets.map((b) => `
        <div class="budget-row">
          <div class="row-top"><strong>${escapeHtml(b.name)}</strong><span class="pill ${b.status}">${b.status === 'over' ? 'Over budget' : b.status === 'near' ? b.pct + '% used' : b.pct + '% used'}</span></div>
          <div class="bar-track"><div class="bar-fill ${b.status === 'over' ? 'over' : b.status === 'near' ? 'near' : ''}" style="width:${Math.min(100, b.pct)}%"></div></div>
          <div class="row-sub"><span>${money(b.spent)} spent</span><span>of ${money(b.budget)}</span></div>
        </div>`).join('')}
      <p style="margin-top:0.9rem;"><a href="#/budgets">See all budgets &rarr;</a></p>
    </div>
  </section>

  <section class="grid grid-2">
    <div class="card">
      <h2>Recent transactions</h2>
      ${recent.length === 0 ? '<p class="empty">No transactions this month yet.</p>' : `
      <table>
        <thead><tr><th>Date</th><th>What</th><th class="num">Amount</th></tr></thead>
        <tbody>
          ${recent.map((t) => `<tr><td>${dayLabel(t.date)}</td><td>${escapeHtml(t.note)}<div class="tx-note">${escapeHtml(t.category)}</div></td><td class="num ${t.type === 'income' ? 'amount-income' : 'amount-expense'}">${t.type === 'income' ? '+' : '&minus;'}${money(t.amount)}</td></tr>`).join('')}
        </tbody>
      </table>`}
      <p style="margin-top:0.9rem;"><a href="#/transactions">All transactions &rarr;</a></p>
    </div>

    <div>
      <div class="card">
        <h2>Bills still to pay</h2>
        ${bills.length === 0 ? '<p class="empty">Every bill this month is paid. Nice work.</p>' : bills.map((b) => `
          <div class="bill-row">
            <div><div class="bill-name">${escapeHtml(b.name)}</div><div class="bill-meta">Due day ${b.day} &middot; ${b.autopay ? 'Autopay on' : 'Pay by hand'}</div></div>
            <span class="bill-amount">${money(b.amount)}</span>
          </div>`).join('')}
        <p style="margin-top:0.9rem;"><a href="#/bills">All bills &rarr;</a></p>
      </div>
      <div class="card" style="margin-top:1rem;">
        <h2>Three things worth knowing</h2>
        ${TIPS.map((tip) => `<h3>${escapeHtml(tip.title)}</h3><p class="muted small" style="margin-top:0;">${escapeHtml(tip.body)}</p>`).join('')}
      </div>
    </div>
  </section>`;
}

export function mount() {
  // The dashboard has no controls of its own.
}
