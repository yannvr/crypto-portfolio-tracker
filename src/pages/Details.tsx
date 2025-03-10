import Button from '@components/Button';
import usePortfolioStore from '@store/usePortfolioStore';
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AssetInfoCard } from './Details/components/AssetInfoCard';
import { MarketStatsCard } from './Details/components/MarketStatsCard';
import { PriceChartCard } from './Details/components/PriceChartCard';
import { AssetNotFound } from './Details/components/StateComponents';

export default function Details() {
  const { id } = useParams();
  const selectAsset = usePortfolioStore(state => state.selectAsset);
  const [selectedDays, setSelectedDays] = useState(7);

  const asset = selectAsset(id);

  if (!asset) {
    return <AssetNotFound />;
  }

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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* First row with fixed height */}
        <div className="lg:col-span-3 lg:flex lg:flex-col lg:h-[400px]">
          <AssetInfoCard asset={asset} />
        </div>

        <div className="lg:col-span-9 lg:flex lg:flex-col lg:h-[400px]">
          <PriceChartCard
            asset={asset}
            selectedDays={selectedDays}
            setSelectedDays={(days: number) => { setSelectedDays(days) }}
          />
        </div>

        {/* Second row - Market Stats only */}
        <div className="lg:col-span-12">
          <MarketStatsCard symbol={asset.symbol} />
        </div>
      </div>
    </div>
  );
}
