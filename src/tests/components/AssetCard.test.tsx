import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import AssetCard from '../../components/AssetCard';

// Mock the hooks used inside AssetCard
jest.mock('../../hooks/usePriceStreamStore', () => ({
  usePriceStream: jest.fn(() => 500), // Mock price stream to return a fixed price
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate, // Mock useNavigate with a jest function
}));

const asset = { id: 1, symbol: 'BTC', quantity: 2 };

test('renders AssetCard component correctly', () => {
  render(
    <Router>
      <AssetCard asset={asset} />
    </Router>
  );

  expect(screen.getByText(/BTC/i)).toBeInTheDocument();
  expect(screen.getByText(/Quantity: 2/i)).toBeInTheDocument();
  expect(screen.getByText(/\$1,000/)).toBeInTheDocument(); // 500 * 2 (mocked price)
});

test('handles edit button click', () => {
  const { container } = render(
    <Router>
      <AssetCard asset={asset} />
    </Router>
  );

  const editButton = container.querySelector('button[aria-label="Edit BTC"]');
  if (editButton) {
    fireEvent.click(editButton);
  }
  expect(mockNavigate).toHaveBeenCalledWith('/edit/1'); // Verify navigation
});
