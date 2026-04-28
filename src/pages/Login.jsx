import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserCircle, Briefcase, ChevronRight, ArrowLeft } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const Login = () => {
  const { state, dispatch } = useAppContext();
  const [step, setStep] = useState('select_mode'); // 'select_mode' | 'financial_setup'
  const [selectedMode, setSelectedMode] = useState(null); // 'personal' | 'commercial'
  
  // Use predefined data from sampleData.js if available, otherwise fallback to empty/defaults
  const [personalData, setPersonalData] = useState({
    fixedIncome: state.settings.financialProfile?.personal?.fixedIncome || 50000,
    variableIncome: state.settings.financialProfile?.personal?.variableIncome || 10000,
    savingsGoal: state.settings.financialProfile?.personal?.savingsGoal || 15000,
    precommittedExpenses: state.settings.financialProfile?.personal?.precommittedExpenses || 15000
  });

  const [commercialData, setCommercialData] = useState({
    monthlyRevenueTarget: state.settings.financialProfile?.commercial?.monthlyRevenueTarget || 500000,
    operatingBudget: state.settings.financialProfile?.commercial?.operatingBudget || 350000,
    taxReservePercent: state.settings.financialProfile?.commercial?.taxReservePercent || 18,
    precommittedExpenses: state.settings.financialProfile?.commercial?.precommittedExpenses || 100000
  });

  // Clear old cached state and ensure fresh data on every login
  useEffect(() => {
    localStorage.removeItem('finAppState');
    dispatch({ type: 'LOGOUT' });
  }, [dispatch]);

  const handleModeSelect = (mode) => {
    setSelectedMode(mode);
    setStep('financial_setup');
  };

  const handleFinalSubmit = (e) => {
    e.preventDefault();
    const payloadData = selectedMode === 'personal' ? personalData : commercialData;
    
    // Save financial profile
    dispatch({ 
      type: 'SET_FINANCIAL_PROFILE', 
      payload: { mode: selectedMode, data: payloadData } 
    });
    
    // Log in
    dispatch({ type: 'LOGIN', payload: selectedMode });
  };

  return (
    <div className="min-h-screen bg-[var(--bg-color)] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-fin-primary/20 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px]" />

      <div className="z-10 text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-tr from-fin-primary to-emerald-400 shadow-[0_0_30px_rgba(34,197,94,0.3)] mb-6">
          <span className="font-bold text-white text-3xl">B</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-fin-primary to-emerald-300 mb-4">
          Budgify
        </h1>
        <p className="text-xl text-[var(--text-muted)]">Financial Intelligence Platform</p>
      </div>

      <AnimatePresence mode="wait">
        {step === 'select_mode' && (
          <motion.div 
            key="select_mode"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 z-10"
          >
            {/* Personal Option */}
            <motion.div 
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleModeSelect('personal')}
              className="bg-[var(--panel-color)] backdrop-blur-xl border border-[var(--border-color)] hover:border-fin-primary/50 rounded-2xl p-8 cursor-pointer group transition-all shadow-lg hover:shadow-[0_0_30px_rgba(34,197,94,0.15)] flex flex-col h-full"
            >
              <div className="w-16 h-16 rounded-2xl bg-fin-primary/10 flex items-center justify-center text-fin-primary mb-6 group-hover:scale-110 transition-transform">
                <UserCircle size={32} />
              </div>
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-3 flex items-center justify-between">
                Personal Use
                <ChevronRight className="text-[var(--text-muted)] group-hover:text-fin-primary group-hover:translate-x-1 transition-all" />
              </h2>
              <p className="text-[var(--text-muted)] leading-relaxed flex-grow">
                Track daily expenses, manage personal budgets, receive AI-driven SIP investment advice, and scan receipts effortlessly.
              </p>
            </motion.div>

            {/* Commercial Option */}
            <motion.div 
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleModeSelect('commercial')}
              className="bg-[var(--panel-color)] backdrop-blur-xl border border-[var(--border-color)] hover:border-fin-primary/50 rounded-2xl p-8 cursor-pointer group transition-all shadow-lg hover:shadow-[0_0_30px_rgba(34,197,94,0.15)] flex flex-col h-full"
            >
              <div className="w-16 h-16 rounded-2xl bg-fin-primary/10 flex items-center justify-center text-fin-primary mb-6 group-hover:scale-110 transition-transform">
                <Briefcase size={32} />
              </div>
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-3 flex items-center justify-between">
                Commercial Use
                <ChevronRight className="text-[var(--text-muted)] group-hover:text-fin-primary group-hover:translate-x-1 transition-all" />
              </h2>
              <p className="text-[var(--text-muted)] leading-relaxed flex-grow">
                Enterprise procurement analytics, bulk invoice scanning, vendor tracking, and AI-powered financial risk analysis.
              </p>
            </motion.div>
          </motion.div>
        )}

        {step === 'financial_setup' && (
          <motion.div
            key="financial_setup"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="w-full max-w-xl z-10"
          >
            <div className="bg-[var(--panel-color)] backdrop-blur-xl border border-[var(--border-color)] rounded-2xl p-8 shadow-lg">
              <button 
                onClick={() => setStep('select_mode')}
                className="flex items-center text-sm text-[var(--text-muted)] hover:text-fin-primary mb-6 transition-colors"
              >
                <ArrowLeft size={16} className="mr-1" /> Back
              </button>
              
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
                {selectedMode === 'personal' ? 'Personal Financial Setup' : 'Commercial Financial Setup'}
              </h2>
              <p className="text-[var(--text-muted)] mb-6 text-sm">
                Provide your baseline data so we can accurately calculate your budget insights.
              </p>

              <form onSubmit={handleFinalSubmit} className="space-y-4">
                {selectedMode === 'personal' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-1">Monthly Fixed Income (₹)</label>
                      <input 
                        type="number" 
                        value={personalData.fixedIncome}
                        onChange={e => setPersonalData({...personalData, fixedIncome: Number(e.target.value)})}
                        className="w-full px-4 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-[var(--border-color)] focus:outline-none focus:border-fin-primary"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Expected Variable Income (₹)</label>
                      <input 
                        type="number" 
                        value={personalData.variableIncome}
                        onChange={e => setPersonalData({...personalData, variableIncome: Number(e.target.value)})}
                        className="w-full px-4 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-[var(--border-color)] focus:outline-none focus:border-fin-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Monthly Savings Goal (₹)</label>
                      <input 
                        type="number" 
                        value={personalData.savingsGoal}
                        onChange={e => setPersonalData({...personalData, savingsGoal: Number(e.target.value)})}
                        className="w-full px-4 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-[var(--border-color)] focus:outline-none focus:border-fin-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Precommitted Expenses (₹)</label>
                      <input 
                        type="number" 
                        value={personalData.precommittedExpenses}
                        onChange={e => setPersonalData({...personalData, precommittedExpenses: Number(e.target.value)})}
                        className="w-full px-4 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-[var(--border-color)] focus:outline-none focus:border-fin-primary"
                        placeholder="e.g. Rent, EMIs"
                      />
                    </div>
                  </>
                )}

                {selectedMode === 'commercial' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-1">Monthly Revenue Target (₹)</label>
                      <input 
                        type="number" 
                        value={commercialData.monthlyRevenueTarget}
                        onChange={e => setCommercialData({...commercialData, monthlyRevenueTarget: Number(e.target.value)})}
                        className="w-full px-4 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-[var(--border-color)] focus:outline-none focus:border-fin-primary"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Monthly Operating Budget (₹)</label>
                      <input 
                        type="number" 
                        value={commercialData.operatingBudget}
                        onChange={e => setCommercialData({...commercialData, operatingBudget: Number(e.target.value)})}
                        className="w-full px-4 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-[var(--border-color)] focus:outline-none focus:border-fin-primary"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Tax Reserve (%)</label>
                      <input 
                        type="number" 
                        value={commercialData.taxReservePercent}
                        onChange={e => setCommercialData({...commercialData, taxReservePercent: Number(e.target.value)})}
                        className="w-full px-4 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-[var(--border-color)] focus:outline-none focus:border-fin-primary"
                        min="0" max="100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Precommitted Expenses (₹)</label>
                      <input 
                        type="number" 
                        value={commercialData.precommittedExpenses}
                        onChange={e => setCommercialData({...commercialData, precommittedExpenses: Number(e.target.value)})}
                        className="w-full px-4 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-[var(--border-color)] focus:outline-none focus:border-fin-primary"
                        placeholder="e.g. Rent, Fixed Payroll"
                      />
                    </div>
                  </>
                )}

                <button 
                  type="submit"
                  className="w-full mt-6 py-3 bg-fin-primary text-white rounded-xl font-bold hover:bg-fin-primary/90 transition-colors shadow-[0_0_20px_rgba(34,197,94,0.3)]"
                >
                  Continue to Dashboard
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <p className="text-[var(--text-muted)] text-sm mt-12 z-10">
        © 2026 Budgify Technologies. All rights reserved.
      </p>
    </div>
  );
};

export default Login;
