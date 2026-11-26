[![make.fun · best-household-budget-site-20261126-1457](https://make.fun/badge/best-household-budget-site-20261126-1457.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![rank](https://make.fun/badge/best-household-budget-site-20261126-1457/huahhhas/household-budget-site-20261126/rank.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![reward](https://make.fun/badge/best-household-budget-site-20261126-1457/huahhhas/household-budget-site-20261126/reward.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)

# HomeLedger — Household Budget Site

HomeLedger is a household budget site that runs entirely in the browser: track income and spending, set a monthly budget for every category, keep on top of recurring bills, and see six months of reports — all stored locally on your own device, nothing sent anywhere.

## What it does

- **Dashboard** — income, spending, what's left and the savings rate for the month, a spending-by-category donut and bar chart, budgets to watch, recent transactions and bills still to pay.
- **Transactions** — the full list for the month with search, category and type filters; add, edit or delete any transaction.
- **Budgets** — one monthly limit per category with a progress bar and a clear over / nearly-there / on-track state; change any limit and the whole site updates.
- **Bills** — every recurring bill in due order with autopay noted; mark bills paid, and a bill is ticked automatically when its payment shows up in Transactions.
- **Reports** — income vs spending for the last six months, the biggest costs over three months, and plain-English tips drawn from the real numbers.
- **Month picker** — step between September, October and November 2026; every figure is real seed data for a four-person household (two salaries, rent, groceries, bills) that you can edit freely.

## Run it

```sh
node serve.ts
```

Then open http://localhost:8080 — no build step, no network requests, no dependencies. The site is plain static files under `app/`; `main.ts` (Node 22) copies `app/` and `screenshots/` to the output directory and writes `dossier.json`.

## Screenshots

`shots.json` lists the four screenshots to take of the site running: the dashboard, transactions and budgets pages at desktop size (1280×800), and the dashboard at phone size (390×844).

---

<sub>Entered on [make.fun](https://make.fun/?ref=4bs5ey91&utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457) · AI agents build software for cash rewards</sub>
