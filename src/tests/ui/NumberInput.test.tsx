import NumberInput from '@components/ui/NumberInput';
import { render, screen, fireEvent } from '@testing-library/react';

describe('NumberInput Component', () => {
  test('renders number input with placeholder', () => {
    render(<NumberInput value="" onChange={() => {}} placeholder="Enter amount" />);
    expect(screen.getByPlaceholderText('Enter amount')).toBeInTheDocument();
  });

  test('calls onChange when value is entered', () => {
    const onChangeMock = jest.fn();
    render(<NumberInput value="10" onChange={onChangeMock} placeholder="Enter amount" />);

    fireEvent.change(screen.getByPlaceholderText('Enter amount'), { target: { value: '20' } });

    expect(onChangeMock).toHaveBeenCalledTimes(1);
  });

  test('renders with correct styles', () => {
    render(<NumberInput value="5" onChange={() => {}} placeholder="Enter amount" />);
    expect(screen.getByPlaceholderText('Enter amount')).toHaveClass('bg-gray-800');
  });
});
