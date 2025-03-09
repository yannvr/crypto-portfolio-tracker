import { formatCurrency, formatNumber, formatPercent, formatPriceChange, truncateString } from './utils';

describe('Utility Functions', () => {
  describe('formatCurrency', () => {
    test('formats currency with 2 decimal places', () => {
      expect(formatCurrency(1234.56)).toBe('$1,234.56');
    });

    test('formats zero correctly', () => {
      expect(formatCurrency(0)).toBe('$0.00');
    });

    test('formats negative values correctly', () => {
      expect(formatCurrency(-1234.56)).toBe('-$1,234.56');
    });
  });

  describe('formatNumber', () => {
    test('formats number with default 2 decimal places', () => {
      expect(formatNumber(1234.56789)).toBe('1234.57');
    });

    test('formats number with specified decimal places', () => {
      expect(formatNumber(1234.56789, 3)).toBe('1234.568');
    });
  });

  describe('formatPercent', () => {
    test('formats percentage with default 2 decimal places', () => {
      expect(formatPercent(12.345)).toBe('12.35%');
    });

    test('formats percentage with specified decimal places', () => {
      expect(formatPercent(12.345, 1)).toBe('12.3%');
    });

    test('formats negative percentage correctly', () => {
      expect(formatPercent(-12.345)).toBe('-12.35%');
    });
  });

  describe('formatPriceChange', () => {
    test('formats positive price change correctly', () => {
      expect(formatPriceChange(5, 100)).toBe('+5.00% (+$5.00)');
    });

    test('formats negative price change correctly', () => {
      expect(formatPriceChange(-5, 100)).toBe('-5.00% (-$5.00)');
    });
  });

  describe('truncateString', () => {
    test('truncates string longer than maxLength', () => {
      expect(truncateString('This is a long string', 10)).toBe('This is...');
    });

    test('does not truncate string shorter than maxLength', () => {
      expect(truncateString('Short', 10)).toBe('Short');
    });

    test('handles empty string', () => {
      expect(truncateString('', 10)).toBe('');
    });
  });
});
