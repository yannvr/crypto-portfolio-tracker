import { render, screen } from '@testing-library/react';
import { MarketStatsCard } from './MarketStatsCard';
import { useCoinData } from '../../../hooks/useAssetData';

// Mock the hooks
jest.mock('../../../hooks/useAssetData', () => ({
  useCoinData: jest.fn()
}));

describe('MarketStatsCard', () => {
  beforeEach(() => {
    (useCoinData as jest.Mock).mockReturnValue({
      data: {
        market_data: {
          market_cap: { usd: 1000000000000 },
          total_volume: { usd: 50000000000 },
          circulating_supply: 19000000,
          total_supply: 21000000,
          max_supply: 21000000,
          fully_diluted_valuation: { usd: 1200000000000 },
          price_change_percentage_24h: 5.25,
          price_change_percentage_7d: 10.5,
          price_change_percentage_30d: -3.75
        }
      },
      loading: false
    });
  });

  test('renders market stats title', () => {
    render(<MarketStatsCard symbol="BTC" />);
    expect(screen.getByText('Market Stats')).toBeInTheDocument();
  });

  test('renders all market stats', () => {
    render(<MarketStatsCard symbol="BTC" />);

    // Market stats
    expect(screen.getByText('Market Cap')).toBeInTheDocument();
    expect(screen.getByText('$1000.00B')).toBeInTheDocument();

    expect(screen.getByText('Trading Volume (24h)')).toBeInTheDocument();
    expect(screen.getByText('$50.00B')).toBeInTheDocument();

    expect(screen.getByText('Circulating Supply')).toBeInTheDocument();
    expect(screen.getByText('19,000,000 BTC')).toBeInTheDocument();

    expect(screen.getByText('Total Supply')).toBeInTheDocument();
    // Use getAllByText for elements that appear multiple times
    const totalSupplyElements = screen.getAllByText('21,000,000 BTC');
    expect(totalSupplyElements.length).toBeGreaterThan(0);

    expect(screen.getByText('Max Supply')).toBeInTheDocument();
    // We've already verified that 21,000,000 BTC appears in the document

    expect(screen.getByText('Fully Diluted Valuation')).toBeInTheDocument();
    expect(screen.getByText('$1200.00B')).toBeInTheDocument();
  });

  test('renders price changes', () => {
    render(<MarketStatsCard symbol="BTC" />);

    expect(screen.getByText('24h Change')).toBeInTheDocument();
    expect(screen.getByText('+5.25%')).toBeInTheDocument();

    expect(screen.getByText('7d Change')).toBeInTheDocument();
    expect(screen.getByText('+10.50%')).toBeInTheDocument();

    expect(screen.getByText('30d Change')).toBeInTheDocument();
    expect(screen.getByText('-3.75%')).toBeInTheDocument();
  });

  test('renders loading state', () => {
    (useCoinData as jest.Mock).mockReturnValue({
      data: null,
      loading: true
    });

    render(<MarketStatsCard symbol="BTC" />);
    expect(screen.getByText('Market Stats')).toBeInTheDocument();
    // Should show loading skeleton
    expect(document.querySelector('.animate-pulse')).toBeInTheDocument();
  });

  test('renders no data message when market data is missing', () => {
    (useCoinData as jest.Mock).mockReturnValue({
      data: { market_data: null },
      loading: false
    });

    render(<MarketStatsCard symbol="BTC" />);
    expect(screen.getByText('No market data available for this asset.')).toBeInTheDocument();
  });
});
