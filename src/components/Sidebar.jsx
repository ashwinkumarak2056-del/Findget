import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Receipt, 
  CreditCard, 
  PieChart, 
  BrainCircuit, 
  TrendingUp, 
  Building2, 
  Settings,
  Users,
  ArrowRightLeft
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const Sidebar = () => {
  const { state } = useAppContext();
  const isCommercial = state.settings.userMode === 'commercial';

  const personalLinks = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Smart Scanner', path: '/scanner', icon: <Receipt size={20} /> },
    { name: 'Expenses', path: '/expenses', icon: <CreditCard size={20} /> },
    { name: 'Budget Planner', path: '/budget', icon: <PieChart size={20} /> },
    { name: 'Currency Converter', path: '/converter', icon: <ArrowRightLeft size={20} /> },
    { name: 'AI Insights', path: '/insights', icon: <BrainCircuit size={20} /> },
    { name: 'Investments', path: '/investments', icon: <TrendingUp size={20} /> },
  ];

  const commercialLinks = [
    ...personalLinks.slice(0, 5), // Reuse core ones
    { name: 'Invoices', path: '/commercial/invoices', icon: <Receipt size={20} /> },
    { name: 'Vendors', path: '/commercial/vendors', icon: <Users size={20} /> },
    { name: 'Enterprise Analytics', path: '/commercial/analytics', icon: <Building2 size={20} /> },
  ];

  const links = isCommercial ? commercialLinks : personalLinks;

  return (
    <motion.div 
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      className="w-64 h-screen fixed left-0 top-0 glass-panel !rounded-none border-t-0 border-l-0 border-b-0 flex flex-col z-20"
    >
      <div className="p-6 flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-fin-primary to-emerald-300 flex items-center justify-center shadow-[0_0_15px_rgba(34,197,94,0.5)]">
          <BrainCircuit className="text-white" size={24} />
        </div>
        <div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-fin-primary to-emerald-400">FinAI</h1>
          <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">
            {isCommercial ? 'Enterprise' : 'Personal'} Edition
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                isActive 
                  ? 'bg-fin-primary/20 text-fin-primary font-medium shadow-[inset_0_0_10px_rgba(34,197,94,0.1)]' 
                  : 'text-[var(--text-muted)] hover:bg-black/10 dark:hover:bg-white/5 hover:text-[var(--text-primary)]'
              }`
            }
          >
            {link.icon}
            <span>{link.name}</span>
          </NavLink>
        ))}
      </div>

      <div className="p-4 border-t border-[var(--border-color)]">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
              isActive ? 'bg-fin-primary/20 text-fin-primary' : 'text-[var(--text-muted)] hover:bg-black/10 dark:hover:bg-white/5 hover:text-[var(--text-primary)]'
            }`
          }
        >
          <Settings size={20} />
          <span>Settings</span>
        </NavLink>
      </div>
    </motion.div>
  );
};

export default Sidebar;
