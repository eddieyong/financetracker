import { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency } from '../utils/formatCurrency';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const ExpenseChart = () => {
  const { transactions } = useFinance();
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: []
  });

  useEffect(() => {
    // Filter only expense transactions
    const expenses = transactions.filter(t => t.amount < 0);
    
    // Group expenses by category
    const expensesByCategory = expenses.reduce((acc, transaction) => {
      const category = transaction.category;
      if (!acc[category]) {
        acc[category] = 0;
      }
      acc[category] += Math.abs(transaction.amount);
      return acc;
    }, {});
    
    // Sort categories by amount (descending)
    const sortedCategories = Object.entries(expensesByCategory)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 7); // Take top 7 categories
    
    // Prepare data for chart
    const labels = sortedCategories.map(([category]) => {
      const categories = {
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
      return categories[category] || category;
    });
    
    const data = sortedCategories.map(([, amount]) => amount);
    
    // Generate colors
    const backgroundColors = [
      '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#8AC249'
    ];
    
    setChartData({
      labels,
      datasets: [
        {
          data,
          backgroundColor: backgroundColors,
          borderColor: backgroundColors.map(color => color.replace(')', ', 1)').replace('rgb', 'rgba')),
          borderWidth: 1
        }
      ]
    });
  }, [transactions]);

  // Options for the chart
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          boxWidth: 15,
          padding: 15,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.chart.getDatasetMeta(0).total;
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${formatCurrency(value)} (${percentage}%)`;
          }
        }
      }
    }
  };

  // If there are no expenses, show a message
  if (transactions.filter(t => t.amount < 0).length === 0) {
    return (
      <div className="card border-0 shadow-sm h-100">
        <div className="card-body">
          <h5 className="card-title mb-4">Expense Breakdown</h5>
          <div className="text-center py-5">
            <i className="bi bi-pie-chart fs-1 text-muted"></i>
            <p className="mt-3 text-muted">No expense data to display</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card border-0 shadow-sm h-100">
      <div className="card-body">
        <h5 className="card-title mb-4">Expense Breakdown</h5>
        <div style={{ height: '300px', position: 'relative' }}>
          <Pie data={chartData} options={options} />
        </div>
      </div>
    </div>
  );
};

export default ExpenseChart; 