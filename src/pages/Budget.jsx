import React from 'react';
import { motion } from 'framer-motion';
import { PieChart, BrainCircuit, AlertTriangle, TrendingUp } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import AnimatedCounter from '../components/AnimatedCounter';
import { useAppContext } from '../context/AppContext';

const BudgetPlanner = () => {
  const { state } = useAppContext();
  const { budgets } = state;

  const totalBudget = budgets.reduce((acc, curr) => acc + curr.limit, 0);
  const totalSpent = budgets.reduce((acc, curr) => acc + curr.spent, 0);
  const overallPercentage = (totalSpent / totalBudget) * 100;

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-1">Budget Planner</h2>
        <p className="text-[var(--text-muted)] text-sm">Set limits and track your monthly spending</p>
      </div>

      {/* Top Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard className="md:col-span-2 relative overflow-hidden">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 relative z-10">
            <div>
              <p className="text-[var(--text-muted)] font-medium">Total Monthly Budget</p>
              <div className="flex items-baseline space-x-2">
                <h3 className="text-3xl font-bold"><AnimatedCounter value={totalSpent} prefix="₹" /></h3>
                <span className="text-[var(--text-muted)]">/ ₹{totalBudget}</span>
              </div>
            </div>
            <div className="mt-4 md:mt-0 text-right">
              <p className="text-[var(--text-muted)] font-medium">Remaining</p>
              <h3 className="text-2xl font-bold text-fin-primary">₹{(totalBudget - totalSpent).toFixed(2)}</h3>
            </div>
          </div>
          
          <div className="w-full bg-black/20 dark:bg-white/5 rounded-full h-4 relative z-10 overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(overallPercentage, 100)}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className={`h-full rounded-full ${
                overallPercentage > 90 ? 'bg-red-500' : overallPercentage > 75 ? 'bg-yellow-500' : 'bg-fin-primary'
              }`}
            />
          </div>
          <p className="text-right text-xs mt-2 text-[var(--text-muted)]">{overallPercentage.toFixed(1)}% used</p>
        </GlassCard>

        <GlassCard className="bg-fin-primary/10 border-fin-primary/30 flex flex-col justify-center items-center text-center">
          <BrainCircuit size={48} className="text-fin-primary mb-4" />
          <h3 className="text-lg font-bold text-fin-primary">AI Budget Advisor</h3>
          <p className="text-sm text-[var(--text-muted)] mt-2">
            Based on your spending, we recommend increasing your <strong>Food</strong> budget by ₹4,000 and reducing <strong>Entertainment</strong> by ₹2,500.
          </p>
          <button className="mt-4 text-sm font-medium text-fin-primary hover:underline">Apply Suggestions</button>
        </GlassCard>
      </div>

      {/* Category Budgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {budgets.map((budget, index) => {
          const percentage = (budget.spent / budget.limit) * 100;
          const isOver = percentage > 100;
          const isWarning = percentage > 85 && !isOver;

          return (
            <GlassCard key={budget.category} delay={0.1 * index} hover>
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-2">
                  <div className={`p-2 rounded-lg ${
                    isOver ? 'bg-red-500/20 text-red-400' : 
                    isWarning ? 'bg-yellow-500/20 text-yellow-400' : 
                    'bg-fin-primary/20 text-fin-primary'
                  }`}>
                    {isOver ? <AlertTriangle size={20} /> : <PieChart size={20} />}
                  </div>
                  <h3 className="font-bold">{budget.category}</h3>
                </div>
                <button className="text-[var(--text-muted)] hover:text-[var(--text-primary)]">Edit</button>
              </div>

              <div className="flex justify-between items-baseline mb-2">
                <span className="text-xl font-bold">₹{budget.spent.toLocaleString()}</span>
                <span className="text-sm text-[var(--text-muted)]">of ₹{budget.limit.toLocaleString()}</span>
              </div>

              <div className="w-full bg-black/20 dark:bg-white/5 rounded-full h-2 mb-2 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(percentage, 100)}%` }}
                  transition={{ duration: 1 }}
                  className={`h-full rounded-full ${
                    isOver ? 'bg-red-500' : isWarning ? 'bg-yellow-500' : 'bg-fin-primary'
                  }`}
                />
              </div>
              
              <div className="flex justify-between text-xs">
                <span className={isOver ? 'text-red-400 font-medium' : 'text-[var(--text-muted)]'}>
                  {percentage.toFixed(1)}% used
                </span>
                <span className="text-[var(--text-muted)]">
                  {isOver ? 'Over budget' : `₹${(budget.limit - budget.spent).toLocaleString()} left`}
                </span>
              </div>
            </GlassCard>
          );
        })}
        
        {/* Add New Budget Card */}
        <GlassCard hover className="border-dashed border-2 flex flex-col items-center justify-center cursor-pointer hover:bg-black/5 dark:hover:bg-white/5">
          <div className="w-12 h-12 rounded-full bg-fin-primary/20 flex items-center justify-center text-fin-primary mb-4">
            <span className="text-2xl">+</span>
          </div>
          <h3 className="font-bold">Create New Budget</h3>
          <p className="text-sm text-[var(--text-muted)] mt-1">Track a new category</p>
        </GlassCard>
      </div>
    </div>
  );
};

export default BudgetPlanner;
