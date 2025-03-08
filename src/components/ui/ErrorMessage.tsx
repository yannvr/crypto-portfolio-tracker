import React from 'react';

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  return <div className="text-red-400 text-xs">{message}</div>;
};

export default ErrorMessage;
