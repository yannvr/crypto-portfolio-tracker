import { render, waitFor } from '@testing-library/react';
import PriceChart from '../../components/PriceChart';

// Properly cast fetch as a Jest mock function
global.fetch = jest.fn() as jest.Mock;

describe('PriceChart Component - Data Fetching', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Reset mocks before each test
  });

  test('fetches price data correctly', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => [
        [1710633600000, 48000, 49000, 47000, 48500], // Mocked price data
        [1710720000000, 48500, 49500, 47500, 49000],
      ],
    });

    render(<PriceChart symbol="BTC" />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1d&limit=7'
      );
    });
  });

  test('handles API fetch error gracefully', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('API Error'));

    // Mock console.error properly
    const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});

    render(<PriceChart symbol="BTC" />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining('Error fetching price data for BTC:'),
        expect.any(Error)
      );
    });

    // Restore original console.error
    consoleErrorMock.mockRestore();
  });
});
