import { render, screen } from '@testing-library/react';
import PriceBadge from '../../components/PriceBadge';

describe('PriceBadge Component', () => {
  test('renders PriceBadge component correctly for positive change', () => {
    const { rerender } = render(<PriceBadge currentPrice={50000} />); // Initial render
    rerender(<PriceBadge currentPrice={51000} />); // Simulate price update

    // Use a regex matcher to handle spaces/newlines
    expect(screen.getByText(/▲\s*2.00%/)).toBeInTheDocument();
  });

  test('renders PriceBadge component correctly for negative change', () => {
    const { rerender } = render(<PriceBadge currentPrice={50000} />);
    rerender(<PriceBadge currentPrice={49000} />);

    // Use a regex matcher to handle spaces/newlines
    expect(screen.getByText(/▼\s*-2.00%/)).toBeInTheDocument();
  });

  test('does not render when currentPrice is null', () => {
    const { container } = render(<PriceBadge currentPrice={null} />);
    expect(container.firstChild).toBeNull();
  });

  test('does not render when previousPrice is null', () => {
    const { container } = render(<PriceBadge currentPrice={50000} />);
    expect(container.firstChild).toBeNull();
  });

  test('does not render when both currentPrice and previousPrice are null', () => {
    const { container } = render(<PriceBadge currentPrice={null} />);
    expect(container.firstChild).toBeNull();
  });
});
