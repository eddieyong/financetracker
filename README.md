# MoneyTracker

A responsive web application for tracking personal finances, built with React, Vite, and Bootstrap.

## Features

- **Dashboard**: View your financial summary, add transactions, and see recent activity
- **Transaction Management**: Add, filter, and delete income and expense transactions
- **Budget Planning**: Set monthly budgets for different expense categories
- **Categorization**: Organize transactions by categories for better financial insights
- **Reports**: Visualize your financial data with charts and graphs
- **Dark Mode**: Toggle between light and dark themes for comfortable viewing
- **Multiple Currencies**: Support for various currencies including Malaysian Ringgit (RM)
- **Data Export**: Export your transaction data to CSV format
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Local Storage**: Your data is saved in your browser's local storage

## Technologies Used

- **React**: Frontend library for building user interfaces
- **Vite**: Next-generation frontend tooling for faster development
- **React Router**: For navigation and routing
- **Bootstrap 5**: For responsive UI components and styling
- **Chart.js**: For data visualization
- **UUID**: For generating unique IDs

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/money-tracker.git
   cd money-tracker
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

### Adding Transactions

1. Navigate to the Dashboard
2. Fill out the transaction form with:
   - Transaction type (income or expense)
   - Description
   - Amount
   - Category
   - Date
3. Click "Add Transaction"

### Viewing Transactions

1. Navigate to the Transactions page
2. Use the filter buttons to view all, income, or expense transactions
3. Use the search box to find specific transactions

### Analyzing Your Finances

1. Navigate to the Reports page
2. View your savings rate
3. Use the period selector to view income vs. expenses over different time periods

## Building for Production

To create a production build:

```
npm run build
```

The build files will be in the `dist` directory.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Icons provided by Bootstrap Icons
- Charts powered by Chart.js
