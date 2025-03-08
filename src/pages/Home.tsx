import React from 'react';
import { Link } from 'react-router-dom';
import usePortfolioStore from '../hooks/usePortfolioStore';
import AssetCard from '../components/AssetCard';
import usePriceStream from '../hooks/usePriceStream';

export default function Home() {
  const { assets } = usePortfolioStore();

  return (
    <div className="max-w-3xl mx-auto p-4 bg-gray-100 rounded-lg shadow-lg">
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Crypto Portfolio</h1>
        <Link to="/add" className="bg-blue-500 text-white py-2 px-4 rounded">
          + Add New Holding
        </Link>
      </header>

      <main className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {assets.map((asset) => (
          <AssetCard
            key={asset.id}
            asset={asset}
            currentPrice={usePriceStream(asset.symbol)}
            previousPrice={asset.previousPrice}
          />
        ))}
      </main>
    </div>
  );
}
