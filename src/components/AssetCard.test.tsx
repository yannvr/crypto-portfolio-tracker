import { render, screen } from '@testing-library/react';
import AssetCard from './AssetCard';

const asset = { symbol: 'BTC', quantity: 2 };

jest.mock('./PriceBadge', () => () => <div>PriceBadge</div>);
jest.mock('./PriceChart', () => () => <div>PriceChart</div>);

test('renders AssetCard component correctly', () => {
  render(<AssetCard asset={asset} currentPrice={50000} previousPrice={49000} historicalData={[]} onSelectAsset={() => {}} />);
  expect(screen.getByText(/BTC/i)).toBeInTheDocument();
  expect(screen.getByText(/Qty: 2/i)).toBeInTheDocument();
  expect(screen.getByText(/Value: \$100000.00/i)).toBeInTheDocument();
});
