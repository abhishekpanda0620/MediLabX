import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaUserCircle, FaSignOutAlt, FaVials, FaUserFriends, FaChartBar, FaCog, FaBell } from 'react-icons/fa';
import { useAuth } from '../context/authContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const userRole = user?.role;

  const menuItems = {
    admin: [
      { path: '/admin/dashboard', label: 'Dashboard', icon: FaHome },
      { path: '/admin/staff', label: 'Staff Management', icon: FaUserFriends },
      { path: '/admin/tests', label: 'Test Management', icon: FaVials },
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
    <nav className=" text-white p-4">
      <ul className="flex flex-row  justify-evenly space-y-2 md:space-y-0 md:space-x-4">
        {[...roleMenu, ...commonMenu].map((item) => (
          <li key={item.path} className="flex ">
            <Link to={item.path} className="flex  space-x-2 hover:text-gray-300" title={item.label}>
              <item.icon />  <span className='sm:block hidden'>{item.label}</span> 
              <span className="hidden md:inline">{item.label}</span>
            </Link>
          </li>
        ))}
        {user && (
          <li className="flex ">
            <button onClick={logout} className="flex  space-x-2 hover:text-gray-300" title="Logout">
              <FaSignOutAlt />
              <span className="hidden md:inline">Logout</span>
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
