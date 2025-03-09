import useSWR from 'swr';
import { getFallbackCoinGeckoId } from '../services/coinGeckoService';
import { fetcher, coinGeckoSWRConfig } from '../utils/swrConfig';
import { useCoinList } from './useCoinList';
import { API_URLS, COINGECKO_ENDPOINTS } from '../utils/constants';

/**
 * Hook to fetch real-time price data for a cryptocurrency
 * @param symbol The cryptocurrency symbol (e.g., 'BTC')
 * @returns Object containing price data and loading/error states
 */
export function usePriceStreamSWR(symbol: string) {
  // Get the coin list and the function to find a coin ID by symbol
  const { findCoinIdBySymbol, isLoading: isLoadingCoinList } = useCoinList();

  // Try to find the coin ID using the dynamic list
  const dynamicCoinId = findCoinIdBySymbol(symbol);

  // If the dynamic lookup fails or is still loading, use the fallback
  const coinId = dynamicCoinId || getFallbackCoinGeckoId(symbol);

  // Only fetch data if we have a coin ID
  const shouldFetch = Boolean(coinId);

  const { data, error, isLoading: isLoadingPriceData } = useSWR(
    shouldFetch ? `${API_URLS.COINGECKO_BASE_URL}${COINGECKO_ENDPOINTS.SIMPLE_PRICE(coinId)}` : null,
    fetcher,
    {
      ...coinGeckoSWRConfig,
      // Override config for price data
      refreshInterval: 15000, // Refresh every 15 seconds for price data
    }
  );

  // Extract the price from the response
  const price = data && data[coinId]?.usd ? data[coinId].usd : null;

  // We're loading if either the coin list or the price data is loading
  const isLoading = isLoadingCoinList || isLoadingPriceData;

  return {
    price,
    coinId,
    isLoading,
    isError: error,
  };
}
