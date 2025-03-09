import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import AssetDetails from '@components/AssetDetails';

// Mock dependencies
jest.mock('@components/PriceChart', () => () => <div>PriceChart</div>);

// Mock price stream to return a fixed price or null
jest.mock('@store/usePriceStreamStore', () => ({
  usePriceStream: jest.fn((symbol) => {
    if (symbol === 'BTC') return 500; // Mock price stream to return $500 for BTC
    if (symbol === 'ETH') return -500; // Mock price stream to return -$500 for ETH
    return null; // Return null for other symbols
  }),
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate, // Mock useNavigate with a jest function
}));

const assetBTC = { id: 1, symbol: 'BTC', quantity: 2 };
const assetETH = { id: 2, symbol: 'ETH', quantity: 2 };

describe('AssetDetails Component', () => {
  it('renders asset details correctly', () => {
    render(
      <Router>
        <AssetDetails asset={assetBTC} />
      </Router>
    );

    expect(screen.getByText('BTC')).toBeInTheDocument();
    expect(screen.getByText(/PriceChart/i)).toBeInTheDocument();
  });

  it('calculates and displays the correct total value', () => {
    render(
      <Router>
        <AssetDetails asset={assetBTC} />
      </Router>
    );

    // Expected total value: 500 * 2 = $1,000
    expect(screen.getByText(/\$1,000/)).toBeInTheDocument();
  });

  it('returns null when currentPrice or priceChange is not available', () => {
    const assetWithNoPrice = { id: 3, symbol: 'LTC', quantity: 2 };

    render(
      <Router>
        <AssetDetails asset={assetWithNoPrice} />
      </Router>
    );

    // Ensure that the price details are not rendered
    expect(screen.queryByText(/\$1,000/)).toBeNull();
    expect(screen.queryByText(/▲/)).toBeNull();
    expect(screen.queryByText(/▼/)).toBeNull();
  });

  it('navigates back to home when back button is clicked', () => {
    render(
      <Router>
        <AssetDetails asset={assetBTC} />
      </Router>
    );

    const backButton = screen.getByText('Back to Home');
    fireEvent.click(backButton);

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('applies the correct priceChangeColor for positive price change', () => {
    render(
      <Router>
        <AssetDetails asset={assetBTC} />
      </Router>
    );

    const priceChangeElement = screen.getByText(/▲/).closest('div');
    expect(priceChangeElement).toHaveClass('text-green-400');
  });

  it('applies the correct priceChangeColor for negative price change', () => {
    render(
      <Router>
        <AssetDetails asset={assetETH} />
      </Router>
    );

    const priceChangeElement = screen.getByText(/▼/).closest('div');
    expect(priceChangeElement).toHaveClass('text-red-400');
  });
});
