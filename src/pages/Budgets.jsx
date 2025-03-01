import BudgetManager from '../components/BudgetManager';
import { useFinance } from '../context/FinanceContext';

const Budgets = () => {
  const { error } = useFinance();

  return (
    <div className="container py-4">
      {/* Error Alert */}
      {error && (
        <div className="alert alert-danger alert-dismissible fade show mb-4" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
          <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
      )}

      <div className="row mb-4">
        <div className="col">
          <h1 className="h3">Budget Management</h1>
          <p className="text-muted">Set and track your monthly spending limits by category</p>
        </div>
      </div>

      <BudgetManager />
    </div>
  );
};

export default Budgets; 