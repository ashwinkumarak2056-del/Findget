import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Plus, Search, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import GlassCard from '../../components/GlassCard';
import { useAppContext } from '../../context/AppContext';

const Invoices = () => {
  const { state } = useAppContext();
  const { invoices } = state;
  const [searchTerm, setSearchTerm] = useState('');

  const filteredInvoices = invoices.filter(inv => 
    inv.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inv.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Paid': return <CheckCircle size={16} className="text-green-500" />;
      case 'Pending': return <Clock size={16} className="text-yellow-500" />;
      case 'Overdue': return <AlertCircle size={16} className="text-red-500" />;
      default: return null;
    }
  };

  const getStatusStyle = (status) => {
    switch(status) {
      case 'Paid': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'Pending': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'Overdue': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return '';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold mb-1">Invoice Management</h2>
          <p className="text-[var(--text-muted)] text-sm">Commercial bulk upload and GST tracking</p>
        </div>
        
        <div className="flex space-x-3 w-full md:w-auto">
          <button className="glass-button flex items-center justify-center flex-1 md:flex-none">
            <Download size={18} className="mr-2" />
            Export Report
          </button>
          <button className="glass-button bg-fin-primary text-[var(--text-light)] hover:bg-fin-primary/90 flex items-center justify-center flex-1 md:flex-none shadow-[0_0_15px_rgba(34,197,94,0.5)] border-transparent text-black">
            <Plus size={18} className="mr-2" />
            Bulk Upload
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <GlassCard hover>
          <p className="text-[var(--text-muted)] text-sm mb-1">Total Invoiced</p>
          <h3 className="text-2xl font-bold">${invoices.reduce((acc, inv) => acc + inv.amount, 0).toLocaleString()}</h3>
        </GlassCard>
        <GlassCard hover>
          <p className="text-[var(--text-muted)] text-sm mb-1">Total GST Extract</p>
          <h3 className="text-2xl font-bold text-fin-primary">${invoices.reduce((acc, inv) => acc + inv.gst, 0).toLocaleString()}</h3>
        </GlassCard>
        <GlassCard hover>
          <p className="text-[var(--text-muted)] text-sm mb-1">Pending Payment</p>
          <h3 className="text-2xl font-bold text-yellow-500">${invoices.filter(i => i.status === 'Pending').reduce((acc, inv) => acc + inv.amount, 0).toLocaleString()}</h3>
        </GlassCard>
      </div>

      <GlassCard className="p-0 overflow-hidden">
        <div className="p-4 border-b border-[var(--border-color)] bg-black/10 dark:bg-white/5">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={18} />
            <input 
              type="text" 
              placeholder="Search Invoice ID or Vendor..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="glass-input pl-10"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--border-color)] text-[var(--text-muted)] text-sm uppercase tracking-wider bg-black/20 dark:bg-white/5">
                <th className="p-4 font-medium">Invoice ID</th>
                <th className="p-4 font-medium">Vendor</th>
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">GST Extracted</th>
                <th className="p-4 font-medium text-right">Total Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)]">
              {filteredInvoices.length > 0 ? (
                filteredInvoices.map((inv) => (
                  <motion.tr 
                    key={inv.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    <td className="p-4 font-medium flex items-center space-x-2">
                      <FileText size={16} className="text-[var(--text-muted)]" />
                      <span>{inv.id}</span>
                    </td>
                    <td className="p-4 text-[var(--text-primary)]">{inv.vendor}</td>
                    <td className="p-4 text-sm text-[var(--text-muted)]">{inv.date}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusStyle(inv.status)}`}>
                        {getStatusIcon(inv.status)}
                        <span>{inv.status}</span>
                      </span>
                    </td>
                    <td className="p-4 text-right text-fin-primary">${inv.gst.toFixed(2)}</td>
                    <td className="p-4 text-right font-bold">${inv.amount.toFixed(2)}</td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-[var(--text-muted)]">
                    No invoices found.
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

export default Invoices;
