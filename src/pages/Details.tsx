import React from 'react';
import { useParams } from 'react-router-dom';
import usePortfolioStore from '../hooks/usePortfolioStore';
import AssetDetails from '../components/AssetDetails';

export default function Details() {
  const { id } = useParams();
  const { assets } = usePortfolioStore();
  const asset = assets.find((asset) => asset.id === Number(id));

  if (!asset) {
    return <div>Asset not found</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-4 bg-gray-100 rounded-lg shadow-lg">
      <AssetDetails asset={asset} />
    </div>
  );
}
