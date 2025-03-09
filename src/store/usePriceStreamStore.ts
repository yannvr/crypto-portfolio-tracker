import { useEffect } from 'react';
import { create } from 'zustand';
import { API_URLS, BINANCE_WS_ENDPOINTS } from '../utils/constants';

interface PriceStreamState {
  // State
  prices: Record<string, number | null>;
  lastUpdated: Record<string, number>;
  connectionStatus: Record<string, 'connected' | 'disconnected' | 'error'>;

  // Actions
  setPrice: (symbol: string, price: number) => void;
  setConnectionStatus: (symbol: string, status: 'connected' | 'disconnected' | 'error') => void;
  clearPrices: () => void;
}

/**
 * Store for managing real-time price data from WebSockets
 * This is intentionally not persisted as it should only contain real-time data
 */
const usePriceStreamStore = create<PriceStreamState>()((set) => ({
  // State
  prices: {},
  lastUpdated: {},
  connectionStatus: {},

  // Actions
  setPrice: (symbol, price) =>
    set((state) => ({
      prices: { ...state.prices, [symbol]: price },
      lastUpdated: { ...state.lastUpdated, [symbol]: Date.now() },
    })),

  setConnectionStatus: (symbol, status) =>
    set((state) => ({
      connectionStatus: { ...state.connectionStatus, [symbol]: status },
    })),

  clearPrices: () => set({ prices: {}, lastUpdated: {} }),
}));

/**
 * Hook to subscribe to real-time price updates for a specific asset
 * @param assetSymbol The symbol of the asset to subscribe to (e.g., 'BTC')
 * @param onError Optional callback for handling WebSocket errors
 * @returns The current price of the asset
 */
export function usePriceStream(assetSymbol: string, onError?: (message: string) => void) {
  const { prices, setPrice, setConnectionStatus } = usePriceStreamStore();

  useEffect(() => {
    // Use constants for WebSocket URL
    const wsUrl = `${API_URLS.BINANCE_WS_BASE_URL}/${BINANCE_WS_ENDPOINTS.MINI_TICKER(assetSymbol)}`;
    const ws = new WebSocket(wsUrl);

    // Set connection status to connected when the WebSocket opens
    ws.onopen = () => {
      setConnectionStatus(assetSymbol, 'connected');
    };

    // Update price when a message is received
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setPrice(assetSymbol, parseFloat(data.c));
      } catch (error) {
        console.error(`Error parsing WebSocket data for ${assetSymbol}:`, error);
      }
    };

    // Handle WebSocket errors
    ws.onerror = () => {
      setConnectionStatus(assetSymbol, 'error');
      onError?.(`WebSocket error for ${assetSymbol}`);
    };

    // Handle WebSocket disconnections
    ws.onclose = () => {
      setConnectionStatus(assetSymbol, 'disconnected');
    };

    // Clean up WebSocket connection when the component unmounts
    return () => {
      ws.close();
    };
  }, [assetSymbol, onError, setPrice, setConnectionStatus]);

  return prices[assetSymbol] || null;
}

export default usePriceStreamStore;
