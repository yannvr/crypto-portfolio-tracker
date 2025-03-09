import { render, screen, fireEvent } from '@testing-library/react';
import NumberInput from './NumberInput';

describe('NumberInput Component', () => {
  test('renders input with placeholder', () => {
    render(<NumberInput value="" onChange={() => {}} placeholder="Enter a number" />);
    expect(screen.getByPlaceholderText('Enter a number')).toBeInTheDocument();
  });

  test('calls onChange when value changes', () => {
    const onChangeMock = jest.fn();
    render(<NumberInput value="" onChange={onChangeMock} placeholder="Enter a number" />);

    fireEvent.change(screen.getByPlaceholderText('Enter a number'), { target: { value: '42' } });

    expect(onChangeMock).toHaveBeenCalledTimes(1);
  });

  test('displays the provided value', () => {
    render(<NumberInput value="42" onChange={() => {}} placeholder="Enter a number" />);
    expect(screen.getByDisplayValue('42')).toBeInTheDocument();
  });
});
