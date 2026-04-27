import { Bell, Moon, Sun, User, Briefcase, UserCircle } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { motion } from 'framer-motion';

const Header = () => {
  const { state, dispatch } = useAppContext();
  const { theme, userMode } = state.settings;

  return (
    <header className="h-20 flex items-center justify-between px-8 glass-panel m-4 ml-0 border-fin-primary/20">
      <div className="flex items-center gap-4">
        <h2 className="text-2xl font-semibold text-text-primary capitalize">
          {userMode} Dashboard
        </h2>
        
        {/* User Mode Toggle */}
        <div className="flex bg-black/20 dark:bg-white/5 p-1 rounded-lg border border-fin-primary/20">
          <button
            onClick={() => dispatch({ type: 'SET_USER_MODE', payload: 'personal' })}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
              userMode === 'personal' 
                ? 'bg-fin-primary text-black shadow-lg' 
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            <UserCircle size={16} />
            Personal
          </button>
          <button
            onClick={() => dispatch({ type: 'SET_USER_MODE', payload: 'commercial' })}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
              userMode === 'commercial' 
                ? 'bg-fin-primary text-black shadow-lg' 
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            <Briefcase size={16} />
            Commercial
          </button>
        </div>
      </div>

      <div className="flex items-center gap-6">
        {/* Search Bar */}
        <div className="hidden lg:block relative">
          <input 
            type="text" 
            placeholder="Search transactions, invoices..." 
            className="glass-input w-64 pl-10"
          />
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 border-l border-white/10 pl-6">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => dispatch({ type: 'TOGGLE_THEME' })}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-black/20 dark:bg-white/5 border border-white/5 text-text-muted hover:text-fin-primary hover:border-fin-primary/30 transition-all"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </motion.button>
          
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative w-10 h-10 rounded-full flex items-center justify-center bg-black/20 dark:bg-white/5 border border-white/5 text-text-muted hover:text-fin-primary hover:border-fin-primary/30 transition-all"
          >
            <Bell size={18} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.8)]"></span>
          </motion.button>

          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 pl-2 cursor-pointer"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-fin-primary/50 to-fin-primary flex items-center justify-center overflow-hidden border border-fin-primary/30">
              <User size={20} className="text-white" />
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-text-primary leading-tight">Vishal</p>
              <p className="text-xs text-text-muted">Pro Member</p>
            </div>
          </motion.button>
        </div>
      </div>
    </header>
  );
};

export default Header;
