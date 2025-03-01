import { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency } from '../utils/formatCurrency';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Reports = () => {
  const { transactions } = useFinance();
  const [period, setPeriod] = useState('month');
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: []
  });

  useEffect(() => {
    // Group transactions by period
    const groupedData = groupTransactionsByPeriod(transactions, period);
    
    // Set chart data
    setChartData({
      labels: groupedData.labels,
      datasets: [
        {
          label: 'Income',
          data: groupedData.income,
          backgroundColor: 'rgba(40, 167, 69, 0.7)',
          borderColor: 'rgb(40, 167, 69)',
          borderWidth: 1
        },
        {
          label: 'Expenses',
          data: groupedData.expenses,
          backgroundColor: 'rgba(220, 53, 69, 0.7)',
          borderColor: 'rgb(220, 53, 69)',
          borderWidth: 1
        }
      ]
    });
  }, [transactions, period]);

  // Group transactions by period (month, quarter, year)
  const groupTransactionsByPeriod = (transactions, period) => {
    const now = new Date();
    const currentYear = now.getFullYear();
    let labels = [];
    let income = [];
    let expenses = [];

    if (period === 'month') {
      // Last 6 months
      labels = Array.from({ length: 6 }, (_, i) => {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        return date.toLocaleString('default', { month: 'short' });
      }).reverse();

      // Initialize income and expenses arrays
      income = Array(6).fill(0);
      expenses = Array(6).fill(0);

      // Group transactions by month
      transactions.forEach(transaction => {
        const transactionDate = new Date(transaction.date);
        const monthDiff = (now.getMonth() - transactionDate.getMonth() + 12) % 12;
        
        if (monthDiff < 6 && transactionDate.getFullYear() >= currentYear - 1) {
          const index = 5 - monthDiff;
          
          if (transaction.amount > 0) {
            income[index] += transaction.amount;
          } else {
            expenses[index] += Math.abs(transaction.amount);
          }
        }
      });
    } else if (period === 'quarter') {
      // Last 4 quarters
      const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
      const currentQuarter = Math.floor(now.getMonth() / 3);
      
      labels = Array.from({ length: 4 }, (_, i) => {
        const quarterIndex = (currentQuarter - i + 4) % 4;
        const yearOffset = Math.floor((i + currentQuarter) / 4);
        return `${quarters[quarterIndex]} ${currentYear - yearOffset}`;
      }).reverse();

      // Initialize income and expenses arrays
      income = Array(4).fill(0);
      expenses = Array(4).fill(0);

      // Group transactions by quarter
      transactions.forEach(transaction => {
        const transactionDate = new Date(transaction.date);
        const transactionQuarter = Math.floor(transactionDate.getMonth() / 3);
        const transactionYear = transactionDate.getFullYear();
        
        const quarterDiff = (currentQuarter - transactionQuarter + 4) % 4 + (currentYear - transactionYear) * 4;
        
        if (quarterDiff < 4) {
          const index = 3 - quarterDiff;
          
          if (transaction.amount > 0) {
            income[index] += transaction.amount;
          } else {
            expenses[index] += Math.abs(transaction.amount);
          }
        }
      });
    } else if (period === 'year') {
      // Last 3 years
      labels = Array.from({ length: 3 }, (_, i) => `${currentYear - i}`).reverse();

      // Initialize income and expenses arrays
      income = Array(3).fill(0);
      expenses = Array(3).fill(0);

      // Group transactions by year
      transactions.forEach(transaction => {
        const transactionDate = new Date(transaction.date);
        const transactionYear = transactionDate.getFullYear();
        const yearDiff = currentYear - transactionYear;
        
        if (yearDiff < 3) {
          const index = 2 - yearDiff;
          
          if (transaction.amount > 0) {
            income[index] += transaction.amount;
          } else {
            expenses[index] += Math.abs(transaction.amount);
          }
        }
      });
    }

    return { labels, income, expenses };
  };

  // Chart options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          display: false
        }
      },
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return formatCurrency(value).replace(/\.00$/, '');
          }
        }
      }
    },
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.dataset.label || '';
            const value = context.raw || 0;
            return `${label}: ${formatCurrency(value)}`;
          }
        }
      }
    }
  };

  // Calculate savings rate
  const calculateSavingsRate = () => {
    const totalIncome = transactions
      .filter(t => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenses = transactions
      .filter(t => t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    
    if (totalIncome === 0) return 0;
    
    return ((totalIncome - totalExpenses) / totalIncome) * 100;
  };

  const savingsRate = calculateSavingsRate();

  return (
    <div className="container py-4">
      <div className="row mb-4">
        <div className="col">
          <h1 className="h3">Financial Reports</h1>
          <p className="text-muted">Analyze your income and expenses over time</p>
        </div>
      </div>

      {/* Savings Rate Card */}
      <div className="row mb-4">
        <div className="col-md-6 mx-auto">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <h5 className="card-title text-muted mb-3">
                <i className="bi bi-piggy-bank me-2"></i>Overall Savings Rate
              </h5>
              <h2 className={`mb-0 fw-bold ${savingsRate >= 0 ? 'text-success' : 'text-danger'}`}>
                {savingsRate.toFixed(1)}%
              </h2>
              <p className="text-muted mt-2">
                {savingsRate >= 20 ? 'Excellent! You\'re saving a significant portion of your income.' :
                 savingsRate >= 10 ? 'Good job! You\'re on the right track.' :
                 savingsRate >= 0 ? 'You\'re saving, but try to increase your rate.' :
                 'You\'re spending more than you earn. Review your expenses.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Period Selector */}
      <div className="row mb-4">
        <div className="col">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="card-title mb-0">Income vs. Expenses</h5>
                
                <div className="btn-group" role="group" aria-label="Period selector">
                  <button 
                    type="button" 
                    className={`btn ${period === 'month' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setPeriod('month')}
                  >
                    Monthly
                  </button>
                  <button 
                    type="button" 
                    className={`btn ${period === 'quarter' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setPeriod('quarter')}
                  >
                    Quarterly
                  </button>
                  <button 
                    type="button" 
                    className={`btn ${period === 'year' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setPeriod('year')}
                  >
                    Yearly
                  </button>
                </div>
              </div>
              
              <div style={{ height: '400px', position: 'relative' }}>
                <Bar data={chartData} options={options} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports; 