import { useParams } from 'react-router-dom';
import { useMemo } from 'react';
import AssetDetails from './Details/components/AssetDetails';
import usePortfolioStore from '@store/usePortfolioStore';
import { useCoinData } from '../hooks/useCoinData';

export default function Details() {
  const { id } = useParams();
  const selectAsset = usePortfolioStore(state => state.selectAsset);

  // Use useMemo to prevent unnecessary re-renders when the asset doesn't change
  const asset = useMemo(() => selectAsset(id), [id, selectAsset]);

  // Extract useCoinData to the parent component
  const coinData = asset ? useCoinData(asset.symbol) : null;

  if (!asset) {
    return <div className="text-white text-center mt-10">Asset not found</div>;
  }

  return <AssetDetails asset={asset} coinData={coinData} />;
}
