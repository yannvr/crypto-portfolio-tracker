import { Asset } from 'pages/Home';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface PortfolioState {
  assets: Asset[];
  nextId: number;
  // Actions
  addAsset: (symbol: string, quantity: number) => void;
  removeAsset: (id: number) => void;
  editAsset: (id: number, updates: Partial<Omit<Asset, 'id'>>) => void;
  selectAsset: (id?: string) => Asset | undefined;
  // Virtual values
  getTotalAssets: () => number;
}

const usePortfolioStore = create<PortfolioState>()(
  persist<PortfolioState>(
    (set, get) => ({
      assets: [],
      nextId: 1,
      addAsset: (symbol, quantity) =>
        set((state) => {
          const newAsset = {
            id: state.nextId,
            symbol: symbol.toUpperCase(),
            quantity,
          };
          return {
            assets: [...state.assets, newAsset],
            nextId: state.nextId + 1,
          };
        }),
      removeAsset: (id) =>
        set((state) => ({
          assets: state.assets.filter((asset) => asset.id !== id),
        })),
      editAsset: (id, updates) =>
        set((state) => ({
          assets: state.assets.map((asset) =>
            asset.id === id ? { ...asset, ...updates } : asset
          ),
        })),
      selectAsset: (id) => id ? get().assets.find(asset => asset.id === Number(id)) : undefined,
      getTotalAssets: () => get().assets.length,
    }),
    {
      name: 'portfolio-storage',
    },
  ),
);

export default usePortfolioStore;
