import { useEffect, useState, useCallback } from 'react';
import useSWR from 'swr';
import { create } from 'zustand';
import { API_URLS, ENDPOINTS, SWR_CONFIG, fetcher } from '../services/apiService';

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

/**
 * Store for managing real-time price data
 */
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

/**
 * Hook to fetch and manage the list of available coins
 * @returns Object containing coin list and functions to work with it
 */
export function useCoinList() {
  const { data, error, isLoading } = useSWR<Coin[]>(
    `${API_URLS.COINGECKO_BASE_URL}${ENDPOINTS.COINGECKO.COINS_LIST}`,
    fetcher,
    {
      ...SWR_CONFIG.COINGECKO,
      dedupingInterval: 24 * 60 * 60 * 1000, // 24 hours
      refreshInterval: 0, // Don't auto-refresh
      revalidateOnFocus: false,
      revalidateIfStale: false,
    }
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

/**
 * Hook to fetch and manage coin data
 * @param symbol The symbol of the coin (e.g., 'BTC')
 * @returns Object containing coin data and loading state
 */
export function useCoinData(symbol: string) {
  const { findCoinIdBySymbol } = useCoinList();
  const { setPrice } = usePriceStore();

  // Get coin ID
  const coinId = findCoinIdBySymbol(symbol) || symbol.toLowerCase();

  // Fetch coin data
  const { data, error, isLoading } = useSWR(
    coinId ? `${API_URLS.COINGECKO_BASE_URL}${ENDPOINTS.COINGECKO.COIN_DETAILS(coinId)}` : null,
    fetcher,
    SWR_CONFIG.COINGECKO
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

/**
 * Hook to fetch and format price history data for charts
 * @param symbol The symbol of the coin (e.g., 'BTC')
 * @param days Number of days of history to fetch
 * @returns Object containing chart data and loading state
 */
export function usePriceChart(symbol: string, days = 7) {
  const { findCoinIdBySymbol } = useCoinList();

  // Get coin ID
  const coinId = findCoinIdBySymbol(symbol) || symbol.toLowerCase();

  // Fetch price history
  const { data, error, isLoading } = useSWR(
    coinId ? `${API_URLS.COINGECKO_BASE_URL}${ENDPOINTS.COINGECKO.MARKET_CHART(coinId, days)}` : null,
    fetcher,
    SWR_CONFIG.COINGECKO
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

/**
 * Hook to subscribe to real-time price updates for a specific asset
 * @param symbol The symbol of the asset to subscribe to (e.g., 'BTC')
 * @param onError Optional callback for handling WebSocket errors
 * @returns The current price of the asset
 */
export function usePriceStream(symbol: string, onError?: (message: string) => void) {
  const { prices, setPrice, setConnectionStatus } = usePriceStore();

  useEffect(() => {
    // Use constants for WebSocket URL
    const wsUrl = `${API_URLS.BINANCE_WS_BASE_URL}/${ENDPOINTS.BINANCE_WS.MINI_TICKER(symbol)}`;
    const ws = new WebSocket(wsUrl);

    // Set connection status to connected when the WebSocket opens
    ws.onopen = () => {
      setConnectionStatus(symbol, 'connected');
    };

    // Update price when a message is received
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setPrice(symbol, parseFloat(data.c));
      } catch (error) {
        console.error(`Error parsing WebSocket data for ${symbol}:`, error);
      }
    };

    // Handle WebSocket errors
    ws.onerror = () => {
      setConnectionStatus(symbol, 'error');
      onError?.(`WebSocket error for ${symbol}`);
    };

    // Handle WebSocket disconnections
    ws.onclose = () => {
      setConnectionStatus(symbol, 'disconnected');
    };

    // Clean up WebSocket connection when the component unmounts
    return () => {
      ws.close();
    };
  }, [symbol, onError, setPrice, setConnectionStatus]);

  return prices[symbol] || null;
}

/**
 * Hook to initialize price streams for all assets in a portfolio
 * @param assets Array of assets with symbols
 */
export function usePortfolioPriceStreams(assets: Array<{ symbol: string }>) {
  useEffect(() => {
    const symbols = assets.map(asset => asset.symbol);

    // Create WebSocket connections for each symbol
    const connections = symbols.map(symbol => {
      const wsUrl = `${API_URLS.BINANCE_WS_BASE_URL}/${ENDPOINTS.BINANCE_WS.MINI_TICKER(symbol)}`;
      const ws = new WebSocket(wsUrl);
      const { setPrice, setConnectionStatus } = usePriceStore.getState();

      // Set connection status to connected when the WebSocket opens
      ws.onopen = () => {
        setConnectionStatus(symbol, 'connected');
      };

      // Update price when a message is received
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setPrice(symbol, parseFloat(data.c));
        } catch (error) {
          console.error(`Error parsing WebSocket data for ${symbol}:`, error);
        }
      };

      // Handle WebSocket errors
      ws.onerror = () => {
        setConnectionStatus(symbol, 'error');
      };

      // Handle WebSocket disconnections
      ws.onclose = () => {
        setConnectionStatus(symbol, 'disconnected');
      };

      return ws;
    });

    // Clean up WebSocket connections when the component unmounts
    return () => {
      connections.forEach(ws => ws.close());
    };
  }, [assets]); // Re-run when assets change
}
