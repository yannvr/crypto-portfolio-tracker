import { useParams } from 'react-router-dom';
import AssetDetails from '@components/AssetDetails';
import usePortfolioStore from '@store/usePortfolioStore';

export default function Details() {
  const { id } = useParams();
  const { selectAsset } = usePortfolioStore();
  const asset = selectAsset(id);

  if (!asset) {
    return <div className="text-white text-center mt-10">Asset not found</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white flex justify-center items-center px-6">
      <div className="w-full max-w-4xl bg-gray-900/80 rounded-xl p-6 shadow-lg border border-gray-800 backdrop-blur-md">
        <AssetDetails asset={asset} />
      </div>
    </div>
  );
}
