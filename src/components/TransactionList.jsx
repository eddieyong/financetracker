import { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency, getAmountClass } from '../utils/formatCurrency';

const TransactionList = ({ limit = null }) => {
  const { transactions, deleteTransaction, currency } = useFinance();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [expandedId, setExpandedId] = useState(null);
  const [animatedId, setAnimatedId] = useState(null);

  // Filter transactions based on search term and filter
  const filteredTransactions = transactions
    .filter(transaction => {
      // Filter by type
      if (filter === 'income' && transaction.amount < 0) return false;
      if (filter === 'expense' && transaction.amount > 0) return false;
      
      // Filter by search term
      if (searchTerm.trim() === '') return true;
      
      return (
        transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (transaction.notes && transaction.notes.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    })
    // Limit the number of transactions if limit is provided
    .slice(0, limit || transactions.length);

  // Get category name from ID
  const getCategoryName = (categoryId) => {
    const categories = {
      'income': 'Income',
      'salary': 'Salary',
      'freelance': 'Freelance',
      'investment': 'Investment',
      'gift': 'Gift',
      'other_income': 'Other Income',
      'food': 'Food & Dining',
      'transportation': 'Transportation',
      'housing': 'Housing & Rent',
      'utilities': 'Utilities',
      'entertainment': 'Entertainment',
      'shopping': 'Shopping',
      'healthcare': 'Healthcare',
      'education': 'Education',
      'personal': 'Personal Care',
      'travel': 'Travel',
      'debt': 'Debt Payment',
      'other_expense': 'Other Expense'
    };
    
    return categories[categoryId] || categoryId;
  };

  // Toggle expanded row
  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
    
    // Add animation when expanding
    if (expandedId !== id) {
      setAnimatedId(id);
      setTimeout(() => setAnimatedId(null), 500);
    }
  };

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h5 className="card-title mb-0">
            {limit ? 'Recent Transactions' : 'All Transactions'}
          </h5>
          
          {!limit && (
            <div className="btn-group" role="group" aria-label="Filter transactions">
              <button 
                type="button" 
                className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setFilter('all')}
              >
                All
              </button>
              <button 
                type="button" 
                className={`btn ${filter === 'income' ? 'btn-success' : 'btn-outline-success'}`}
                onClick={() => setFilter('income')}
              >
                Income
              </button>
              <button 
                type="button" 
                className={`btn ${filter === 'expense' ? 'btn-danger' : 'btn-outline-danger'}`}
                onClick={() => setFilter('expense')}
              >
                Expenses
              </button>
            </div>
          )}
        </div>
        
        {!limit && (
          <div className="mb-4">
            <div className="input-group">
              <span className="input-group-text">
                <i className="bi bi-search"></i>
              </span>
              <input 
                type="text" 
                className="form-control" 
                placeholder="Search transactions..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button 
                  className="btn btn-outline-secondary" 
                  type="button"
                  onClick={() => setSearchTerm('')}
                >
                  <i className="bi bi-x-lg"></i>
                </button>
              )}
            </div>
          </div>
        )}
        
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-5">
            <i className="bi bi-search fs-1 text-muted mb-3 d-block"></i>
            <p className="text-muted">
              {searchTerm 
                ? 'No transactions found matching your search.' 
                : 'No transactions yet. Add your first transaction to get started!'}
            </p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th className="text-end">Amount</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map(transaction => (
                  <>
                    <tr 
                      key={transaction.id} 
                      className={`transaction-row ${transaction.amount > 0 ? 'income' : 'expense'} ${animatedId === transaction.id ? 'new-item-animation' : ''}`}
                      onClick={() => toggleExpand(transaction.id)}
                      style={{ cursor: 'pointer' }}
                    >
                      <td>{transaction.date}</td>
                      <td>{transaction.description}</td>
                      <td>
                        <span className={`badge bg-light text-dark category-${transaction.category}`}>
                          {getCategoryName(transaction.category)}
                        </span>
                      </td>
                      <td className={`text-end fw-bold ${getAmountClass(transaction.amount)}`}>
                        {formatCurrency(transaction.amount, currency)}
                      </td>
                      <td className="text-center">
                        <button 
                          className="btn btn-sm btn-outline-danger"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm('Are you sure you want to delete this transaction?')) {
                              deleteTransaction(transaction.id);
                            }
                          }}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                    {expandedId === transaction.id && (
                      <tr key={`${transaction.id}-details`} className="transaction-details">
                        <td colSpan="5" className="border-0 pt-0">
                          <div className="bg-light p-3 rounded">
                            <div className="d-flex justify-content-between mb-2">
                              <span className="text-muted">Transaction ID:</span>
                              <span className="text-monospace">{transaction.id.substring(0, 8)}...</span>
                            </div>
                            {transaction.notes && (
                              <div className="mb-0">
                                <span className="text-muted">Notes:</span>
                                <p className="mb-0 mt-1 p-2 bg-white rounded border">{transaction.notes}</p>
                              </div>
                            )}
                            {!transaction.notes && (
                              <div className="text-center text-muted">
                                <small>No notes for this transaction</small>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {limit && transactions.length > limit && (
          <div className="text-center mt-3">
            <a href="/transactions" className="btn btn-sm btn-outline-primary">
              View All Transactions
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionList; 