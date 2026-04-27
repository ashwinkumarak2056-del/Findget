import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Download, Plus, MoreVertical, Trash2, Edit2 } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import { useAppContext } from '../context/AppContext';

const Expenses = () => {
  const { state, dispatch } = useAppContext();
  const { expenses } = state;
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const categories = ['All', 'Food', 'Transport', 'Shopping', 'Utilities', 'Entertainment', 'Healthcare', 'Miscellaneous'];

  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = expense.merchant.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || expense.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleDelete = (id) => {
    if(window.confirm('Are you sure you want to delete this expense?')) {
      dispatch({ type: 'DELETE_EXPENSE', payload: id });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold mb-1">Expense Tracking</h2>
          <p className="text-[var(--text-muted)] text-sm">Manage and analyze your spending history</p>
        </div>
        
        <div className="flex space-x-3 w-full md:w-auto">
          <button className="glass-button flex items-center justify-center flex-1 md:flex-none">
            <Download size={18} className="mr-2" />
            Export CSV
          </button>
          <button className="glass-button bg-fin-primary text-[var(--text-light)] hover:bg-fin-primary/90 flex items-center justify-center flex-1 md:flex-none shadow-[0_0_15px_rgba(34,197,94,0.5)] border-transparent text-black">
            <Plus size={18} className="mr-2" />
            Add Manual
          </button>
        </div>
      </div>

      <GlassCard className="p-0 overflow-hidden">
        {/* Filters Bar */}
        <div className="p-4 border-b border-[var(--border-color)] flex flex-col md:flex-row justify-between gap-4 bg-black/10 dark:bg-white/5">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={18} />
            <input 
              type="text" 
              placeholder="Search merchants..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="glass-input pl-10"
            />
          </div>
          
          <div className="flex space-x-2 overflow-x-auto custom-scrollbar pb-2 md:pb-0">
            {categories.map(cat => (
              <button 
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-colors border ${
                  categoryFilter === cat 
                    ? 'bg-fin-primary/20 border-fin-primary/50 text-fin-primary' 
                    : 'bg-transparent border-transparent text-[var(--text-muted)] hover:bg-black/10 dark:hover:bg-white/10 hover:border-[var(--border-color)]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--border-color)] text-[var(--text-muted)] text-sm uppercase tracking-wider bg-black/20 dark:bg-white/5">
                <th className="p-4 font-medium">Merchant</th>
                <th className="p-4 font-medium">Category</th>
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium">Payment Mode</th>
                <th className="p-4 font-medium text-right">Amount</th>
                <th className="p-4 font-medium text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)]">
              {filteredExpenses.length > 0 ? (
                filteredExpenses.map((expense) => (
                  <motion.tr 
                    key={expense.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors group"
                  >
                    <td className="p-4">
                      <div className="font-medium text-[var(--text-primary)]">{expense.merchant}</div>
                    </td>
                    <td className="p-4">
                      <span className="inline-block px-3 py-1 rounded-full bg-fin-primary/10 text-fin-primary text-xs font-medium border border-fin-primary/20">
                        {expense.category}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-[var(--text-muted)]">{expense.date}</td>
                    <td className="p-4 text-sm text-[var(--text-muted)]">{expense.paymentMode}</td>
                    <td className="p-4 text-right font-bold text-[var(--text-primary)]">
                      ₹{expense.amount.toLocaleString(undefined, {minimumFractionDigits: 2})}
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 hover:bg-fin-primary/20 rounded-lg text-fin-primary transition-colors">
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(expense.id)}
                          className="p-2 hover:bg-red-500/20 rounded-lg text-red-400 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-[var(--text-muted)]">
                    No expenses found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
};

export default Expenses;
