// Money and date formatting for HomeLedger. All amounts are US dollars.

export function money(cents) {
  const dollars = cents / 100;
  return dollars.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

export function moneySigned(cents) {
  return (cents < 0 ? '-' : '') + money(Math.abs(cents));
}

export function monthKey(year, month) {
  // month is 0-based; key looks like "2026-11".
  return `${year}-${String(month + 1).padStart(2, '0')}`;
}

export function monthLabel(key) {
  const [y, m] = key.split('-').map(Number);
  return new Date(y, m - 1, 1).toLocaleString('en-US', { month: 'long', year: 'numeric' });
}

export function shortMonthLabel(key) {
  const [y, m] = key.split('-').map(Number);
  return new Date(y, m - 1, 1).toLocaleString('en-US', { month: 'short' });
}

export function shiftMonth(key, delta) {
  const [y, m] = key.split('-').map(Number);
  const d = new Date(y, m - 1 + delta, 1);
  return monthKey(d.getFullYear(), d.getMonth());
}

export function dayLabel(isoDate) {
  const [y, m, d] = isoDate.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function escapeHtml(text) {
  return String(text)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}
