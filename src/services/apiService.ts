/**
 * Consolidated API service for all external data fetching
 */

// API URLs
export const API_URLS = {
  COINGECKO_BASE_URL: 'https://api.coingecko.com/api/v3',
  BINANCE_BASE_URL: 'https://api.binance.com/api/v3',
  BINANCE_WS_BASE_URL: 'wss://stream.binance.com:443/ws',
};

// API Endpoints
export const ENDPOINTS = {
  // CoinGecko endpoints
  COINGECKO: {
    COINS_LIST: '/coins/list',
    COIN_DETAILS: (coinId: string) =>
      `/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`,
    MARKET_CHART: (coinId: string, days: number) =>
      `/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`,
    SIMPLE_PRICE: (coinId: string) =>
      `/simple/price?ids=${coinId}&vs_currencies=usd`,
  },

  // Binance endpoints
  BINANCE: {
    KLINES: (symbol: string, interval = '1d', limit = 7) =>
      `/klines?symbol=${symbol.toUpperCase()}USDT&interval=${interval}&limit=${limit}`,
    TICKER: (symbol: string) =>
      `/ticker/price?symbol=${symbol.toUpperCase()}USDT`,
  },

  // Binance WebSocket endpoints
  BINANCE_WS: {
    MINI_TICKER: (symbol: string) =>
      `${symbol.toLowerCase()}usdt@miniTicker`,
  },
};

// SWR configuration
export const SWR_CONFIG = {
  // Default configuration
  DEFAULT: {
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    refreshInterval: 60000, // 1 minute
    dedupingInterval: 5000, // 5 seconds
    errorRetryCount: 3,
  },

  // CoinGecko specific configuration
  COINGECKO: {
    refreshInterval: 60000, // 1 minute
    dedupingInterval: 10000, // 10 seconds
    errorRetryCount: 3,
    errorRetryInterval: 5000, // 5 seconds
  },

  // Binance specific configuration
  BINANCE: {
    refreshInterval: 30000, // 30 seconds
    dedupingInterval: 5000, // 5 seconds
    errorRetryCount: 3,
  },
};

// Fetcher function for SWR
export const fetcher = async (url: string) => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
};
