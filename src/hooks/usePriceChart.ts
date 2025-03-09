import useSWR from 'swr';
import { fetcher, swrConfig } from '../utils/swrConfig';
import { API_URLS, BINANCE_ENDPOINTS } from '../utils/constants';

export interface PriceData {
  date: string;
  price: number;
}

/**
 * Hook to fetch price chart data from Binance
 */
export function usePriceChart(symbol: string, interval = '1d', limit = 7) {
  const { data, error, isLoading } = useSWR(
    `${API_URLS.BINANCE_BASE_URL}${BINANCE_ENDPOINTS.KLINES(symbol, interval, limit)}`,
    fetcher,
    {
      ...swrConfig,
      refreshInterval: 60000, // Refresh every minute
    }
  );

  // Transform the data to match our PriceData interface
  const chartData: PriceData[] = data
    ? data.map((item: any) => ({
        date: new Date(item[0]).toLocaleDateString('en-GB', { month: '2-digit', day: 'numeric' }),
        price: parseFloat(item[4]), // Closing price
      }))
    : [];

  return {
    chartData,
    isLoading,
    isError: error,
  };
}
