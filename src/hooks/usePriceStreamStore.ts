import { useEffect } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
  console.log("🚀 ~ usePriceStream ~ assetSymbol:", assetSymbol)
  const { prices, setPrice } = usePriceStreamStore();

  useEffect(() => {
    const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${assetSymbol.toLowerCase()}usdt@miniTicker`);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("🚀 ~ useEffect ~ data:", data)
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
