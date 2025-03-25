import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import Layout from '../../components/Layout';

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    // <Layout>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-2xl font-bold mb-6 text-center">Join Us</h2>
          <form>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="name">Name</label>
              <div className="flex items-center border border-gray-300 rounded-lg">
                <FaUser className="ml-2 text-gray-500" />
                <input type="text" id="name" className="w-full p-2 border-none outline-none focus:ring-0" />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="email">Email</label>
              <div className="flex items-center border border-gray-300 rounded-lg">
                <FaEnvelope className="ml-2 text-gray-500" />
                <input type="email" id="email" className="w-full p-2 border-none outline-none focus:ring-0" />
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 mb-2" htmlFor="password">Password</label>
              <div className="flex items-center border border-gray-300 rounded-lg">
                <FaLock className="ml-2 text-gray-500" />
                <input type={showPassword ? "text" : "password"} id="password" className="w-full p-2 border-none outline-none focus:ring-0" />
                <button type="button" onClick={togglePasswordVisibility} className="mr-2 text-gray-500 focus:outline-none">
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
            <button type="submit" className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg shadow-lg hover:bg-indigo-700 cursor-pointer">Sign Up</button>
          </form>
          <p className="mt-4 text-center text-gray-700">
            Already have an account? <Link to="/signin" className="text-blue-600 hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    // </Layout>
  );
};

export default SignUp;