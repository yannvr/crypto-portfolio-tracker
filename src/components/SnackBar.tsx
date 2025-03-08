interface SnackbarProps {
  message: string;
  visible: boolean;
  severity?: 'info' | 'error';
}

export default function Snackbar({ message, visible, severity = 'info' }: SnackbarProps) {
  if (!visible) return null;

  const severityStyles = {
    info: 'bg-gray-800',
    error: 'bg-red-500',
  };

  return (
    <div className={`fixed bottom-4 right-4 p-2 text-white rounded shadow-md ${severityStyles[severity]}`}>
      {message}
    </div>
  );
}
