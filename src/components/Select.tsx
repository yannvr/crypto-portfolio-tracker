import React from 'react';

interface SelectProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  children: React.ReactNode;
}

// This uses the native select element for maximum accessibility
const Select: React.FC<SelectProps> = ({ value, onChange, children }) => {
  return (
    <select
      value={value}
      onChange={onChange}
      className="bg-gray-900/80 border h-[40px] border-gray-700 text-white px-4 py-0 shadow-md
      focus:ring-2 focus:ring-green-500 focus:shadow-green-500/50 transition-all duration-300 rounded-md sm:rounded-full"
    >
      {children}
    </select>
  );
};

export default Select;
