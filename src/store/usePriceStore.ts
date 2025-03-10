import { create } from 'zustand';

interface PriceState {
  prices: Record<string, number | null>;
  previousPrices: Record<string, number | null>;
  priceChanges: Record<string, number>;
  lastUpdated: Record<string, number>;
  connectionStatus: Record<string, 'connected' | 'disconnected' | 'error'>;

  setPrice: (symbol: string, price: number) => void;
  setConnectionStatus: (symbol: string, status: 'connected' | 'disconnected' | 'error') => void;
}

// Store for managing real-time price data
const usePriceStore = create<PriceState>()((set) => ({
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
}));

export default usePriceStore;
