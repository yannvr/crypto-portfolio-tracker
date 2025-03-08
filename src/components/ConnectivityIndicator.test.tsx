import { render, screen } from '@testing-library/react';
import ConnectivityIndicator from './ConnectivityIndicator';

test('renders connected state correctly', () => {
  render(<ConnectivityIndicator connected={true} />);
  expect(screen.getByText('Live Prices')).toBeInTheDocument();
  expect(screen.getByText('Live Prices').previousSibling).toHaveClass('bg-green-500');
});

test('renders disconnected state correctly', () => {
  render(<ConnectivityIndicator connected={false} />);
  expect(screen.getByText('Disconnected')).toBeInTheDocument();
  expect(screen.getByText('Disconnected').previousSibling).toHaveClass('bg-red-500');
});
