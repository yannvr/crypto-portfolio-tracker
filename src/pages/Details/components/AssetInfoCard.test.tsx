import { render, screen } from '@testing-library/react';
import { AssetInfoCard } from './AssetInfoCard';
import { useCoinData } from '../../../hooks/useAssetData';

// Mock the hooks
jest.mock('../../../hooks/useAssetData', () => ({
  useCoinData: jest.fn()
}));

describe('AssetInfoCard', () => {
  const mockAsset = {
    symbol: 'BTC',
    quantity: 1.5
  };

  beforeEach(() => {
    (useCoinData as jest.Mock).mockReturnValue({
      data: {
        name: 'Bitcoin',
        symbol: 'BTC',
        image: { small: 'bitcoin.png' },
        market_data: {
          current_price: { usd: 50000 }
        }
      },
      loading: false
    });
  });

  test('renders asset information', () => {
    render(<AssetInfoCard asset={mockAsset} />);

    expect(screen.getByText('Bitcoin')).toBeInTheDocument();
    expect(screen.getByText('BTC')).toBeInTheDocument();
    expect(screen.getByText('1.5 BTC')).toBeInTheDocument();
    expect(screen.getByText('$50.00K')).toBeInTheDocument();
    expect(screen.getByText('$75.00K')).toBeInTheDocument(); // Total value
  });

  test('renders loading state', () => {
    (useCoinData as jest.Mock).mockReturnValue({
      data: null,
      loading: true
    });

    render(<AssetInfoCard asset={mockAsset} />);

    // Use getAllByText for elements that appear multiple times
    const loadingElements = screen.getAllByText('Loading...');
    expect(loadingElements.length).toBe(2); // Two loading indicators
  });

  test('renders fallback image when no coin image', () => {
    (useCoinData as jest.Mock).mockReturnValue({
      data: {
        name: 'Bitcoin',
        symbol: 'BTC',
        market_data: {
          current_price: { usd: 50000 }
        }
      },
      loading: false
    });

    render(<AssetInfoCard asset={mockAsset} />);

    const fallbackImage = screen.getByText('B'); // First letter of symbol
    expect(fallbackImage).toBeInTheDocument();
  });
});
