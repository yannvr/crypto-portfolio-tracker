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
  selectAsset: (id?: string) => Asset | undefined;
}

const usePortfolioStore = create<PortfolioState>()(
  persist<PortfolioState>(
    (set, get) => ({
      assets: [
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
        selectAsset: id => id ? get().assets.find(asset => asset.id === Number(id)) : undefined,
    }),
    {
      name: 'portfolio-storage', // name of the item in the storage (must be unique)
    },
  ),
);

export default usePortfolioStore;
