import { render, screen } from '@testing-library/react';
import Snackbar from './Snackbar';

test('renders Snackbar when visible', () => {
  render(<Snackbar message="Info message" visible />);
  expect(screen.getByText('Info message')).toBeInTheDocument();
});

test('does not render Snackbar when not visible', () => {
  render(<Snackbar message="Hidden message" visible={false} />);
  expect(screen.queryByText('Info message')).toBeNull();
});

test('renders Snackbar with severity styles', () => {
  render(<Snackbar message="Error message" visible severity="error" />);
  expect(screen.getByText('Error message')).toHaveClass('bg-red-100');
});
