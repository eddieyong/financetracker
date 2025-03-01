import { useState, useEffect } from 'react';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency } from '../utils/formatCurrency';

const categories = [
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

const BudgetManager = () => {
  const { budgets, addBudget, updateBudget, deleteBudget, calculateBudgetProgress, setError, currency } = useFinance();
  const [formData, setFormData] = useState({
    categoryId: '',
    amount: '',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear()
  });
  const [editingId, setEditingId] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  // Get category name from ID
  const getCategoryName = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : categoryId;
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.categoryId) {
      setError('Please select a category');
      return;
    }
    
    if (!formData.amount || isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    
    const budgetData = {
      categoryId: formData.categoryId,
      limit: parseFloat(formData.amount),
      month: parseInt(formData.month),
      year: parseInt(formData.year)
    };
    
    // Check if budget already exists for this category/month/year
    const existingBudget = budgets.find(
      b => b.categoryId === budgetData.categoryId && 
           b.month === budgetData.month && 
           b.year === budgetData.year &&
           (!editingId || b.id !== editingId)
    );
    
    if (existingBudget) {
      setError('A budget for this category and month already exists');
      return;
    }
    
    if (editingId) {
      updateBudget({ ...budgetData, id: editingId });
      setEditingId(null);
    } else {
      addBudget(budgetData);
    }
    
    // Reset form
    setFormData({
      categoryId: '',
      amount: '',
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear()
    });
  };

  // Handle edit budget
  const handleEdit = (budget) => {
    setFormData({
      categoryId: budget.categoryId,
      amount: budget.limit ? budget.limit.toString() : budget.amount ? budget.amount.toString() : '0',
      month: budget.month,
      year: budget.year
    });
    setEditingId(budget.id);
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({
      categoryId: '',
      amount: '',
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear()
    });
  };

  // Filter budgets by current month/year
  const filteredBudgets = budgets.filter(
    budget => budget.month === currentMonth && budget.year === currentYear
  );

  // Generate month options
  const months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' }
  ];

  // Generate year options (current year and 2 years ahead)
  const currentYearValue = new Date().getFullYear();
  const years = [
    currentYearValue - 1,
    currentYearValue,
    currentYearValue + 1,
    currentYearValue + 2
  ];

  return (
    <div className="row">
      <div className="col-lg-4 mb-4">
        <div className="card border-0 shadow-sm">
          <div className="card-body">
            <h5 className="card-title mb-4">
              {editingId ? 'Edit Budget' : 'Create Budget'}
            </h5>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="categoryId" className="form-label">Category</label>
                <select 
                  className="form-select" 
                  id="categoryId" 
                  name="categoryId" 
                  value={formData.categoryId} 
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="mb-3">
                <label htmlFor="amount" className="form-label">Budget Amount</label>
                <div className="input-group">
                  <span className="input-group-text">RM</span>
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
              
              <div className="row mb-3">
                <div className="col-md-6">
                  <label htmlFor="month" className="form-label">Month</label>
                  <select 
                    className="form-select" 
                    id="month" 
                    name="month" 
                    value={formData.month} 
                    onChange={handleChange}
                    required
                  >
                    {months.map(month => (
                      <option key={month.value} value={month.value}>
                        {month.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="col-md-6">
                  <label htmlFor="year" className="form-label">Year</label>
                  <select 
                    className="form-select" 
                    id="year" 
                    name="year" 
                    value={formData.year} 
                    onChange={handleChange}
                    required
                  >
                    {years.map(year => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="d-grid gap-2">
                <button type="submit" className="btn btn-primary">
                  {editingId ? 'Update Budget' : 'Create Budget'}
                </button>
                
                {editingId && (
                  <button 
                    type="button" 
                    className="btn btn-outline-secondary"
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
      
      <div className="col-lg-8">
        <div className="card border-0 shadow-sm">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="card-title mb-0">Budget Overview</h5>
              
              <div className="d-flex gap-2">
                <select 
                  className="form-select form-select-sm" 
                  value={currentMonth}
                  onChange={(e) => setCurrentMonth(parseInt(e.target.value))}
                  style={{ width: 'auto' }}
                >
                  {months.map(month => (
                    <option key={month.value} value={month.value}>
                      {month.label}
                    </option>
                  ))}
                </select>
                
                <select 
                  className="form-select form-select-sm" 
                  value={currentYear}
                  onChange={(e) => setCurrentYear(parseInt(e.target.value))}
                  style={{ width: 'auto' }}
                >
                  {years.map(year => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {filteredBudgets.length === 0 ? (
              <div className="text-center py-5">
                <i className="bi bi-clipboard-data fs-1 text-muted"></i>
                <p className="mt-3 text-muted">No budgets found for this month</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Category</th>
                      <th>Budget</th>
                      <th>Spent</th>
                      <th>Remaining</th>
                      <th>Progress</th>
                      <th className="text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBudgets.map(budget => {
                      const progress = calculateBudgetProgress(
                        budget.categoryId, 
                        budget.month, 
                        budget.year
                      );
                      
                      // Ensure budget amount is a valid number
                      const budgetLimit = parseFloat(budget.limit || budget.amount) || 0;
                      
                      // Ensure progress values are valid numbers
                      const spent = progress?.amount || 0;
                      const remaining = progress?.remaining || budgetLimit;
                      const percentage = progress?.percentage || 0;
                      
                      return (
                        <tr key={budget.id}>
                          <td>{getCategoryName(budget.categoryId)}</td>
                          <td className="fw-bold">{formatCurrency(budgetLimit, currency)}</td>
                          <td className="text-danger">
                            {formatCurrency(spent, currency)}
                          </td>
                          <td className={remaining < 0 ? 'text-danger fw-bold' : 'text-success'}>
                            {formatCurrency(remaining, currency)}
                          </td>
                          <td style={{ width: '20%' }}>
                            <div className="d-flex align-items-center">
                              <div className="progress flex-grow-1" style={{ height: '10px' }}>
                                <div 
                                  className={`progress-bar ${
                                    percentage > 100 
                                      ? 'bg-danger' 
                                      : percentage > 75 
                                        ? 'bg-warning' 
                                        : 'bg-success'
                                  }`}
                                  role="progressbar" 
                                  style={{ width: `${Math.min(percentage, 100)}%` }}
                                  aria-valuenow={Math.min(percentage, 100)}
                                  aria-valuemin="0" 
                                  aria-valuemax="100"
                                ></div>
                              </div>
                              <span className="ms-2 small">
                                {Math.round(percentage)}%
                              </span>
                            </div>
                          </td>
                          <td className="text-center">
                            <div className="btn-group btn-group-sm">
                              <button 
                                className="btn btn-outline-primary"
                                onClick={() => handleEdit(budget)}
                                aria-label="Edit budget"
                              >
                                <i className="bi bi-pencil"></i>
                              </button>
                              <button 
                                className="btn btn-outline-danger"
                                onClick={() => deleteBudget(budget.id)}
                                aria-label="Delete budget"
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetManager; 