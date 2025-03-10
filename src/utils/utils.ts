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

export const formatPercent = (value: number): string => {
  if (value === 0) return '0.00%';

  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
};

export const formatNumber = (value: number): string => {
  return value.toLocaleString();
};

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

export function truncateString(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return `${str.substring(0, maxLength - 3)}...`;
}
