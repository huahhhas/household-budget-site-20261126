// Seed data for HomeLedger: the categories a household budgets by, the monthly
// budget for each one, the recurring bills, and real-looking transactions for
// September, October and November 2026. Amounts are in cents. On first run the
// store copies this into local storage; after that the household's own edits win.

export const CATEGORIES = [
  { id: 'housing', name: 'Housing', color: '#1d4d3b' },
  { id: 'groceries', name: 'Groceries', color: '#2e7d4f' },
  { id: 'utilities', name: 'Utilities', color: '#2f6f8f' },
  { id: 'transport', name: 'Transport', color: '#c98a2b' },
  { id: 'dining', name: 'Dining out', color: '#b3372e' },
  { id: 'health', name: 'Health', color: '#7a5ea3' },
  { id: 'kids', name: 'Kids & school', color: '#c25e8a' },
  { id: 'fun', name: 'Fun & leisure', color: '#4a7a8c' },
  { id: 'household', name: 'Household', color: '#8a6d3b' },
  { id: 'savings', name: 'Savings', color: '#3f7a5e' },
  { id: 'other', name: 'Other', color: '#66756d' },
];

export const INCOME_CATEGORIES = [
  { id: 'paycheck', name: 'Paycheck' },
  { id: 'freelance', name: 'Freelance' },
  { id: 'refund', name: 'Refund' },
  { id: 'other-income', name: 'Other income' },
];

export const MONTHLY_BUDGETS = {
  housing: 185000,
  groceries: 72000,
  utilities: 31000,
  transport: 28000,
  dining: 24000,
  health: 15000,
  kids: 20000,
  fun: 18000,
  household: 12000,
  savings: 80000,
  other: 10000,
};

export const BILLS = [
  { id: 'bill-rent', name: 'Rent — Maple Court Apt 4B', amount: 185000, day: 1, category: 'housing', autopay: true },
  { id: 'bill-electric', name: 'City Power & Light', amount: 14200, day: 8, category: 'utilities', autopay: true },
  { id: 'bill-water', name: 'Water & sewer', amount: 6800, day: 12, category: 'utilities', autopay: false },
  { id: 'bill-internet', name: 'Northlink internet 500 Mb', amount: 7900, day: 15, category: 'utilities', autopay: true },
  { id: 'bill-phone', name: 'Mobile — two lines', amount: 11200, day: 18, category: 'utilities', autopay: true },
  { id: 'bill-insurance', name: 'Home & car insurance', amount: 23600, day: 22, category: 'transport', autopay: true },
  { id: 'bill-gym', name: 'Family gym membership', amount: 8900, day: 5, category: 'health', autopay: true },
  { id: 'bill-streaming', name: 'Streaming bundle', amount: 2490, day: 27, category: 'fun', autopay: true },
];

// type: "expense" | "income". November is the current month and is still open;
// September and October are complete, so Reports has something to compare.
export const SEED_TRANSACTIONS = [
  // ---- November 2026 ----
  { id: 't-nov-01', date: '2026-11-01', type: 'income', category: 'paycheck', note: 'Maya — salary, Nov 1', amount: 342000 },
  { id: 't-nov-02', date: '2026-11-01', type: 'expense', category: 'housing', note: 'Rent — Maple Court Apt 4B', amount: 185000 },
  { id: 't-nov-03', date: '2026-11-02', type: 'expense', category: 'groceries', note: 'Greenmart weekly shop', amount: 14860 },
  { id: 't-nov-04', date: '2026-11-03', type: 'expense', category: 'transport', note: 'Fuel — Shell, 42 L', amount: 6120 },
  { id: 't-nov-05', date: '2026-11-04', type: 'expense', category: 'dining', note: 'Pizza night with the kids', amount: 3840 },
  { id: 't-nov-06', date: '2026-11-05', type: 'expense', category: 'health', note: 'Family gym membership', amount: 8900 },
  { id: 't-nov-07', date: '2026-11-06', type: 'expense', category: 'groceries', note: 'Farmers market — veg & eggs', amount: 4215 },
  { id: 't-nov-08', date: '2026-11-07', type: 'expense', category: 'kids', note: 'School lunch money — Leo & June', amount: 6000 },
  { id: 't-nov-09', date: '2026-11-08', type: 'expense', category: 'utilities', note: 'City Power & Light', amount: 14200 },
  { id: 't-nov-10', date: '2026-11-09', type: 'expense', category: 'household', note: 'Laundry detergent & paper goods', amount: 2875 },
  { id: 't-nov-11', date: '2026-11-10', type: 'expense', category: 'groceries', note: 'Greenmart weekly shop', amount: 16230 },
  { id: 't-nov-12', date: '2026-11-11', type: 'expense', category: 'fun', note: 'Cinema — family film night', amount: 5400 },
  { id: 't-nov-13', date: '2026-11-12', type: 'expense', category: 'transport', note: 'Bus passes — November', amount: 9800 },
  { id: 't-nov-14', date: '2026-11-13', type: 'expense', category: 'dining', note: 'Lunch with Sam at the deli', amount: 2650 },
  { id: 't-nov-15', date: '2026-11-14', type: 'income', category: 'freelance', note: 'Sam — weekend design job', amount: 45000 },
  { id: 't-nov-16', date: '2026-11-14', type: 'expense', category: 'groceries', note: 'Costco run — pantry stock-up', amount: 21480 },
  { id: 't-nov-17', date: '2026-11-15', type: 'expense', category: 'utilities', note: 'Northlink internet 500 Mb', amount: 7900 },
  { id: 't-nov-18', date: '2026-11-16', type: 'expense', category: 'health', note: 'Pharmacy — allergy meds', amount: 2340 },
  { id: 't-nov-19', date: '2026-11-17', type: 'expense', category: 'kids', note: 'June — new school shoes', amount: 6800 },
  { id: 't-nov-20', date: '2026-11-18', type: 'expense', category: 'utilities', note: 'Mobile — two lines', amount: 11200 },
  { id: 't-nov-21', date: '2026-11-18', type: 'expense', category: 'groceries', note: 'Greenmart midweek top-up', amount: 7390 },
  { id: 't-nov-22', date: '2026-11-19', type: 'expense', category: 'dining', note: 'Takeaway Thai — busy Thursday', amount: 4290 },
  { id: 't-nov-23', date: '2026-11-20', type: 'expense', category: 'transport', note: 'Fuel — Shell, 38 L', amount: 5540 },
  { id: 't-nov-24', date: '2026-11-21', type: 'expense', category: 'household', note: 'Light bulbs & a new mop', amount: 1980 },
  { id: 't-nov-25', date: '2026-11-22', type: 'expense', category: 'fun', note: 'Board game for family night', amount: 3495 },
  { id: 't-nov-26', date: '2026-11-23', type: 'expense', category: 'groceries', note: 'Greenmart weekly shop', amount: 13990 },
  { id: 't-nov-27', date: '2026-11-24', type: 'expense', category: 'kids', note: 'Leo — football club fees', amount: 4500 },
  { id: 't-nov-28', date: '2026-11-25', type: 'expense', category: 'other', note: 'Birthday gift for Grandma', amount: 3200 },
  { id: 't-nov-29', date: '2026-11-15', type: 'income', category: 'paycheck', note: 'Sam — salary, Nov 15', amount: 298000 },
  { id: 't-nov-30', date: '2026-11-26', type: 'expense', category: 'savings', note: 'Transfer to emergency fund', amount: 80000 },
  // ---- October 2026 ----
  { id: 't-oct-01', date: '2026-10-01', type: 'income', category: 'paycheck', note: 'Maya — salary, Oct 1', amount: 342000 },
  { id: 't-oct-02', date: '2026-10-01', type: 'expense', category: 'housing', note: 'Rent — Maple Court Apt 4B', amount: 185000 },
  { id: 't-oct-03', date: '2026-10-03', type: 'expense', category: 'groceries', note: 'Greenmart weekly shop', amount: 15120 },
  { id: 't-oct-04', date: '2026-10-05', type: 'expense', category: 'transport', note: 'Fuel — Shell, 44 L', amount: 6480 },
  { id: 't-oct-05', date: '2026-10-07', type: 'expense', category: 'dining', note: 'Anniversary dinner', amount: 9850 },
  { id: 't-oct-06', date: '2026-10-08', type: 'expense', category: 'utilities', note: 'City Power & Light', amount: 13850 },
  { id: 't-oct-07', date: '2026-10-10', type: 'expense', category: 'groceries', note: 'Greenmart weekly shop', amount: 14760 },
  { id: 't-oct-08', date: '2026-10-12', type: 'expense', category: 'kids', note: 'School trip — Leo', amount: 12000 },
  { id: 't-oct-09', date: '2026-10-14', type: 'expense', category: 'health', note: 'Dentist check-up — June', amount: 7500 },
  { id: 't-oct-10', date: '2026-10-15', type: 'income', category: 'paycheck', note: 'Sam — salary, Oct 15', amount: 298000 },
  { id: 't-oct-11', date: '2026-10-16', type: 'expense', category: 'groceries', note: 'Costco run', amount: 19840 },
  { id: 't-oct-12', date: '2026-10-18', type: 'expense', category: 'transport', note: 'Car service & oil change', amount: 18900 },
  { id: 't-oct-13', date: '2026-10-20', type: 'expense', category: 'fun', note: 'Pumpkin patch & hayride', amount: 6200 },
  { id: 't-oct-14', date: '2026-10-22', type: 'expense', category: 'utilities', note: 'Water & sewer', amount: 6540 },
  { id: 't-oct-15', date: '2026-10-24', type: 'expense', category: 'groceries', note: 'Greenmart weekly shop', amount: 15530 },
  { id: 't-oct-16', date: '2026-10-25', type: 'expense', category: 'dining', note: 'Takeaway pizza', amount: 3690 },
  { id: 't-oct-17', date: '2026-10-27', type: 'expense', category: 'household', note: 'Winter curtains', amount: 8400 },
  { id: 't-oct-18', date: '2026-10-28', type: 'expense', category: 'kids', note: 'Halloween costumes', amount: 7650 },
  { id: 't-oct-19', date: '2026-10-30', type: 'expense', category: 'groceries', note: 'Greenmart weekly shop', amount: 14110 },
  { id: 't-oct-20', date: '2026-10-31', type: 'expense', category: 'savings', note: 'Transfer to emergency fund', amount: 80000 },
  { id: 't-oct-21', date: '2026-10-15', type: 'income', category: 'refund', note: 'Refund — returned jacket', amount: 8990 },
  // ---- September 2026 ----
  { id: 't-sep-01', date: '2026-09-01', type: 'income', category: 'paycheck', note: 'Maya — salary, Sep 1', amount: 342000 },
  { id: 't-sep-02', date: '2026-09-01', type: 'expense', category: 'housing', note: 'Rent — Maple Court Apt 4B', amount: 185000 },
  { id: 't-sep-03', date: '2026-09-05', type: 'expense', category: 'groceries', note: 'Greenmart weekly shop', amount: 14980 },
  { id: 't-sep-04', date: '2026-09-07', type: 'expense', category: 'kids', note: 'Back-to-school supplies', amount: 13200 },
  { id: 't-sep-05', date: '2026-09-09', type: 'expense', category: 'transport', note: 'Fuel — Shell, 40 L', amount: 5960 },
  { id: 't-sep-06', date: '2026-09-11', type: 'expense', category: 'dining', note: 'Dinner out — first week of school', amount: 5420 },
  { id: 't-sep-07', date: '2026-09-13', type: 'expense', category: 'groceries', note: 'Greenmart weekly shop', amount: 15890 },
  { id: 't-sep-08', date: '2026-09-15', type: 'income', category: 'paycheck', note: 'Sam — salary, Sep 15', amount: 298000 },
  { id: 't-sep-09', date: '2026-09-17', type: 'expense', category: 'utilities', note: 'City Power & Light', amount: 12980 },
  { id: 't-sep-10', date: '2026-09-19', type: 'expense', category: 'household', note: 'New vacuum bags & filters', amount: 2340 },
  { id: 't-sep-11', date: '2026-09-21', type: 'expense', category: 'groceries', note: 'Greenmart weekly shop', amount: 14650 },
  { id: 't-sep-12', date: '2026-09-23', type: 'expense', category: 'health', note: 'Eye test — Sam', amount: 4500 },
  { id: 't-sep-13', date: '2026-09-25', type: 'expense', category: 'fun', note: 'Mini-golf afternoon', amount: 4100 },
  { id: 't-sep-14', date: '2026-09-27', type: 'expense', category: 'groceries', note: 'Greenmart weekly shop', amount: 15210 },
  { id: 't-sep-15', date: '2026-09-29', type: 'expense', category: 'transport', note: 'Fuel — Shell, 41 L', amount: 6120 },
  { id: 't-sep-16', date: '2026-09-30', type: 'expense', category: 'savings', note: 'Transfer to emergency fund', amount: 80000 },
];

export const TIPS = [
  { title: 'Groceries are your swing category', body: 'Groceries are 17% of November spending so far and the easiest place to find $50 a month: plan the week\'s meals before the shop and the top-ups shrink.' },
  { title: 'Dining out is on pace to beat its budget', body: 'At $107.80 of a $240 budget with four days left, dining is fine — but one more takeaway night puts it over. Cook the Thursday meal from the pantry.' },
  { title: 'Your emergency fund is on track', body: 'Three straight $800 transfers. At this pace the fund covers three months of rent by February — keep the transfer on payday so you never see the money.' },
];
