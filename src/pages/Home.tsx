import Button from '@components/Button';
import Select from '@components/Select';
import TextInput from '@components/TextInput';
import usePortfolioStore from '@store/usePortfolioStore';
import usePriceStore from '@store/usePriceStore';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchInitialPrices, usePriceStream } from '../hooks/useAssetData';
import { formatCurrency } from '../utils/utils';
import AssetCard from './Home/components/AssetCard';

type SortOption = 'name' | 'value';

export interface Asset {
  id: number;
  symbol: string;
  quantity: number;
}

interface PortfolioHeaderProps {
  assetCount: number;
  totalValue: number;
}

interface FilterControlsProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  sortOption: SortOption;
  setSortOption: (value: SortOption) => void;
}

interface AssetGridProps {
  assets: Asset[];
}

// ===== Components =====

const PortfolioHeader: React.FC<PortfolioHeaderProps> = ({ assetCount, totalValue }) => (
  <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
    <div>
      <h1 className="text-4xl font-bold text-white">Crypto Portfolio</h1>
      <p className="text-gray-400 mt-1">
        {assetCount} {assetCount === 1 ? 'Asset' : 'Assets'} • Total Value: {formatCurrency(totalValue)}
      </p>
    </div>
    <Link to="/add">
      <Button>+ Asset</Button>
    </Link>
  </header>
);

const FilterControls: React.FC<FilterControlsProps> = ({
  searchTerm,
  setSearchTerm,
  sortOption,
  setSortOption
}) => (
  <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
    <TextInput
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Search asset..."
      aria-label="Search assets"
    />

    <Select
      value={sortOption}
      onChange={(e) => setSortOption(e.target.value as SortOption)}
      aria-label="Sort assets"
    >
      <option value="name">Sort by Name</option>
      <option value="value">Sort by Value</option>
    </Select>
  </div>
);


const EmptyPortfolio: React.FC = () => (
  <div className="col-span-full text-center text-gray-400 py-12 bg-gray-900 rounded-lg">
    <p className="text-xl mb-4">Your portfolio is empty</p>
    <p className="mb-6">Add your first asset to start tracking your crypto investments</p>
    <Link to="/add">
      <Button>Add Your First Asset</Button>
    </Link>
  </div>
);


const AssetGrid: React.FC<AssetGridProps> = ({ assets }) => (
  <main className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
    {assets.length > 0 ? (
      assets.map((asset) => (
        <AssetCard key={asset.id} asset={asset} />
      ))
    ) : (
      <div className="col-span-full">
        <EmptyPortfolio />
      </div>
    )}
  </main>
);

// ===== Custom Hooks =====


const useFilteredAndSortedAssets = (
  assets: Asset[],
  prices: Record<string, number | null>,
  sortOption: SortOption,
  searchTerm: string
): Asset[] => {
  return useMemo(() => {
    // First filter assets by search term
    const filtered = assets.filter(asset =>
      asset.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Then sort the filtered assets
    return filtered.sort((a, b) => {
      if (sortOption === 'name') {
        return a.symbol.localeCompare(b.symbol);
      }

      if (sortOption === 'value') {
        const valueA = (prices[a.symbol] || 0) * a.quantity;
        const valueB = (prices[b.symbol] || 0) * b.quantity;
        return valueB - valueA; // Descending order for values
      }

      return 0;
    });
  }, [assets, prices, sortOption, searchTerm]);
};

const useTotalPortfolioValue = (
  assets: Array<{ symbol: string; quantity: number }>,
  prices: Record<string, number | null>
): number => {
  return useMemo(() => {
    return assets.reduce((total, asset) => {
      const price = prices[asset.symbol] || 0;
      return total + (price * asset.quantity);
    }, 0);
  }, [assets, prices]);
};


export default function Home(): React.ReactElement {
  // State and store hooks
  const { assets } = usePortfolioStore();
  const { prices, setPrice } = usePriceStore();
  const [sortOption, setSortOption] = useState<SortOption>('name');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch initial prices once on component mount
  useEffect(() => {
    fetchInitialPrices(assets, setPrice);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array to run only once on mount, ignoring assets and setPrice changes

  // Initialize price streams for all assets
  usePriceStream(assets);

  // Derived state using custom hooks
  const totalPortfolioValue = useTotalPortfolioValue(assets, prices);
  const filteredAndSortedAssets = useFilteredAndSortedAssets(
    assets,
    prices,
    sortOption,
    searchTerm
  );

  return (
    <div className="min-h-screen bg-black text-white px-6 py-8">
      <PortfolioHeader
        assetCount={assets.length}
        totalValue={totalPortfolioValue}
      />

      <FilterControls
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        sortOption={sortOption}
        setSortOption={setSortOption}
      />

      <AssetGrid assets={filteredAndSortedAssets} />
    </div>
  );
}
