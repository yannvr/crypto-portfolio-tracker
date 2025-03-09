import TextInput from '@components/ui/TextInput';
import { render, screen, fireEvent } from '@testing-library/react';

describe('TextInput Component', () => {
  test('renders text input with placeholder', () => {
    render(<TextInput value="" onChange={() => {}} placeholder="Enter text" />);
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
  });

  test('calls onChange when text is entered', () => {
    const onChangeMock = jest.fn();
    render(<TextInput value="Hello" onChange={onChangeMock} placeholder="Enter text" />);

    fireEvent.change(screen.getByPlaceholderText('Enter text'), { target: { value: 'World' } });

    expect(onChangeMock).toHaveBeenCalledTimes(1);
  });

  test('renders with correct styles', () => {
    render(<TextInput value="Test" onChange={() => {}} placeholder="Enter text" />);
    expect(screen.getByPlaceholderText('Enter text')).toHaveClass('bg-gray-800');
  });
});
