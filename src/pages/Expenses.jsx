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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newExpense, setNewExpense] = useState({
    merchant: '',
    category: 'Food',
    date: new Date().toISOString().split('T')[0],
    paymentMode: 'Credit Card',
    amount: ''
  });

  const exportToCSV = () => {
    if (expenses.length === 0) return;
    const headers = ['ID', 'Merchant', 'Category', 'Date', 'Payment Mode', 'Amount (₹)'];
    const csvRows = expenses.map(e => 
      [e.id, `"${e.merchant}"`, e.category, e.date, e.paymentMode, e.amount].join(',')
    );
    const csvContent = [headers.join(','), ...csvRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'expenses_export.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (newExpense.merchant && newExpense.amount) {
      dispatch({
        type: 'ADD_EXPENSE',
        payload: {
          id: `MANUAL-${Date.now()}`,
          ...newExpense,
          amount: Number(newExpense.amount)
        }
      });
      setIsModalOpen(false);
      setNewExpense({
        merchant: '',
        category: 'Food',
        date: new Date().toISOString().split('T')[0],
        paymentMode: 'Credit Card',
        amount: ''
      });
    }
  };

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
          <button 
            onClick={exportToCSV}
            className="glass-button flex items-center justify-center flex-1 md:flex-none hover:bg-black/10 dark:hover:bg-white/5 transition-colors"
          >
            <Download size={18} className="mr-2" />
            Export CSV
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="glass-button bg-fin-primary text-[var(--text-light)] hover:bg-fin-primary/90 flex items-center justify-center flex-1 md:flex-none shadow-[0_0_15px_rgba(34,197,94,0.5)] border-transparent text-black"
          >
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
                      ₹{expense.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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

      {/* Add Manual Expense Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-[var(--panel-color)] border border-[var(--border-color)] rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="flex justify-between items-center p-6 border-b border-[var(--border-color)]">
              <h3 className="text-xl font-bold">Add Manual Expense</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
              >
                <Trash2 size={20} className="hidden" /> {/* Placeholder for X icon if imported, else just text */}
                <span className="text-xl leading-none">&times;</span>
              </button>
            </div>
            
            <form onSubmit={handleAddSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Merchant</label>
                <input 
                  type="text" 
                  value={newExpense.merchant}
                  onChange={(e) => setNewExpense({...newExpense, merchant: e.target.value})}
                  placeholder="e.g., Amazon, Starbucks"
                  className="w-full px-4 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-[var(--border-color)] focus:outline-none focus:border-fin-primary"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <select 
                    value={newExpense.category}
                    onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}
                    className="w-full px-4 py-2 rounded-xl bg-[var(--bg-color)] border border-[var(--border-color)] focus:outline-none focus:border-fin-primary"
                  >
                    {categories.filter(c => c !== 'All').map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Amount (₹)</label>
                  <input 
                    type="number" 
                    value={newExpense.amount}
                    onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                    placeholder="0.00"
                    className="w-full px-4 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-[var(--border-color)] focus:outline-none focus:border-fin-primary"
                    required
                    min="0.01"
                    step="0.01"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Date</label>
                  <input 
                    type="date" 
                    value={newExpense.date}
                    onChange={(e) => setNewExpense({...newExpense, date: e.target.value})}
                    className="w-full px-4 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-[var(--border-color)] focus:outline-none focus:border-fin-primary style-date-input"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Payment Mode</label>
                  <select 
                    value={newExpense.paymentMode}
                    onChange={(e) => setNewExpense({...newExpense, paymentMode: e.target.value})}
                    className="w-full px-4 py-2 rounded-xl bg-[var(--bg-color)] border border-[var(--border-color)] focus:outline-none focus:border-fin-primary"
                  >
                    <option value="Credit Card">Credit Card</option>
                    <option value="Debit Card">Debit Card</option>
                    <option value="UPI">UPI</option>
                    <option value="Cash">Cash</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                  </select>
                </div>
              </div>
              
              <div className="pt-4 flex space-x-3">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 rounded-xl border border-[var(--border-color)] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-2 rounded-xl bg-fin-primary text-white font-bold hover:bg-fin-primary/90 transition-colors shadow-lg shadow-fin-primary/30"
                >
                  Add Expense
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Expenses;
