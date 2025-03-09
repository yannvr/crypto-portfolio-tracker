import useSWR from 'swr';
import { fetcher, coinGeckoSWRConfig } from '../utils/swrConfig';
import { API_URLS, COINGECKO_ENDPOINTS } from '../utils/constants';

export interface CoinListItem {
  id: string;
  symbol: string;
  name: string;
}

/**
 * Hook to fetch and cache the list of all coins from CoinGecko
 */
export function useCoinList() {
  const { data, error, isLoading } = useSWR<CoinListItem[]>(
    `${API_URLS.COINGECKO_BASE_URL}${COINGECKO_ENDPOINTS.COINS_LIST}`,
    fetcher,
    {
      ...coinGeckoSWRConfig,
      // Cache the coin list for a longer period since it doesn't change often
      dedupingInterval: 24 * 60 * 60 * 1000, // 24 hours
      refreshInterval: 0, // Don't auto-refresh
      revalidateOnFocus: false,
      revalidateIfStale: false,
    }
  );

  /**
   * Find a coin ID by its symbol
   * @param symbol The coin symbol to look up
   * @returns The coin ID or null if not found
   */
  const findCoinIdBySymbol = (symbol: string): string | null => {
    if (!data) return null;

    const normalizedSymbol = symbol.toLowerCase();

    // First try exact match
    const exactMatch = data.find(coin => coin.symbol.toLowerCase() === normalizedSymbol);
    if (exactMatch) return exactMatch.id;

    // If no exact match, try to find the most popular coin with this symbol
    // This is a heuristic - in a real app, you might want to use market cap or other metrics
    // to determine the "main" coin for a symbol
    const matches = data.filter(coin => coin.symbol.toLowerCase() === normalizedSymbol);
    if (matches.length > 0) {
      // For now, just return the first match
      // In a real app, you might want to fetch additional data to determine the most popular one
      return matches[0].id;
    }

    // If still no match, return null
    return null;
  };

  return {
    coinList: data || [],
    findCoinIdBySymbol,
    isLoading,
    isError: error,
  };
}
