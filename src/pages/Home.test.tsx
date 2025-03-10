import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Home from './Home';
import usePortfolioStore from '../store/usePortfolioStore';
import { usePriceStore, usePriceStream } from '../hooks/useAssetData';

// Mock the stores and hooks
jest.mock('../store/usePortfolioStore', () => ({
  __esModule: true,
  default: jest.fn()
}));

jest.mock('../hooks/useAssetData', () => ({
  usePriceStore: jest.fn(),
  usePriceStream: jest.fn(),
  useInitialPrices: jest.fn()
}));

describe('Home Page', () => {
  beforeEach(() => {
    // Setup default mock implementations
    ((usePortfolioStore as unknown) as jest.Mock).mockReturnValue({
      assets: [
        { id: 1, symbol: 'BTC', quantity: 1.5 },
        { id: 2, symbol: 'ETH', quantity: 10 }
      ]
    });

    ((usePriceStore as unknown) as jest.Mock).mockReturnValue({
      prices: { BTC: 50000, ETH: 3000 }
    });

    ((usePriceStream as unknown) as jest.Mock).mockImplementation(() => {});
  });

  test('renders portfolio title', () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    expect(screen.getByText('Crypto Portfolio')).toBeInTheDocument();
  });

  test('renders asset count', () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    expect(screen.getByText(/2 Assets/)).toBeInTheDocument();
  });

  test('renders total portfolio value', () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    // 1.5 BTC * $50,000 + 10 ETH * $3,000 = $75,000 + $30,000 = $105,000
    expect(screen.getByText(/Total Value: \$105.00K/)).toBeInTheDocument();
  });

  test('renders add asset button', () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    expect(screen.getByText('+ Asset')).toBeInTheDocument();
  });

  test('renders empty state when no assets', () => {
    ((usePortfolioStore as unknown) as jest.Mock).mockReturnValue({
      assets: []
    });

    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    expect(screen.getByText('Your portfolio is empty')).toBeInTheDocument();
    expect(screen.getByText('Add Your First Asset')).toBeInTheDocument();
  });
});
