import { Link, useLocation } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { 
  LayoutDashboard, 
  Receipt, 
  PieChart, 
  TrendingUp, 
  Building2, 
  FileText,
  ShieldAlert,
  Settings,
  Scan
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const { state } = useAppContext();
  const isPersonal = state.settings.userMode === 'personal';

  const personalLinks = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Expenses', path: '/expenses', icon: <Receipt size={20} /> },
    { name: 'Budget Planner', path: '/budget', icon: <PieChart size={20} /> },
    { name: 'Investments', path: '/investments', icon: <TrendingUp size={20} /> },
  ];

  const commercialLinks = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Invoices', path: '/invoices', icon: <FileText size={20} /> },
    { name: 'Vendors', path: '/vendors', icon: <Building2 size={20} /> },
    { name: 'Risk Analysis', path: '/risk', icon: <ShieldAlert size={20} /> },
  ];

  const links = isPersonal ? personalLinks : commercialLinks;

  return (
    <aside className="w-64 hidden md:flex flex-col glass-panel m-4 overflow-hidden border-fin-primary/20">
      <div className="p-6 flex items-center gap-3 border-b border-white/5">
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-fin-primary to-emerald-400 flex items-center justify-center shadow-[0_0_15px_rgba(34,197,94,0.4)]">
          <span className="font-bold text-white text-lg">B</span>
        </div>
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-fin-primary to-emerald-300">
          Budgify
        </h1>
      </div>

      <div className="flex-1 py-6 px-4 space-y-2">
        {links.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.name}
              to={link.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                isActive 
                  ? 'bg-fin-primary/20 text-fin-primary shadow-[inset_0_0_20px_rgba(34,197,94,0.1)] border border-fin-primary/30' 
                  : 'text-text-muted hover:bg-white/5 hover:text-text-primary'
              }`}
            >
              <span className={`${isActive ? 'text-fin-primary' : 'text-text-muted'}`}>
                {link.icon}
              </span>
              <span className="font-medium">{link.name}</span>
            </Link>
          );
        })}

        <div className="pt-4 mt-4 border-t border-white/5">
          <Link
            to="/scanner"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
              location.pathname === '/scanner'
                ? 'bg-fin-primary/20 text-fin-primary shadow-[inset_0_0_20px_rgba(34,197,94,0.1)] border border-fin-primary/30'
                : 'text-text-muted hover:bg-white/5 hover:text-text-primary'
            }`}
          >
            <Scan size={20} className={location.pathname === '/scanner' ? 'text-fin-primary' : ''} />
            <span className="font-medium">Smart Scanner</span>
          </Link>
        </div>
      </div>

      <div className="p-4 border-t border-white/5">
        <button className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-text-muted hover:bg-white/5 hover:text-text-primary transition-all">
          <Settings size={20} />
          <span className="font-medium">Settings</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
