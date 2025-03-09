import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AddEditHolding from './AddEditHolding';
import usePortfolioStore from '../store/usePortfolioStore';

// Mock the store
jest.mock('../store/usePortfolioStore', () => ({
  __esModule: true,
  default: jest.fn()
}));

// Mock the useCoinList hook
jest.mock('../hooks/useAssetData', () => ({
  useCoinList: jest.fn().mockReturnValue({
    coins: [],
    loading: false,
    error: null,
    findCoinIdBySymbol: jest.fn().mockReturnValue('bitcoin') // Always return a valid coin ID
  })
}));

// Mock the useNavigate hook
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

describe('AddEditHolding Page', () => {
  beforeEach(() => {
    // Setup default mock implementations
    ((usePortfolioStore as unknown) as jest.Mock).mockReturnValue({
      addAsset: jest.fn(),
      editAsset: jest.fn(),
      removeAsset: jest.fn(),
      selectAsset: jest.fn().mockReturnValue(null), // Default to add mode
      assets: []
    });

    mockNavigate.mockClear();
  });

  test('renders add asset form', () => {
    render(
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<AddEditHolding />} />
        </Routes>
      </BrowserRouter>
    );

    expect(screen.getByText('Add New Asset')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Token Symbol (BTC)')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Quantity')).toBeInTheDocument();
    expect(screen.getByText('Add')).toBeInTheDocument();
  });

  test('renders edit asset form', () => {
    ((usePortfolioStore as unknown) as jest.Mock).mockReturnValue({
      addAsset: jest.fn(),
      editAsset: jest.fn(),
      removeAsset: jest.fn(),
      selectAsset: jest.fn().mockReturnValue({ id: 1, symbol: 'BTC', quantity: 1.5 }),
      assets: []
    });

    render(
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<AddEditHolding />} />
        </Routes>
      </BrowserRouter>
    );

    expect(screen.getByText('Edit Asset')).toBeInTheDocument();
    expect(screen.getByDisplayValue('BTC')).toBeInTheDocument();
    expect(screen.getByDisplayValue('1.5')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  test('validates form inputs', () => {
    const addAsset = jest.fn();
    ((usePortfolioStore as unknown) as jest.Mock).mockReturnValue({
      addAsset,
      editAsset: jest.fn(),
      removeAsset: jest.fn(),
      selectAsset: jest.fn().mockReturnValue(null),
      assets: []
    });

    render(
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<AddEditHolding />} />
        </Routes>
      </BrowserRouter>
    );

    // Submit without filling the form
    fireEvent.click(screen.getByText('Add'));

    // Should show validation errors
    expect(screen.getByText('Token symbol is required')).toBeInTheDocument();
    expect(screen.getByText('Quantity must be greater than zero')).toBeInTheDocument();

    // addAsset should not be called
    expect(addAsset).not.toHaveBeenCalled();
  });

  test('adds a new asset', () => {
    const addAsset = jest.fn();
    ((usePortfolioStore as unknown) as jest.Mock).mockReturnValue({
      addAsset,
      editAsset: jest.fn(),
      removeAsset: jest.fn(),
      selectAsset: jest.fn().mockReturnValue(null),
      assets: [
        { id: 1, symbol: 'BTC', quantity: 1.5 }
      ]
    });

    render(
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<AddEditHolding />} />
        </Routes>
      </BrowserRouter>
    );

    // Fill the form with a symbol that doesn't exist in the portfolio
    fireEvent.change(screen.getByPlaceholderText('Token Symbol (BTC)'), { target: { value: 'SOL' } });
    fireEvent.change(screen.getByPlaceholderText('Quantity'), { target: { value: '10' } });

    // Submit the form
    fireEvent.click(screen.getByText('Add'));

    // addAsset should be called with the correct values
    expect(addAsset).toHaveBeenCalledWith('SOL', 10);

    // Should navigate back to home
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  test('edits an existing asset', () => {
    const editAsset = jest.fn();
    ((usePortfolioStore as unknown) as jest.Mock).mockReturnValue({
      addAsset: jest.fn(),
      editAsset,
      removeAsset: jest.fn(),
      selectAsset: jest.fn().mockReturnValue({ id: 1, symbol: 'BTC', quantity: 1.5 }),
      assets: []
    });

    render(
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<AddEditHolding />} />
        </Routes>
      </BrowserRouter>
    );

    // Verify the form is pre-filled with the existing asset data
    expect(screen.getByDisplayValue('BTC')).toBeInTheDocument();
    expect(screen.getByDisplayValue('1.5')).toBeInTheDocument();

    // Change the quantity using the NumberInput
    const quantityInput = screen.getByDisplayValue('1.5');
    fireEvent.change(quantityInput, { target: { value: '2.5' } });

    // Get the form element and submit it
    const form = screen.getByText('Save').closest('form')!;
    fireEvent.submit(form);

    // editAsset should be called with the correct values
    expect(editAsset).toHaveBeenCalledWith(1, { symbol: 'BTC', quantity: 2.5 });

    // Should navigate back to home
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  test('validates duplicate symbol', () => {
    const addAsset = jest.fn();
    ((usePortfolioStore as unknown) as jest.Mock).mockReturnValue({
      addAsset,
      editAsset: jest.fn(),
      removeAsset: jest.fn(),
      selectAsset: jest.fn().mockReturnValue(null),
      assets: [
        { id: 1, symbol: 'BTC', quantity: 1.5 },
        { id: 2, symbol: 'ETH', quantity: 5.0 }
      ]
    });

    render(
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<AddEditHolding />} />
        </Routes>
      </BrowserRouter>
    );

    // Try to add an existing symbol
    fireEvent.change(screen.getByPlaceholderText('Token Symbol (BTC)'), { target: { value: 'ETH' } });
    fireEvent.change(screen.getByPlaceholderText('Quantity'), { target: { value: '10' } });

    // Submit the form
    fireEvent.click(screen.getByText('Add'));

    // Should show validation error
    expect(screen.getByText('This token is already in your portfolio. Edit the existing entry instead.')).toBeInTheDocument();

    // addAsset should not be called
    expect(addAsset).not.toHaveBeenCalled();
  });

  test('allows editing existing symbol', () => {
    const editAsset = jest.fn();
    ((usePortfolioStore as unknown) as jest.Mock).mockReturnValue({
      addAsset: jest.fn(),
      editAsset,
      removeAsset: jest.fn(),
      selectAsset: jest.fn().mockReturnValue({ id: 1, symbol: 'BTC', quantity: 1.5 }),
      assets: [
        { id: 1, symbol: 'BTC', quantity: 1.5 },
        { id: 2, symbol: 'ETH', quantity: 5.0 }
      ]
    });

    render(
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<AddEditHolding />} />
        </Routes>
      </BrowserRouter>
    );

    // Change the quantity
    fireEvent.change(screen.getByDisplayValue('1.5'), { target: { value: '2.5' } });

    // Submit the form
    const form = screen.getByText('Save').closest('form')!;
    fireEvent.submit(form);

    // editAsset should be called with the correct values
    expect(editAsset).toHaveBeenCalledWith(1, { symbol: 'BTC', quantity: 2.5 });

    // Should navigate back to home
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});
