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
    };
  } catch (error) {
    console.error(`Error fetching coin stats for ${coinId}:`, error);
    return null;
  }
};
