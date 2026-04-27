import React from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit, AlertOctagon, Lightbulb, TrendingUp, ShieldAlert, Copy } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import { CustomBarChart } from '../components/Charts';
import { useAppContext } from '../context/AppContext';
import { analyzeSpending, detectDuplicates, generateRecommendations } from '../utils/aiEngine';

const Insights = () => {
  const { state } = useAppContext();
  const { expenses, budgets } = state;

  const analysis = analyzeSpending(expenses, budgets);
  const duplicates = detectDuplicates(expenses);
  const recommendations = generateRecommendations(analysis);

  // Mock forecast data
  const forecastData = [
    { name: 'Jan', actual: 2100, forecast: 2100 },
    { name: 'Feb', actual: 2350, forecast: 2300 },
    { name: 'Mar', actual: 1900, forecast: 2000 },
    { name: 'Apr', actual: analysis.totalSpent, forecast: 2200 },
    { name: 'May', actual: 0, forecast: 2150 },
    { name: 'Jun', actual: 0, forecast: 2050 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-8">
        <div className="p-3 bg-gradient-to-tr from-fin-primary to-emerald-400 rounded-xl">
          <BrainCircuit className="text-white" size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-1">Financial Intelligence</h2>
          <p className="text-[var(--text-muted)] text-sm">AI-powered analysis of your spending behavior</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Risk Score & Alerts */}
        <div className="space-y-6">
          <GlassCard className="text-center">
            <h3 className="font-bold text-[var(--text-muted)] mb-4">Financial Risk Score</h3>
            <div className="relative inline-flex items-center justify-center mb-4">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle cx="64" cy="64" r="56" stroke="rgba(255,255,255,0.1)" strokeWidth="12" fill="none" />
                <motion.circle 
                  cx="64" cy="64" r="56" 
                  stroke={analysis.riskScore > 80 ? '#22c55e' : analysis.riskScore > 50 ? '#f59e0b' : '#ef4444'} 
                  strokeWidth="12" fill="none" 
                  strokeDasharray="351.8" 
                  initial={{ strokeDashoffset: 351.8 }}
                  animate={{ strokeDashoffset: 351.8 - (351.8 * analysis.riskScore) / 100 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold">{analysis.riskScore}</span>
                <span className="text-xs text-[var(--text-muted)]">/ 100</span>
              </div>
            </div>
            <p className="text-sm font-medium">Status: <span className={analysis.healthStatus === 'Excellent' ? 'text-fin-primary' : analysis.healthStatus === 'Fair' ? 'text-yellow-500' : 'text-red-500'}>{analysis.healthStatus}</span></p>
          </GlassCard>

          <GlassCard>
            <h3 className="font-bold mb-4 flex items-center">
              <Lightbulb className="mr-2 text-yellow-500" size={20} /> 
              Smart Recommendations
            </h3>
            <div className="space-y-4">
              {recommendations.map((rec, idx) => (
                <div key={idx} className={`p-4 rounded-xl border ${
                  rec.type === 'critical' ? 'bg-red-500/10 border-red-500/20' :
                  rec.type === 'warning' ? 'bg-yellow-500/10 border-yellow-500/20' :
                  'bg-fin-primary/10 border-fin-primary/20'
                }`}>
                  <h4 className={`font-bold mb-1 text-sm ${
                    rec.type === 'critical' ? 'text-red-400' :
                    rec.type === 'warning' ? 'text-yellow-400' :
                    'text-fin-primary'
                  }`}>{rec.title}</h4>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed">{rec.desc}</p>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Main Analysis Area */}
        <div className="lg:col-span-2 space-y-6">
          
          <GlassCard className="h-80 flex flex-col">
            <h3 className="font-bold mb-4 flex items-center">
              <TrendingUp className="mr-2 text-blue-500" size={20} /> 
              Spending Forecast (6 Months)
            </h3>
            <div className="flex-1">
              <CustomBarChart 
                data={forecastData} 
                bars={[
                  { dataKey: 'actual', color: '#22c55e' },
                  { dataKey: 'forecast', color: 'rgba(34, 197, 94, 0.3)' }
                ]}
              />
            </div>
          </GlassCard>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GlassCard>
              <h3 className="font-bold mb-4 flex items-center">
                <AlertOctagon className="mr-2 text-red-500" size={20} /> 
                Overspending Predictions
              </h3>
              {analysis.overspendingAlerts.length > 0 ? (
                <div className="space-y-3">
                  {analysis.overspendingAlerts.map((alert, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 bg-black/20 dark:bg-white/5 rounded-lg">
                      <span className="text-sm font-medium">{alert.category}</span>
                      <span className="text-sm text-red-400 font-bold">+{alert.percentage}%</span>
                    </div>
                  ))}
                  <p className="text-xs text-[var(--text-muted)] mt-2">AI predicts you will exceed limits in these categories based on current run-rate.</p>
                </div>
              ) : (
                <p className="text-sm text-[var(--text-muted)] text-center py-8">No overspending predicted this month.</p>
              )}
            </GlassCard>

            <GlassCard>
              <h3 className="font-bold mb-4 flex items-center">
                <Copy className="mr-2 text-purple-500" size={20} /> 
                Duplicate Detection
              </h3>
              {duplicates.length > 0 ? (
                <div className="space-y-3">
                  {duplicates.map((dup, idx) => (
                    <div key={idx} className="p-3 bg-black/20 dark:bg-white/5 rounded-lg border border-red-500/30">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">{dup.duplicate.merchant}</span>
                        <span className="text-sm font-bold">${dup.duplicate.amount}</span>
                      </div>
                      <p className="text-xs text-[var(--text-muted)]">Potential duplicate charge on {dup.duplicate.date}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-6 text-[var(--text-muted)]">
                  <ShieldAlert size={32} className="mb-2 opacity-50" />
                  <p className="text-sm">No suspicious duplicates found.</p>
                </div>
              )}
            </GlassCard>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Insights;
