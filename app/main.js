// HomeLedger boot and router. Hash routes: #/ dashboard, #/transactions,
// #/budgets, #/bills, #/reports. The month picker steps between September and
// November 2026, the months the seed data covers.

import { CURRENT_MONTH, FIRST_MONTH } from './store.js';
import { monthLabel, shiftMonth } from './format.js';
import * as Dashboard from './views.js';
import * as Transactions from './transactions.js';
import * as Budgets from './budgets.js';
import * as Bills from './bills.js';
import * as Reports from './reports.js';

const PAGES = {
  dashboard: Dashboard,
  transactions: Transactions,
  budgets: Budgets,
  bills: Bills,
  reports: Reports,
};

const app = document.getElementById('app');
const monthLabelEl = document.getElementById('month-label');
const prevBtn = document.getElementById('prev-month');
const nextBtn = document.getElementById('next-month');

let month = CURRENT_MONTH;

function route() {
  const hash = window.location.hash || '#/';
  const name = hash.replace(/^#\/?/, '').split('/')[0] || 'dashboard';
  return PAGES[name] ? name : 'dashboard';
}

function render() {
  const name = route();
  const page = PAGES[name];
  monthLabelEl.textContent = monthLabel(month);
  prevBtn.disabled = month <= FIRST_MONTH;
  nextBtn.disabled = month >= CURRENT_MONTH;
  document.querySelectorAll('.mainnav a').forEach((a) => {
    a.classList.toggle('active', a.getAttribute('data-nav') === name);
  });
  app.innerHTML = page.render(month);
  const rerender = () => render();
  page.mount(app, month, rerender);
}

prevBtn.addEventListener('click', () => {
  month = shiftMonth(month, -1);
  render();
});
nextBtn.addEventListener('click', () => {
  month = shiftMonth(month, 1);
  render();
});
window.addEventListener('hashchange', render);

render();
