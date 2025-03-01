import BalanceSummary from '../components/BalanceSummary';
import TransactionForm from '../components/TransactionForm';
import TransactionList from '../components/TransactionList';
import ExpenseChart from '../components/ExpenseChart';
import { useFinance } from '../context/FinanceContext';

const Dashboard = () => {
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

      {/* Balance Summary */}
      <BalanceSummary />

      <div className="row g-4">
        {/* Left Column - Transaction Form */}
        <div className="col-lg-4">
          <TransactionForm />
        </div>

        {/* Right Column - Charts and Recent Transactions */}
        <div className="col-lg-8">
          <div className="mb-4">
            <ExpenseChart />
          </div>
          
          <TransactionList limit={5} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 