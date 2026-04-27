import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RefreshCcw, ArrowRightLeft, TrendingUp, Info, AlertCircle } from 'lucide-react';
import GlassCard from '../components/GlassCard';

const CurrencyConverter = () => {
  const [amount, setAmount] = useState(100);
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [convertedAmount, setConvertedAmount] = useState(0);
  const [rates, setRates] = useState({
    USD: 83.25,
    EUR: 89.40,
    GBP: 104.15,
    JPY: 0.55,
    AUD: 54.20,
    CAD: 61.10
  });

  useEffect(() => {
    setConvertedAmount(amount * rates[fromCurrency]);
  }, [amount, fromCurrency, rates]);

  const currencies = Object.keys(rates);

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-1">Currency Converter</h2>
        <p className="text-[var(--text-muted)] text-sm">Convert international currencies to INR for financial analysis</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <GlassCard className="space-y-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-lg">Conversion Tool</h3>
            <button className="text-fin-primary hover:bg-fin-primary/10 p-2 rounded-full transition-all">
              <RefreshCcw size={18} />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-[var(--text-muted)] mb-2">Amount</label>
              <input 
                type="number" 
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="glass-input text-xl font-bold"
              />
            </div>

            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="block text-sm text-[var(--text-muted)] mb-2">From</label>
                <select 
                  value={fromCurrency}
                  onChange={(e) => setFromCurrency(e.target.value)}
                  className="glass-input"
                >
                  {currencies.map(curr => (
                    <option key={curr} value={curr}>{curr}</option>
                  ))}
                </select>
              </div>
              <div className="mt-7 text-fin-primary">
                <ArrowRightLeft size={24} />
              </div>
              <div className="flex-1">
                <label className="block text-sm text-[var(--text-muted)] mb-2">To</label>
                <div className="glass-input bg-black/20 dark:bg-white/5 opacity-80 cursor-default">
                  INR (Fixed)
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 p-6 rounded-2xl bg-fin-primary/10 border border-fin-primary/30 text-center">
            <p className="text-sm text-[var(--text-muted)] mb-1">{amount} {fromCurrency} equals</p>
            <h3 className="text-4xl font-bold text-fin-primary">
              ₹{convertedAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h3>
            <p className="text-xs text-[var(--text-muted)] mt-4 italic">
              Exchange Rate: 1 {fromCurrency} = ₹{rates[fromCurrency]} INR
            </p>
          </div>
        </GlassCard>

        <div className="space-y-6">
          <GlassCard className="border-l-4 border-l-fin-primary">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <TrendingUp size={20} className="text-fin-primary" />
              Budget Impact Analysis
            </h3>
            <p className="text-sm text-[var(--text-muted)] mb-4">
              If this conversion represents a new expense, here is how it affects your current <strong>Shopping</strong> budget (₹24,000 limit):
            </p>
            
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span>Current Spent:</span>
                <span className="font-medium">₹12,000 (50%)</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>With New Expense:</span>
                <span className="font-bold text-yellow-500">
                  ₹{(12000 + convertedAmount).toLocaleString()} ({((12000 + convertedAmount)/24000*100).toFixed(1)}%)
                </span>
              </div>
              
              <div className="w-full bg-black/20 rounded-full h-2">
                <div 
                  className="bg-yellow-500 h-2 rounded-full transition-all duration-1000" 
                  style={{ width: `${Math.min(((12000 + convertedAmount)/24000*100), 100)}%` }}
                />
              </div>
              
              <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20 flex items-start gap-3 mt-4">
                <AlertCircle size={18} className="text-yellow-500 shrink-0 mt-0.5" />
                <p className="text-xs text-yellow-500/80">
                  Adding this expense will utilize {((convertedAmount/24000)*100).toFixed(1)}% of your remaining shopping budget.
                </p>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="bg-blue-500/10 border-blue-500/20">
            <h3 className="font-bold mb-2 flex items-center gap-2">
              <Info size={18} className="text-blue-400" />
              Why Convert?
            </h3>
            <ul className="text-sm text-[var(--text-muted)] space-y-2 list-disc pl-4">
              <li>Analyze international procurement costs in local currency.</li>
              <li>Estimate wealth growth for overseas investments (NRI portfolios).</li>
              <li>Track travel expenses and cross-border subscriptions precisely.</li>
            </ul>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default CurrencyConverter;
