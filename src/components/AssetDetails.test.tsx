import { render, screen } from '@testing-library/react';
import AssetDetails from './AssetDetails';

jest.mock('./PriceBadge', () => () => <div>PriceBadge</div>);
jest.mock('./PriceChart', () => () => <div>PriceChart</div>);

test('renders asset details correctly', () => {
  render(
    <AssetDetails
      asset={{
        symbol: 'BTC',
        quantity: 2,
        historicalData: [{ price: 50000 }],
      }}
    />
  );

  expect(screen.getByText('BTC Details')).toBeInTheDocument();
  expect(screen.getByText(/Quantity: 2/i)).toBeInTheDocument();
  expect(screen.getByText(/PriceChart/i)).toBeInTheDocument();
});
