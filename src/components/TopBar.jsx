import React from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, Search, Moon, Sun, User } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const TopBar = () => {
  const { state, dispatch } = useAppContext();
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Overview Dashboard';
    if (path.includes('scanner')) return 'Smart Receipt Scanner';
    if (path.includes('expenses')) return 'Expense Management';
    if (path.includes('budget')) return 'Budget Planner';
    if (path.includes('insights')) return 'AI Financial Insights';
    if (path.includes('investments')) return 'Investment Advisory';
    if (path.includes('settings')) return 'Platform Settings';
    if (path.includes('commercial/invoices')) return 'Invoice Management';
    if (path.includes('commercial/vendors')) return 'Vendor Tracking';
    if (path.includes('commercial/analytics')) return 'Enterprise Analytics';
    return 'FinAI';
  };

  return (
    <div className="h-20 ml-64 flex items-center justify-between px-8 z-10 sticky top-0 bg-[var(--bg-color)]/80 backdrop-blur-md border-b border-[var(--border-color)]">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{getPageTitle()}</h2>
        <p className="text-sm text-[var(--text-muted)]">Real-time financial intelligence</p>
      </div>

      <div className="flex items-center space-x-6">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={18} />
          <input 
            type="text" 
            placeholder="Search transactions..." 
            className="pl-10 pr-4 py-2 bg-black/5 dark:bg-white/5 border border-[var(--border-color)] rounded-full text-sm focus:outline-none focus:border-fin-primary focus:ring-1 focus:ring-fin-primary/50 w-64 transition-all"
          />
        </div>

        <button 
          onClick={() => dispatch({ type: 'TOGGLE_THEME' })}
          className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 text-[var(--text-muted)] hover:text-fin-primary transition-colors"
        >
          {state.settings.theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <button className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 text-[var(--text-muted)] hover:text-fin-primary transition-colors relative">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full shadow-[0_0_5px_red]"></span>
        </button>

        <div className="flex items-center space-x-3 pl-4 border-l border-[var(--border-color)]">
          <div className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity mr-4">
            <div className="w-9 h-9 rounded-full bg-fin-primary/20 flex items-center justify-center border border-fin-primary/30 text-fin-primary">
              <User size={18} />
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium leading-tight">Alex Mitchell</p>
              <p className="text-xs text-[var(--text-muted)]">{state.settings.userMode === 'commercial' ? 'Admin' : 'Pro Member'}</p>
            </div>
          </div>
          
          <button 
            onClick={() => dispatch({ type: 'LOGOUT' })}
            className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors text-xs font-bold"
          >
            LOGOUT
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
