export const analyzeSpending = (expenses, budgets) => {
  const currentMonth = new Date().getMonth();
  const currentMonthExpenses = expenses.filter(e => new Date(e.date).getMonth() === currentMonth);
  
  let totalSpent = 0;
  const categorySpending = {};
  
  currentMonthExpenses.forEach(e => {
    totalSpent += e.amount;
    categorySpending[e.category] = (categorySpending[e.category] || 0) + e.amount;
  });

  const overspendingAlerts = [];
  budgets.forEach(b => {
    const spent = categorySpending[b.category] || 0;
    if (spent > b.limit) {
      overspendingAlerts.push({
        category: b.category,
        excess: spent - b.limit,
        percentage: Math.round((spent / b.limit) * 100)
      });
    }
  });

  // Calculate Risk Score (0-100)
  // Higher overspending = lower score
  let riskScore = 100;
  overspendingAlerts.forEach(alert => {
    riskScore -= (alert.percentage - 100) * 0.5; 
  });
  riskScore = Math.max(0, Math.min(100, riskScore));

  return {
    totalSpent,
    categorySpending,
    overspendingAlerts,
    riskScore,
    healthStatus: riskScore > 80 ? 'Excellent' : riskScore > 50 ? 'Fair' : 'Poor'
  };
};

export const detectDuplicates = (expenses) => {
  const duplicates = [];
  const seen = {};

  expenses.forEach(e => {
    // A duplicate is likely same amount, same date, same merchant
    const key = `${e.amount}-${e.date}-${e.merchant}`;
    if (seen[key]) {
      duplicates.push({ original: seen[key], duplicate: e });
    } else {
      seen[key] = e;
    }
  });

  return duplicates;
};

export const generateRecommendations = (spendingAnalysis) => {
  const recs = [];
  
  if (spendingAnalysis.riskScore < 50) {
    recs.push({
      title: "High Risk Alert",
      desc: "Your spending has significantly exceeded budgets. Consider an immediate freeze on non-essential categories like Entertainment and Shopping.",
      type: "critical"
    });
  }

  const topOverspent = spendingAnalysis.overspendingAlerts.sort((a,b) => b.excess - a.excess)[0];
  if (topOverspent) {
    recs.push({
      title: `${topOverspent.category} Overrun`,
      desc: `You are ${topOverspent.percentage}% over budget in ${topOverspent.category}. AI suggests reallocating funds from your highest saving category to balance it.`,
      type: "warning"
    });
  }

  if (recs.length === 0) {
    recs.push({
      title: "Great Job!",
      desc: "Your finances are perfectly on track. Consider increasing your SIP investment by 5% this month.",
      type: "success"
    });
  }

  return recs;
};
