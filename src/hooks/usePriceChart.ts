import useSWR from 'swr';
import { fetcher, swrConfig } from '../utils/swrConfig';
import { API_URLS, BINANCE_ENDPOINTS } from '../utils/constants';

export interface PriceData {
  date: string;
  price: number;
}

export type TimeInterval = '1h' | '4h' | '1d' | '1w' | '1M';

// Map time intervals to appropriate limit values for meaningful charts
const intervalToLimitMap: Record<TimeInterval, number> = {
  '1h': 24,   // 24 hours of hourly data
  '4h': 42,   // 7 days of 4-hour data
  '1d': 30,   // 30 days of daily data
  '1w': 12,   // 12 weeks of weekly data
  '1M': 12,   // 12 months of monthly data
};

// Map time intervals to appropriate date formatting options
const intervalToDateFormat: Record<TimeInterval, Intl.DateTimeFormatOptions> = {
  '1h': { hour: '2-digit', minute: '2-digit' },
  '4h': { month: 'short', day: 'numeric', hour: '2-digit' },
  '1d': { month: 'short', day: 'numeric' },
  '1w': { month: 'short', day: 'numeric' },
  '1M': { year: 'numeric', month: 'short' },
};

/**
 * Hook to fetch price chart data from Binance
 */
export function usePriceChart(symbol: string, interval: TimeInterval = '1d') {
  const limit = intervalToLimitMap[interval];
  const dateFormat = intervalToDateFormat[interval];

  const { data, error, isLoading } = useSWR(
    `${API_URLS.BINANCE_BASE_URL}${BINANCE_ENDPOINTS.KLINES(symbol, interval, limit)}`,
    fetcher,
    {
      ...swrConfig,
      refreshInterval: interval === '1h' ? 30000 : 60000, // Refresh more frequently for hourly data
    }
  );

  // Transform the data to match our PriceData interface
  const chartData: PriceData[] = data
    ? data.map((item: any) => ({
        date: new Date(item[0]).toLocaleDateString('en-GB', dateFormat),
        price: parseFloat(item[4]), // Closing price
      }))
    : [];

  return {
    chartData,
    isLoading,
    isError: error,
  };
}
