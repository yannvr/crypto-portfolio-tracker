import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import usePortfolioStore from '../store/usePortfolioStore';
import { useInitialPrices } from '../hooks/useAssetData';
import Button from '../components/Button';
import {
  AssetInfoCard,
  PriceChartCard,
  MarketStatsCard,
  LoadingState,
  ErrorState,
  AssetNotFound
} from './Details.components';

export default function Details() {
  const { id } = useParams();
  const selectAsset = usePortfolioStore(state => state.selectAsset);
  const [selectedDays, setSelectedDays] = useState(7);

  // Get the asset directly without memoization
  const asset = selectAsset(id);

  // Fetch initial price data if we have an asset
  // useInitialPrices(asset ? [asset] : []);

  if (!asset) {
    return <AssetNotFound />;
  }

  // Simple function to handle days change
  const handleDaysChange = (days: number) => {
    setSelectedDays(days);
  };

  return (
    <div className="min-h-screen bg-black text-white px-6 py-8">
      <header className="flex justify-between items-center mb-8">
        <div>
          <Link to="/" className="text-gray-400 hover:text-white mb-2 inline-block">
            &larr; Back to Portfolio
          </Link>
          <h1 className="text-3xl font-bold">{asset.symbol} Details</h1>
        </div>
        <Link to={`/edit/${asset.id}`}>
          <Button>Edit Asset</Button>
        </Link>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <AssetInfoCard
          asset={asset}
        />

        <PriceChartCard
          asset={asset}
          selectedDays={selectedDays}
          setSelectedDays={handleDaysChange}
        />

        <MarketStatsCard
          asset={asset}
        />
      </div>
    </div>
  );
}
