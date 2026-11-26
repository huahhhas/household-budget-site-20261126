// Transactions: the full list for the month, with search and filters, and the
// form that adds a transaction or edits the one you picked.

import { CATEGORIES, INCOME_CATEGORIES } from './data.js';
import { addTransaction, allTransactions, categoryById, deleteTransaction, monthTotals, transactionsFor, updateTransaction } from './store.js';
import { dayLabel, escapeHtml, money, monthLabel } from './format.js';

let editingId = null;
let filter = { q: '', category: 'all', type: 'all' };
let notice = '';

function categoryOptions(selected, type) {
  const list = type === 'income' ? INCOME_CATEGORIES : CATEGORIES;
  return list.map((c) => `<option value="${c.id}"${c.id === selected ? ' selected' : ''}>${escapeHtml(c.name)}</option>`).join('');
}

function rowHtml(t) {
  const cat = categoryById(t.category);
  return `<tr>
    <td>${dayLabel(t.date)}</td>
    <td>${escapeHtml(t.note)}<div class="tx-note"><span class="cat-dot" style="background:${cat.color}"></span>${escapeHtml(cat.name)}</div></td>
    <td class="hide-phone">${t.type === 'income' ? 'Income' : 'Expense'}</td>
    <td class="num ${t.type === 'income' ? 'amount-income' : 'amount-expense'}">${t.type === 'income' ? '+' : '&minus;'}${money(t.amount)}</td>
    <td class="row-actions">
      <button type="button" class="link-btn" data-edit="${t.id}">Edit</button>
      <button type="button" class="link-btn danger" data-delete="${t.id}">Delete</button>
    </td>
  </tr>`;
}

export function render(month) {
  const totals = monthTotals(month);
  let list = transactionsFor(month);
  if (filter.type !== 'all') list = list.filter((t) => t.type === filter.type);
  if (filter.category !== 'all') list = list.filter((t) => t.category === filter.category);
  if (filter.q) {
    const q = filter.q.toLowerCase();
    list = list.filter((t) => t.note.toLowerCase().includes(q) || categoryById(t.category).name.toLowerCase().includes(q));
  }
  const editing = editingId ? allTransactions().find((t) => t.id === editingId) : null;
  const formType = editing ? editing.type : 'expense';
  const formCategory = editing ? editing.category : 'groceries';
  const formDate = editing ? editing.date : `${month}-26`;
  const formNote = editing ? editing.note : '';
  const formAmount = editing ? (editing.amount / 100).toFixed(2) : '';

  return `
  <div class="page-head">
    <h1>Transactions — ${escapeHtml(monthLabel(month))}</h1>
    <p>${list.length} shown &middot; ${money(totals.income)} in, ${money(totals.expenses)} out, ${money(totals.remaining)} left. Add what you spent as it happens and the dashboard stays honest.</p>
  </div>
  ${notice ? `<div class="notice" role="status">${escapeHtml(notice)}</div>` : ''}

  <div class="grid grid-2">
    <div class="card">
      <h2>${editing ? 'Edit transaction' : 'Add a transaction'}</h2>
      <form id="tx-form">
        <div class="form-row">
          <div class="field">
            <label for="tx-date">Date</label>
            <input id="tx-date" name="date" type="date" value="${formDate}" required>
          </div>
          <div class="field">
            <label for="tx-amount">Amount ($)</label>
            <input id="tx-amount" name="amount" type="number" min="0.01" step="0.01" inputmode="decimal" value="${formAmount}" placeholder="0.00" required>
          </div>
        </div>
        <div class="form-row">
          <div class="field">
            <label for="tx-type">Type</label>
            <select id="tx-type" name="type">
              <option value="expense"${formType === 'expense' ? ' selected' : ''}>Expense</option>
              <option value="income"${formType === 'income' ? ' selected' : ''}>Income</option>
            </select>
          </div>
          <div class="field">
            <label for="tx-category">Category</label>
            <select id="tx-category" name="category">${categoryOptions(formCategory, formType)}</select>
          </div>
        </div>
        <div class="field">
          <label for="tx-note">What was it?</label>
          <input id="tx-note" name="note" type="text" maxlength="120" value="${escapeHtml(formNote)}" placeholder="e.g. Greenmart weekly shop" required>
        </div>
        <div class="btn-row">
          <button class="btn gold" type="submit">${editing ? 'Save changes' : 'Add transaction'}</button>
          ${editing ? '<button class="btn ghost" type="button" id="tx-cancel">Cancel</button>' : ''}
        </div>
      </form>
    </div>

    <div class="card">
      <h2>Find it</h2>
      <form id="tx-filters">
        <div class="field">
          <label for="filter-q">Search</label>
          <input id="filter-q" type="search" value="${escapeHtml(filter.q)}" placeholder="Shop, note or category">
        </div>
        <div class="form-row">
          <div class="field">
            <label for="filter-type">Type</label>
            <select id="filter-type">
              <option value="all"${filter.type === 'all' ? ' selected' : ''}>All</option>
              <option value="expense"${filter.type === 'expense' ? ' selected' : ''}>Expenses</option>
              <option value="income"${filter.type === 'income' ? ' selected' : ''}>Income</option>
            </select>
          </div>
          <div class="field">
            <label for="filter-category">Category</label>
            <select id="filter-category">
              <option value="all">All categories</option>
              ${CATEGORIES.map((c) => `<option value="${c.id}"${filter.category === c.id ? ' selected' : ''}>${escapeHtml(c.name)}</option>`).join('')}
            </select>
          </div>
        </div>
        <div class="btn-row"><button class="btn" type="submit">Apply filters</button></div>
      </form>
      <p class="muted small" style="margin-top:0.8rem;">Everything is saved in this browser only — nothing is sent anywhere.</p>
    </div>
  </div>

  <section class="card" style="margin-top:1rem;">
    <h2>All transactions</h2>
    ${list.length === 0 ? '<p class="empty">Nothing matches. Loosen the filters, or add the month\'s first transaction above.</p>' : `
    <div style="overflow-x:auto;">
    <table>
      <thead><tr><th>Date</th><th>What</th><th class="hide-phone">Type</th><th class="num">Amount</th><th></th></tr></thead>
      <tbody>${list.map(rowHtml).join('')}</tbody>
    </table>
    </div>`}
  </section>`;
}

export function mount(app, month, rerender) {
  const form = app.querySelector('#tx-form');
  const typeSelect = app.querySelector('#tx-type');
  const catSelect = app.querySelector('#tx-category');
  typeSelect.addEventListener('change', () => {
    const list = typeSelect.value === 'income' ? INCOME_CATEGORIES : CATEGORIES;
    const keep = list.some((c) => c.id === catSelect.value) ? catSelect.value : list[0].id;
    catSelect.innerHTML = list.map((c) => `<option value="${c.id}"${c.id === keep ? ' selected' : ''}>${escapeHtml(c.name)}</option>`).join('');
  });
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const amount = Math.round(Number(data.get('amount')) * 100);
    if (!Number.isFinite(amount) || amount <= 0) {
      notice = 'Enter an amount above $0.';
      rerender();
      return;
    }
    const tx = {
      date: String(data.get('date')),
      type: String(data.get('type')),
      category: String(data.get('category')),
      note: String(data.get('note')).trim(),
      amount,
    };
    if (editingId) {
      updateTransaction(editingId, tx);
      notice = `Updated “${tx.note}” — ${money(tx.amount)}.`;
      editingId = null;
    } else {
      addTransaction(tx);
      notice = `Added “${tx.note}” — ${money(tx.amount)}.`;
    }
    rerender();
  });
  const cancel = app.querySelector('#tx-cancel');
  if (cancel) cancel.addEventListener('click', () => { editingId = null; rerender(); });

  const filters = app.querySelector('#tx-filters');
  filters.addEventListener('submit', (event) => {
    event.preventDefault();
    filter = {
      q: app.querySelector('#filter-q').value.trim(),
      type: app.querySelector('#filter-type').value,
      category: app.querySelector('#filter-category').value,
    };
    rerender();
  });

  app.querySelectorAll('[data-edit]').forEach((btn) => {
    btn.addEventListener('click', () => {
      editingId = btn.getAttribute('data-edit');
      notice = '';
      rerender();
      const target = app.querySelector('#tx-form');
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
  app.querySelectorAll('[data-delete]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const tx = allTransactions().find((t) => t.id === btn.getAttribute('data-delete'));
      if (tx && window.confirm(`Delete “${tx.note}” (${money(tx.amount)})?`)) {
        deleteTransaction(tx.id);
        if (editingId === tx.id) editingId = null;
        notice = `Deleted “${tx.note}”.`;
        rerender();
      }
    });
  });
}
