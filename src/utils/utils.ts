/**
 * Format a number as currency (USD)
 * @param value - The number to format
 * @returns Formatted currency string
 */
export const formatCurrency = (value: number): string => {
  // Handle zero or very small values
  if (value === 0) return '$0.00';
  if (value < 0.01) return '<$0.01';

  // Format based on value size
  if (value >= 1_000_000_000) {
    return `$${(value / 1_000_000_000).toFixed(2)}B`;
  } else if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(2)}M`;
  } else if (value >= 1_000) {
    return `$${(value / 1_000).toFixed(2)}K`;
  } else {
    return `$${value.toFixed(2)}`;
  }
};

/**
 * Format a number as a percentage
 * @param value - The number to format
 * @returns Formatted percentage string
 */
export const formatPercent = (value: number): string => {
  if (value === 0) return '0.00%';

  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
};

/**
 * Format a large number with commas
 * @param value - The number to format
 * @returns Formatted number string
 */
export const formatNumber = (value: number): string => {
  return value.toLocaleString();
};

/**
 * Format a date to a readable string
 * @param date - The date to format
 * @returns Formatted date string
 */
export const formatDate = (date: Date | string): string => {
  if (!date) return 'N/A';

  const dateObj = typeof date === 'string' ? new Date(date) : date;

  return dateObj.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export function formatPriceChange(change: number, price: number): string {
  const sign = change >= 0 ? '+' : '-';
  const percentChange = `${sign}${Math.abs(change).toFixed(2)}%`;

  // Calculate the absolute value change
  const valueChange = (price * Math.abs(change)) / 100;
  const formattedValueChange = formatCurrency(valueChange);

  return `${percentChange} (${sign}${formattedValueChange})`;
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

export function truncateString(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return `${str.substring(0, maxLength - 3)}...`;
}

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
