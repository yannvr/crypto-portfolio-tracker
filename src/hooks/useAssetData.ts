import { useCallback, useEffect } from 'react';
import useSWR from 'swr';
import { API_URLS, ENDPOINTS, fetcher } from '../services/apiService';
import usePriceStore from '@store/usePriceStore';

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

// Hook to fetch and manage real-time price data via WebSocket
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

      // Get the store methods directly to avoid closure issues
      const { setPrice, setConnectionStatus } = usePriceStore.getState();

      ws.onopen = () => {
        setConnectionStatus(symbol, 'connected');
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setPrice(symbol, parseFloat(data.c));
        } catch (error) {
          console.error(`Error parsing WebSocket data for ${symbol}:`, error);
        }
      };

      ws.onerror = () => {
        setConnectionStatus(symbol, 'error');
        if (typeof symbolsInput === 'string') {
          onError?.(`WebSocket error for ${symbol}`);
        }
      };

      ws.onclose = () => {
        setConnectionStatus(symbol, 'disconnected');
      };

      return ws;
    });

    // Clean up WebSocket connections when the component unmounts
    return () => {
      connections.forEach(ws => ws.close());
    };
  }, [symbolsInput, onError]);  // Removed setPrice and setConnectionStatus from dependencies

  // Only return the price in single symbol mode
  return typeof symbolsInput === 'string' ? prices[symbolsInput] || null : undefined;
}

// Fetch initial prices for multiple assets in a single API call
// Used by home page to fetch prices for all assets in one go
export async function fetchInitialPrices(
  assets: Array<{ symbol: string }>,
  onSuccess: (symbol: string, price: number) => void
) {
  if (!assets || assets.length === 0) return;

  try {
    // Get the coin list first
    const coinListUrl = `${API_URLS.COINGECKO_BASE_URL}${ENDPOINTS.COINGECKO.COINS_LIST}`;
    const coinList = await fetcher(coinListUrl);

    // Get unique symbols and map them to coin IDs
    const symbols = [...new Set(assets.map(asset => asset.symbol))];
    const coinIds = symbols.map(symbol => {
      // Find the coin ID for this symbol
      const normalizedSymbol = symbol.toLowerCase();

      // Check canonical IDs first
      if (CANONICAL_COIN_IDS[normalizedSymbol]) {
        return CANONICAL_COIN_IDS[normalizedSymbol];
      }

      // Find in the list
      const coin = coinList.find((c: Coin) => c.symbol.toLowerCase() === normalizedSymbol);
      return coin?.id || normalizedSymbol;
    }).filter(Boolean);

    // Batch fetch prices for all coins
    if (coinIds.length > 0) {
      try {
        const idsParam = coinIds.join(',');
        const pricesUrl = `${API_URLS.COINGECKO_BASE_URL}/simple/price?ids=${idsParam}&vs_currencies=usd`;
        const pricesData = await fetcher(pricesUrl);

        // Update prices in the store
        symbols.forEach((symbol, index) => {
          const coinId = coinIds[index];
          if (coinId && pricesData[coinId]?.usd) {
            onSuccess(symbol, pricesData[coinId].usd);
          }
        });
      } catch (priceError) {
        console.error('Error fetching batch prices:', priceError);
        // Fall back to individual price fetches if batch fails
        symbols.forEach(async (symbol, index) => {
          try {
            const coinId = coinIds[index];
            if (coinId) {
              const singlePriceUrl = `${API_URLS.COINGECKO_BASE_URL}/simple/price?ids=${coinId}&vs_currencies=usd`;
              const singlePriceData = await fetcher(singlePriceUrl);
              if (singlePriceData[coinId]?.usd) {
                onSuccess(symbol, singlePriceData[coinId].usd);
              }
            }
          } catch (singleError) {
            console.error(`Error fetching price for ${symbol}:`, singleError);
          }
        });
      }
    }
  } catch (error) {
    console.error('Error in fetchInitialPrices:', error);
  }
}
