import { renderHook } from '@testing-library/react';
import { usePriceStreamSWR } from '../hooks/usePriceStreamSWR';

// Mock the SWR hook
jest.mock('../hooks/usePriceStreamSWR', () => ({
  usePriceStreamSWR: jest.fn()
}));

beforeEach(() => {
  // Reset the mock before each test
  (usePriceStreamSWR as jest.Mock).mockReset();
});

test('initial price state is null when loading', () => {
  (usePriceStreamSWR as jest.Mock).mockReturnValue({
    price: null,
    isLoading: true,
    isError: false
  });

  const { result } = renderHook(() => usePriceStreamSWR('BTC'));
  expect(result.current.price).toBeNull();
  expect(result.current.isLoading).toBe(true);
});

test('returns price when data is loaded', () => {
  (usePriceStreamSWR as jest.Mock).mockReturnValue({
    price: 50000,
    isLoading: false,
    isError: false
  });

  const { result } = renderHook(() => usePriceStreamSWR('BTC'));
  expect(result.current.price).toBe(50000);
  expect(result.current.isLoading).toBe(false);
});
