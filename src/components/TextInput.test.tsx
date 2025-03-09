import { render, screen, fireEvent } from '@testing-library/react';
import TextInput from './TextInput';

describe('TextInput Component', () => {
  test('renders input with placeholder', () => {
    render(<TextInput value="" onChange={() => {}} placeholder="Enter text" />);
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
  });

  test('calls onChange when value changes', () => {
    const onChangeMock = jest.fn();
    render(<TextInput value="" onChange={onChangeMock} placeholder="Enter text" />);

    fireEvent.change(screen.getByPlaceholderText('Enter text'), { target: { value: 'test' } });

    expect(onChangeMock).toHaveBeenCalledTimes(1);
  });

  test('displays the provided value', () => {
    render(<TextInput value="test" onChange={() => {}} placeholder="Enter text" />);
    expect(screen.getByDisplayValue('test')).toBeInTheDocument();
  });
});
