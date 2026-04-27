import React from 'react';
import { motion } from 'framer-motion';
import { Wallet, TrendingDown, PiggyBank, Target, ArrowUpRight, ArrowDownRight, AlertTriangle, BrainCircuit, Receipt } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import AnimatedCounter from '../components/AnimatedCounter';
import { CustomPieChart, CustomLineChart } from '../components/Charts';
import { useAppContext } from '../context/AppContext';
import { analyzeSpending } from '../utils/aiEngine';

const Dashboard = () => {
  const { state } = useAppContext();
  const { expenses, budgets } = state;
  
  const analysis = analyzeSpending(expenses, budgets);

  // Prepare Chart Data
  const pieData = Object.entries(analysis.categorySpending)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5); // Top 5 categories

  // Mock monthly trend data based on current expenses
  const trendData = [
    { name: 'Week 1', spent: analysis.totalSpent * 0.2 },
    { name: 'Week 2', spent: analysis.totalSpent * 0.4 },
    { name: 'Week 3', spent: analysis.totalSpent * 0.7 },
    { name: 'Week 4', spent: analysis.totalSpent },
  ];

  const recentTransactions = [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <GlassCard delay={0.1} hover className="relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <TrendingDown size={64} className="text-red-500" />
          </div>
          <div className="flex items-center space-x-4 mb-4 relative z-10">
            <div className="p-3 bg-red-500/20 rounded-xl text-red-400">
              <TrendingDown size={24} />
            </div>
            <div>
              <p className="text-[var(--text-muted)] text-sm font-medium">Total Expenses</p>
              <h3 className="text-2xl font-bold text-[var(--text-primary)]">
                <AnimatedCounter value={analysis.totalSpent} prefix="₹" decimals={2} />
              </h3>
            </div>
          </div>
          <div className="flex items-center text-sm text-red-400 relative z-10">
            <ArrowUpRight size={16} className="mr-1" />
            <span>12% higher than last month</span>
          </div>
        </GlassCard>

        <GlassCard delay={0.2} hover className="relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Wallet size={64} className="text-fin-primary" />
          </div>
          <div className="flex items-center space-x-4 mb-4 relative z-10">
            <div className="p-3 bg-fin-primary/20 rounded-xl text-fin-primary">
              <Wallet size={24} />
            </div>
            <div>
              <p className="text-[var(--text-muted)] text-sm font-medium">Monthly Budget</p>
              <h3 className="text-2xl font-bold text-[var(--text-primary)]">
                <AnimatedCounter value={budgets.reduce((acc, b) => acc + b.limit, 0)} prefix="₹" decimals={0} />
              </h3>
            </div>
          </div>
          <div className="flex items-center text-sm text-fin-primary relative z-10">
            <ArrowDownRight size={16} className="mr-1" />
            <span>On track to save ₹4,500</span>
          </div>
        </GlassCard>

        <GlassCard delay={0.3} hover className="relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Target size={64} className="text-blue-500" />
          </div>
          <div className="flex items-center space-x-4 mb-4 relative z-10">
            <div className="p-3 bg-blue-500/20 rounded-xl text-blue-400">
              <Target size={24} />
            </div>
            <div>
              <p className="text-[var(--text-muted)] text-sm font-medium">Health Score</p>
              <h3 className="text-2xl font-bold text-[var(--text-primary)]">
                <AnimatedCounter value={analysis.riskScore} suffix="/100" />
              </h3>
            </div>
          </div>
          <div className="flex items-center text-sm text-blue-400 relative z-10">
            <span>Status: {analysis.healthStatus}</span>
          </div>
        </GlassCard>
        
        <GlassCard delay={0.4} hover className="relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <PiggyBank size={64} className="text-purple-500" />
          </div>
          <div className="flex items-center space-x-4 mb-4 relative z-10">
            <div className="p-3 bg-purple-500/20 rounded-xl text-purple-400">
              <PiggyBank size={24} />
            </div>
            <div>
              <p className="text-[var(--text-muted)] text-sm font-medium">Total Savings</p>
              <h3 className="text-2xl font-bold text-[var(--text-primary)]">
                <AnimatedCounter value={980450} prefix="₹" />
              </h3>
            </div>
          </div>
          <div className="w-full bg-black/20 rounded-full h-2 mt-2">
            <div className="bg-purple-500 h-2 rounded-full" style={{ width: '65%' }}></div>
          </div>
          <p className="text-xs text-[var(--text-muted)] mt-1">65% of yearly goal</p>
        </GlassCard>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Charts Section */}
        <div className="lg:col-span-2 space-y-6">
          <GlassCard delay={0.5} className="h-96 flex flex-col">
            <h3 className="text-lg font-bold mb-4">Spending Trend</h3>
            <div className="flex-1">
              <CustomLineChart 
                data={trendData} 
                lines={[{ dataKey: 'spent', name: 'Spent', color: '#22c55e' }]} 
              />
            </div>
          </GlassCard>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GlassCard delay={0.6} className="h-80 flex flex-col">
              <h3 className="text-lg font-bold mb-4">Expense Breakdown</h3>
              <div className="flex-1">
                <CustomPieChart data={pieData} />
              </div>
            </GlassCard>
            
            <GlassCard delay={0.7} className="h-80 flex flex-col overflow-hidden relative">
              <h3 className="text-lg font-bold mb-4 flex items-center">
                <BrainCircuit className="text-fin-primary mr-2" size={20}/>
                AI Insights
              </h3>
              
              <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar">
                {analysis.overspendingAlerts.length > 0 ? (
                  analysis.overspendingAlerts.map((alert, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start space-x-3">
                      <AlertTriangle className="text-red-400 shrink-0 mt-0.5" size={16} />
                      <div>
                        <p className="text-sm font-medium text-red-400">{alert.category} Overbudget</p>
                        <p className="text-xs text-[var(--text-muted)]">Exceeded by ₹{alert.excess.toFixed(2)} ({alert.percentage}%)</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 rounded-xl bg-fin-primary/10 border border-fin-primary/20 flex items-start space-x-3">
                    <Target className="text-fin-primary shrink-0 mt-0.5" size={18} />
                    <div>
                      <p className="text-sm font-medium text-fin-primary">All Budgets on Track</p>
                      <p className="text-xs text-[var(--text-muted)] mt-1">Great job! AI recommends moving ₹5,000 extra to your SIP.</p>
                    </div>
                  </div>
                )}
                
                <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                  <p className="text-sm font-medium text-blue-400">Subscription Alert</p>
                  <p className="text-xs text-[var(--text-muted)] mt-1">You have 3 active subscriptions (₹3,450/mo). Consider canceling unused ones.</p>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>

        {/* Sidebar Section */}
        <div className="space-y-6">
          <GlassCard delay={0.8} className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold">Recent Transactions</h3>
              <button className="text-sm text-fin-primary hover:underline">View All</button>
            </div>
            
            <div className="space-y-4">
              {recentTransactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-black/20 dark:hover:bg-white/5 transition-colors group cursor-pointer border border-transparent hover:border-[var(--border-color)]">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-black/20 dark:bg-white/10 flex items-center justify-center font-bold text-sm">
                      {tx.merchant.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium leading-tight group-hover:text-fin-primary transition-colors">{tx.merchant}</p>
                      <p className="text-xs text-[var(--text-muted)]">{tx.category} • {tx.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-red-400">-₹{tx.amount.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <button className="w-full mt-6 glass-button flex items-center justify-center">
              <Receipt size={18} className="mr-2" />
              Scan New Receipt
            </button>
          </GlassCard>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
