export const API_URLS = {
  // CoinGecko API base URL - provides detailed coin information and historical data
  COINGECKO_BASE_URL: 'https://api.coingecko.com/api/v3',

  // Binance REST API base URL - provides current price data
  BINANCE_BASE_URL: 'https://api.binance.com/api/v3',

  // Binance WebSocket API base URL - provides real-time price updates
  BINANCE_WS_BASE_URL: 'wss://stream.binance.com:443/ws',
};

export const ENDPOINTS = {
  COINGECKO: {
    // Get a list of all available coins
    COINS_LIST: '/coins/list',

    // Get detailed information about a specific coin
    COIN_DETAILS: (coinId: string) =>
      `/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`,

    // Get historical market data for a coin
    MARKET_CHART: (coinId: string, days: number) =>
      `/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`,

    // Get simple price data for a coin
    SIMPLE_PRICE: (coinId: string) =>
      `/simple/price?ids=${coinId}&vs_currencies=usd`,
  },

  // Binance endpoints
  BINANCE: {
     // Get kline/candlestick data for a trading pair
    KLINES: (symbol: string, interval = '1d', limit = 7) =>
      `/klines?symbol=${symbol.toUpperCase()}USDT&interval=${interval}&limit=${limit}`,

    // Get current price for a trading pair
    TICKER: (symbol: string) =>
      `/ticker/price?symbol=${symbol.toUpperCase()}USDT`,
  },

  // Binance WebSocket endpoints
  BINANCE_WS: {
    // Get mini ticker stream for a trading pair
    MINI_TICKER: (symbol: string) =>
      `${symbol.toLowerCase()}usdt@miniTicker`,
  },
};

export const fetcher = async (url: string) => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
};
