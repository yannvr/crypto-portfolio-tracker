import { create } from 'zustand';
import { persist, PersistOptions } from 'zustand/middleware';

interface Asset {
  id: number;
  symbol: string;
  quantity: number;
  previousPrice: number;
}

interface PortfolioState {
  assets: Asset[];
  addAsset: (asset: Asset) => void;
  removeAsset: (id: number) => void;
  editAsset: (updatedAsset: Asset) => void;
}

const usePortfolioStore = create<PortfolioState>()(
  persist<PortfolioState>(
    (set) => ({
      assets: [
        // { id: 1, symbol: 'BTC', quantity: 2.5, previousPrice: 50000 },
        // { id: 2, symbol: 'ETH', quantity: 10, previousPrice: 4000 },
        // { id: 3, symbol: 'XRP', quantity: 2000, previousPrice: 1.5 },
        // { id: 4, symbol: 'LTC', quantity: 50, previousPrice: 200 },
        // { id: 5, symbol: 'ADA', quantity: 500, previousPrice: 2 },
        { id: 6, symbol: 'DOT', quantity: 100, previousPrice: 35 },
        { id: 7, symbol: 'BNB', quantity: 20, previousPrice: 600 },
      ],
      addAsset: asset => set(state => ({ assets: [...state.assets, asset] })),
      removeAsset: id =>
        set(state => ({
          assets: state.assets.filter(asset => asset.id !== id),
        })),
      editAsset: updatedAsset =>
        set(state => ({
          assets: state.assets.map(asset => (asset.id === updatedAsset.id ? updatedAsset : asset)),
        })),
    }),
    {
      name: 'portfolio-storage', // name of the item in the storage (must be unique)
      // getStorage: () => localStorage, // (optional) by default, 'localStorage' is used
    },
  ),
);

export default usePortfolioStore;
