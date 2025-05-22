import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <h1 className="text-5xl font-bold text-indigo-600 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Page Not Found</h2>
        <p className="text-gray-600 mb-6">Sorry, the page you are looking for does not exist.</p>
        <button
          className="bg-indigo-600 mx-2 text-white py-2 px-6 rounded-lg shadow hover:bg-indigo-700 transition cursor-pointer"
          onClick={() => navigate(-1)}
        >
          Go Back
        </button>
        <button
          className="bg-gray-200 text-gray-800 py-2 px-6 rounded-lg shadow hover:bg-gray-300 transition cursor-pointer mt-3"
          onClick={() => navigate('/')}
        >
          Go Home
        </button>
      </div>
    </div>
  );
};

export default NotFound;
