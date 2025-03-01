/**
 * Format a number as currency
 * @param {number} amount - The amount to format
 * @param {string} currency - The currency code (default: MYR)
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, currency = 'MYR') => {
  // Handle NaN, undefined, or null values
  if (amount === undefined || amount === null || isNaN(amount)) {
    amount = 0;
  }
  
  // Ensure amount is a number
  const numericAmount = parseFloat(amount);
  
  return new Intl.NumberFormat('en-MY', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(numericAmount);
};

/**
 * Format a number as a percentage
 * @param {number} value - The value to format as percentage
 * @returns {string} Formatted percentage string
 */
export const formatPercentage = (value) => {
  // Handle NaN, undefined, or null values
  if (value === undefined || value === null || isNaN(value)) {
    value = 0;
  }
  
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  }).format(value / 100);
};

/**
 * Get CSS class based on amount (positive or negative)
 * @param {number} amount - The amount to check
 * @returns {string} CSS class name
 */
export const getAmountClass = (amount) => {
  // Handle NaN, undefined, or null values
  if (amount === undefined || amount === null || isNaN(amount)) {
    return 'text-muted';
  }
  
  return parseFloat(amount) >= 0 ? 'text-success' : 'text-danger';
}; 