import { Link } from 'react-router-dom';
import Button from '@components/Button';

export const ErrorState: React.FC<{ message?: string }> = ({
  message = "Error loading data. Please try again later."
}) => (
  <div className="text-center py-12 text-red-500">
    <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
    <p>{message}</p>
  </div>
);

export const AssetNotFound: React.FC = () => (
  <div className="min-h-screen bg-black text-white flex justify-center items-center">
    <div className="text-center">
      <h2 className="text-2xl font-bold mb-4">Asset not found</h2>
      <Link to="/">
        <Button>Back to Portfolio</Button>
      </Link>
    </div>
  </div>
);
