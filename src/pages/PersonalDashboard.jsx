import GlassCard from '../components/ui/GlassCard';
import { useAppContext } from '../context/AppContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Target } from 'lucide-react';

const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6'];

const PersonalDashboard = () => {
  const { state } = useAppContext();
  const { expenses } = state;

  // Mock data for charts
  const categoryData = [
    { name: 'Food', value: 400 },
    { name: 'Transport', value: 300 },
    { name: 'Shopping', value: 300 },
    { name: 'Utilities', value: 200 },
  ];

  const monthlyData = [
    { name: 'Jan', value: 1200 },
    { name: 'Feb', value: 1100 },
    { name: 'Mar', value: 1400 },
    { name: 'Apr', value: 900 },
  ];

  return (
    <div className="space-y-6">
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <GlassCard className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-fin-primary/20 flex items-center justify-center text-fin-primary">
            <span className="text-xl font-bold">₹</span>
          </div>
          <div>
            <p className="text-sm text-text-muted">Total Balance</p>
            <h3 className="text-2xl font-bold text-text-primary">₹9,80,450</h3>
          </div>
        </GlassCard>
        
        <GlassCard className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center text-red-500">
            <TrendingDown size={24} />
          </div>
          <div>
            <p className="text-sm text-text-muted">Monthly Expenses</p>
            <h3 className="text-2xl font-bold text-text-primary">₹68,200</h3>
          </div>
        </GlassCard>
        
        <GlassCard className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-fin-primary/20 flex items-center justify-center text-fin-primary">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-sm text-text-muted">Monthly Income</p>
            <h3 className="text-2xl font-bold text-text-primary">₹2,45,000</h3>
          </div>
        </GlassCard>

        <GlassCard className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500">
            <Target size={24} />
          </div>
          <div>
            <p className="text-sm text-text-muted">Savings Goal</p>
            <h3 className="text-2xl font-bold text-text-primary">68%</h3>
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Spending Trend */}
        <GlassCard className="h-96 flex flex-col">
          <h3 className="text-lg font-semibold mb-4 text-text-primary">Spending Trend</h3>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" stroke="#86efac" />
                <YAxis stroke="#86efac" />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: 'rgba(15, 23, 19, 0.9)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: '8px' }}
                />
                <Line type="monotone" dataKey="value" stroke="#22c55e" strokeWidth={3} dot={{ r: 4, fill: '#22c55e' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Expenses by Category */}
        <GlassCard className="h-96 flex flex-col">
          <h3 className="text-lg font-semibold mb-4 text-text-primary">Expenses by Category</h3>
          <div className="flex-1 min-h-0 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: 'rgba(15, 23, 19, 0.9)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: '8px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      {/* AI Budget Advisor (Placeholder) */}
      <GlassCard className="border-fin-primary/40 shadow-[0_0_20px_rgba(34,197,94,0.1)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-fin-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="relative z-10">
          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <span className="text-fin-primary">AI Financial Intelligence</span>
          </h3>
          <p className="text-text-muted mb-4">Based on your recent spending habits, you are projected to exceed your Dining out budget by 15% this week. Consider reducing restaurant visits.</p>
          <button className="glass-button">View Detailed Analysis</button>
        </div>
      </GlassCard>
    </div>
  );
};

export default PersonalDashboard;
