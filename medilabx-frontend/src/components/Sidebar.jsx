import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaTachometerAlt, FaCalendarAlt, FaFlask, FaFileAlt, FaUser, FaUsers, FaSignOutAlt } from 'react-icons/fa';
import { GoSidebarCollapse, GoSidebarExpand } from 'react-icons/go';
import { ROUTES } from '../routes/routeConstants';
import { useAuth } from '../context/authContext';

const Sidebar = ({ isCollapsed, toggleCollapse, userRole }) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const getMenuSections = () => {
    if (userRole === 'admin') {
      return [
        {
          title: 'Admin',
          items: [
            { icon: FaTachometerAlt, label: 'Dashboard', path: ROUTES.ADMIN_DASHBOARD },
            { icon: FaUsers, label: 'Staff Management', path: ROUTES.STAFF_MANAGEMENT },
          ],
        },
        {
          title: 'Management',
          items: [
            { icon: FaFlask, label: 'Test Management', path: ROUTES.TEST_MANAGEMENT },
            { icon: FaFileAlt, label: 'Billing', path: ROUTES.BILLING_MANAGEMENT },
          ],
        },
      ];
    }
    if (userRole === 'doctor') {
      return [
        {
          title: 'Doctor',
          items: [
            { icon: FaTachometerAlt, label: 'Dashboard', path: ROUTES.DOCTOR_DASHBOARD },
            { icon: FaUser, label: 'Patient Management', path: ROUTES.PATIENT_MANAGEMENT },
            { icon: FaFileAlt, label: 'Report Generation', path: ROUTES.REPORT_GENERATION },
          ],
        },
      ];
    }
    if (userRole === 'patient') {
      return [
        {
          title: 'Patient',
          items: [
            { icon: FaTachometerAlt, label: 'Dashboard', path: ROUTES.PATIENT_DASHBOARD },
            { icon: FaFileAlt, label: 'Lab Reports', path: ROUTES.PATIENT_REPORTS },
            { icon: FaUser, label: 'Profile', path: ROUTES.PATIENT_PROFILE },
          ],
        }
      ];
    }
    // Default fallback for patient
    return [
      {
        title: 'Patient',
        items: [
          { icon: FaTachometerAlt, label: 'Dashboard', path: ROUTES.PATIENT_DASHBOARD },
          { icon: FaFileAlt, label: 'Lab Reports', path: ROUTES.PATIENT_REPORTS },
          { icon: FaUser, label: 'Profile', path: ROUTES.PATIENT_PROFILE },
        ],
      },
    ];
  };

  const menuSections = getMenuSections();

  // Handle Logout button click
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside className={`  bg-indigo-700 text-white ${isCollapsed ? 'w-16' : 'w-56'} transition-all duration-300 hidden md:block`}>
      <div className="flex relative flex-col h-full">
        <div>
          <div className="flex justify-end items-center p-4">
          <button onClick={toggleCollapse} className="text-xl p-2 absolute mx-[-30px] bg-indigo-600 rounded-lg transform transition-transform duration-200 hover:scale-105">
              {isCollapsed ? <GoSidebarCollapse /> : <GoSidebarExpand />}
          </button>
          </div>
          <nav className="mt-4">
            {menuSections.map((section, idx) => (
              <div key={idx} className="mb-6">
                {!isCollapsed && (
                  <h3 className="px-4 mb-2 text-xs font-semibold uppercase text-indigo-200">
                    {section.title}
                  </h3>
                )}
                {section.items.map((item, index) => (
                  <Link
                    key={index}
                    to={item.path}
                    className={`flex items-center px-4 py-3 transition-colors ${location.pathname === item.path ? 'bg-indigo-800' : 'hover:bg-indigo-600'}`}
                  >
                    <item.icon className={`text-lg ${location.pathname === item.path ? 'text-white' : 'text-indigo-300'}`} />
                    {!isCollapsed && <span className="ml-3">{item.label}</span>}
                  </Link>
                ))}
              </div>
            ))}
          </nav>
        </div>
        {/* Logout Button */}
        {user && (
          <div className="py-4 absolute bottom-0 w-full">
            <button onClick={handleLogout} className="flex items-center px-4 py-3 w-full transition-colors hover:bg-indigo-600">
              <FaSignOutAlt className="text-lg text-indigo-300" />
              {!isCollapsed && <span className="ml-3">Logout</span>}
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
