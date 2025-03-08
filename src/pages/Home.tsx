import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import usePortfolioStore from '../hooks/usePortfolioStore';
import usePriceStreamStore from '../hooks/usePriceStreamStore';
import AssetCard from '../components/AssetCard';

type SortOption = 'name' | 'value';

export default function Home() {
  const { assets } = usePortfolioStore();
  const { prices } = usePriceStreamStore();
  const [sortOption, setSortOption] = useState<SortOption>('name');
  const [searchTerm, setSearchTerm] = useState('');

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
    <div className="max-w-5xl mx-auto p-6 bg-background rounded-lg shadow-lg">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-primary">Crypto Portfolio</h1>
        <Link to="/add" className="bg-blue-500  bg-accent text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-400">
          + Add New Holding
        </Link>
      </header>

      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
        <input
          type="text"
          placeholder="Search asset..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border rounded-lg p-3 flex-1 shadow-sm"
        />

        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value as SortOption)}
          className="border rounded-lg p-3 shadow-sm"
        >
          <option value="name">Sort by Name</option>
          <option value="value">Sort by Value</option>
        </select>
      </div>

      <main className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredAndSortedAssets.map((asset) => (
          <AssetCard
            key={asset.id}
            asset={asset}
          />
        ))}
      </main>
    </div>
  );
}
