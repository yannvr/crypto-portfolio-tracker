import React from 'react';

interface NumberInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
}

const NumberInput: React.FC<NumberInputProps> = ({ value, onChange, placeholder }) => {
  return (
    <input
      className="bg-gray-800 border border-gray-700 text-white rounded-md sm:rounded-full px-4 py-2 w-full mt-2 shadow-sm focus:ring-2 focus:ring-green-500"
      type="number"
      min={1}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
  );
};

export default NumberInput;
