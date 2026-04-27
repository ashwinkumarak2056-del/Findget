import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, AlertCircle, Info, Calculator, Sparkles } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import { CustomLineChart } from '../components/Charts';
import { useAppContext } from '../context/AppContext';

const Investments = () => {
  const { state } = useAppContext();
  const [monthlyInvestment, setMonthlyInvestment] = useState(10000);
  const [expectedReturn, setExpectedReturn] = useState(12);
  const [years, setYears] = useState(10);

  // Simple SIP Calculator
  const generateProjection = () => {
    const data = [];
    const monthlyRate = expectedReturn / 12 / 100;
    let totalInvested = 0;
    let futureValue = 0;

    for (let i = 1; i <= years; i++) {
      const months = i * 12;
      totalInvested = monthlyInvestment * months;
      futureValue = monthlyInvestment * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
      
      data.push({
        name: `Year ${i}`,
        invested: totalInvested,
        wealth: futureValue
      });
    }
    return data;
  };

  const projectionData = generateProjection();
  const finalWealth = projectionData[projectionData.length - 1]?.wealth || 0;
  const totalInvested = projectionData[projectionData.length - 1]?.invested || 0;

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
               <span className="font-bold">₹{totalInvested.toLocaleString(undefined, {maximumFractionDigits:0})}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-[var(--text-muted)]">Est. Returns:</span>
               <span className="font-bold text-fin-primary">₹{(finalWealth - totalInvested).toLocaleString(undefined, {maximumFractionDigits:0})}</span>
            </div>
            <div className="h-px bg-[var(--border-color)] my-3" />
            <div className="flex justify-between">
              <span className="font-bold">Total Wealth:</span>
               <span className="text-xl font-bold text-fin-primary">₹{finalWealth.toLocaleString(undefined, {maximumFractionDigits:0})}</span>
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
            <div className="p-4 rounded-xl bg-black/10 dark:bg-white/5">
              <h4 className="font-bold text-sm text-fin-primary mb-2">Step-up SIP Strategy</h4>
              <p className="text-xs text-[var(--text-muted)] mb-3">Based on your historical income growth, increasing your SIP by 10% annually could yield an additional ₹84L over 10 years.</p>
              <button className="text-xs font-bold text-fin-primary hover:underline">Simulate Step-up</button>
            </div>
            <div className="p-4 rounded-xl bg-black/10 dark:bg-white/5">
              <h4 className="font-bold text-sm text-fin-primary mb-2">Risk Profile: Moderate-Aggressive</h4>
              <p className="text-xs text-[var(--text-muted)] mb-3">Your spending patterns indicate a high savings rate. Consider allocating 70% to Index Funds and 30% to Large Cap for optimal growth.</p>
              <button className="text-xs font-bold text-fin-primary hover:underline">View Portfolio Mix</button>
            </div>
            <div className="p-4 rounded-xl bg-black/10 dark:bg-white/5">
              <h4 className="font-bold text-sm text-fin-primary mb-2">Emergency Fund Status</h4>
              <p className="text-xs text-[var(--text-muted)] mb-3">You currently have 4 months of expenses saved. AI suggests maintaining 6 months (₹1,50,000) before increasing market investments.</p>
              <div className="w-full bg-black/20 rounded-full h-1.5 mt-2">
                <div className="bg-yellow-500 h-1.5 rounded-full" style={{ width: '66%' }}></div>
              </div>
            </div>
          </div>
        </GlassCard>

      </div>
    </div>
  );
};

export default Investments;
