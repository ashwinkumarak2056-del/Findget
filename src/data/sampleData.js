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
  { category: 'Food', limit: 40000, spent: 25600 },
  { category: 'Transport', limit: 16000, spent: 6800 },
  { category: 'Shopping', limit: 24000, spent: 12000 },
  { category: 'Entertainment', limit: 8000, spent: 3600 },
  { category: 'Utilities', limit: 20000, spent: 16800 },
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
  theme: 'dark', // 'dark' | 'light'
  userMode: 'personal', // 'personal' | 'commercial'
  currency: 'INR',
  isAuthenticated: false
};
