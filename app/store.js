// The store: loads the household's data, keeps it in local storage, and answers
// every question the views ask — totals for a month, spending by category, which
// bills are due, and the last six months for Reports. Nothing here touches the
// network; the data never leaves the browser.

import { BILLS, CATEGORIES, MONTHLY_BUDGETS, SEED_TRANSACTIONS } from './data.js';
import { monthKey, shiftMonth } from './format.js';

const STORAGE_KEY = 'homeledger-v1';
export const CURRENT_MONTH = '2026-11';
export const FIRST_MONTH = '2026-09';

function defaultState() {
  return {
    transactions: SEED_TRANSACTIONS.map((t) => ({ ...t })),
    budgets: { ...MONTHLY_BUDGETS },
    billsPaid: {}, // "2026-11:bill-rent" -> true
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed.transactions) || typeof parsed.budgets !== 'object') return defaultState();
    return { transactions: parsed.transactions, budgets: parsed.budgets, billsPaid: parsed.billsPaid || {} };
  } catch {
    return defaultState();
  }
}

export const state = loadState();

export function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage full or unavailable: the site still works for this visit.
  }
}

export function resetToSeed() {
  const fresh = defaultState();
  state.transactions = fresh.transactions;
  state.budgets = fresh.budgets;
  state.billsPaid = fresh.billsPaid;
  save();
}

export function categoryById(id) {
  return CATEGORIES.find((c) => c.id === id) || { id, name: 'Other', color: '#66756d' };
}

export function transactionsFor(month) {
  return state.transactions
    .filter((t) => t.date.startsWith(month))
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

export function allTransactions() {
  return [...state.transactions].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

export function monthTotals(month) {
  let income = 0;
  let expenses = 0;
  for (const t of state.transactions) {
    if (!t.date.startsWith(month)) continue;
    if (t.type === 'income') income += t.amount;
    else expenses += t.amount;
  }
  return { income, expenses, remaining: income - expenses, savingsRate: income > 0 ? Math.round(((income - expenses) / income) * 100) : 0 };
}

export function spendingByCategory(month) {
  const byId = {};
  for (const c of CATEGORIES) byId[c.id] = 0;
  for (const t of state.transactions) {
    if (t.type !== 'expense' || !t.date.startsWith(month)) continue;
    byId[t.category] = (byId[t.category] || 0) + t.amount;
  }
  return CATEGORIES.map((c) => ({ ...c, spent: byId[c.id] || 0, budget: state.budgets[c.id] || 0 }))
    .filter((c) => c.spent > 0 || c.budget > 0)
    .sort((a, b) => b.spent - a.spent);
}

export function budgetStatus(month) {
  return spendingByCategory(month).map((c) => {
    const pct = c.budget > 0 ? Math.round((c.spent / c.budget) * 100) : 0;
    const status = c.spent > c.budget ? 'over' : pct >= 80 ? 'near' : 'ok';
    return { ...c, pct, status };
  });
}

export function totalBudgeted() {
  return Object.values(state.budgets).reduce((sum, v) => sum + v, 0);
}

export function addTransaction(tx) {
  const id = `t-${Date.now().toString(36)}-${Math.floor(Math.random() * 10000)}`;
  state.transactions.push({ id, ...tx });
  save();
  return id;
}

export function updateTransaction(id, patch) {
  const tx = state.transactions.find((t) => t.id === id);
  if (!tx) return false;
  Object.assign(tx, patch);
  save();
  return true;
}

export function deleteTransaction(id) {
  const index = state.transactions.findIndex((t) => t.id === id);
  if (index === -1) return false;
  state.transactions.splice(index, 1);
  save();
  return true;
}

export function setBudget(categoryId, cents) {
  state.budgets[categoryId] = Math.max(0, Math.round(cents));
  save();
}

export function isBillPaid(month, billId) {
  return Boolean(state.billsPaid[`${month}:${billId}`]);
}

export function toggleBillPaid(month, billId) {
  const key = `${month}:${billId}`;
  state.billsPaid[key] = !state.billsPaid[key];
  if (!state.billsPaid[key]) delete state.billsPaid[key];
  save();
}

export function billsFor(month, todayDay) {
  // A bill is paid if the household marked it paid, or if a transaction in the
  // month matches its name — rent, power and the rest are in the seed data.
  const paidByTransaction = new Set();
  for (const t of state.transactions) {
    if (t.type !== 'expense' || !t.date.startsWith(month)) continue;
    for (const b of BILLS) {
      if (t.note === b.name) paidByTransaction.add(b.id);
    }
  }
  return BILLS.map((b) => {
    const paid = isBillPaid(month, b.id) || paidByTransaction.has(b.id);
    const status = paid ? 'paid' : b.day <= todayDay ? 'due' : 'soon';
    return { ...b, paid, status };
  });
}

export function lastSixMonths() {
  const months = [];
  let key = CURRENT_MONTH;
  for (let i = 0; i < 6; i++) {
    months.unshift(key);
    key = shiftMonth(key, -1);
  }
  return months.map((m) => ({ month: m, ...monthTotals(m) }));
}

export function monthKeyNow() {
  const now = new Date();
  return monthKey(now.getFullYear(), now.getMonth());
}
