/**
 * Format a number as currency with compact notation
 * @param num The number to format
 * @param currency The currency code (default: 'USD')
 * @returns Formatted currency string
 */
export const formatCurrency = (num: number, currency = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    notation: 'compact',
    maximumFractionDigits: 2
  }).format(num);
};

/**
 * Format a number with compact notation
 * @param num The number to format
 * @returns Formatted number string
 */
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 2
  }).format(num);
};

/**
 * Format a number as a percentage
 * @param num The number to format (0.1 = 10%)
 * @param digits Number of decimal places
 * @returns Formatted percentage string
 */
export const formatPercent = (num: number, digits = 2): string => {
  return `${(num * 100).toFixed(digits)}%`;
};

/**
 * Format a price change with sign and percentage
 * @param change The price change amount
 * @param price The current price
 * @returns Formatted price change string
 */
export const formatPriceChange = (change: number, price: number): string => {
  const percentChange = (change / price) * 100;
  return `${change.toFixed(2)} (${percentChange.toFixed(2)}%)`;
};
