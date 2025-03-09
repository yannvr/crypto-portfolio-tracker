import Button from '@components/ui/Button';
import { render, screen, fireEvent } from '@testing-library/react';

describe('Button Component', () => {
  test('renders button with children', () => {
    render(<Button onClick={() => {}}>Click Me</Button>);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  test('calls onClick when clicked', () => {
    const onClickMock = jest.fn();
    render(<Button onClick={onClickMock}>Click Me</Button>);

    fireEvent.click(screen.getByText('Click Me'));

    expect(onClickMock).toHaveBeenCalledTimes(1);
  });

  test('applies primary and secondary styles correctly', () => {
    const { rerender } = render(<Button onClick={() => {}}>Primary</Button>);
    expect(screen.getByText('Primary')).toHaveClass('bg-green-500');

    rerender(<Button onClick={() => {}} secondary>Secondary</Button>);
    expect(screen.getByText('Secondary')).toHaveClass('bg-gray-800');
  });
});
