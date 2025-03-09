import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Details from './Details';
import usePortfolioStore from '../store/usePortfolioStore';
import { useCoinData, usePriceChart } from '../hooks/useAssetData';

// Mock the stores and hooks
jest.mock('../store/usePortfolioStore', () => ({
  __esModule: true,
  default: jest.fn()
}));

jest.mock('../hooks/useAssetData', () => ({
  useCoinData: jest.fn(),
  usePriceChart: jest.fn()
}));

// Mock recharts to avoid rendering issues in tests
jest.mock('recharts', () => ({
  LineChart: () => <div data-testid="line-chart" />,
  Line: () => <div />,
  XAxis: () => <div />,
  YAxis: () => <div />,
  CartesianGrid: () => <div />,
  Tooltip: () => <div />,
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}));

describe('Details Page', () => {
  beforeEach(() => {
    // Setup default mock implementations
    ((usePortfolioStore as unknown) as jest.Mock).mockImplementation(selector => {
      const state = {
        selectAsset: () => ({ id: 1, symbol: 'BTC', quantity: 1.5 })
      };
      return selector ? selector(state) : state;
    });

    (useCoinData as jest.Mock).mockReturnValue({
      data: {
        name: 'Bitcoin',
        symbol: 'BTC',
        image: { small: 'bitcoin.png' },
        market_data: {
          current_price: { usd: 50000 },
          market_cap: { usd: 1000000000000 },
          price_change_percentage_24h: 5.25,
          price_change_percentage_7d: 10.5,
          price_change_percentage_30d: -3.75
        }
      },
      loading: false,
      error: null
    });

    (usePriceChart as jest.Mock).mockReturnValue({
      chartData: [
        { date: '2023-01-01', price: 48000 },
        { date: '2023-01-02', price: 49000 },
        { date: '2023-01-03', price: 50000 }
      ],
      loading: false,
      error: null
    });
  });

  test('renders asset symbol in title', () => {
    render(
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<Details />} />
        </Routes>
      </BrowserRouter>
    );

    expect(screen.getByText('BTC Details')).toBeInTheDocument();
  });

  test('renders asset holdings information', () => {
    render(
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<Details />} />
        </Routes>
      </BrowserRouter>
    );

    expect(screen.getByText('Your Holdings')).toBeInTheDocument();
    expect(screen.getByText('1.5 BTC')).toBeInTheDocument();
  });

  test('renders current price', () => {
    render(
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<Details />} />
        </Routes>
      </BrowserRouter>
    );

    expect(screen.getByText('Current Price')).toBeInTheDocument();
    expect(screen.getByText('$50,000.00')).toBeInTheDocument();
  });

  test('renders price chart', () => {
    render(
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<Details />} />
        </Routes>
      </BrowserRouter>
    );

    expect(screen.getByText('Price History')).toBeInTheDocument();
    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
  });

  test('renders loading state', () => {
    (useCoinData as jest.Mock).mockReturnValue({
      data: null,
      loading: true,
      error: null
    });

    render(
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<Details />} />
        </Routes>
      </BrowserRouter>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('renders error state', () => {
    (useCoinData as jest.Mock).mockReturnValue({
      data: null,
      loading: false,
      error: 'Failed to fetch data'
    });

    render(
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<Details />} />
        </Routes>
      </BrowserRouter>
    );

    expect(screen.getByText('Error loading data. Please try again later.')).toBeInTheDocument();
  });
});
