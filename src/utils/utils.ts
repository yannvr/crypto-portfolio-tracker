export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatNumber(value: number, precision = 2): string {
  return value.toFixed(precision);
}

export function formatPercent(value: number, digits = 2): string {
  return `${value.toFixed(digits)}%`;
}

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
