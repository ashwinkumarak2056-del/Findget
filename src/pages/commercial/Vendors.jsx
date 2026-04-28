import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, TrendingUp, AlertTriangle, Star, Search, ExternalLink, BarChart3 } from 'lucide-react';
import GlassCard from '../../components/GlassCard';
import { CustomBarChart } from '../../components/Charts';
import { useAppContext } from '../../context/AppContext';

const Vendors = () => {
  const { state } = useAppContext();
  const { vendors, invoices, expenses } = state;
  const [searchTerm, setSearchTerm] = useState('');

  const financialProfile = state.settings.financialProfile?.commercial || null;
  const operatingBudget = financialProfile?.operatingBudget || 350000;

  // Enrich vendors with computed metrics
  const enrichedVendors = vendors.map(v => {
    const vendorInvoices = invoices.filter(inv => inv.vendor === v.name);
    const paidInvoices = vendorInvoices.filter(inv => inv.status === 'Paid');
    const pendingInvoices = vendorInvoices.filter(inv => inv.status === 'Pending');
    const overdueInvoices = vendorInvoices.filter(inv => inv.status === 'Overdue');
    const totalInvoiceValue = vendorInvoices.reduce((a, inv) => a + inv.amount, 0);
    const shareOfBudget = operatingBudget > 0 ? ((v.totalSpent / (operatingBudget * 12)) * 100).toFixed(1) : 0;

    // Simple risk score
    let riskLevel = 'Low';
    if (overdueInvoices.length > 0) riskLevel = 'High';
    else if (pendingInvoices.length > 1) riskLevel = 'Medium';

    // Reliability score (0-5 stars)
    let reliability = 5;
    if (overdueInvoices.length > 0) reliability -= 2;
    if (pendingInvoices.length > 0) reliability -= 1;

    return {
      ...v,
      vendorInvoices,
      paidCount: paidInvoices.length,
      pendingCount: pendingInvoices.length,
      overdueCount: overdueInvoices.length,
      totalInvoiceValue,
      shareOfBudget,
      riskLevel,
      reliability: Math.max(1, reliability)
    };
  });

  const filteredVendors = enrichedVendors.filter(v =>
    v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Top vendors by spend for chart
  const spendChartData = enrichedVendors
    .sort((a, b) => b.totalSpent - a.totalSpent)
    .map(v => ({
      name: v.name.length > 12 ? v.name.substring(0, 12) + '..' : v.name,
      spent: v.totalSpent,
    }));

  // Summary stats
  const totalVendorSpend = vendors.reduce((a, v) => a + v.totalSpent, 0);
  const totalOverdue = enrichedVendors.reduce((a, v) => a + v.overdueCount, 0);
  const avgReliability = enrichedVendors.length > 0 
    ? (enrichedVendors.reduce((a, v) => a + v.reliability, 0) / enrichedVendors.length).toFixed(1) 
    : 0;

  const fmt = (v) => v.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
        <div>
          <h2 className="text-2xl font-bold mb-1">Vendor Management</h2>
          <p className="text-[var(--text-muted)] text-sm">Track vendor relationships, spending, and risk analysis</p>
        </div>
        <div className="relative mt-4 md:mt-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={18} />
          <input
            type="text"
            placeholder="Search vendors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 bg-black/5 dark:bg-white/5 border border-[var(--border-color)] rounded-full text-sm focus:outline-none focus:border-fin-primary w-64"
          />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <GlassCard delay={0.1} hover>
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-fin-primary/20 rounded-xl text-fin-primary"><Users size={20} /></div>
            <p className="text-[var(--text-muted)] text-sm">Total Vendors</p>
          </div>
          <h3 className="text-2xl font-bold">{vendors.length}</h3>
        </GlassCard>
        <GlassCard delay={0.2} hover>
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-blue-500/20 rounded-xl text-blue-400"><TrendingUp size={20} /></div>
            <p className="text-[var(--text-muted)] text-sm">Total Vendor Spend</p>
          </div>
          <h3 className="text-2xl font-bold">₹{(totalVendorSpend / 100000).toFixed(1)}L</h3>
        </GlassCard>
        <GlassCard delay={0.3} hover>
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-yellow-500/20 rounded-xl text-yellow-400"><AlertTriangle size={20} /></div>
            <p className="text-[var(--text-muted)] text-sm">Overdue Invoices</p>
          </div>
          <h3 className="text-2xl font-bold">{totalOverdue}</h3>
        </GlassCard>
        <GlassCard delay={0.4} hover>
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-purple-500/20 rounded-xl text-purple-400"><Star size={20} /></div>
            <p className="text-[var(--text-muted)] text-sm">Avg Reliability</p>
          </div>
          <h3 className="text-2xl font-bold">{avgReliability}/5</h3>
        </GlassCard>
      </div>

      {/* Spend Chart + Vendor List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard className="lg:col-span-1 h-80 flex flex-col">
          <h3 className="font-bold mb-4 flex items-center">
            <BarChart3 size={20} className="mr-2 text-fin-primary" /> Spend by Vendor
          </h3>
          <div className="flex-1">
            <CustomBarChart 
              data={spendChartData}
              bars={[{ dataKey: 'spent', color: '#22c55e', name: 'Total Spent' }]}
            />
          </div>
        </GlassCard>

        <GlassCard className="lg:col-span-2">
          <h3 className="font-bold mb-4">Vendor Directory</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border-color)]">
                  <th className="text-left py-3 px-2 text-[var(--text-muted)] font-medium">Vendor</th>
                  <th className="text-left py-3 px-2 text-[var(--text-muted)] font-medium">Category</th>
                  <th className="text-right py-3 px-2 text-[var(--text-muted)] font-medium">Total Spent</th>
                  <th className="text-center py-3 px-2 text-[var(--text-muted)] font-medium">Risk</th>
                  <th className="text-center py-3 px-2 text-[var(--text-muted)] font-medium">Rating</th>
                  <th className="text-center py-3 px-2 text-[var(--text-muted)] font-medium">Invoices</th>
                </tr>
              </thead>
              <tbody>
                {filteredVendors.map((v) => (
                  <tr key={v.id} className="border-b border-[var(--border-color)] hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                    <td className="py-3 px-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-full bg-fin-primary/20 flex items-center justify-center text-fin-primary font-bold text-xs">
                          {v.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium">{v.name}</p>
                          <p className="text-xs text-[var(--text-muted)]">{v.shareOfBudget}% of annual budget</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <span className="px-2 py-1 bg-black/10 dark:bg-white/10 rounded-lg text-xs">{v.category}</span>
                    </td>
                    <td className="py-3 px-2 text-right font-bold">₹{fmt(v.totalSpent)}</td>
                    <td className="py-3 px-2 text-center">
                      <span className={`px-2 py-1 rounded-lg text-xs font-bold ${
                        v.riskLevel === 'High' ? 'bg-red-500/20 text-red-400' :
                        v.riskLevel === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-fin-primary/20 text-fin-primary'
                      }`}>{v.riskLevel}</span>
                    </td>
                    <td className="py-3 px-2 text-center">
                      <div className="flex justify-center space-x-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={12} className={i < v.reliability ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'} />
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-2 text-center">
                      <div className="flex justify-center space-x-2 text-xs">
                        <span className="text-fin-primary">{v.paidCount}P</span>
                        <span className="text-yellow-400">{v.pendingCount}W</span>
                        <span className="text-red-400">{v.overdueCount}O</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default Vendors;
