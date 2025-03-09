/**
 * Consolidated utilities file
 */

/**
 * Format a number as currency
 * @param value The number to format
 * @returns Formatted currency string
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Format a number with appropriate precision
 * @param value The number to format
 * @param precision The number of decimal places
 * @returns Formatted number string
 */
export function formatNumber(value: number, precision = 2): string {
  return value.toFixed(precision);
}

/**
 * Format a percentage value
 * @param value The percentage value
 * @param digits The number of decimal places
 * @returns Formatted percentage string
 */
export function formatPercent(value: number, digits = 2): string {
  return `${value.toFixed(digits)}%`;
}

/**
 * Format a price change value
 * @param change The price change percentage
 * @param price The current price
 * @returns Formatted price change string
 */
export function formatPriceChange(change: number, price: number): string {
  const sign = change >= 0 ? '+' : '-';
  const percentChange = `${sign}${Math.abs(change).toFixed(2)}%`;

  // Calculate the absolute value change
  const valueChange = (price * Math.abs(change)) / 100;
  const formattedValueChange = formatCurrency(valueChange);

  return `${percentChange} (${sign}${formattedValueChange})`;
}

/**
 * Generate a unique ID
 * @returns A unique ID string
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

/**
 * Truncate a string to a specified length
 * @param str The string to truncate
 * @param maxLength The maximum length
 * @returns The truncated string
 */
export function truncateString(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return `${str.substring(0, maxLength - 3)}...`;
}

/**
 * Debounce a function
 * @param func The function to debounce
 * @param wait The wait time in milliseconds
 * @returns The debounced function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return function(...args: Parameters<T>): void {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
