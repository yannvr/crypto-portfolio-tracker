import React from 'react';
import { render, screen } from '@testing-library/react';
import PriceBadge from './PriceBadge';

describe('PriceBadge Component', () => {
  test('renders price correctly', () => {
    render(<PriceBadge price={1234.56} />);
    expect(screen.getByText('$1.23K')).toBeInTheDocument();
  });

  test('renders positive price change in green', () => {
    render(<PriceBadge price={1000} priceChange={5.25} />);

    const changeElement = screen.getByText('+5.25%');
    expect(changeElement).toBeInTheDocument();
    expect(changeElement.className).toContain('text-green-500');
  });

  test('renders negative price change in red', () => {
    render(<PriceBadge price={1000} priceChange={-3.75} />);

    const changeElement = screen.getByText('-3.75%');
    expect(changeElement).toBeInTheDocument();
    expect(changeElement.className).toContain('text-red-500');
  });
});
