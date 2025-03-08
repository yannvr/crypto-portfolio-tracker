import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import usePortfolioStore from '../hooks/usePortfolioStore';
import usePriceStreamStore from '../hooks/usePriceStreamStore';
import AssetCard from '../components/AssetCard';
import TextInput from '../components/ui/TextInput';
import Button from '../components/ui/Button';
import Select from '../components/ui/Select';

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
    <div className="min-h-screen bg-black text-white px-6 py-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-white">Crypto Portfolio</h1>
        <Link to="/add">
          <Button>+ Add New Holding</Button>
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
        {filteredAndSortedAssets.map((asset) => (
          <AssetCard key={asset.id} asset={asset} />
        ))}
      </main>
    </div>
  );
}
