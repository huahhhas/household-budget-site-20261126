// Bills: the recurring payments for the month, when each one is due, and a
// tick to mark it paid. Autopay bills are marked paid automatically when the
// matching transaction appears in the month.

import { billsFor, toggleBillPaid } from './store.js';
import { escapeHtml, money, monthLabel } from './format.js';

export function render(month) {
  const todayDay = 26;
  const bills = billsFor(month, todayDay);
  const total = bills.reduce((s, b) => s + b.amount, 0);
  const paidTotal = bills.filter((b) => b.paid).reduce((s, b) => s + b.amount, 0);
  const unpaid = bills.filter((b) => !b.paid);
  const unpaidTotal = unpaid.reduce((s, b) => s + b.amount, 0);
  const sorted = [...bills].sort((a, b) => a.day - b.day);

  return `
  <div class="page-head">
    <h1>Bills — ${escapeHtml(monthLabel(month))}</h1>
    <p>${bills.length} recurring bills, ${money(total)} in all. ${money(paidTotal)} is paid and ${money(unpaidTotal)} is still to go.</p>
  </div>

  <div class="grid grid-3">
    <div class="card stat"><div class="label">Bills this month</div><div class="value">${money(total)}</div><div class="sub">${bills.length} recurring payments</div></div>
    <div class="card stat good"><div class="label">Paid</div><div class="value">${money(paidTotal)}</div><div class="sub">${bills.filter((b) => b.paid).length} of ${bills.length} bills</div></div>
    <div class="card stat ${unpaidTotal > 0 ? 'warn' : 'good'}"><div class="label">Still to pay</div><div class="value">${money(unpaidTotal)}</div><div class="sub">${unpaid.length} bill${unpaid.length === 1 ? '' : 's'} left</div></div>
  </div>

  <section class="card">
    <h2>All bills, in due order</h2>
    ${sorted.map((b) => `
      <div class="bill-row">
        <div>
          <div class="bill-name">${escapeHtml(b.name)}</div>
          <div class="bill-meta">Due day ${b.day} &middot; ${escapeHtml(b.category)} &middot; ${b.autopay ? 'Autopay on' : 'Pay by hand'}</div>
        </div>
        <div style="display:flex; align-items:center; gap:0.75rem;">
          <span class="pill ${b.paid ? 'paid' : b.status === 'due' ? 'due' : 'soon'}">${b.paid ? 'Paid' : b.status === 'due' ? 'Due now' : 'Coming up'}</span>
          <span class="bill-amount">${money(b.amount)}</span>
          <button type="button" class="btn ${b.paid ? 'ghost' : ''}" data-bill="${b.id}">${b.paid ? 'Undo' : 'Mark paid'}</button>
        </div>
      </div>`).join('')}
  </section>

  <section class="card">
    <h2>Never miss one again</h2>
    <p>Put every bill on autopay where the amount is fixed — rent, internet, phone, insurance — and keep a buffer of one month's bills in the checking account. For bills that change, like power and water, check the amount when the statement lands and update the figure here.</p>
    <p>Marking a bill paid here is just a tick for your own records; the money itself moves at your bank. A bill whose matching payment shows up in Transactions is ticked automatically.</p>
  </section>`;
}

export function mount(app, month, rerender) {
  app.querySelectorAll('[data-bill]').forEach((btn) => {
    btn.addEventListener('click', () => {
      toggleBillPaid(month, btn.getAttribute('data-bill'));
      rerender();
    });
  });
}
