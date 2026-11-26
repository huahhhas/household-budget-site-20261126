// Small SVG chart builders — no library, just strings. Every chart is drawn from
// the household's own numbers, with real labels, so it reads at a glance.

import { money } from './format.js';

export function horizontalBars(rows, options = {}) {
  // rows: [{ label, value, color, note }]. Draws a labelled bar per row.
  const max = Math.max(...rows.map((r) => r.value), 1);
  const width = options.width || 640;
  const rowH = 34;
  const height = rows.length * rowH + 8;
  const labelW = 150;
  const valueW = 90;
  const barW = width - labelW - valueW - 16;
  let body = '';
  rows.forEach((r, i) => {
    const y = 8 + i * rowH;
    const w = Math.max(2, Math.round((r.value / max) * barW));
    body += `<text x="0" y="${y + 15}" font-size="13" fill="#22302a">${escapeSvg(r.label)}</text>`;
    body += `<rect x="${labelW}" y="${y + 2}" width="${w}" height="18" rx="4" fill="${r.color}" />`;
    body += `<text x="${labelW + barW + 8}" y="${y + 15}" font-size="13" font-weight="700" fill="#22302a">${money(r.value)}</text>`;
  });
  return `<svg viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img" aria-label="Spending by category chart">${body}</svg>`;
}

export function donut(segments, options = {}) {
  // segments: [{ label, value, color }]. Returns an SVG donut with a centre total.
  const total = segments.reduce((s, x) => s + x.value, 0);
  const size = options.size || 220;
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 14;
  const inner = r - 34;
  let offset = 0;
  let paths = '';
  for (const seg of segments) {
    if (seg.value <= 0) continue;
    const frac = seg.value / total;
    const a0 = offset * Math.PI * 2 - Math.PI / 2;
    const a1 = (offset + frac) * Math.PI * 2 - Math.PI / 2;
    const large = frac > 0.5 ? 1 : 0;
    const x0 = cx + r * Math.cos(a0);
    const y0 = cy + r * Math.sin(a0);
    const x1 = cx + r * Math.cos(a1);
    const y1 = cy + r * Math.sin(a1);
    const xi1 = cx + inner * Math.cos(a1);
    const yi1 = cy + inner * Math.sin(a1);
    const xi0 = cx + inner * Math.cos(a0);
    const yi0 = cy + inner * Math.sin(a0);
    paths += `<path d="M ${x0.toFixed(1)} ${y0.toFixed(1)} A ${r} ${r} 0 ${large} 1 ${x1.toFixed(1)} ${y1.toFixed(1)} L ${xi1.toFixed(1)} ${yi1.toFixed(1)} A ${inner} ${inner} 0 ${large} 0 ${xi0.toFixed(1)} ${yi0.toFixed(1)} Z" fill="${seg.color}"><title>${escapeSvg(seg.label)}: ${money(seg.value)}</title></path>`;
    offset += frac;
  }
  return `<svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" role="img" aria-label="Spending share by category">${paths}<text x="${cx}" y="${cy - 4}" text-anchor="middle" font-size="13" fill="#66756d">Total spent</text><text x="${cx}" y="${cy + 18}" text-anchor="middle" font-size="18" font-weight="800" fill="#22302a">${money(total)}</text></svg>`;
}

export function monthlyBars(months, options = {}) {
  // months: [{ month, income, expenses }] with short labels supplied by caller.
  const width = options.width || 640;
  const height = 240;
  const max = Math.max(...months.flatMap((m) => [m.income, m.expenses]), 1);
  const n = months.length;
  const slot = width / n;
  const barW = Math.min(34, slot / 3);
  const base = height - 30;
  let body = '';
  months.forEach((m, i) => {
    const cx = slot * i + slot / 2;
    const ih = Math.round((m.income / max) * (height - 60));
    const eh = Math.round((m.expenses / max) * (height - 60));
    body += `<rect x="${(cx - barW - 3).toFixed(1)}" y="${base - ih}" width="${barW}" height="${ih}" rx="3" fill="#2e7d4f"><title>Income ${m.label}: ${money(m.income)}</title></rect>`;
    body += `<rect x="${(cx + 3).toFixed(1)}" y="${base - eh}" width="${barW}" height="${eh}" rx="3" fill="#b3372e"><title>Spending ${m.label}: ${money(m.expenses)}</title></rect>`;
    body += `<text x="${cx}" y="${height - 10}" text-anchor="middle" font-size="12" fill="#66756d">${escapeSvg(m.label)}</text>`;
  });
  body += `<line x1="0" y1="${base}" x2="${width}" y2="${base}" stroke="#dfe6df" />`;
  return `<svg viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img" aria-label="Income and spending by month">${body}</svg>`;
}

function escapeSvg(text) {
  return String(text)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}
