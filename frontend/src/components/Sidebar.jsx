import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaVials, FaUserFriends, FaChartBar, FaCog, FaBell, FaSignOutAlt, FaChevronLeft, FaChevronRight, FaFileAlt, FaTag, FaClipboardList, FaTimes } from 'react-icons/fa';
import { useAuth } from '../context/authContext';

const Sidebar = ({ isCollapsed, toggleCollapse, userRole, isMobileOpen, onMobileClose }) => {
  const { logout } = useAuth();

  const menuItems = {
    admin: [
      { path: '/admin/dashboard', label: 'Dashboard', icon: FaHome },
      { path: '/admin/staff', label: 'Staffs', icon: FaUserFriends },
      { path: '/admin/doctors', label: 'Doctors', icon: FaUserFriends },
      { path: '/admin/patients', label: 'Patients', icon: FaUserFriends },
      { path: '/admin/tests', label: 'Test Management', icon: FaVials },
      { path: '/admin/test-packages', label: 'Test Packages', icon: FaTag },
      { path: '/admin/billing', label: 'Billing', icon: FaChartBar },
    ],
    doctor: [
      { path: '/doctor', label: 'Dashboard', icon: FaHome },
      { path: '/doctor/patients', label: 'Patients', icon: FaUserFriends },
      { path: '/doctor/reports', label: 'Reports', icon: FaChartBar },
    ],
    lab_technician: [
      { path: '/lab', label: 'Dashboard', icon: FaHome },
      { path: '/lab/samples', label: 'Samples', icon: FaVials },
      { path: '/lab/reports', label: 'Reports', icon: FaFileAlt },
      { path: '/lab/create-case', label: 'Create Case & Report', icon: FaClipboardList },
      // { path: '/lab/generate-report', label: 'Generate Report', icon: FaFileAlt },
    ],
    patient: [
      { path: '/patient/dashboard', label: 'Dashboard', icon: FaHome },
      { path: '/patient/appointments', label: 'Appointments', icon: FaUserFriends },
      { path: '/patient/my-reports', label: 'My Reports', icon: FaChartBar },
    ],
    common: [
      { path: '/settings', label: 'Settings', icon: FaCog },
      { path: '/notifications', label: 'Notifications', icon: FaBell },
    ],
  };

  const roleMenu = menuItems[userRole] || [];
  const commonMenu = menuItems.common;

  // Sidebar classes
  const sidebarBase = `bg-indigo-700 text-white max-h-screen overflow-y-auto transition-all duration-300 z-40`;
  const sidebarWidth = isCollapsed ? 'w-16' : 'w-64';
  // Desktop: fixed width, Mobile: overlay with smooth slide
  const sidebarPosition = `lg:relative lg:translate-x-0 lg:flex fixed left-0 top-0 bottom-0 transition-transform duration-300 ${isMobileOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'} lg:opacity-100`;

  return (
    <aside
      className={`
        ${sidebarBase}
        ${sidebarWidth}
        ${sidebarPosition}
        flex flex-col
        transition-all duration-300
        lg:block
      `}
      style={{ minWidth: isCollapsed ? '4rem' : '16rem', maxWidth: isCollapsed ? '4rem' : '16rem' }}
    >
      {/* Collapse/Expand button (always visible on desktop) */}
      <button onClick={toggleCollapse} className="p-2 items-center justify-center hover:bg-indigo-600 hidden lg:flex">
        {isCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
      </button>
      {/* Mobile close button */}
      <button
        onClick={onMobileClose}
        className="p-2 flex items-center justify-center hover:bg-indigo-600 lg:hidden absolute top-2 right-2 z-50"
        aria-label="Close sidebar"
      >
        <FaTimes />
      </button>
      <nav className="mt-4 flex-grow">
        {[...roleMenu, ...commonMenu].map((item) => (
          <Link key={item.path} to={item.path} className="block py-2 px-4 hover:bg-indigo-600">
            <item.icon className="inline-block mr-2" />
            {!isCollapsed && item.label}
          </Link>
        ))}
      </nav>
      <button onClick={logout} className="py-2 px-4 hover:bg-indigo-600 w-full text-left flex items-center">
        <FaSignOutAlt className="mr-2" />
        {!isCollapsed ? 'Logout' : ''}
      </button>
    </aside>
  );
};

export default Sidebar;
