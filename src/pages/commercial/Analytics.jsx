import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, TrendingDown, PieChart, Target, AlertTriangle, ArrowUpRight, ArrowDownRight, DollarSign, Activity } from 'lucide-react';
import GlassCard from '../../components/GlassCard';
import AnimatedCounter from '../../components/AnimatedCounter';
import { CustomBarChart, CustomPieChart, CustomLineChart } from '../../components/Charts';
import { useAppContext } from '../../context/AppContext';

const Analytics = () => {
  const { state } = useAppContext();
  const { expenses, budgets, invoices, vendors, settings } = state;
  const financialProfile = settings.financialProfile?.commercial || null;

  const revenue = financialProfile?.monthlyRevenueTarget || 500000;
  const operatingBudget = financialProfile?.operatingBudget || 350000;
  const precommitted = financialProfile?.precommittedExpenses || 100000;
  const taxReserve = financialProfile?.taxReservePercent || 18;

  const totalExpenses = expenses.reduce((a, e) => a + e.amount, 0);
  const totalBudgeted = budgets.reduce((a, b) => a + b.limit, 0);
  const totalSpent = budgets.reduce((a, b) => a + b.spent, 0);
  const totalGST = expenses.reduce((a, e) => a + (e.gst || 0), 0);
  const taxReserved = Math.round(revenue * (taxReserve / 100));
  const netProfit = revenue - totalExpenses - taxReserved;
  const profitMargin = revenue > 0 ? ((netProfit / revenue) * 100).toFixed(1) : 0;
  const burnRate = totalExpenses;
  const runway = netProfit > 0 ? Math.round(revenue / burnRate) : 0;

  // ── Category Expense Breakdown ──
  const categoryBreakdown = useMemo(() => {
    const map = {};
    expenses.forEach(e => {
      map[e.category] = (map[e.category] || 0) + e.amount;
    });
    return Object.entries(map)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [expenses]);

  // ── Monthly Trend (simulated quarters) ──
  const quarterlyTrend = [
    { name: 'Q1', revenue: revenue * 0.9, expenses: totalExpenses * 0.85, profit: (revenue * 0.9) - (totalExpenses * 0.85) },
    { name: 'Q2', revenue: revenue * 0.95, expenses: totalExpenses * 0.9, profit: (revenue * 0.95) - (totalExpenses * 0.9) },
    { name: 'Q3', revenue: revenue, expenses: totalExpenses * 0.95, profit: revenue - (totalExpenses * 0.95) },
    { name: 'Q4 (Current)', revenue: revenue, expenses: totalExpenses, profit: netProfit },
  ];

  // ── Budget Utilization ──
  const budgetUtilization = budgets.map(b => ({
    name: b.category.length > 10 ? b.category.substring(0, 10) + '..' : b.category,
    allocated: b.limit,
    spent: b.spent,
  }));

  // ── Invoice Status Breakdown ──
  const invoiceStatusData = useMemo(() => {
    const paid = invoices.filter(i => i.status === 'Paid').length;
    const pending = invoices.filter(i => i.status === 'Pending').length;
    const overdue = invoices.filter(i => i.status === 'Overdue').length;
    return [
      { name: 'Paid', value: paid },
      { name: 'Pending', value: pending },
      { name: 'Overdue', value: overdue },
    ].filter(d => d.value > 0);
  }, [invoices]);

  // ── Vendor Concentration Risk ──
  const totalVendorSpend = vendors.reduce((a, v) => a + v.totalSpent, 0);
  const vendorConcentration = vendors.map(v => ({
    name: v.name.length > 12 ? v.name.substring(0, 12) + '..' : v.name,
    value: v.totalSpent,
    percentage: totalVendorSpend > 0 ? ((v.totalSpent / totalVendorSpend) * 100).toFixed(1) : 0
  })).sort((a, b) => b.value - a.value);

  const topVendorShare = vendorConcentration.length > 0 ? vendorConcentration[0].percentage : 0;

  const fmt = (v) => v.toLocaleString('en-IN', { maximumFractionDigits: 0 });

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <h2 className="text-2xl font-bold mb-1">Enterprise Analytics</h2>
        <p className="text-[var(--text-muted)] text-sm">
          Revenue: ₹{fmt(revenue)} | Operating Budget: ₹{fmt(operatingBudget)} | Tax Reserve: {taxReserve}%
        </p>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <GlassCard delay={0.1} hover className="relative overflow-hidden">
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 bg-fin-primary/20 rounded-xl text-fin-primary"><DollarSign size={20} /></div>
            <p className="text-[var(--text-muted)] text-sm">Net Profit</p>
          </div>
          <h3 className={`text-2xl font-bold ${netProfit >= 0 ? 'text-fin-primary' : 'text-red-400'}`}>
            <AnimatedCounter value={netProfit} prefix="₹" decimals={0} />
          </h3>
          <p className="text-xs text-[var(--text-muted)] mt-1">Margin: {profitMargin}%</p>
        </GlassCard>

        <GlassCard delay={0.2} hover>
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 bg-red-500/20 rounded-xl text-red-400"><TrendingDown size={20} /></div>
            <p className="text-[var(--text-muted)] text-sm">Total Expenses</p>
          </div>
          <h3 className="text-2xl font-bold"><AnimatedCounter value={totalExpenses} prefix="₹" decimals={0} /></h3>
          <p className="text-xs text-[var(--text-muted)] mt-1">GST Input: ₹{fmt(totalGST)}</p>
        </GlassCard>

        <GlassCard delay={0.3} hover>
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 bg-yellow-500/20 rounded-xl text-yellow-400"><AlertTriangle size={20} /></div>
            <p className="text-[var(--text-muted)] text-sm">Tax Reserved</p>
          </div>
          <h3 className="text-2xl font-bold"><AnimatedCounter value={taxReserved} prefix="₹" decimals={0} /></h3>
          <p className="text-xs text-[var(--text-muted)] mt-1">{taxReserve}% of revenue</p>
        </GlassCard>

        <GlassCard delay={0.4} hover>
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 bg-blue-500/20 rounded-xl text-blue-400"><Activity size={20} /></div>
            <p className="text-[var(--text-muted)] text-sm">Burn Rate</p>
          </div>
          <h3 className="text-2xl font-bold">₹{(burnRate / 1000).toFixed(0)}K</h3>
          <p className="text-xs text-[var(--text-muted)] mt-1">Runway: ~{runway} months</p>
        </GlassCard>
      </div>

      {/* ── Revenue vs Expenses Trend + Expense Breakdown ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard className="lg:col-span-2 h-80 flex flex-col">
          <h3 className="font-bold mb-4 flex items-center">
            <TrendingUp size={20} className="mr-2 text-fin-primary" /> Revenue vs Expenses (Quarterly)
          </h3>
          <div className="flex-1">
            <CustomBarChart
              data={quarterlyTrend}
              bars={[
                { dataKey: 'revenue', color: '#22c55e', name: 'Revenue' },
                { dataKey: 'expenses', color: '#ef4444', name: 'Expenses' },
                { dataKey: 'profit', color: '#3b82f6', name: 'Profit' },
              ]}
            />
          </div>
        </GlassCard>

        <GlassCard className="h-80 flex flex-col">
          <h3 className="font-bold mb-4 flex items-center">
            <PieChart size={20} className="mr-2 text-purple-400" /> Expense Breakdown
          </h3>
          <div className="flex-1">
            <CustomPieChart data={categoryBreakdown} />
          </div>
        </GlassCard>
      </div>

      {/* ── Budget Utilization + Invoice Status ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard className="lg:col-span-2 h-80 flex flex-col">
          <h3 className="font-bold mb-4 flex items-center">
            <BarChart3 size={20} className="mr-2 text-blue-400" /> Budget Utilization
          </h3>
          <div className="flex-1">
            <CustomBarChart
              data={budgetUtilization}
              bars={[
                { dataKey: 'allocated', color: 'rgba(34, 197, 94, 0.3)', name: 'Allocated' },
                { dataKey: 'spent', color: '#22c55e', name: 'Spent' },
              ]}
            />
          </div>
        </GlassCard>

        <GlassCard className="h-80 flex flex-col">
          <h3 className="font-bold mb-4 flex items-center">
            <Target size={20} className="mr-2 text-yellow-400" /> Invoice Status
          </h3>
          <div className="flex-1">
            <CustomPieChart data={invoiceStatusData} />
          </div>
          <div className="flex justify-center space-x-4 mt-2 text-xs">
            <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-fin-primary mr-1"></span>Paid</span>
            <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-yellow-500 mr-1"></span>Pending</span>
            <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-red-500 mr-1"></span>Overdue</span>
          </div>
        </GlassCard>
      </div>

      {/* ── Vendor Concentration Risk ── */}
      <GlassCard>
        <h3 className="font-bold mb-4 flex items-center">
          <AlertTriangle size={20} className="mr-2 text-yellow-400" /> Vendor Concentration Risk
        </h3>
        <p className="text-xs text-[var(--text-muted)] mb-4">
          Top vendor accounts for {topVendorShare}% of total spend. 
          {Number(topVendorShare) > 40 
            ? ' ⚠️ High concentration risk — consider diversifying suppliers.' 
            : ' ✅ Healthy vendor distribution.'}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {vendorConcentration.map((v, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-black/10 dark:bg-white/5 border border-[var(--border-color)]">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-sm">{v.name}</span>
                <span className="text-xs font-bold text-fin-primary">{v.percentage}%</span>
              </div>
              <div className="w-full bg-black/20 rounded-full h-2 overflow-hidden">
                <div className="bg-fin-primary h-full rounded-full" style={{ width: `${v.percentage}%` }}></div>
              </div>
              <p className="text-xs text-[var(--text-muted)] mt-1">₹{fmt(v.value)}</p>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
};

export default Analytics;
