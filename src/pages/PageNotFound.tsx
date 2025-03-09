import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';

export default function PageNotFound() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-lg mb-8">The page you are looking for does not exist.</p>
      <Link to="/">
        <Button secondary>Back to Home</Button>
      </Link>
    </div>
  );
}
