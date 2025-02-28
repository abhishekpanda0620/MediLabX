import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaTachometerAlt, FaCalendarAlt, FaUserShield, FaSignInAlt, FaUserCircle, FaBars, FaTimes } from 'react-icons/fa';

const Layout = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isAuthenticated = true;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-gradient-to-r from-indigo-700 to-purple-700 text-white shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-xl md:text-2xl font-bold font-poppins">
                Medi<span className='text-orange-500'>Lab</span><span className='text-2xl md:text-3xl'>X</span>
              </span>
            </Link>
            
            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-indigo-600 focus:outline-none"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden md:block">
              <ul className="flex items-center space-x-6">
                <li>
                  <Link to="/" className="flex items-center space-x-1 hover:text-indigo-200 transition duration-150">
                    <FaHome className="text-lg" />
                    <span>Home</span>
                  </Link>
                </li>
                
                {isAuthenticated ? (
                  <>
                    <li>
                      <Link to="/dashboard" className="flex items-center space-x-1 hover:text-indigo-200 transition duration-150">
                        <FaTachometerAlt className="text-lg" />
                        <span>Dashboard</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/appointments" className="flex items-center space-x-1 hover:text-indigo-200 transition duration-150">
                        <FaCalendarAlt className="text-lg" />
                        <span>Appointments</span>
                      </Link>
                    </li>
                    <li>
                      <div className="flex items-center space-x-2 border-l pl-6 ml-6 border-indigo-500">
                        <FaUserCircle className="text-2xl" />
                        <span className="font-medium">John Doe</span>
                      </div>
                    </li>
                  </>
                ) : (
                  <li>
                    <Link 
                      to="/signin" 
                      className="flex items-center space-x-1 bg-white text-indigo-700 px-4 py-2 rounded-lg font-medium hover:bg-indigo-50 transition duration-150"
                    >
                      <FaSignInAlt />
                      <span>Sign In</span>
                    </Link>
                  </li>
                )}
              </ul>
            </nav>
          </div>

          {/* Mobile Navigation */}
          <nav className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:hidden pb-4`}>
            <ul className="flex flex-col space-y-4">
              <li>
                <Link to="/" className="flex items-center space-x-1 hover:text-indigo-200 transition duration-150">
                  <FaHome className="text-lg" />
                  <span>Home</span>
                </Link>
              </li>
              
              {isAuthenticated ? (
                <>
                  <li>
                    <Link to="/dashboard" className="flex items-center space-x-1 hover:text-indigo-200 transition duration-150">
                      <FaTachometerAlt className="text-lg" />
                      <span>Dashboard</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/appointments" className="flex items-center space-x-1 hover:text-indigo-200 transition duration-150">
                      <FaCalendarAlt className="text-lg" />
                      <span>Appointments</span>
                    </Link>
                  </li>
                  <li className="pt-4 border-t border-indigo-600">
                    <div className="flex items-center space-x-2">
                      <FaUserCircle className="text-xl" />
                      <span className="font-medium">John Doe</span>
                    </div>
                  </li>
                </>
              ) : (
                <li>
                  <Link 
                    to="/signin" 
                    className="flex items-center space-x-1 bg-white text-indigo-700 px-4 py-2 rounded-lg font-medium hover:bg-indigo-50 transition duration-150 w-full sm:w-auto justify-center sm:justify-start"
                  >
                    <FaSignInAlt />
                    <span>Sign In</span>
                  </Link>
                </li>
              )}
            </ul>
          </nav>
        </div>
      </header>

      <main className="flex-grow p-4 bg-gray-50">
        {children}
      </main>

      <footer className="bg-indigo-700 text-white p-4 text-center">
        <div className="container mx-auto text-sm md:text-base">
          &copy; 2025 MediLabX. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Layout;