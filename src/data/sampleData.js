// ── Personal demo data ──
export const sampleExpenses = [
  { id: '1', date: '2026-04-20', merchant: 'Whole Foods Market', amount: 12000, category: 'Food', paymentMode: 'Credit Card', gst: 600 },
  { id: '2', date: '2026-04-21', merchant: 'Uber', amount: 2000, category: 'Transport', paymentMode: 'UPI', gst: 100 },
  { id: '3', date: '2026-04-22', merchant: 'Netflix', amount: 1299, category: 'Entertainment', paymentMode: 'Credit Card', gst: 233 },
  { id: '4', date: '2026-04-23', merchant: 'Amazon', amount: 7500, category: 'Shopping', paymentMode: 'Debit Card', gst: 1350 },
  { id: '5', date: '2026-04-24', merchant: 'Electricity Bill', amount: 9600, category: 'Utilities', paymentMode: 'Bank Transfer', gst: 0 },
  { id: '6', date: '2026-04-25', merchant: 'Starbucks', amount: 650, category: 'Food', paymentMode: 'Cash', gst: 32 },
  { id: '7', date: '2026-04-26', merchant: 'Apollo Pharmacy', amount: 12500, category: 'Healthcare', paymentMode: 'Credit Card', gst: 0 },
];

export const sampleBudgets = [
  { category: 'Food', limit: 8000, spent: 6200 },
  { category: 'Transport', limit: 4000, spent: 2800 },
  { category: 'Shopping', limit: 6000, spent: 5100 },
  { category: 'Entertainment', limit: 3000, spent: 1800 },
  { category: 'Utilities', limit: 5000, spent: 4200 },
];

// ── Commercial demo data ──
export const commercialExpenses = [
  { id: 'C1', date: '2026-04-10', merchant: 'TechCorp Supplies', amount: 125000, category: 'Hardware', paymentMode: 'Bank Transfer', gst: 22500 },
  { id: 'C2', date: '2026-04-12', merchant: 'AWS Cloud Services', amount: 45000, category: 'Cloud & IT', paymentMode: 'Credit Card', gst: 8100 },
  { id: 'C3', date: '2026-04-15', merchant: 'Office Space Ltd', amount: 80000, category: 'Rent', paymentMode: 'Bank Transfer', gst: 14400 },
  { id: 'C4', date: '2026-04-18', merchant: 'Marketing Solutions', amount: 35000, category: 'Marketing', paymentMode: 'Credit Card', gst: 6300 },
  { id: 'C5', date: '2026-04-20', merchant: 'Employee Benefits Co', amount: 60000, category: 'Payroll', paymentMode: 'Bank Transfer', gst: 0 },
  { id: 'C6', date: '2026-04-22', merchant: 'Legal Advisors LLP', amount: 28000, category: 'Services', paymentMode: 'Bank Transfer', gst: 5040 },
];

export const commercialBudgets = [
  { category: 'Hardware', limit: 60000, spent: 45000 },
  { category: 'Cloud & IT', limit: 40000, spent: 35000 },
  { category: 'Rent', limit: 50000, spent: 50000 },
  { category: 'Marketing', limit: 35000, spent: 22000 },
  { category: 'Payroll', limit: 40000, spent: 38000 },
  { category: 'Services', limit: 25000, spent: 18000 },
];

export const sampleInvoices = [
  { id: 'INV-001', vendor: 'TechCorp Supplies', date: '2026-04-10', amount: 360000, status: 'Paid', gst: 64800 },
  { id: 'INV-002', vendor: 'Office Space Ltd', date: '2026-04-15', amount: 160000, status: 'Pending', gst: 28800 },
  { id: 'INV-003', vendor: 'Marketing Solutions', date: '2026-04-18', amount: 96000, status: 'Overdue', gst: 17280 },
];

export const sampleVendors = [
  { id: 'V1', name: 'TechCorp Supplies', totalSpent: 1200000, category: 'Hardware' },
  { id: 'V2', name: 'Office Space Ltd', totalSpent: 1920000, category: 'Rent' },
  { id: 'V3', name: 'Marketing Solutions', totalSpent: 640000, category: 'Services' },
];

export const initialSettings = {
  theme: 'dark',
  currency: 'INR',
  notifications: true,
  isAuthenticated: false,
  userMode: null,
  profile: {
    name: 'Alex Mitchell',
    email: 'alex.mitchell@example.com',
    phone: '+1 (555) 123-4567',
    company: 'Budgify'
  },
  financialProfile: {
    personal: {
      fixedIncome: 50000,
      variableIncome: 10000,
      savingsGoal: 15000,
      precommittedExpenses: 15000
    },
    commercial: {
      monthlyRevenueTarget: 500000,
      operatingBudget: 350000,
      taxReservePercent: 18,
      precommittedExpenses: 100000
    }
  }
};
