import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import { useAppContext } from './context/AppContext';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ReceiptScanner from './pages/ReceiptScanner';
import Expenses from './pages/Expenses';
import Budget from './pages/Budget';
import Insights from './pages/Insights';
import Investments from './pages/Investments';
import CurrencyConverter from './pages/CurrencyConverter';
import Settings from './pages/Settings';
import CommercialInvoices from './pages/commercial/Invoices';

// Pages (Placeholders for now)
const CommercialVendors = () => <div className="p-8 text-[var(--text-primary)]"><h1 className="text-2xl font-bold">Commercial Vendors Coming Soon</h1></div>;
const CommercialAnalytics = () => <div className="p-8 text-[var(--text-primary)]"><h1 className="text-2xl font-bold">Commercial Analytics Coming Soon</h1></div>;

function App() {
  const { state } = useAppContext();
  const { isAuthenticated } = state.settings;

  return (
    <Router>
      <div className="flex min-h-screen">
        {isAuthenticated && <Sidebar />}
        <div className={`flex-1 flex flex-col ${isAuthenticated ? 'ml-64' : ''}`}>
          {isAuthenticated && <TopBar />}
          <main className="flex-1 p-8 overflow-y-auto">
            <Routes>
              {/* Public Route */}
              <Route path="/login" element={<Login />} />
              
              {/* Protected Routes */}
              <Route path="/" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />} />
              <Route path="/scanner" element={isAuthenticated ? <ReceiptScanner /> : <Navigate to="/login" replace />} />
              <Route path="/expenses" element={isAuthenticated ? <Expenses /> : <Navigate to="/login" replace />} />
              <Route path="/budget" element={isAuthenticated ? <Budget /> : <Navigate to="/login" replace />} />
              <Route path="/converter" element={isAuthenticated ? <CurrencyConverter /> : <Navigate to="/login" replace />} />
              <Route path="/insights" element={isAuthenticated ? <Insights /> : <Navigate to="/login" replace />} />
              <Route path="/investments" element={isAuthenticated ? <Investments /> : <Navigate to="/login" replace />} />
              <Route path="/settings" element={isAuthenticated ? <Settings /> : <Navigate to="/login" replace />} />
              
              {/* Commercial Routes */}
              <Route path="/commercial/invoices" element={isAuthenticated ? <CommercialInvoices /> : <Navigate to="/login" replace />} />
              <Route path="/commercial/vendors" element={isAuthenticated ? <CommercialVendors /> : <Navigate to="/login" replace />} />
              <Route path="/commercial/analytics" element={isAuthenticated ? <CommercialAnalytics /> : <Navigate to="/login" replace />} />
              
              <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
