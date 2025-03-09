import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from './Button';

describe('Button Component', () => {
  test('renders button with text', () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  test('calls onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);

    fireEvent.click(screen.getByText('Click Me'));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('renders secondary button when secondary prop is true', () => {
    render(<Button secondary>Secondary Button</Button>);
    const button = screen.getByText('Secondary Button');

    // Check if it has the secondary class
    expect(button.className).toContain('bg-gray-700');
  });
});
