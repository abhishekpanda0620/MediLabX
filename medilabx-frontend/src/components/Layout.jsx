import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaTachometerAlt, FaCalendarAlt, FaUserShield } from 'react-icons/fa';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-indigo-700 text-white p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">MediLabX</h1>
        <nav>
          <ul className="flex space-x-4">
            <li className="flex items-center">
              <FaHome className="mr-1" />
              <Link to="/" className="hover:underline">Home</Link>
            </li>
            <li className="flex items-center">
              <FaTachometerAlt className="mr-1" />
              <Link to="/dashboard" className="hover:underline">Dashboard</Link>
            </li>
            <li className="flex items-center">
              <FaCalendarAlt className="mr-1" />
              <Link to="/appointments" className="hover:underline">Appointments</Link>
            </li>
            <li className="flex items-center">
              <FaUserShield className="mr-1" />
              <Link to="/admin" className="hover:underline">Admin</Link>
            </li>
          </ul>
        </nav>
      </header>
      <main className="flex-grow p-4 bg-gray-100">
        {children}
      </main>
      <footer className="bg-indigo-700 text-white p-4 text-center">
        &copy; 2025 MediLabX. All rights reserved.
      </footer>
    </div>
  );
};

export default Layout;