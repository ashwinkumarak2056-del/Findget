export const analyzeSpending = (expenses, budgets, financialProfile = null) => {
  const currentMonth = new Date().getMonth();
  const currentMonthExpenses = expenses.filter(e => new Date(e.date).getMonth() === currentMonth);
  
  let totalSpent = 0;
  const categorySpending = {};
  
  currentMonthExpenses.forEach(e => {
    totalSpent += e.amount;
    categorySpending[e.category] = (categorySpending[e.category] || 0) + e.amount;
  });

  const overspendingAlerts = [];
  const warningAlerts = [];
  
  budgets.forEach(b => {
    const spent = categorySpending[b.category] || 0;
    const pct = b.limit > 0 ? Math.round((spent / b.limit) * 100) : 0;
    
    if (spent > b.limit) {
      overspendingAlerts.push({
        category: b.category,
        excess: spent - b.limit,
        percentage: pct,
        spent,
        limit: b.limit
      });
    } else if (pct >= 80) {
      warningAlerts.push({
        category: b.category,
        remaining: b.limit - spent,
        percentage: pct,
        spent,
        limit: b.limit
      });
    }
  });

  // Calculate Risk Score (0-100)
  let riskScore = 100;
  
  overspendingAlerts.forEach(alert => {
    riskScore -= (alert.percentage - 100) * 0.5; 
  });

  warningAlerts.forEach(() => {
    riskScore -= 3; // Small penalty for approaching limits
  });

  if (financialProfile) {
    const precommitted = financialProfile.precommittedExpenses || 0;
    const target = (financialProfile.fixedIncome || 0) + (financialProfile.variableIncome || 0) || financialProfile.operatingBudget || 0;
    const effectiveTarget = target - precommitted;
    if (effectiveTarget > 0 && totalSpent > effectiveTarget) {
      riskScore -= 30;
    } else if (effectiveTarget > 0 && totalSpent > effectiveTarget * 0.9) {
      riskScore -= 10;
    }
  }

  riskScore = Math.max(0, Math.min(100, Math.round(riskScore)));

  return {
    totalSpent,
    categorySpending,
    overspendingAlerts,
    warningAlerts,
    riskScore,
    healthStatus: riskScore > 80 ? 'Excellent' : riskScore > 50 ? 'Fair' : 'Poor'
  };
};

export const detectDuplicates = (expenses) => {
  const duplicates = [];
  const seen = {};

  expenses.forEach(e => {
    const key = `${e.amount}-${e.date}-${e.merchant}`;
    if (seen[key]) {
      duplicates.push({ original: seen[key], duplicate: e });
    } else {
      seen[key] = e;
    }
  });

  return duplicates;
};

export const generateRecommendations = (spendingAnalysis, financialProfile = null) => {
  const recs = [];
  const fmt = (v) => v.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  // ── Critical ──
  if (spendingAnalysis.riskScore < 50) {
    recs.push({
      title: "High Risk Alert",
      desc: `Your financial health score is ${spendingAnalysis.riskScore}/100. You have ${spendingAnalysis.overspendingAlerts.length} overbudget categories totalling ₹${fmt(spendingAnalysis.overspendingAlerts.reduce((a, c) => a + c.excess, 0))} in excess spending. Freeze non-essential categories immediately.`,
      type: "critical"
    });
  }

  // ── Overspending warnings ──
  spendingAnalysis.overspendingAlerts.forEach(alert => {
    recs.push({
      title: `${alert.category}: ₹${fmt(alert.excess)} over budget`,
      desc: `Spent ₹${fmt(alert.spent)} against a ₹${fmt(alert.limit)} limit (${alert.percentage}%). Reduce spending in ${alert.category} or increase this budget limit.`,
      type: "warning"
    });
  });

  // ── Approaching-limit warnings ──
  spendingAnalysis.warningAlerts.forEach(alert => {
    recs.push({
      title: `${alert.category}: ${alert.percentage}% used`,
      desc: `Only ₹${fmt(alert.remaining)} remaining in your ${alert.category} budget. You've spent ₹${fmt(alert.spent)} of ₹${fmt(alert.limit)}.`,
      type: "warning"
    });
  });

  // ── Income vs spend insight ──
  if (financialProfile) {
    const income = (financialProfile.fixedIncome || 0) + (financialProfile.variableIncome || 0) || financialProfile.monthlyRevenueTarget || 0;
    const precommitted = financialProfile.precommittedExpenses || 0;
    const savingsGoal = financialProfile.savingsGoal || 0;
    const availableBudget = income - precommitted - savingsGoal;
    const totalSpent = spendingAnalysis.totalSpent;
    
    if (availableBudget > 0) {
      const spendPct = Math.round((totalSpent / availableBudget) * 100);
      if (totalSpent <= availableBudget) {
        recs.push({
          title: `Spending at ${spendPct}% of available budget`,
          desc: `You've spent ₹${fmt(totalSpent)} of your ₹${fmt(availableBudget)} available budget (after ₹${fmt(precommitted)} precommitted + ₹${fmt(savingsGoal)} savings). You have ₹${fmt(availableBudget - totalSpent)} headroom left.`,
          type: "success"
        });
      } else {
        recs.push({
          title: `Over available budget by ₹${fmt(totalSpent - availableBudget)}`,
          desc: `Your spending (₹${fmt(totalSpent)}) exceeds your available budget (₹${fmt(availableBudget)}). This will eat into your savings goal of ₹${fmt(savingsGoal)}.`,
          type: "critical"
        });
      }
    }
  }

  if (recs.length === 0) {
    recs.push({
      title: "All Clear!",
      desc: "Your finances are perfectly on track. All budgets are within healthy limits.",
      type: "success"
    });
  }

  return recs;
};

export const generateBudgetSuggestions = (budgets, expenses, financialProfile = null) => {
  if (!financialProfile) {
    return { text: "Set up your financial profile to receive personalized budget suggestions.", adjustments: [] };
  }

  const income = (financialProfile.fixedIncome || 0) + (financialProfile.variableIncome || 0) || financialProfile.monthlyRevenueTarget || 0;
  const precommitted = financialProfile.precommittedExpenses || 0;
  const savingsGoal = financialProfile.savingsGoal || 0;
  
  if (income === 0) {
    return { text: "Please set up your initial financial profile to receive personalized budget suggestions.", adjustments: [] };
  }

  const totalBudgeted = budgets.reduce((acc, curr) => acc + curr.limit, 0);
  const totalAllowedToSpend = income - precommitted - savingsGoal;
  const adjustments = [];

  if (totalBudgeted > totalAllowedToSpend && totalAllowedToSpend > 0) {
    const diff = totalBudgeted - totalAllowedToSpend;
    // Proportionally reduce each budget
    const ratio = totalAllowedToSpend / totalBudgeted;
    budgets.forEach(b => {
      const newLimit = Math.round(b.limit * ratio);
      if (newLimit !== b.limit) {
        adjustments.push({ category: b.category, oldLimit: b.limit, newLimit, spent: b.spent });
      }
    });
    
    return {
      text: `Your budgets total ₹${totalBudgeted.toLocaleString('en-IN')} but your available budget is ₹${totalAllowedToSpend.toLocaleString('en-IN')} (Income ₹${income.toLocaleString('en-IN')} − Precommitted ₹${precommitted.toLocaleString('en-IN')} − Savings ₹${savingsGoal.toLocaleString('en-IN')}). AI recommends reducing budgets by ₹${diff.toLocaleString('en-IN')} proportionally.`,
      adjustments
    };
  } else if (totalBudgeted < totalAllowedToSpend) {
    const surplus = totalAllowedToSpend - totalBudgeted;
    return {
      text: `You have ₹${surplus.toLocaleString('en-IN')} unallocated from your ₹${totalAllowedToSpend.toLocaleString('en-IN')} available budget. Consider creating a new budget category or increasing existing limits.`,
      adjustments: []
    };
  }

  return { text: "Your budgets are perfectly aligned with your income, savings goals, and precommitted expenses.", adjustments: [] };
};

// Generate notification objects from budget analysis
export const generateNotifications = (budgets, expenses, financialProfile) => {
  const notifications = [];
  const now = new Date().toISOString();
  const currentMonth = new Date().getMonth();
  const currentMonthExpenses = expenses.filter(e => new Date(e.date).getMonth() === currentMonth);
  
  const categorySpending = {};
  currentMonthExpenses.forEach(e => {
    categorySpending[e.category] = (categorySpending[e.category] || 0) + e.amount;
  });

  budgets.forEach(b => {
    const spent = categorySpending[b.category] || 0;
    const pct = b.limit > 0 ? Math.round((spent / b.limit) * 100) : 0;

    if (spent > b.limit) {
      notifications.push({
        id: `overspent-${b.category}`,
        type: 'critical',
        title: `${b.category} Over Budget!`,
        message: `You've spent ₹${spent.toLocaleString('en-IN')} on ${b.category}, exceeding the ₹${b.limit.toLocaleString('en-IN')} limit by ₹${(spent - b.limit).toLocaleString('en-IN')}.`,
        time: now,
        read: false
      });
    } else if (pct >= 85) {
      notifications.push({
        id: `warning-${b.category}`,
        type: 'warning',
        title: `${b.category} Budget ${pct}% Used`,
        message: `Only ₹${(b.limit - spent).toLocaleString('en-IN')} remaining in ${b.category}. Consider slowing down spending.`,
        time: now,
        read: false
      });
    }
  });

  // Overall income check
  if (financialProfile) {
    const income = (financialProfile.fixedIncome || 0) + (financialProfile.variableIncome || 0) || financialProfile.monthlyRevenueTarget || 0;
    const precommitted = financialProfile.precommittedExpenses || 0;
    const totalSpent = currentMonthExpenses.reduce((a, e) => a + e.amount, 0);
    const available = income - precommitted;
    
    if (available > 0 && totalSpent > available * 0.9) {
      notifications.push({
        id: 'income-warning',
        type: 'critical',
        title: 'Approaching Income Limit',
        message: `Total spending (₹${totalSpent.toLocaleString('en-IN')}) is at ${Math.round((totalSpent / available) * 100)}% of your available income (₹${available.toLocaleString('en-IN')}).`,
        time: now,
        read: false
      });
    }
  }

  return notifications;
};
