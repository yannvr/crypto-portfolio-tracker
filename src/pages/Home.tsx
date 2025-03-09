import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { usePortfolioStore, usePriceStreamStore } from '../store';
import AssetCard from '../components/AssetCard';
import TextInput from '../components/ui/TextInput';
import Button from '../components/ui/Button';
import Select from '../components/ui/Select';
import { usePriceStream } from '../store/usePriceStreamStore';
import { formatCurrency } from '../utils/formatters';

type SortOption = 'name' | 'value';

export default function Home() {
  const { assets } = usePortfolioStore();
  const { prices } = usePriceStreamStore();
  const [sortOption, setSortOption] = useState<SortOption>('name');
  const [searchTerm, setSearchTerm] = useState('');

  // Calculate total portfolio value
  const totalPortfolioValue = useMemo(() => {
    return assets.reduce((total, asset) => {
      const price = prices[asset.symbol] || 0;
      return total + (price * asset.quantity);
    }, 0);
  }, [assets, prices]);

  const filteredAndSortedAssets = useMemo(() => {
    const filtered = assets.filter(asset =>
      asset.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return filtered.sort((a, b) => {
      if (sortOption === 'name') {
        return a.symbol.localeCompare(b.symbol);
      } else if (sortOption === 'value') {
        const valueA = (prices[a.symbol] || 0) * a.quantity;
        const valueB = (prices[b.symbol] || 0) * b.quantity;
        return valueB - valueA;
      }
      return 0;
    });
  }, [assets, prices, sortOption, searchTerm]);

  return (
    <div className="min-h-screen bg-black text-white px-6 py-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold text-white">Crypto Portfolio</h1>
          <p className="text-gray-400 mt-1">
            {assets.length} {assets.length === 1 ? 'Asset' : 'Assets'} • Total Value: {formatCurrency(totalPortfolioValue)}
          </p>
        </div>
        <Link to="/add">
          <Button>+ Asset</Button>
        </Link>
      </header>

      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
        <TextInput
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search asset..."
        />

        <Select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value as SortOption)}
        >
          <option value="name">Sort by Name</option>
          <option value="value">Sort by Value</option>
        </Select>
      </div>

      <main className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredAndSortedAssets.length > 0 ? (
          filteredAndSortedAssets.map((asset) => (
            <AssetCard key={asset.id} asset={asset} />
          ))
        ) : (
          <div className="col-span-full text-center text-gray-400 py-12 bg-gray-900 rounded-lg">
            <p className="text-xl mb-4">Your portfolio is empty</p>
            <p className="mb-6">Add your first asset to start tracking your crypto investments</p>
            <Link to="/add">
              <Button>Add Your First Asset</Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
