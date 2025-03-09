import useSWR from 'swr';
import { getFallbackCoinGeckoId } from '../services/coinGeckoService';
import { fetcher, coinGeckoSWRConfig } from '../utils/swrConfig';
import { useCoinList } from './useCoinList';
import { API_URLS, COINGECKO_ENDPOINTS } from '../utils/constants';
import { useMemo } from 'react';

// Define a comprehensive interface for the transformed coin data
export interface TransformedCoinData {
  // Basic info
  id: string;
  name: string;
  symbol: string;

  // Images
  image: {
    thumb: string;
    small: string;
    large: string;
  };

  // Description
  description: string;

  // Links
  links: {
    homepage: string[];
    blockchain_site: string[];
    official_forum_url: string[];
    chat_url: string[];
    twitter_screen_name: string;
    facebook_username: string;
    telegram_channel_identifier: string;
    subreddit_url: string;
  };

  // Market data
  market_data: {
    current_price: { usd: number };
    market_cap: { usd: number };
    fully_diluted_valuation: { usd: number };
    total_volume: { usd: number };
    circulating_supply: number;
    total_supply: number;
    max_supply: number | null;
    price_change_percentage_24h: number;
    price_change_percentage_7d: number;
    price_change_percentage_30d: number;
    price_change_percentage_1y: number;
    ath: { usd: number };
    ath_date: { usd: string };
    ath_change_percentage: { usd: number };
    atl: { usd: number };
    atl_date: { usd: string };
    atl_change_percentage: { usd: number };
  };

  // Raw data for any other needs
  raw: any;
}

export function useCoinData(symbol: string) {
  // Get the coin list and the function to find a coin ID by symbol
  const { findCoinIdBySymbol, isLoading: isLoadingCoinList } = useCoinList();

  // Try to find the coin ID using the dynamic list
  // Use useMemo to prevent unnecessary recalculations
  const coinId = useMemo(() => {
    // Try to find the coin ID using the dynamic list
    const dynamicCoinId = findCoinIdBySymbol(symbol);

    // If the dynamic lookup fails or is still loading, use the fallback
    const fallbackId = getFallbackCoinGeckoId(symbol);

    const finalId = dynamicCoinId || fallbackId;

    // Log the result for debugging
    console.debug(`Symbol matching for ${symbol}: dynamicId=${dynamicCoinId}, fallbackId=${fallbackId}, finalId=${finalId}`);

    return finalId;
  }, [findCoinIdBySymbol, symbol]);

  // Only fetch data if we have a coin ID
  const shouldFetch = Boolean(coinId);

  // Create the SWR key with useMemo to prevent unnecessary re-fetches
  const swrKey = useMemo(() => {
    return shouldFetch ? `${API_URLS.COINGECKO_BASE_URL}${COINGECKO_ENDPOINTS.COIN_DETAILS(coinId)}` : null;
  }, [shouldFetch, coinId]);

  const { data, error, isLoading: isLoadingCoinData } = useSWR(
    swrKey,
    fetcher,
    coinGeckoSWRConfig // Use CoinGecko-specific configuration
  );

  // Transform the data to provide a clean, consistent interface
  // Use useMemo to prevent unnecessary transformations on each render
  const coinStats = useMemo(() => {
    if (!data) return null;

    // Create a transformed object with a clean interface
    const transformed: TransformedCoinData = {
      id: data.id || '',
      name: data.name || '',
      symbol: data.symbol?.toUpperCase() || symbol.toUpperCase(),

      image: {
        thumb: data.image?.thumb || '',
        small: data.image?.small || '',
        large: data.image?.large || '',
      },

      description: data.description?.en || '',

      links: {
        homepage: data.links?.homepage || [],
        blockchain_site: data.links?.blockchain_site || [],
        official_forum_url: data.links?.official_forum_url || [],
        chat_url: data.links?.chat_url || [],
        twitter_screen_name: data.links?.twitter_screen_name || '',
        facebook_username: data.links?.facebook_username || '',
        telegram_channel_identifier: data.links?.telegram_channel_identifier || '',
        subreddit_url: data.links?.subreddit_url || '',
      },

      market_data: {
        current_price: { usd: data.market_data?.current_price?.usd || 0 },
        market_cap: { usd: data.market_data?.market_cap?.usd || 0 },
        fully_diluted_valuation: { usd: data.market_data?.fully_diluted_valuation?.usd || 0 },
        total_volume: { usd: data.market_data?.total_volume?.usd || 0 },
        circulating_supply: data.market_data?.circulating_supply || 0,
        total_supply: data.market_data?.total_supply || 0,
        max_supply: data.market_data?.max_supply || null,
        price_change_percentage_24h: data.market_data?.price_change_percentage_24h || 0,
        price_change_percentage_7d: data.market_data?.price_change_percentage_7d || 0,
        price_change_percentage_30d: data.market_data?.price_change_percentage_30d || 0,
        price_change_percentage_1y: data.market_data?.price_change_percentage_1y || 0,
        ath: { usd: data.market_data?.ath?.usd || 0 },
        ath_date: { usd: data.market_data?.ath_date?.usd || '' },
        ath_change_percentage: { usd: data.market_data?.ath_change_percentage?.usd || 0 },
        atl: { usd: data.market_data?.atl?.usd || 0 },
        atl_date: { usd: data.market_data?.atl_date?.usd || '' },
        atl_change_percentage: { usd: data.market_data?.atl_change_percentage?.usd || 0 },
      },

      // Include the raw data for any other needs
      raw: data,
    };

    return transformed;
  }, [data, symbol]);

  // We're loading if either the coin list or the coin data is loading
  const isLoading = isLoadingCoinList || isLoadingCoinData;

  return {
    coinStats,
    coinId,
    isLoading,
    isError: error,
  };
}
