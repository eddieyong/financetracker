import { useState } from 'react';
import { useFinance } from '../context/FinanceContext';

const categories = [
  { id: 'income', name: 'Income', type: 'income' },
  { id: 'salary', name: 'Salary', type: 'income' },
  { id: 'freelance', name: 'Freelance', type: 'income' },
  { id: 'investment', name: 'Investment', type: 'income' },
  { id: 'gift', name: 'Gift', type: 'income' },
  { id: 'other_income', name: 'Other Income', type: 'income' },
  { id: 'food', name: 'Food & Dining', type: 'expense' },
  { id: 'transportation', name: 'Transportation', type: 'expense' },
  { id: 'housing', name: 'Housing & Rent', type: 'expense' },
  { id: 'utilities', name: 'Utilities', type: 'expense' },
  { id: 'entertainment', name: 'Entertainment', type: 'expense' },
  { id: 'shopping', name: 'Shopping', type: 'expense' },
  { id: 'healthcare', name: 'Healthcare', type: 'expense' },
  { id: 'education', name: 'Education', type: 'expense' },
  { id: 'personal', name: 'Personal Care', type: 'expense' },
  { id: 'travel', name: 'Travel', type: 'expense' },
  { id: 'debt', name: 'Debt Payment', type: 'expense' },
  { id: 'other_expense', name: 'Other Expense', type: 'expense' }
];

const TransactionForm = () => {
  const { addTransaction, setError, currency } = useFinance();
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: '',
    date: new Date().toISOString().slice(0, 10),
    type: 'expense',
    notes: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Update category options when type changes
    if (name === 'type') {
      setFormData(prev => ({ ...prev, category: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.description.trim()) {
      setError('Please enter a description');
      return;
    }
    
    if (!formData.amount || isNaN(formData.amount)) {
      setError('Please enter a valid amount');
      return;
    }
    
    if (!formData.category) {
      setError('Please select a category');
      return;
    }
    
    // Convert amount to positive or negative based on type
    const amount = formData.type === 'income' 
      ? Math.abs(parseFloat(formData.amount)) 
      : -Math.abs(parseFloat(formData.amount));
    
    addTransaction({
      description: formData.description,
      amount,
      category: formData.category,
      date: formData.date,
      notes: formData.notes
    });
    
    // Reset form
    setFormData({
      description: '',
      amount: '',
      category: '',
      date: new Date().toISOString().slice(0, 10),
      type: 'expense',
      notes: ''
    });
  };

  // Filter categories based on selected type
  const filteredCategories = categories.filter(
    category => category.type === formData.type
  );

  // Get currency symbol
  const getCurrencySymbol = (currencyCode) => {
    const symbols = {
      'MYR': 'RM',
      'USD': '$',
      'EUR': '€',
      'GBP': '£',
      'JPY': '¥',
      'SGD': 'S$',
      'AUD': 'A$',
      'CAD': 'C$',
      'CNY': '¥',
      'INR': '₹',
      'IDR': 'Rp',
      'THB': '฿'
    };
    return symbols[currencyCode] || currencyCode;
  };

  return (
    <div className="card border-0 shadow-sm mb-4">
      <div className="card-body">
        <h5 className="card-title mb-4">Add New Transaction</h5>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="type" className="form-label">Transaction Type</label>
            <div className="btn-group w-100" role="group" aria-label="Transaction type">
              <input 
                type="radio" 
                className="btn-check" 
                name="type" 
                id="typeExpense" 
                value="expense" 
                checked={formData.type === 'expense'} 
                onChange={handleChange}
              />
              <label className="btn btn-outline-danger" htmlFor="typeExpense">Expense</label>
              
              <input 
                type="radio" 
                className="btn-check" 
                name="type" 
                id="typeIncome" 
                value="income" 
                checked={formData.type === 'income'} 
                onChange={handleChange}
              />
              <label className="btn btn-outline-success" htmlFor="typeIncome">Income</label>
            </div>
          </div>
          
          <div className="mb-3">
            <label htmlFor="description" className="form-label">Description</label>
            <input 
              type="text" 
              className="form-control" 
              id="description" 
              name="description" 
              value={formData.description} 
              onChange={handleChange} 
              placeholder="What was this transaction for?"
              required
            />
          </div>
          
          <div className="mb-3">
            <label htmlFor="amount" className="form-label">Amount</label>
            <div className="input-group">
              <span className="input-group-text">{getCurrencySymbol(currency)}</span>
              <input 
                type="number" 
                className="form-control" 
                id="amount" 
                name="amount" 
                value={formData.amount} 
                onChange={handleChange} 
                placeholder="0.00"
                step="0.01"
                min="0"
                required
              />
            </div>
          </div>
          
          <div className="mb-3">
            <label htmlFor="category" className="form-label">Category</label>
            <select 
              className="form-select" 
              id="category" 
              name="category" 
              value={formData.category} 
              onChange={handleChange}
              required
            >
              <option value="">Select a category</option>
              {filteredCategories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="mb-3">
            <label htmlFor="date" className="form-label">Date</label>
            <input 
              type="date" 
              className="form-control" 
              id="date" 
              name="date" 
              value={formData.date} 
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="mb-3">
            <label htmlFor="notes" className="form-label">Notes (Optional)</label>
            <textarea 
              className="form-control" 
              id="notes" 
              name="notes" 
              value={formData.notes} 
              onChange={handleChange} 
              placeholder="Add any additional details..."
              rows="2"
            ></textarea>
          </div>
          
          <button type="submit" className="btn btn-primary w-100">
            Add Transaction
          </button>
        </form>
      </div>
    </div>
  );
};

export default TransactionForm; 