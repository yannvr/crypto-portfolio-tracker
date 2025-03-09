/**
 * API URLs for external services
 */
export const API_URLS = {
  COINGECKO_BASE_URL: 'https://api.coingecko.com/api/v3',
  BINANCE_BASE_URL: 'https://api.binance.com/api/v3',
  BINANCE_WS_BASE_URL: 'wss://stream.binance.com:443/ws',
};

/**
 * Endpoints for CoinGecko API
 */
export const COINGECKO_ENDPOINTS = {
  COINS_LIST: '/coins/list',
  COIN_DETAILS: (coinId: string) =>
    `/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`,
  SIMPLE_PRICE: (coinId: string) => `/simple/price?ids=${coinId}&vs_currencies=usd`,
};

/**
 * Endpoints for Binance API
 */
export const BINANCE_ENDPOINTS = {
  KLINES: (symbol: string, interval = '1d', limit = 7) =>
    `/klines?symbol=${symbol.toUpperCase()}USDT&interval=${interval}&limit=${limit}`,
};

/**
 * WebSocket endpoints for Binance
 */
export const BINANCE_WS_ENDPOINTS = {
  MINI_TICKER: (symbol: string) =>
    `${symbol.toLowerCase()}usdt@miniTicker`,
};
