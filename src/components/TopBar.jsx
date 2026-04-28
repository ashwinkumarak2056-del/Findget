import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Bell, Search, Moon, Sun, User, AlertTriangle, AlertCircle, CheckCircle } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { generateNotifications } from '../utils/aiEngine';

const TopBar = () => {
  const { state, dispatch } = useAppContext();
  const location = useLocation();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef(null);

  const notifications = state.notifications || [];
  const unreadCount = notifications.filter(n => !n.read).length;

  // Generate notifications on mount and whenever budgets/expenses change
  useEffect(() => {
    if (state.settings.isAuthenticated) {
      const fp = state.settings.financialProfile?.[state.settings.userMode] || null;
      const newNotifs = generateNotifications(state.budgets, state.expenses, fp);
      newNotifs.forEach(n => {
        dispatch({ type: 'ADD_NOTIFICATION', payload: n });
      });
    }
  }, [state.budgets, state.expenses, state.settings.isAuthenticated]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

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
    return 'Budgify';
  };

  const getNotifIcon = (type) => {
    switch (type) {
      case 'critical': return <AlertTriangle size={16} className="text-red-400 shrink-0" />;
      case 'warning': return <AlertCircle size={16} className="text-yellow-400 shrink-0" />;
      default: return <CheckCircle size={16} className="text-fin-primary shrink-0" />;
    }
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

        {/* Notification Bell */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 text-[var(--text-muted)] hover:text-fin-primary transition-colors relative"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center shadow-[0_0_8px_rgba(239,68,68,0.6)]">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 top-12 w-96 max-h-[480px] bg-[var(--panel-color)] border border-[var(--border-color)] rounded-2xl shadow-2xl overflow-hidden z-50">
              <div className="flex items-center justify-between p-4 border-b border-[var(--border-color)]">
                <h4 className="font-bold text-sm">Notifications</h4>
                {notifications.length > 0 && (
                  <button 
                    onClick={() => dispatch({ type: 'CLEAR_NOTIFICATIONS' })}
                    className="text-xs text-fin-primary hover:underline"
                  >
                    Clear All
                  </button>
                )}
              </div>
              
              <div className="overflow-y-auto max-h-[400px] custom-scrollbar">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-[var(--text-muted)]">
                    <Bell size={32} className="mx-auto mb-2 opacity-30" />
                    <p className="text-sm">No notifications yet</p>
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div 
                      key={notif.id}
                      onClick={() => dispatch({ type: 'MARK_NOTIFICATION_READ', payload: notif.id })}
                      className={`p-4 border-b border-[var(--border-color)] hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer transition-colors ${!notif.read ? 'bg-fin-primary/5' : ''}`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="mt-0.5">{getNotifIcon(notif.type)}</div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold leading-tight">{notif.title}</p>
                          <p className="text-xs text-[var(--text-muted)] mt-1 leading-relaxed">{notif.message}</p>
                        </div>
                        {!notif.read && (
                          <span className="w-2 h-2 bg-fin-primary rounded-full shrink-0 mt-1.5"></span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-3 pl-4 border-l border-[var(--border-color)]">
          <div 
            className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity mr-4"
            onClick={() => navigate('/settings')}
          >
            <div className="w-9 h-9 rounded-full bg-fin-primary/20 flex items-center justify-center border border-fin-primary/30 text-fin-primary">
              <User size={18} />
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium leading-tight">
                {state.settings.profile?.name || (state.settings.userMode === 'commercial' ? 'Admin' : 'Alex Mitchell')}
              </p>
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
