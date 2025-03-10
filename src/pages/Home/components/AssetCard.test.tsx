import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AssetCard from './AssetCard';
import { usePriceStore } from '../../../hooks/useAssetData';

// Mock the usePriceStore
jest.mock('../../../hooks/useAssetData', () => ({
  usePriceStore: jest.fn().mockImplementation((selector) => {
    const state = {
      prices: { BTC: 50000 },
      priceChanges: { BTC: 5.25 },
      connectionStatus: { BTC: 'connected' }
    };
    return selector ? selector(state) : state;
  })
}));

describe('AssetCard Component', () => {
  // No beforeEach needed as we've already mocked usePriceStore globally

  test('renders asset symbol', () => {
    render(
      <BrowserRouter>
        <AssetCard asset={{ id: 1, symbol: 'BTC', quantity: 1.5 }} />
      </BrowserRouter>
    );

    expect(screen.getByText('BTC')).toBeInTheDocument();
  });

  test('renders asset quantity', () => {
    render(
      <BrowserRouter>
        <AssetCard asset={{ id: 1, symbol: 'BTC', quantity: 1.5 }} />
      </BrowserRouter>
    );

    expect(screen.getByText('Quantity: 1.5')).toBeInTheDocument();
  });

  test('renders total value based on price and quantity', () => {
    render(
      <BrowserRouter>
        <AssetCard asset={{ id: 1, symbol: 'BTC', quantity: 1.5 }} />
      </BrowserRouter>
    );

    // 1.5 BTC * $50,000 = $75,000
    expect(screen.getByText('$75,000.00')).toBeInTheDocument();
  });

  test('renders edit and details links', () => {
    render(
      <BrowserRouter>
        <AssetCard asset={{ id: 1, symbol: 'BTC', quantity: 1.5 }} />
      </BrowserRouter>
    );

    expect(screen.getByText('Edit')).toBeInTheDocument();
    expect(screen.getByText('Details')).toBeInTheDocument();
  });
});
