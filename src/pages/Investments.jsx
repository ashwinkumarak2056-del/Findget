import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, AlertCircle, Info, Calculator, Sparkles } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import { CustomLineChart } from '../components/Charts';
import { useAppContext } from '../context/AppContext';

const Investments = () => {
  const { state } = useAppContext();
  const financialProfile = state.settings.financialProfile?.[state.settings.userMode] || null;
  const defaultInvestment = (financialProfile?.savingsGoal) || 10000;

  const [monthlyInvestment, setMonthlyInvestment] = useState(defaultInvestment);
  const [expectedReturn, setExpectedReturn] = useState(12);
  const [years, setYears] = useState(10);
  const [isStepUpMode, setIsStepUpMode] = useState(false);

  // Derive total income for dynamic calculations
  let totalIncome = 0;
  if (state.settings.userMode === 'personal' && financialProfile) {
    totalIncome = (financialProfile.fixedIncome || 0) + (financialProfile.variableIncome || 0);
  } else if (state.settings.userMode === 'commercial' && financialProfile) {
    totalIncome = financialProfile.monthlyRevenueTarget || 0;
  }
  
  // Calculate average monthly expense for emergency fund
  const avgExpense = state.expenses.reduce((acc, e) => acc + e.amount, 0) || 30000;
  const emergencyFundTarget = avgExpense * 6;
  const currentEmergencyFund = (totalIncome * 0.1) * 4; // Mock 4 months of 10% income savings
  const emergencyFundPercent = Math.min(100, Math.round((currentEmergencyFund / emergencyFundTarget) * 100));

  const savingsRate = totalIncome > 0 ? ((financialProfile?.savingsGoal || 0) / totalIncome) * 100 : 20;

  // Simple SIP Calculator
  const generateProjection = (stepUp = false) => {
    const data = [];
    const monthlyRate = expectedReturn / 12 / 100;
    let totalInvested = 0;
    let futureValue = 0;
    let currentMonthlySIP = monthlyInvestment;

    for (let i = 1; i <= years; i++) {
      for (let m = 1; m <= 12; m++) {
        totalInvested += currentMonthlySIP;
        futureValue = (futureValue + currentMonthlySIP) * (1 + monthlyRate);
      }
      
      data.push({
        name: `Year ${i}`,
        invested: totalInvested,
        wealth: futureValue
      });

      if (stepUp) {
        currentMonthlySIP = currentMonthlySIP * 1.10; // 10% annual step-up
      }
    }
    return data;
  };

  const projectionData = generateProjection(isStepUpMode);
  const standardProjection = generateProjection(false);
  const stepUpProjection = generateProjection(true);
  
  const finalWealth = projectionData[projectionData.length - 1]?.wealth || 0;
  const totalInvested = projectionData[projectionData.length - 1]?.invested || 0;

  const standardWealth = standardProjection[standardProjection.length - 1]?.wealth || 0;
  const stepUpWealth = stepUpProjection[stepUpProjection.length - 1]?.wealth || 0;
  const stepUpDifference = stepUpWealth - standardWealth;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold mb-1">Investment & Wealth Advisory</h2>
          <p className="text-[var(--text-muted)] text-sm">AI-driven SIP suggestions and wealth forecasting</p>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-start space-x-3 text-blue-400">
        <Info size={20} className="shrink-0 mt-0.5" />
        <p className="text-sm">
          <strong>Disclaimer:</strong> AI-generated financial insights and projections are for educational purposes only and do not constitute professional financial advice. Always consult with a certified financial planner before making investment decisions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* SIP Calculator Controls */}
        <GlassCard className="space-y-6 h-full">
          <div className="flex items-center space-x-2 text-fin-primary mb-2">
            <Calculator size={20} />
            <h3 className="font-bold text-lg text-[var(--text-primary)]">SIP Calculator</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="flex justify-between text-sm text-[var(--text-muted)] mb-2">
                <span>Monthly Investment (₹)</span>
                <span className="font-bold text-[var(--text-primary)]">{monthlyInvestment}</span>
              </label>
              <input 
                type="range" 
                min="1000" max="100000" step="1000"
                value={monthlyInvestment}
                onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
                className="w-full accent-fin-primary"
              />
            </div>

            <div>
              <label className="flex justify-between text-sm text-[var(--text-muted)] mb-2">
                <span>Expected Return (%)</span>
                <span className="font-bold text-[var(--text-primary)]">{expectedReturn}%</span>
              </label>
              <input 
                type="range" 
                min="5" max="25" step="1"
                value={expectedReturn}
                onChange={(e) => setExpectedReturn(Number(e.target.value))}
                className="w-full accent-fin-primary"
              />
            </div>

            <div>
              <label className="flex justify-between text-sm text-[var(--text-muted)] mb-2">
                <span>Time Period (Years)</span>
                <span className="font-bold text-[var(--text-primary)]">{years}</span>
              </label>
              <input 
                type="range" 
                min="1" max="30" step="1"
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
                className="w-full accent-fin-primary"
              />
            </div>
          </div>

          <div className="mt-8 p-4 rounded-xl bg-black/20 dark:bg-white/5 border border-[var(--border-color)]">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-[var(--text-muted)]">Total Invested:</span>
               <span className="font-bold">₹{totalInvested.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-[var(--text-muted)]">Est. Returns:</span>
               <span className="font-bold text-fin-primary">₹{(finalWealth - totalInvested).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div className="h-px bg-[var(--border-color)] my-3" />
            <div className="flex justify-between">
              <span className="font-bold">Total Wealth:</span>
               <span className="text-xl font-bold text-fin-primary">₹{finalWealth.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
          </div>
        </GlassCard>

        {/* Chart */}
        <GlassCard className="lg:col-span-2 h-[500px] flex flex-col">
          <h3 className="font-bold text-lg mb-4">Wealth Growth Projection</h3>
          <div className="flex-1">
            <CustomLineChart 
              data={projectionData}
              lines={[
                { dataKey: 'wealth', color: '#22c55e', name: 'Total Wealth' },
                { dataKey: 'invested', color: '#8b5cf6', name: 'Total Invested' }
              ]}
            />
          </div>
        </GlassCard>

        {/* AI Suggestions */}
        <GlassCard className="lg:col-span-3 bg-gradient-to-r from-[var(--panel-color)] to-fin-primary/5">
          <div className="flex items-center space-x-2 text-fin-primary mb-4">
            <Sparkles size={20} />
            <h3 className="font-bold text-lg text-[var(--text-primary)]">AI Investment Recommendations</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 rounded-xl bg-black/10 dark:bg-white/5 border border-transparent hover:border-fin-primary/30 transition-colors">
              <h4 className="font-bold text-sm text-fin-primary mb-2">Step-up SIP Strategy</h4>
              <p className="text-xs text-[var(--text-muted)] mb-3">
                Based on historical income growth, increasing your SIP by 10% annually could yield an additional <strong className="text-[var(--text-primary)]">₹{stepUpDifference.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</strong> over {years} years.
              </p>
              <button 
                onClick={() => setIsStepUpMode(!isStepUpMode)}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${isStepUpMode ? 'bg-fin-primary text-white' : 'text-fin-primary bg-fin-primary/10 hover:bg-fin-primary/20'}`}
              >
                {isStepUpMode ? 'Disable Step-up' : 'Simulate Step-up'}
              </button>
            </div>
            
            <div className="p-4 rounded-xl bg-black/10 dark:bg-white/5 border border-transparent hover:border-fin-primary/30 transition-colors">
              <h4 className="font-bold text-sm text-fin-primary mb-2">
                Risk Profile: {savingsRate > 20 ? 'Moderate-Aggressive' : 'Conservative'}
              </h4>
              <p className="text-xs text-[var(--text-muted)] mb-3">
                Your savings rate is {savingsRate.toFixed(1)}%. Consider allocating {savingsRate > 20 ? '70% to Index Funds and 30% to Large Cap' : '60% to Debt and 40% to Large Cap'} for optimal growth.
              </p>
              <button 
                onClick={() => window.alert(`Recommended Portfolio Mix:\n\n${savingsRate > 20 ? '- 70% Nifty 50 Index Fund\n- 20% Bluechip Equity\n- 10% Gold/Debt' : '- 60% Corporate Bonds/FDs\n- 30% Bluechip Equity\n- 10% Gold'}`)}
                className="text-xs font-bold px-3 py-1.5 rounded-lg text-fin-primary bg-fin-primary/10 hover:bg-fin-primary/20 transition-colors"
              >
                View Portfolio Mix
              </button>
            </div>
            
            <div className="p-4 rounded-xl bg-black/10 dark:bg-white/5 border border-transparent hover:border-yellow-500/30 transition-colors">
              <h4 className="font-bold text-sm text-fin-primary mb-2">Emergency Fund Status</h4>
              <p className="text-xs text-[var(--text-muted)] mb-3">
                AI suggests maintaining 6 months of expenses (₹{emergencyFundTarget.toLocaleString('en-IN', { maximumFractionDigits: 0 })}) before increasing market investments.
              </p>
              <div className="flex justify-between text-xs mb-1">
                <span>₹{currentEmergencyFund.toLocaleString('en-IN', { maximumFractionDigits: 0 })} saved</span>
                <span className="font-bold text-yellow-500">{emergencyFundPercent}%</span>
              </div>
              <div className="w-full bg-black/20 rounded-full h-1.5">
                <div className="bg-yellow-500 h-1.5 rounded-full transition-all duration-1000" style={{ width: `${emergencyFundPercent}%` }}></div>
              </div>
            </div>
          </div>
        </GlassCard>

      </div>
    </div>
  );
};

export default Investments;
