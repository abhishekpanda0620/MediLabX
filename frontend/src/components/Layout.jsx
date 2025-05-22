import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaTachometerAlt, FaCalendarAlt, FaSignInAlt, FaUserCircle, FaBars, FaTimes } from 'react-icons/fa';
import Sidebar from './Sidebar';
import { useAuth } from '../context/authContext';

const Layout = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();
  const userRole = user?.role;
  
  // Don't show sidebar on home page or when not authenticated
  const shouldShowSidebar = user && location.pathname !== '/';

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header with sidebar toggle for mobile only */}
      <header className="bg-gradient-to-r from-indigo-700 to-purple-700 text-white shadow-lg">
        <div className="mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex justify-start items-center space-x-2 py-2 font-serif">
              <span className="text-xl md:text-2xl font-bold font-poppins">
                Medi<span className='text-orange-500'>Lab</span><span className='text-2xl md:text-3xl'>X</span>
              </span>
            </Link>
            {/* Sidebar open button for mobile */}
            {shouldShowSidebar && (
              <button
                className="lg:hidden p-2 rounded-lg hover:bg-indigo-600 focus:outline-none"
                onClick={() => setIsSidebarOpen(true)}
              >
                <FaBars size={24} />
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="flex-grow flex relative">
        {shouldShowSidebar && (
          <Sidebar
            isCollapsed={isSidebarCollapsed}
            toggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            userRole={userRole}
            isMobileOpen={isSidebarOpen}
            onMobileClose={() => setIsSidebarOpen(false)}
          />
        )}
        {/* Overlay for mobile sidebar */}
        {shouldShowSidebar && isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-40 z-30 lg:hidden transition-opacity duration-300"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
        <main className={`flex-grow p-4 max-h-screen overflow-y-auto bg-gray-50 ${shouldShowSidebar ? 'lg:ml-0' : ''}`}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;