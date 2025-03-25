import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaTachometerAlt, FaCalendarAlt, FaSignInAlt, FaUserCircle, FaBars, FaTimes } from 'react-icons/fa';
import Sidebar from './Sidebar';
import { useAuth } from '../context/authContext';
import Navbar from './Navbar';

const Layout = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const location = useLocation();
  const isAuthenticated = true;
   const { user } = useAuth();
    console.log("User in App:", user);
    const userRole = user?.role; // This will be undefined if not logged in
    console.log("UserRole in App:", userRole);
  
  // Don't show sidebar on home page or when not authenticated
  const shouldShowSidebar = isAuthenticated && location.pathname !== '/';

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-gradient-to-r from-indigo-700 to-purple-700 text-white shadow-lg">
        <div className=" mx-auto  px-4">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex justify-start items-center space-x-2 py-2 font-serif">
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
            {/* <nav className="hidden md:block">
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
            </nav> */}
          </div>

          {/* Mobile Navigation */}
          <nav className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:hidden pb-4`}>
            <Navbar/>
          </nav>
        </div>
      </header>

      <div className="flex-grow flex">
        {shouldShowSidebar && (
          <Sidebar 
            isCollapsed={isSidebarCollapsed}
            toggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            userRole={userRole} // pass current user's role here (e.g., 'patient', 'admin', 'doctor', 'lab')
          />
        )}

        <main className={`flex-grow p-4 bg-gray-50 ${shouldShowSidebar ? 'md:ml-0' : ''}`}>
          {children}
        </main>
      </div>

      <footer className="bg-indigo-700 text-slate-300 p-1 text-center">
        <div className="container mx-auto text-sm md:text-base font-semibold">
          &copy; 2025 MediLabX. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Layout;