import Settings from '../components/Settings';
import { useFinance } from '../context/FinanceContext';

const SettingsPage = () => {
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
          <h1 className="h3">Settings</h1>
          <p className="text-muted">Customize your MoneyTracker experience</p>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-6 mx-auto">
          <Settings />
        </div>
      </div>
    </div>
  );
};

export default SettingsPage; 