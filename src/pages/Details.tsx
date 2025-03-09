import React, { useMemo, useState, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import usePortfolioStore from '../store/usePortfolioStore';
import { useCoinData, usePriceChart } from '../hooks/useAssetData';
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
  const navigate = useNavigate();
  const selectAsset = usePortfolioStore(state => state.selectAsset);
  const [selectedDays, setSelectedDays] = useState(7);

  // Memoize the setSelectedDays callback to prevent unnecessary re-renders
  const handleDaysChange = useCallback((days: number) => {
    setSelectedDays(days);
  }, []);

  // Use useMemo to prevent unnecessary re-renders when the asset doesn't change
  const asset = useMemo(() => selectAsset(id), [id, selectAsset]);

  // Fetch coin data
  const { data: coinData, loading: coinLoading, error: coinError } =
    asset ? useCoinData(asset.symbol) : { data: null, loading: false, error: null };

  // Fetch price chart data
  const { chartData, loading: chartLoading, error: chartError } =
    asset ? usePriceChart(asset.symbol, selectedDays) : { chartData: [], loading: false, error: null };

  // Calculate y-axis domain for the chart
  const yAxisDomain = useMemo(() => {
    if (!chartData.length) return [0, 0] as [number, number];
    const prices = chartData.map(d => d.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const padding = (max - min) * 0.02;
    return [min - padding, max + padding] as [number, number];
  }, [chartData]);

  if (!asset) {
    return <AssetNotFound />;
  }

  const isLoading = coinLoading || chartLoading;
  const hasError = coinError || chartError;
  const currentPrice = coinData?.market_data?.current_price?.usd || 0;
  const totalValue = currentPrice * asset.quantity;

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

      {isLoading ? (
        <LoadingState />
      ) : hasError ? (
        <ErrorState />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <AssetInfoCard
            asset={asset}
            coinData={coinData}
            currentPrice={currentPrice}
            totalValue={totalValue}
          />

          <PriceChartCard
            chartData={chartData}
            selectedDays={selectedDays}
            setSelectedDays={handleDaysChange}
            yAxisDomain={yAxisDomain}
          />

          <MarketStatsCard coinData={coinData} />
        </div>
      )}
    </div>
  );
}
