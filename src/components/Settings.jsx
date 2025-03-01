import { useState } from 'react';
import { useFinance } from '../context/FinanceContext';

const Settings = () => {
  const { currency, setCurrency, theme, toggleTheme, colorTheme, setColorTheme, exportTransactions } = useFinance();
  const [showExportSuccess, setShowExportSuccess] = useState(false);

  const currencies = [
    { code: 'MYR', name: 'Malaysian Ringgit (RM)' },
    { code: 'USD', name: 'US Dollar ($)' },
    { code: 'EUR', name: 'Euro (€)' },
    { code: 'GBP', name: 'British Pound (£)' },
    { code: 'JPY', name: 'Japanese Yen (¥)' },
    { code: 'SGD', name: 'Singapore Dollar (S$)' },
    { code: 'AUD', name: 'Australian Dollar (A$)' },
    { code: 'CAD', name: 'Canadian Dollar (C$)' },
    { code: 'CNY', name: 'Chinese Yuan (¥)' },
    { code: 'INR', name: 'Indian Rupee (₹)' },
    { code: 'IDR', name: 'Indonesian Rupiah (Rp)' },
    { code: 'THB', name: 'Thai Baht (฿)' }
  ];

  const colorThemes = [
    { id: 'default', name: 'Default (Green)', color: '#4CAF50' },
    { id: 'blue', name: 'Ocean Blue', color: '#2196F3' },
    { id: 'purple', name: 'Royal Purple', color: '#9C27B0' },
    { id: 'orange', name: 'Sunset Orange', color: '#FF9800' },
    { id: 'teal', name: 'Teal', color: '#009688' }
  ];

  const handleExport = () => {
    exportTransactions();
    setShowExportSuccess(true);
    setTimeout(() => setShowExportSuccess(false), 3000);
  };

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-body">
        <h5 className="card-title mb-4">Settings</h5>
        
        {showExportSuccess && (
          <div className="alert alert-success alert-dismissible fade show mb-4" role="alert">
            <i className="bi bi-check-circle-fill me-2"></i>
            Transactions exported successfully!
            <button 
              type="button" 
              className="btn-close" 
              onClick={() => setShowExportSuccess(false)}
              aria-label="Close"
            ></button>
          </div>
        )}
        
        <div className="mb-4">
          <h6 className="mb-3">Appearance</h6>
          <div className="form-check form-switch mb-3">
            <input 
              className="form-check-input" 
              type="checkbox" 
              id="themeSwitch" 
              checked={theme === 'dark'}
              onChange={toggleTheme}
            />
            <label className="form-check-label" htmlFor="themeSwitch">
              Dark Mode
            </label>
          </div>
          
          <h6 className="mb-3">Color Theme</h6>
          <div className="d-flex flex-wrap gap-2 mb-3">
            {colorThemes.map(themeOption => (
              <div 
                key={themeOption.id}
                className={`color-theme-option ${colorTheme === themeOption.id ? 'active' : ''}`}
                style={{ backgroundColor: themeOption.color }}
                onClick={() => setColorTheme(themeOption.id)}
                title={themeOption.name}
              >
                {colorTheme === themeOption.id && (
                  <i className="bi bi-check-lg text-white"></i>
                )}
              </div>
            ))}
          </div>
          <small className="text-muted d-block mt-2">
            Select a color theme to personalize your experience.
          </small>
        </div>
        
        <div className="mb-4">
          <h6 className="mb-3">Currency</h6>
          <select 
            className="form-select" 
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
          >
            {currencies.map(curr => (
              <option key={curr.code} value={curr.code}>
                {curr.name}
              </option>
            ))}
          </select>
          <small className="text-muted d-block mt-2">
            This setting changes how currency amounts are displayed throughout the app.
          </small>
        </div>
        
        <div className="mb-4">
          <h6 className="mb-3">Data Management</h6>
          <div className="d-grid gap-2">
            <button 
              className="btn btn-outline-primary" 
              onClick={handleExport}
            >
              <i className="bi bi-download me-2"></i>
              Export Transactions (CSV)
            </button>
            
            <button 
              className="btn btn-outline-danger"
              onClick={() => {
                if (window.confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
                  localStorage.clear();
                  window.location.reload();
                }
              }}
            >
              <i className="bi bi-trash me-2"></i>
              Clear All Data
            </button>
          </div>
        </div>
        
        <div className="mb-0">
          <h6 className="mb-3">About</h6>
          <p className="mb-1">
            <strong>MoneyTracker</strong> v1.2.0
          </p>
          <p className="text-muted small mb-0">
            A personal finance management application built with React, Vite, and Bootstrap.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Settings; 