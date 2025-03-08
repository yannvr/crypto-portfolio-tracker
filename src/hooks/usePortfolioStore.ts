import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Asset {
  id: number;
  symbol: string;
  quantity: number;
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
        { id: 6, symbol: 'DOT', quantity: 100 },
        { id: 7, symbol: 'BNB', quantity: 20 },
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
      getStorage: () => localStorage, // (optional) by default, 'localStorage' is used
    },
  ),
);

export default usePortfolioStore;
