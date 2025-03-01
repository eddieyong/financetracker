import { createContext, useContext, useReducer, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Create the Finance Context
const FinanceContext = createContext();

// Initial state for the finance reducer
const initialState = {
  transactions: JSON.parse(localStorage.getItem('transactions')) || [],
  budgets: JSON.parse(localStorage.getItem('budgets')) || [],
  balance: 0,
  income: 0,
  expenses: 0,
  loading: false,
  error: null,
  currency: localStorage.getItem('currency') || 'MYR',
  theme: localStorage.getItem('theme') || 'light',
  colorTheme: localStorage.getItem('colorTheme') || 'default'
};

// Finance reducer function
const financeReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TRANSACTION':
      return {
        ...state,
        transactions: [action.payload, ...state.transactions]
      };
    case 'DELETE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.filter(
          transaction => transaction.id !== action.payload
        )
      };
    case 'ADD_BUDGET':
      return {
        ...state,
        budgets: [...state.budgets, action.payload]
      };
    case 'UPDATE_BUDGET':
      return {
        ...state,
        budgets: state.budgets.map(budget => 
          budget.id === action.payload.id ? action.payload : budget
        )
      };
    case 'DELETE_BUDGET':
      return {
        ...state,
        budgets: state.budgets.filter(budget => budget.id !== action.payload)
      };
    case 'SET_CURRENCY':
      return {
        ...state,
        currency: action.payload
      };
    case 'TOGGLE_THEME':
      return {
        ...state,
        theme: state.theme === 'light' ? 'dark' : 'light'
      };
    case 'SET_COLOR_THEME':
      return {
        ...state,
        colorTheme: action.payload
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload
      };
    case 'CALCULATE_SUMMARY':
      return {
        ...state,
        balance: action.payload.balance,
        income: action.payload.income,
        expenses: action.payload.expenses
      };
    default:
      return state;
  }
};

// Finance Provider component
export const FinanceProvider = ({ children }) => {
  const [state, dispatch] = useReducer(financeReducer, initialState);

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(state.transactions));
    localStorage.setItem('budgets', JSON.stringify(state.budgets));
    localStorage.setItem('currency', state.currency);
    localStorage.setItem('theme', state.theme);
    localStorage.setItem('colorTheme', state.colorTheme);
    
    // Calculate summary whenever transactions change
    calculateSummary();
  }, [state.transactions, state.budgets, state.currency, state.theme, state.colorTheme]);

  // Calculate summary (balance, income, expenses)
  const calculateSummary = () => {
    const income = state.transactions
      .filter(transaction => transaction.amount > 0)
      .reduce((total, transaction) => total + transaction.amount, 0);
    
    const expenses = state.transactions
      .filter(transaction => transaction.amount < 0)
      .reduce((total, transaction) => total + Math.abs(transaction.amount), 0);
    
    const balance = income - expenses;
    
    dispatch({
      type: 'CALCULATE_SUMMARY',
      payload: { balance, income, expenses }
    });
  };

  // Add transaction
  const addTransaction = (transaction) => {
    dispatch({
      type: 'ADD_TRANSACTION',
      payload: {
        id: uuidv4(),
        ...transaction,
        date: transaction.date || new Date().toISOString().slice(0, 10)
      }
    });
  };

  // Delete transaction
  const deleteTransaction = (id) => {
    dispatch({
      type: 'DELETE_TRANSACTION',
      payload: id
    });
  };

  // Add budget
  const addBudget = (budget) => {
    dispatch({
      type: 'ADD_BUDGET',
      payload: {
        id: uuidv4(),
        ...budget,
        createdAt: new Date().toISOString()
      }
    });
  };

  // Update budget
  const updateBudget = (budget) => {
    dispatch({
      type: 'UPDATE_BUDGET',
      payload: budget
    });
  };

  // Delete budget
  const deleteBudget = (id) => {
    dispatch({
      type: 'DELETE_BUDGET',
      payload: id
    });
  };

  // Set currency
  const setCurrency = (currency) => {
    dispatch({
      type: 'SET_CURRENCY',
      payload: currency
    });
  };

  // Toggle theme
  const toggleTheme = () => {
    dispatch({
      type: 'TOGGLE_THEME'
    });
  };

  const setColorTheme = (theme) => {
    dispatch({
      type: 'SET_COLOR_THEME',
      payload: theme
    });
  };

  // Set error
  const setError = (message) => {
    dispatch({
      type: 'SET_ERROR',
      payload: message
    });
    
    // Clear error after 3 seconds
    setTimeout(() => {
      dispatch({
        type: 'SET_ERROR',
        payload: null
      });
    }, 3000);
  };

  // Calculate budget progress
  const calculateBudgetProgress = (categoryId, month, year) => {
    // Find the budget for this category and month/year
    const budget = state.budgets.find(b => 
      b.categoryId === categoryId && 
      b.month === month && 
      b.year === year
    );
    
    // If no budget is found, return zeros to avoid NaN
    if (!budget || !budget.limit) {
      return { 
        amount: 0, 
        limit: budget?.limit || 0, 
        percentage: 0,
        remaining: 0
      };
    }
    
    // Ensure budget limit is a valid number
    const limit = parseFloat(budget.limit) || 0;
    
    // Calculate the total spent in this category for the month
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    
    const spent = state.transactions
      .filter(t => 
        t.category === categoryId && 
        t.amount < 0 &&
        new Date(t.date) >= startDate &&
        new Date(t.date) <= endDate
      )
      .reduce((total, t) => total + Math.abs(parseFloat(t.amount) || 0), 0);
    
    // Calculate percentage and remaining amount
    const percentage = limit > 0 ? (spent / limit) * 100 : 0;
    const remaining = Math.max(limit - spent, 0);
    
    return {
      amount: spent,
      limit: limit,
      percentage: Math.min(percentage, 100), // Cap at 100%
      remaining: remaining
    };
  };

  // Export transactions to CSV
  const exportTransactions = () => {
    try {
      // Convert transactions to CSV format
      const headers = ['Date', 'Description', 'Category', 'Amount'];
      const csvRows = [headers];
      
      state.transactions.forEach(transaction => {
        const row = [
          transaction.date,
          transaction.description,
          transaction.category,
          transaction.amount
        ];
        csvRows.push(row);
      });
      
      // Convert to CSV string
      const csvContent = csvRows
        .map(row => row.map(cell => `"${cell}"`).join(','))
        .join('\n');
      
      // Create a Blob and download link
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `money_tracker_export_${new Date().toISOString().slice(0, 10)}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      return true;
    } catch (error) {
      console.error('Export failed:', error);
      setError('Failed to export transactions');
      return false;
    }
  };

  return (
    <FinanceContext.Provider
      value={{
        transactions: state.transactions,
        budgets: state.budgets,
        balance: state.balance,
        income: state.income,
        expenses: state.expenses,
        loading: state.loading,
        error: state.error,
        currency: state.currency,
        theme: state.theme,
        colorTheme: state.colorTheme,
        addTransaction,
        deleteTransaction,
        addBudget,
        updateBudget,
        deleteBudget,
        setCurrency,
        toggleTheme,
        setColorTheme,
        setError,
        calculateBudgetProgress,
        exportTransactions
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

// Custom hook to use the finance context
export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
}; 