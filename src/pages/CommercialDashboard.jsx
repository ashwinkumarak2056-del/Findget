import GlassCard from '../components/ui/GlassCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';
import { Building2, FileText, TrendingUp, AlertTriangle } from 'lucide-react';

const CommercialDashboard = () => {
  const data = [
    { name: 'Q1', revenue: 40000, expenses: 24000 },
    { name: 'Q2', revenue: 30000, expenses: 13980 },
    { name: 'Q3', revenue: 20000, expenses: 9800 },
    { name: 'Q4', revenue: 27800, expenses: 3908 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-text-primary">Procurement & Operations</h2>
          <p className="text-text-muted text-sm">Enterprise Financial Overview</p>
        </div>
        <button className="glass-button text-sm">Generate Audit Report</button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <GlassCard className="flex items-center gap-4 border-l-4 border-l-fin-primary">
          <div className="p-3 rounded-xl bg-fin-primary/10">
            <Building2 className="text-fin-primary" size={24} />
          </div>
          <div>
            <p className="text-sm text-text-muted">Total Revenue</p>
            <h3 className="text-2xl font-bold text-text-primary">₹12.5Cr</h3>
          </div>
        </GlassCard>

        <GlassCard className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-blue-500/10">
            <TrendingUp className="text-blue-500" size={24} />
          </div>
          <div>
            <p className="text-sm text-text-muted">Operating Margin</p>
            <h3 className="text-2xl font-bold text-text-primary">24%</h3>
          </div>
        </GlassCard>

        <GlassCard className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-purple-500/10">
            <FileText className="text-purple-500" size={24} />
          </div>
          <div>
            <p className="text-sm text-text-muted">Processed Invoices</p>
            <h3 className="text-2xl font-bold text-text-primary">1,432</h3>
          </div>
        </GlassCard>

        <GlassCard className="flex items-center gap-4 border-l-4 border-l-red-500">
          <div className="p-3 rounded-xl bg-red-500/10">
            <AlertTriangle className="text-red-500" size={24} />
          </div>
          <div>
            <p className="text-sm text-text-muted">High Risk Invoices</p>
            <h3 className="text-2xl font-bold text-text-primary">12</h3>
          </div>
        </GlassCard>
      </div>

      {/* Main Chart */}
      <GlassCard className="h-[400px]">
        <h3 className="text-lg font-semibold mb-6 text-text-primary">Revenue vs Expenses</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis dataKey="name" stroke="#86efac" />
            <YAxis stroke="#86efac" />
            <RechartsTooltip 
              contentStyle={{ backgroundColor: 'rgba(15, 23, 19, 0.9)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: '8px' }}
            />
            <Legend wrapperStyle={{ paddingTop: '20px' }}/>
            <Bar dataKey="revenue" fill="#22c55e" radius={[4, 4, 0, 0]} />
            <Bar dataKey="expenses" fill="#f43f5e" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </GlassCard>

      {/* AI Risk Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlassCard>
          <h3 className="text-lg font-semibold mb-4 text-text-primary flex items-center gap-2">
            <AlertTriangle className="text-yellow-500" size={20} />
            AI Risk Detection
          </h3>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 flex items-start gap-3">
              <div className="w-2 h-2 mt-2 rounded-full bg-red-500 flex-shrink-0"></div>
              <div>
                <p className="text-text-primary font-medium">Duplicate Invoice Detected</p>
                <p className="text-sm text-text-muted mt-1">Invoice #INV-2026 from TechCorp matches #INV-1988 exactly.</p>
              </div>
            </div>
            <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20 flex items-start gap-3">
              <div className="w-2 h-2 mt-2 rounded-full bg-yellow-500 flex-shrink-0"></div>
              <div>
                <p className="text-text-primary font-medium">Anomalous Spending Pattern</p>
                <p className="text-sm text-text-muted mt-1">Marketing expenditure is 45% higher than the seasonal average.</p>
              </div>
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <h3 className="text-lg font-semibold mb-4 text-text-primary">Recent Vendor Activity</h3>
          <div className="space-y-4">
            {['TechCorp Solutions', 'Global Logistics', 'Office Supplies Inc'].map((vendor, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-text-primary font-bold">
                    {vendor.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-primary">{vendor}</p>
                    <p className="text-xs text-text-muted">Updated 2h ago</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-text-primary">₹{(Math.random() * 500000 + 100000).toLocaleString(undefined, {maximumFractionDigits:0})}</p>
                  <p className="text-xs text-fin-primary">Paid</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default CommercialDashboard;
