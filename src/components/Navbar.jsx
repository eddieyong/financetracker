import { Link, useLocation } from 'react-router-dom';
import { useFinance } from '../context/FinanceContext';
import { useEffect, useState } from 'react';

const Navbar = () => {
  const location = useLocation();
  const { theme, toggleTheme, colorTheme } = useFinance();
  const [scrolled, setScrolled] = useState(false);
  const [animateIcon, setAnimateIcon] = useState(false);

  // Check if the current path matches the link
  const isActive = (path) => {
    return location.pathname === path;
  };
  
  // Handle scroll event to add shadow to navbar when scrolled
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Animate theme icon when toggled
  const handleThemeToggle = () => {
    setAnimateIcon(true);
    toggleTheme();
    setTimeout(() => setAnimateIcon(false), 500);
  };

  return (
    <nav className={`navbar navbar-expand-lg navbar-dark bg-primary mb-4 ${scrolled ? 'shadow' : ''}`}>
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">
          <i className="bi bi-wallet2 me-2"></i>
          MoneyTracker
        </Link>
        
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav" 
          aria-controls="navbarNav" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link 
                className={`nav-link ${isActive('/') ? 'active' : ''}`} 
                to="/"
              >
                <i className="bi bi-house-door me-1"></i> Dashboard
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className={`nav-link ${isActive('/transactions') ? 'active' : ''}`} 
                to="/transactions"
              >
                <i className="bi bi-list-ul me-1"></i> Transactions
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className={`nav-link ${isActive('/budgets') ? 'active' : ''}`} 
                to="/budgets"
              >
                <i className="bi bi-clipboard-data me-1"></i> Budgets
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className={`nav-link ${isActive('/reports') ? 'active' : ''}`} 
                to="/reports"
              >
                <i className="bi bi-bar-chart me-1"></i> Reports
              </Link>
            </li>
          </ul>
          
          <ul className="navbar-nav">
            <li className="nav-item">
              <button 
                className="btn nav-link" 
                onClick={handleThemeToggle}
                aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              >
                <i className={`bi bi-${theme === 'light' ? 'moon' : 'sun'} me-1 ${animateIcon ? 'new-item-animation' : ''}`}></i>
              </button>
            </li>
            <li className="nav-item">
              <Link 
                className={`nav-link ${isActive('/settings') ? 'active' : ''}`} 
                to="/settings"
              >
                <i className="bi bi-gear me-1"></i> Settings
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 