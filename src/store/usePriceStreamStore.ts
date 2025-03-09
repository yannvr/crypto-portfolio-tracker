import { useEffect } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { API_URLS, BINANCE_WS_ENDPOINTS } from '../utils/constants';

interface PriceStreamState {
  prices: Record<string, number | null>;
  setPrice: (symbol: string, price: number) => void;
}

const usePriceStreamStore = create<PriceStreamState>()(
  persist(
    (set) => ({
      prices: {},
      setPrice: (symbol, price) =>
        set((state) => ({
          prices: { ...state.prices, [symbol]: price },
        })),
    }),
    {
      name: 'price-stream-storage', // name of the item in the storage (must be unique)
    }
  )
);

export function usePriceStream(assetSymbol: string, onError?: (message: string) => void) {
  const { prices, setPrice } = usePriceStreamStore();

  useEffect(() => {
    // Use constants for WebSocket URL
    const wsUrl = `${API_URLS.BINANCE_WS_BASE_URL}/${BINANCE_WS_ENDPOINTS.MINI_TICKER(assetSymbol)}`;
    const ws = new WebSocket(wsUrl);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setPrice(assetSymbol, parseFloat(data.c));
    };

    ws.onerror = () => {
      onError?.(`WebSocket error for ${assetSymbol}`);
    };

    return () => ws.close();
  }, [assetSymbol, onError, setPrice]);

  return prices[assetSymbol] || null;
}

export default usePriceStreamStore;
