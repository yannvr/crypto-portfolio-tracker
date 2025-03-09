import useSWR from 'swr';
import { CoinStats, fetchCoinStats, getFallbackCoinGeckoId } from '../services/coinGeckoService';
import { fetcher, coinGeckoSWRConfig } from '../utils/swrConfig';
import { useCoinList } from './useCoinList';
import { API_URLS, COINGECKO_ENDPOINTS } from '../utils/constants';

export function useCoinData(symbol: string) {
  // Get the coin list and the function to find a coin ID by symbol
  const { findCoinIdBySymbol, isLoading: isLoadingCoinList } = useCoinList();

  // Try to find the coin ID using the dynamic list
  const dynamicCoinId = findCoinIdBySymbol(symbol);

  // If the dynamic lookup fails or is still loading, use the fallback
  const coinId = dynamicCoinId || getFallbackCoinGeckoId(symbol);

  // Only fetch data if we have a coin ID
  const shouldFetch = Boolean(coinId);

  const { data, error, isLoading: isLoadingCoinData } = useSWR(
    shouldFetch ? `${API_URLS.COINGECKO_BASE_URL}${COINGECKO_ENDPOINTS.COIN_DETAILS(coinId)}` : null,
    fetcher,
    coinGeckoSWRConfig // Use CoinGecko-specific configuration
  );

  // Transform the data to match our CoinStats interface
  const coinStats: CoinStats | null = data ? {
    marketCap: data.market_data.market_cap.usd || 0,
    fullyDilutedValuation: data.market_data.fully_diluted_valuation?.usd || 0,
    tradingVolume24h: data.market_data.total_volume.usd || 0,
    circulatingSupply: data.market_data.circulating_supply || 0,
    totalSupply: data.market_data.total_supply || 0,
    maxSupply: data.market_data.max_supply,
  } : null;

  // We're loading if either the coin list or the coin data is loading
  const isLoading = isLoadingCoinList || isLoadingCoinData;

  return {
    coinStats,
    coinId,
    isLoading,
    isError: error,
  };
}
