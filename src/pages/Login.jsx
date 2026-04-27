import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { UserCircle, Briefcase, ChevronRight } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const Login = () => {
  const { dispatch } = useAppContext();

  // If the user reaches this page (e.g. via back button), ensure they are logged out
  useEffect(() => {
    dispatch({ type: 'LOGOUT' });
  }, [dispatch]);

  const handleLogin = (mode) => {
    dispatch({ type: 'LOGIN', payload: mode });
  };

  return (
    <div className="min-h-screen bg-[var(--bg-color)] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-fin-primary/20 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px]" />

      <div className="z-10 text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-tr from-fin-primary to-emerald-400 shadow-[0_0_30px_rgba(34,197,94,0.3)] mb-6">
          <span className="font-bold text-white text-3xl">A</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-fin-primary to-emerald-300 mb-4">
          AuraFin
        </h1>
        <p className="text-xl text-[var(--text-muted)]">Financial Intelligence Platform</p>
      </div>

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 z-10">
        
        {/* Personal Option */}
        <motion.div 
          whileHover={{ scale: 1.02, y: -5 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleLogin('personal')}
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
          onClick={() => handleLogin('commercial')}
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

      </div>
      
      <p className="text-[var(--text-muted)] text-sm mt-12 z-10">
        © 2026 AuraFin Technologies. All rights reserved.
      </p>
    </div>
  );
};

export default Login;
