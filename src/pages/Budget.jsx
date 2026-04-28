import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { PieChart, BrainCircuit, AlertTriangle, TrendingUp, X, Check, BarChart3, TrendingDown, Bell, Target } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import AnimatedCounter from '../components/AnimatedCounter';
import { CustomBarChart, CustomLineChart } from '../components/Charts';
import { useAppContext } from '../context/AppContext';
import { generateBudgetSuggestions } from '../utils/aiEngine';

const BudgetPlanner = () => {
  const { state, dispatch } = useAppContext();
  const { budgets, expenses, settings } = state;
  const userMode = settings.userMode;
  const financialProfile = settings.financialProfile?.[userMode] || null;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [newLimit, setNewLimit] = useState('');
  const [appliedSuggestions, setAppliedSuggestions] = useState(false);

  // ── Financial calculations ──
  let totalIncome = 0;
  let precommitted = 0;
  let savingsGoal = 0;
  if (userMode === 'personal' && financialProfile) {
    totalIncome = (financialProfile.fixedIncome || 0) + (financialProfile.variableIncome || 0);
    precommitted = financialProfile.precommittedExpenses || 0;
    savingsGoal = financialProfile.savingsGoal || 0;
  } else if (userMode === 'commercial' && financialProfile) {
    totalIncome = financialProfile.operatingBudget || 0;
    precommitted = financialProfile.precommittedExpenses || 0;
    savingsGoal = 0;
  }

  const availableBudget = Math.max(0, totalIncome - precommitted - savingsGoal);
  const categoryBudgetSum = budgets.reduce((acc, curr) => acc + curr.limit, 0);
  const totalSpent = budgets.reduce((acc, curr) => acc + curr.spent, 0);
  const overallPercentage = availableBudget > 0 ? (totalSpent / availableBudget) * 100 : 0;

  // ── AI Suggestions ──
  const aiResult = generateBudgetSuggestions(budgets, expenses, financialProfile);
  const aiSuggestion = aiResult.text;
  const aiAdjustments = aiResult.adjustments || [];

  // ── Weekly Spending Trends (simulated from budget spent data) ──
  const weeklyTrends = useMemo(() => {
    return budgets.map(b => ({
      name: b.category.length > 8 ? b.category.substring(0, 8) + '..' : b.category,
      week1: Math.round(b.spent * 0.2),
      week2: Math.round(b.spent * 0.3),
      week3: Math.round(b.spent * 0.25),
      week4: Math.round(b.spent * 0.25),
    }));
  }, [budgets]);

  // ── Linear Regression Budget Prediction ──
  const predictions = useMemo(() => {
    return budgets.map(b => {
      // Simple linear regression: predict month-end spend from weekly run-rate
      const weeks = [b.spent * 0.2, b.spent * 0.5, b.spent * 0.75, b.spent];
      const n = weeks.length;
      const xMean = (n - 1) / 2;
      const yMean = weeks.reduce((a, v) => a + v, 0) / n;
      let num = 0, den = 0;
      weeks.forEach((y, x) => {
        num += (x - xMean) * (y - yMean);
        den += (x - xMean) * (x - xMean);
      });
      const slope = den !== 0 ? num / den : 0;
      const intercept = yMean - slope * xMean;
      // Predict week 5 (end of month + buffer)
      const predicted = Math.round(intercept + slope * 4.5);
      const willExceed = predicted > b.limit;

      return {
        category: b.category,
        currentSpent: b.spent,
        limit: b.limit,
        predicted: Math.max(predicted, b.spent),
        willExceed,
        overBy: willExceed ? predicted - b.limit : 0,
        percentage: b.limit > 0 ? Math.round((predicted / b.limit) * 100) : 0
      };
    });
  }, [budgets]);

  // ── Overspending Areas ──
  const overspendingAreas = budgets
    .filter(b => b.spent > b.limit * 0.8)
    .sort((a, b) => (b.spent / b.limit) - (a.spent / a.limit))
    .map(b => ({
      category: b.category,
      spent: b.spent,
      limit: b.limit,
      percentage: b.limit > 0 ? Math.round((b.spent / b.limit) * 100) : 0,
      isOver: b.spent > b.limit
    }));

  // ── Smart Alerts ──
  const smartAlerts = useMemo(() => {
    const alerts = [];

    // Check if total budgets exceed available budget
    if (categoryBudgetSum > availableBudget && availableBudget > 0) {
      alerts.push({
        type: 'critical',
        text: `Total category budgets (₹${categoryBudgetSum.toLocaleString('en-IN')}) exceed your available budget (₹${availableBudget.toLocaleString('en-IN')}) by ₹${(categoryBudgetSum - availableBudget).toLocaleString('en-IN')}.`
      });
    }

    // Check predictions for upcoming overspend
    predictions.filter(p => p.willExceed).forEach(p => {
      alerts.push({
        type: 'warning',
        text: `AI predicts ${p.category} will exceed its ₹${p.limit.toLocaleString('en-IN')} limit by ₹${p.overBy.toLocaleString('en-IN')} at current pace.`
      });
    });

    // Check overspending
    overspendingAreas.filter(o => o.isOver).forEach(o => {
      alerts.push({
        type: 'critical',
        text: `${o.category} has already exceeded its budget — spent ₹${o.spent.toLocaleString('en-IN')} of ₹${o.limit.toLocaleString('en-IN')}.`
      });
    });

    // Check categories nearing limit
    overspendingAreas.filter(o => !o.isOver && o.percentage >= 85).forEach(o => {
      alerts.push({
        type: 'warning',
        text: `${o.category} is at ${o.percentage}% — only ₹${(o.limit - o.spent).toLocaleString('en-IN')} remaining.`
      });
    });

    if (alerts.length === 0) {
      alerts.push({ type: 'success', text: 'All budgets are healthy. No issues detected.' });
    }

    return alerts;
  }, [budgets, predictions, overspendingAreas, categoryBudgetSum, availableBudget]);

  // ── Prediction chart data ──
  const predictionChartData = predictions.map(p => ({
    name: p.category.length > 8 ? p.category.substring(0, 8) + '..' : p.category,
    current: p.currentSpent,
    predicted: p.predicted,
    limit: p.limit
  }));

  // ── Handlers ──
  const handleAddBudget = (e) => {
    e.preventDefault();
    if (newCategory && newLimit) {
      dispatch({
        type: 'ADD_BUDGET',
        payload: { category: newCategory, limit: Number(newLimit), spent: 0 }
      });
      setNewCategory('');
      setNewLimit('');
      setIsModalOpen(false);
    }
  };

  const handleApplySuggestions = () => {
    if (aiAdjustments.length === 0) return;
    const newBudgets = budgets.map(b => {
      const adj = aiAdjustments.find(a => a.category === b.category);
      return adj ? { ...b, limit: adj.newLimit } : b;
    });
    dispatch({ type: 'SET_BUDGETS', payload: newBudgets });
    setAppliedSuggestions(true);
    setTimeout(() => setAppliedSuggestions(false), 3000);
  };

  const fmt = (v) => v.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-1">Budget Planner</h2>
        <p className="text-[var(--text-muted)] text-sm">
          {userMode === 'personal' 
            ? `Income: ₹${totalIncome.toLocaleString('en-IN')} | Precommitted: ₹${precommitted.toLocaleString('en-IN')} | Savings: ₹${savingsGoal.toLocaleString('en-IN')}`
            : `Operating Budget: ₹${totalIncome.toLocaleString('en-IN')} | Precommitted: ₹${precommitted.toLocaleString('en-IN')}`
          }
        </p>
      </div>

      {/* ── Top Summary Row ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard className="md:col-span-2 relative overflow-hidden">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 relative z-10">
            <div>
              <p className="text-[var(--text-muted)] font-medium">Available Budget</p>
              <div className="flex items-baseline space-x-2">
                <h3 className="text-3xl font-bold"><AnimatedCounter value={totalSpent} prefix="₹" decimals={2} /></h3>
                <span className="text-[var(--text-muted)]">/ ₹{fmt(availableBudget)}</span>
              </div>
              <p className="text-xs text-[var(--text-muted)] mt-1">Category budgets total: ₹{categoryBudgetSum.toLocaleString('en-IN')}</p>
            </div>
            <div className="mt-4 md:mt-0 text-right">
              <p className="text-[var(--text-muted)] font-medium">Remaining</p>
              <h3 className={`text-2xl font-bold ${(availableBudget - totalSpent) < 0 ? 'text-red-400' : 'text-fin-primary'}`}>
                ₹{fmt(Math.max(0, availableBudget - totalSpent))}
              </h3>
            </div>
          </div>
          <div className="w-full bg-black/20 dark:bg-white/5 rounded-full h-4 relative z-10 overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(overallPercentage, 100)}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className={`h-full rounded-full ${overallPercentage > 90 ? 'bg-red-500' : overallPercentage > 75 ? 'bg-yellow-500' : 'bg-fin-primary'}`}
            />
          </div>
          <p className="text-right text-xs mt-2 text-[var(--text-muted)]">{overallPercentage.toFixed(1)}% of available budget used</p>
        </GlassCard>

        <GlassCard className="bg-fin-primary/10 border-fin-primary/30 flex flex-col justify-center items-center text-center">
          <BrainCircuit size={36} className="text-fin-primary mb-3" />
          <h3 className="text-lg font-bold text-fin-primary">AI Budget Advisor</h3>
          <p className="text-xs text-[var(--text-muted)] mt-2 leading-relaxed">{aiSuggestion}</p>
          {aiAdjustments.length > 0 && !appliedSuggestions && (
            <button onClick={handleApplySuggestions} className="mt-4 text-sm font-medium text-white bg-fin-primary px-4 py-2 rounded-xl hover:bg-fin-primary/90 transition-colors shadow-lg shadow-fin-primary/30">
              Apply Suggestions
            </button>
          )}
          {appliedSuggestions && (
            <div className="mt-4 flex items-center space-x-2 text-fin-primary">
              <Check size={18} /><span className="text-sm font-medium">Budgets adjusted!</span>
            </div>
          )}
        </GlassCard>
      </div>

      {/* ── Smart Alerts ── */}
      <GlassCard>
        <h3 className="font-bold mb-4 flex items-center">
          <Bell size={20} className="mr-2 text-fin-primary" /> Smart Alerts
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {smartAlerts.map((alert, idx) => (
            <div key={idx} className={`p-3 rounded-xl border flex items-start space-x-3 ${
              alert.type === 'critical' ? 'bg-red-500/10 border-red-500/20' :
              alert.type === 'warning' ? 'bg-yellow-500/10 border-yellow-500/20' :
              'bg-fin-primary/10 border-fin-primary/20'
            }`}>
              {alert.type === 'critical' ? <AlertTriangle size={16} className="text-red-400 shrink-0 mt-0.5" /> :
               alert.type === 'warning' ? <AlertTriangle size={16} className="text-yellow-400 shrink-0 mt-0.5" /> :
               <Check size={16} className="text-fin-primary shrink-0 mt-0.5" />}
              <p className="text-xs leading-relaxed">{alert.text}</p>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* ── Charts Row: Weekly Trends + Budget Prediction ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard className="h-80 flex flex-col">
          <h3 className="font-bold mb-4 flex items-center">
            <BarChart3 size={20} className="mr-2 text-blue-400" /> Weekly Spending Trends
          </h3>
          <div className="flex-1">
            <CustomBarChart 
              data={weeklyTrends} 
              bars={[
                { dataKey: 'week1', color: '#22c55e', name: 'Week 1' },
                { dataKey: 'week2', color: '#3b82f6', name: 'Week 2' },
                { dataKey: 'week3', color: '#f59e0b', name: 'Week 3' },
                { dataKey: 'week4', color: '#ef4444', name: 'Week 4' },
              ]}
            />
          </div>
        </GlassCard>

        <GlassCard className="h-80 flex flex-col">
          <h3 className="font-bold mb-4 flex items-center">
            <TrendingUp size={20} className="mr-2 text-purple-400" /> Budget Prediction (Linear Regression)
          </h3>
          <div className="flex-1">
            <CustomBarChart 
              data={predictionChartData}
              bars={[
                { dataKey: 'current', color: '#22c55e', name: 'Current Spent' },
                { dataKey: 'predicted', color: 'rgba(139, 92, 246, 0.6)', name: 'Predicted' },
                { dataKey: 'limit', color: 'rgba(239, 68, 68, 0.3)', name: 'Budget Limit' },
              ]}
            />
          </div>
        </GlassCard>
      </div>

      {/* ── Overspending Areas ── */}
      {overspendingAreas.length > 0 && (
        <GlassCard>
          <h3 className="font-bold mb-4 flex items-center">
            <TrendingDown size={20} className="mr-2 text-red-400" /> Overspending Areas
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {overspendingAreas.map((area, idx) => (
              <div key={idx} className={`p-4 rounded-xl border ${area.isOver ? 'bg-red-500/10 border-red-500/20' : 'bg-yellow-500/10 border-yellow-500/20'}`}>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-sm">{area.category}</span>
                  <span className={`text-sm font-bold ${area.isOver ? 'text-red-400' : 'text-yellow-400'}`}>
                    {area.percentage}%
                  </span>
                </div>
                <div className="w-full bg-black/20 rounded-full h-2 mb-2 overflow-hidden">
                  <div className={`h-full rounded-full ${area.isOver ? 'bg-red-500' : 'bg-yellow-500'}`} style={{ width: `${Math.min(area.percentage, 100)}%` }}></div>
                </div>
                <p className="text-xs text-[var(--text-muted)]">
                  ₹{area.spent.toLocaleString('en-IN')} / ₹{area.limit.toLocaleString('en-IN')}
                  {area.isOver && <span className="text-red-400 ml-1">(+₹{(area.spent - area.limit).toLocaleString('en-IN')})</span>}
                </p>
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      {/* ── Category Budgets ── */}
      <h3 className="text-lg font-bold">Category Budgets</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {budgets.map((budget, index) => {
          const percentage = budget.limit > 0 ? (budget.spent / budget.limit) * 100 : 0;
          const isOver = percentage > 100;
          const isWarning = percentage > 85 && !isOver;
          const prediction = predictions.find(p => p.category === budget.category);

          return (
            <GlassCard key={budget.category} delay={0.05 * index} hover>
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
              </div>

              <div className="flex justify-between items-baseline mb-2">
                <span className="text-xl font-bold">₹{fmt(budget.spent)}</span>
                <span className="text-sm text-[var(--text-muted)]">of ₹{fmt(budget.limit)}</span>
              </div>

              <div className="w-full bg-black/20 dark:bg-white/5 rounded-full h-2 mb-2 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(percentage, 100)}%` }}
                  transition={{ duration: 1 }}
                  className={`h-full rounded-full ${isOver ? 'bg-red-500' : isWarning ? 'bg-yellow-500' : 'bg-fin-primary'}`}
                />
              </div>
              
              <div className="flex justify-between text-xs mb-3">
                <span className={isOver ? 'text-red-400 font-medium' : 'text-[var(--text-muted)]'}>
                  {percentage.toFixed(1)}% used
                </span>
                <span className="text-[var(--text-muted)]">
                  {isOver ? `Over by ₹${fmt(budget.spent - budget.limit)}` : `₹${fmt(budget.limit - budget.spent)} left`}
                </span>
              </div>

              {/* Prediction tag */}
              {prediction && (
                <div className={`text-xs px-2 py-1 rounded-lg inline-flex items-center space-x-1 ${
                  prediction.willExceed ? 'bg-red-500/10 text-red-400' : 'bg-fin-primary/10 text-fin-primary'
                }`}>
                  <Target size={12} />
                  <span>Predicted: ₹{prediction.predicted.toLocaleString('en-IN')} ({prediction.percentage}%)</span>
                </div>
              )}
            </GlassCard>
          );
        })}
        
        {/* Add New Budget Card */}
        <GlassCard 
          hover 
          className="border-dashed border-2 flex flex-col items-center justify-center cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 min-h-[200px]"
          onClick={() => setIsModalOpen(true)}
        >
          <div className="w-12 h-12 rounded-full bg-fin-primary/20 flex items-center justify-center text-fin-primary mb-4">
            <span className="text-2xl">+</span>
          </div>
          <h3 className="font-bold">Create New Budget</h3>
          <p className="text-sm text-[var(--text-muted)] mt-1">Track a new category</p>
        </GlassCard>
      </div>

      {/* ── Create Budget Modal ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-[var(--panel-color)] border border-[var(--border-color)] rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="flex justify-between items-center p-6 border-b border-[var(--border-color)]">
              <h3 className="text-xl font-bold">Create New Budget</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddBudget} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Category Name</label>
                <input type="text" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} placeholder="e.g., Subscriptions, Gym" className="w-full px-4 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-[var(--border-color)] focus:outline-none focus:border-fin-primary" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Monthly Limit (₹)</label>
                <input type="number" value={newLimit} onChange={(e) => setNewLimit(e.target.value)} placeholder="e.g., 5000" className="w-full px-4 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-[var(--border-color)] focus:outline-none focus:border-fin-primary" required min="1" />
              </div>
              <div className="pt-4 flex space-x-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2 rounded-xl border border-[var(--border-color)] hover:bg-black/5 dark:hover:bg-white/5 transition-colors">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 rounded-xl bg-fin-primary text-white font-bold hover:bg-fin-primary/90 transition-colors shadow-lg shadow-fin-primary/30">Create Budget</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default BudgetPlanner;
