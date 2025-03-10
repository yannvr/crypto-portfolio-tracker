import { formatCurrency, formatNumber, formatPercent, formatPriceChange, truncateString } from './utils';

describe('Utility Functions', () => {
  describe('formatCurrency', () => {
    test('formats small values correctly', () => {
      expect(formatCurrency(123.45)).toBe('$123.45');
    });

    test('formats values in thousands correctly', () => {
      expect(formatCurrency(1234.56)).toBe('$1.23K');
    });

    test('formats values in millions correctly', () => {
      expect(formatCurrency(1234567.89)).toBe('$1.23M');
    });

    test('formats values in billions correctly', () => {
      expect(formatCurrency(1234567890.12)).toBe('$1.23B');
    });

    test('formats zero correctly', () => {
      expect(formatCurrency(0)).toBe('$0.00');
    });

    test('formats very small values correctly', () => {
      expect(formatCurrency(0.001)).toBe('<$0.01');
    });
  });

  describe('formatNumber', () => {
    test('formats number with locale string', () => {
      expect(formatNumber(1234.56789)).toBe('1,234.568');
    });
  });

  describe('formatPercent', () => {
    test('formats positive percentage correctly', () => {
      expect(formatPercent(12.345)).toBe('+12.35%');
    });

    test('formats negative percentage correctly', () => {
      expect(formatPercent(-12.345)).toBe('-12.35%');
    });

    test('formats zero percentage correctly', () => {
      expect(formatPercent(0)).toBe('0.00%');
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
