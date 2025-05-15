import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaVials, FaUserFriends, FaChartBar, FaCog, FaBell, FaSignOutAlt, FaChevronLeft, FaChevronRight, FaFileAlt, FaTag } from 'react-icons/fa';
import { useAuth } from '../context/authContext';

const Sidebar = ({ isCollapsed, toggleCollapse, userRole }) => {
  const { logout } = useAuth();

  const menuItems = {
    admin: [
      { path: '/admin/dashboard', label: 'Dashboard', icon: FaHome },
      { path: '/admin/staff', label: 'Staff Management', icon: FaUserFriends },
      // { path: '/admin/patients', label: 'Patient Management', icon: FaUserFriends },
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
      { path: '/lab/reports', label: 'Reports', icon: FaChartBar },
      { path: '/lab/generate-report', label: 'Generate Report', icon: FaFileAlt },
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

  return (
    <div className={`bg-indigo-700  text-white ${isCollapsed ? 'w-16' : 'w-64'} transition-all duration-300 max-h-screen overflow-y-auto hidden md:flex flex-col`}>
      <button onClick={toggleCollapse} className="p-2 flex items-center justify-center hover:bg-indigo-600">
        {isCollapsed ? <FaChevronRight cla /> : <FaChevronLeft />}
      </button>
      <nav className="mt-4 flex-grow ">
        {[...roleMenu, ...commonMenu].map((item) => (
          <Link key={item.path} to={item.path} className="block py-2 px-4 hover:bg-indigo-600">
            <item.icon className="inline-block mr-2" />
            {!isCollapsed && item.label}
          </Link>
        ))}
      </nav>
      <button onClick={logout} className=" py-2 px-4 hover:bg-indigo-600 w-full text-left flex items-center">
        <FaSignOutAlt className="mr-2" />
        {!isCollapsed?'Logout':''}
      </button>
    </div>
  );
};

export default Sidebar;
