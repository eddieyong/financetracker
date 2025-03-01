import TransactionList from '../components/TransactionList';
import { useFinance } from '../context/FinanceContext';

const Transactions = () => {
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
          <h1 className="h3">Transaction History</h1>
          <p className="text-muted">View and manage all your transactions</p>
        </div>
      </div>

      <TransactionList />
    </div>
  );
};

export default Transactions; 