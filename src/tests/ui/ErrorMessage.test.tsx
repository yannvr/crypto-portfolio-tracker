import ErrorMessage from '@components/ui/ErrorMessage';
import { render, screen } from '@testing-library/react';

describe('ErrorMessage Component', () => {
  test('renders error message text', () => {
    render(<ErrorMessage message="This is an error" />);
    expect(screen.getByText('This is an error')).toBeInTheDocument();
  });

  test('applies the correct styles', () => {
    render(<ErrorMessage message="Error" />);
    expect(screen.getByText('Error')).toHaveClass('text-red-400');
  });
});
