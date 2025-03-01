import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { FinanceProvider, useFinance } from './context/FinanceContext';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Budgets from './pages/Budgets';
import Reports from './pages/Reports';
import SettingsPage from './pages/SettingsPage';
import NotFound from './pages/NotFound';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';

// AppContent component to use the context
function AppContent() {
  const { theme, colorTheme } = useFinance();
  const location = useLocation();

  // Apply theme to body
  useEffect(() => {
    document.body.setAttribute('data-bs-theme', theme);
    document.body.setAttribute('data-color-theme', colorTheme);
    
    // Scroll to top on route change
    window.scrollTo(0, 0);
  }, [theme, colorTheme, location.pathname]);

  return (
    <div className={`d-flex flex-column min-vh-100 bg-light theme-${colorTheme}`}>
      <Navbar />
      <main className="flex-grow-1">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/budgets" element={<Budgets />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <footer className="bg-white py-4 mt-auto border-top">
        <div className="container text-center text-muted">
          <p className="mb-0">
            <small>
              &copy; {new Date().getFullYear()} MoneyTracker. All rights reserved.
            </small>
          </p>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <FinanceProvider>
      <Router>
        <AppContent />
      </Router>
    </FinanceProvider>
  );
}

export default App;
