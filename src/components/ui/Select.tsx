import React from 'react';

interface SelectProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  children: React.ReactNode;
}

const Select: React.FC<SelectProps> = ({ value, onChange, children }) => {
  return (
    <select
      value={value}
      onChange={onChange}
      className="bg-gray-900/80 border border-gray-700 text-white rounded-full px-4 py-2 shadow-md
      focus:ring-2 focus:ring-green-500 focus:shadow-green-500/50 transition-all duration-300"
    >
      {children}
    </select>
  );
};

export default Select;
