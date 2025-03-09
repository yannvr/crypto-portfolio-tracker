import { useCallback, useEffect } from 'react';
import useSWR from 'swr';
import { create } from 'zustand';
import { API_URLS, ENDPOINTS, fetcher } from '../services/apiService';

// ===== Types =====

export interface Coin {
  id: string;
  symbol: string;
  name: string;
}

export interface CoinData {
  id: string;
  name: string;
  symbol: string;
  image: {
    thumb: string;
    small: string;
    large: string;
  };
  description: string;
  market_data: {
    current_price: { usd: number };
    market_cap: { usd: number };
    price_change_percentage_24h: number;
    price_change_percentage_7d: number;
    price_change_percentage_30d: number;
  };
}

export interface ChartData {
  date: string;
  price: number;
}

// ===== SWR Configuration =====

// Default SWR configuration to prevent rate limiting
export const SWR_CONFIG = {
  refreshInterval: 0, // Disable auto-refresh to avoid rate limiting
  revalidateOnFocus: false, // Disable revalidation on focus like changing tabs
};

// Extended SWR configuration with caching options
export const CACHED_SWR_CONFIG = {
  ...SWR_CONFIG,
  dedupingInterval: 24 * 60 * 60 * 1000, // 24 hours
  revalidateIfStale: false,
};

// ===== Price Stream Store =====

interface PriceState {
  prices: Record<string, number | null>;
  previousPrices: Record<string, number | null>;
  priceChanges: Record<string, number>;
  lastUpdated: Record<string, number>;
  connectionStatus: Record<string, 'connected' | 'disconnected' | 'error'>;

  setPrice: (symbol: string, price: number) => void;
  setConnectionStatus: (symbol: string, status: 'connected' | 'disconnected' | 'error') => void;
  clearPrices: () => void;
}

// Store for managing real-time price data
export const usePriceStore = create<PriceState>()((set) => ({
  prices: {},
  previousPrices: {},
  priceChanges: {},
  lastUpdated: {},
  connectionStatus: {},

  setPrice: (symbol, price) =>
    set((state) => {
      const previousPrice = state.prices[symbol];

      let priceChange = state.priceChanges[symbol] || 0;
      if (previousPrice && previousPrice > 0) {
        priceChange = ((price - previousPrice) / previousPrice) * 100;
      }

      return {
        prices: { ...state.prices, [symbol]: price },
        previousPrices: { ...state.previousPrices, [symbol]: previousPrice },
        priceChanges: { ...state.priceChanges, [symbol]: priceChange },
        lastUpdated: { ...state.lastUpdated, [symbol]: Date.now() },
      };
    }),

  setConnectionStatus: (symbol, status) =>
    set((state) => ({
      connectionStatus: { ...state.connectionStatus, [symbol]: status },
    })),

  clearPrices: () => set({
    prices: {},
    previousPrices: {},
    priceChanges: {},
    lastUpdated: {}
  }),
}));

// ===== Canonical Coin IDs =====

// Map for common crypto symbols to their CoinGecko IDs
// This is needed because the CoinGecko API returns different IDs for the same coin!
const CANONICAL_COIN_IDS: Record<string, string> = {
  'btc': 'bitcoin',
  'eth': 'ethereum',
  'usdt': 'tether',
  'usdc': 'usd-coin',
  'bnb': 'binancecoin',
  'xrp': 'ripple',
  'ada': 'cardano',
  'doge': 'dogecoin',
  'sol': 'solana',
  'dot': 'polkadot',
  'shib': 'shiba-inu',
  'matic': 'matic-network',
  'avax': 'avalanche-2',
  'link': 'chainlink',
  'ltc': 'litecoin',
};

// ===== Hooks =====

// Hook to fetch and manage the list of available coins
export function useCoinList() {
  const { data, error, isLoading } = useSWR<Coin[]>(
    `${API_URLS.COINGECKO_BASE_URL}${ENDPOINTS.COINGECKO.COINS_LIST}`,
    fetcher,
    CACHED_SWR_CONFIG
  );

  const findCoinIdBySymbol = useCallback(
    (symbol: string) => {
      if (!data) return null;

      const normalizedSymbol = symbol.toLowerCase();

      // Check canonical IDs first
      if (CANONICAL_COIN_IDS[normalizedSymbol]) {
        return CANONICAL_COIN_IDS[normalizedSymbol];
      }

      // Find in the list
      const coin = data.find((c) => c.symbol.toLowerCase() === normalizedSymbol);
      return coin?.id || null;
    },
    [data]
  );

  return {
    coins: data || [],
    loading: isLoading,
    error,
    findCoinIdBySymbol
  };
}

// Hook to fetch and manage coin data
export function useCoinData(symbol: string) {
  const { findCoinIdBySymbol } = useCoinList();
  const { setPrice } = usePriceStore();

  // Get coin ID
  const coinId = findCoinIdBySymbol(symbol) || symbol.toLowerCase();

  // Fetch coin data
  const { data, error, isLoading } = useSWR(
    coinId ? `${API_URLS.COINGECKO_BASE_URL}${ENDPOINTS.COINGECKO.COIN_DETAILS(coinId)}` : null,
    fetcher,
    SWR_CONFIG
  );

  // Update price in store when data changes
  useEffect(() => {
    if (data?.market_data?.current_price?.usd) {
      setPrice(symbol, data.market_data.current_price.usd);
    }
  }, [data, symbol, setPrice]);

  return {
    data: data as CoinData,
    loading: isLoading,
    error
  };
}

// Hook to fetch and format price history data for charts
export function usePriceChart(symbol: string, days = 7) {
  const { findCoinIdBySymbol } = useCoinList();
  const coinId = findCoinIdBySymbol(symbol) || symbol.toLowerCase();
  const { data, error, isLoading } = useSWR(
    coinId ? `${API_URLS.COINGECKO_BASE_URL}${ENDPOINTS.COINGECKO.MARKET_CHART(coinId, days)}` : null,
    fetcher,
    SWR_CONFIG
  );

  // Format data for chart
  const chartData: ChartData[] = data?.prices
    ? data.prices.map(([timestamp, price]: [number, number]) => ({
        date: new Date(timestamp).toLocaleDateString(),
        price,
      }))
    : [];

  return {
    chartData,
    loading: isLoading,
    error
  };
}

// Hook to initialize price streams for one or multiple assets
export function usePriceStream(
  symbolsInput: string | Array<{ symbol: string }>,
  onError?: (message: string) => void
) {
  const { prices, setPrice, setConnectionStatus } = usePriceStore();

  useEffect(() => {
    // Handle both single symbol string and array of assets
    const symbols = typeof symbolsInput === 'string'
      ? [symbolsInput]
      : symbolsInput.map(asset => asset.symbol);

    // Create WebSocket connections for each symbol
    const connections = symbols.map(symbol => {
      const wsUrl = `${API_URLS.BINANCE_WS_BASE_URL}/${ENDPOINTS.BINANCE_WS.MINI_TICKER(symbol)}`;
      const ws = new WebSocket(wsUrl);

      // For multiple symbols mode, we need to get the store methods directly
      // since we're inside a map function and can't use the destructured values
      const storeActions = typeof symbolsInput === 'string'
        ? { setPrice, setConnectionStatus }
        : usePriceStore.getState();

      ws.onopen = () => {
        storeActions.setConnectionStatus(symbol, 'connected');
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          storeActions.setPrice(symbol, parseFloat(data.c));
        } catch (error) {
          console.error(`Error parsing WebSocket data for ${symbol}:`, error);
        }
      };

      ws.onerror = () => {
        storeActions.setConnectionStatus(symbol, 'error');
        if (typeof symbolsInput === 'string') {
          onError?.(`WebSocket error for ${symbol}`);
        }
      };

      ws.onclose = () => {
        storeActions.setConnectionStatus(symbol, 'disconnected');
      };

      return ws;
    });

    // Clean up WebSocket connections when the component unmounts
    return () => {
      connections.forEach(ws => ws.close());
    };
  }, [symbolsInput, onError, setPrice, setConnectionStatus]);

  // Only return the price in single symbol mode
  return typeof symbolsInput === 'string' ? prices[symbolsInput] || null : undefined;
}

// Hook to fetch initial prices for multiple assets at once
export function useInitialPrices(assets: Array<{ symbol: string }>) {
  const { setPrice } = usePriceStore();
  const { findCoinIdBySymbol } = useCoinList();

  useEffect(() => {
    if (!assets || assets.length === 0) return;

    // Get unique symbols
    const symbols = [...new Set(assets.map(asset => asset.symbol))];

    // For each symbol, find the coin ID and fetch the price
    symbols.forEach(async (symbol) => {
      const coinId = findCoinIdBySymbol(symbol);
      if (!coinId) return;

      try {
        // Use the simple price endpoint for faster response
        const url = `${API_URLS.COINGECKO_BASE_URL}${ENDPOINTS.COINGECKO.SIMPLE_PRICE(coinId)}`;
        const data = await fetcher(url);

        if (data && data[coinId] && data[coinId].usd) {
          setPrice(symbol, data[coinId].usd);
        }
      } catch (error) {
        console.error(`Error fetching initial price for ${symbol}:`, error);
      }
    });
  }, [assets, findCoinIdBySymbol, setPrice]);
}
