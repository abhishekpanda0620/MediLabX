import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  FaTachometerAlt, 
  FaFlask, 
  FaFileAlt, 
  FaUser, 
  FaUsers, 
  FaSignOutAlt 
} from 'react-icons/fa';
import { ROUTES } from '../routes/routeConstants';
import { useAuth } from '../context/authContext';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const userRole = user?.role;

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
    // Default fallback (if role is not defined, assume patient)
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

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  return (
    <nav className="bg-indigo-700 text-white md:hidden p-4">
      <ul className="flex flex-col space-y-4">
        {menuSections.map((section, idx) => (
          <React.Fragment key={idx}>
            <li className="mt-4 mb-2 text-xs font-semibold uppercase text-indigo-200">
              {section.title}
            </li>
            {section.items.map((item, index) => (
              <li key={index}>
                <Link 
                  to={item.path} 
                  className={`flex items-center space-x-2 hover:text-indigo-200 transition duration-150 ${location.pathname === item.path ? 'font-bold' : ''}`}
                >
                  <item.icon size={20} />
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </React.Fragment>
        ))}
        {user && (
          <li className="mt-6 pt-4 border-t border-indigo-500">
            <button 
              onClick={handleLogout}
              className="flex items-center space-x-2 w-full hover:text-indigo-200 transition duration-150"
            >
              <FaSignOutAlt size={20} />
              <span>Logout</span>
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
