import { useFinance } from '../context/FinanceContext';
import { formatCurrency } from '../utils/formatCurrency';

const BalanceSummary = () => {
  const { balance, income, expenses } = useFinance();

  return (
    <div className="row g-4 mb-4">
      {/* Balance Card */}
      <div className="col-md-4">
        <div className="card border-0 shadow-sm h-100">
          <div className="card-body text-center">
            <h5 className="card-title text-muted mb-3">
              <i className="bi bi-wallet2 me-2"></i>Current Balance
            </h5>
            <h2 className={`mb-0 fw-bold ${balance >= 0 ? 'text-success' : 'text-danger'}`}>
              {formatCurrency(balance)}
            </h2>
          </div>
        </div>
      </div>

      {/* Income Card */}
      <div className="col-md-4">
        <div className="card border-0 shadow-sm h-100">
          <div className="card-body text-center">
            <h5 className="card-title text-muted mb-3">
              <i className="bi bi-graph-up-arrow me-2"></i>Total Income
            </h5>
            <h2 className="mb-0 fw-bold text-success">
              {formatCurrency(income)}
            </h2>
          </div>
        </div>
      </div>

      {/* Expenses Card */}
      <div className="col-md-4">
        <div className="card border-0 shadow-sm h-100">
          <div className="card-body text-center">
            <h5 className="card-title text-muted mb-3">
              <i className="bi bi-graph-down-arrow me-2"></i>Total Expenses
            </h5>
            <h2 className="mb-0 fw-bold text-danger">
              {formatCurrency(expenses)}
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BalanceSummary; 