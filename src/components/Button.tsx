interface ButtonProps {
  children: React.ReactNode;
  className?: string;
  secondary?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

const Button: React.FC<ButtonProps> = ({
  onClick,
  children,
  className,
  secondary = false,
  type = 'button'
}) => {
  const baseClasses = 'font-semibold px-4 py-2 shadow-md transition cursor-pointer rounded-md sm:rounded-full ';
  const primaryClasses = 'bg-green-500 text-black hover:bg-green-400';
  const secondaryClasses = 'bg-gray-800 text-white hover:bg-gray-700';

  return (
    <button
      type={type}
      className={`${baseClasses} ${secondary ? secondaryClasses : primaryClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
