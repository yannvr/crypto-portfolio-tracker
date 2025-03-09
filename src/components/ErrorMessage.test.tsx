import { render, screen } from '@testing-library/react';
import ErrorMessage from './ErrorMessage';

describe('ErrorMessage Component', () => {
  test('renders error message', () => {
    render(<ErrorMessage message="This is an error" />);
    expect(screen.getByText('This is an error')).toBeInTheDocument();
  });

  test('applies error styling', () => {
    render(<ErrorMessage message="This is an error" />);
    const errorElement = screen.getByText('This is an error');
    expect(errorElement).toHaveClass('text-red-400 text-xs');
  });
});
