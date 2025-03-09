import { useParams } from 'react-router-dom';
import AssetDetails from './Details/components/AssetDetails';
import usePortfolioStore from '@store/usePortfolioStore';

export default function Details() {
  const { id } = useParams();
  const { selectAsset } = usePortfolioStore();
  const asset = selectAsset(id);

  if (!asset) {
    return <div className="text-white text-center mt-10">Asset not found</div>;
  }

  return <AssetDetails asset={asset} />;
}
