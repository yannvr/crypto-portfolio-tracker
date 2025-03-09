import { render, screen, fireEvent } from '@testing-library/react';
import Select from '@components/Select';

describe('Select Component', () => {
  test('renders select dropdown with options', () => {
    render(
      <Select value="option1" onChange={() => {}}>
        <option value="option1">Option 1</option>
        <option value="option2">Option 2</option>
      </Select>
    );

    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
  });

  test('calls onChange when option is selected', () => {
    const onChangeMock = jest.fn();
    render(
      <Select value="option1" onChange={onChangeMock}>
        <option value="option1">Option 1</option>
        <option value="option2">Option 2</option>
      </Select>
    );

    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'option2' } });

    expect(onChangeMock).toHaveBeenCalledTimes(1);
  });

  test('renders with correct styles', () => {
    render(
      <Select value="option1" onChange={() => {}}>
        <option value="option1">Option 1</option>
      </Select>
    );
    expect(screen.getByRole('combobox')).toHaveClass('bg-gray-900/80');
  });
});
