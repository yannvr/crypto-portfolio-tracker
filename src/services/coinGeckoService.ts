// CoinGecko API service for fetching cryptocurrency data
import { API_URLS, COINGECKO_ENDPOINTS } from '../utils/constants';

// Fallback map for common crypto symbols to their CoinGecko IDs
// This is used only if the dynamic lookup fails
const fallbackSymbolToIdMap: Record<string, string> = {
  'BTC': 'bitcoin',
  'ETH': 'ethereum',
  'SOL': 'solana',
  'USDT': 'tether',
  'BNB': 'binancecoin',
  'XRP': 'ripple',
  'ADA': 'cardano',
  'DOGE': 'dogecoin',
  'AVAX': 'avalanche-2',
  'DOT': 'polkadot',
  'MATIC': 'matic-network',
  'LINK': 'chainlink',
  'UNI': 'uniswap',
  'SHIB': 'shiba-inu',
};

export interface CoinStats {
  marketCap: number;
  fullyDilutedValuation: number;
  tradingVolume24h: number;
  circulatingSupply: number;
  totalSupply: number;
  maxSupply: number | null;
  // Additional information
  name: string;
  description: string;
  image: {
    thumb: string;
    small: string;
    large: string;
  };
  categories: string[];
  website: string;
  priceChangePercentage24h: number;
  priceChangePercentage7d: number;
  priceChangePercentage30d: number;
  priceChangePercentage1y: number;
  allTimeHigh: {
    price: number;
    date: string;
    percentFromATH: number;
  };
  allTimeLow: {
    price: number;
    date: string;
    percentFromATL: number;
  };
}

/**
 * Get the CoinGecko ID for a given symbol using the fallback map
 * This is used only if the dynamic lookup fails
 */
export const getFallbackCoinGeckoId = (symbol: string): string => {
  const upperSymbol = symbol.toUpperCase();
  return fallbackSymbolToIdMap[upperSymbol] || upperSymbol.toLowerCase();
};

/**
 * Fetch detailed coin data from CoinGecko
 */
export const fetchCoinStats = async (coinId: string): Promise<CoinStats | null> => {
  try {
    const response = await fetch(
      `${API_URLS.COINGECKO_BASE_URL}${COINGECKO_ENDPOINTS.COIN_DETAILS(coinId)}`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch data for ${coinId}`);
    }

    const data = await response.json();

    return {
      marketCap: data.market_data.market_cap.usd || 0,
      fullyDilutedValuation: data.market_data.fully_diluted_valuation?.usd || 0,
      tradingVolume24h: data.market_data.total_volume.usd || 0,
      circulatingSupply: data.market_data.circulating_supply || 0,
      totalSupply: data.market_data.total_supply || 0,
      maxSupply: data.market_data.max_supply,
      // Additional information
      name: data.name || '',
      description: data.description?.en || '',
      image: {
        thumb: data.image?.thumb || '',
        small: data.image?.small || '',
        large: data.image?.large || '',
      },
      categories: data.categories || [],
      website: data.links?.homepage?.[0] || '',
      priceChangePercentage24h: data.market_data?.price_change_percentage_24h || 0,
      priceChangePercentage7d: data.market_data?.price_change_percentage_7d || 0,
      priceChangePercentage30d: data.market_data?.price_change_percentage_30d || 0,
      priceChangePercentage1y: data.market_data?.price_change_percentage_1y || 0,
      allTimeHigh: {
        price: data.market_data?.ath?.usd || 0,
        date: data.market_data?.ath_date?.usd || '',
        percentFromATH: data.market_data?.ath_change_percentage?.usd || 0,
      },
      allTimeLow: {
        price: data.market_data?.atl?.usd || 0,
        date: data.market_data?.atl_date?.usd || '',
        percentFromATL: data.market_data?.atl_change_percentage?.usd || 0,
      },
    };
  } catch (error) {
    console.error(`Error fetching coin stats for ${coinId}:`, error);
    return null;
  }
};
