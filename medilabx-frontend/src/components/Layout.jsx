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
  const { user } = useAuth();
  const userRole = user?.role;
  
  // Don't show sidebar on home page or when not authenticated
  const shouldShowSidebar = user && location.pathname !== '/';

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-gradient-to-r from-indigo-700 to-purple-700 text-white shadow-lg">
        <div className="mx-auto px-4">
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
          </div>

          {/* Mobile Navigation */}
          <nav className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:hidden pb-4`}> {/* Updated for responsiveness */}
            <Navbar userRole={userRole} />
          </nav>
        </div>
      </header>

      <div className="flex-grow flex ">
        {shouldShowSidebar && (
          <Sidebar 
            isCollapsed={isSidebarCollapsed}
            toggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            userRole={userRole}
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