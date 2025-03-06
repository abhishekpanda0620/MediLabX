import Home from '../pages/Home';
import SignIn from '../pages/auth/SignIn';
import SignUp from '../pages/auth/SignUp';
import PatientDashboard from '../pages/patient/Dashboard';
import Appointments from '../pages/patient/Appointments';
import MyReports from '../pages/patient/MyReports';
import Profile from '../pages/common/Profile';

import AdminDashboard from '../pages/admin/Dashboard';
import StaffManagement from '../pages/admin/StaffManagement';
import TestManagement from '../pages/admin/TestManagement';
import BillingManagement from '../pages/admin/BillingManagement';

import DoctorDashboard from '../pages/doctor/Dashboard';
import PatientManagement from '../pages/doctor/PatientManagement';
import ReportGeneration from '../pages/doctor/ReportGeneration';

import LabDashboard from '../pages/lab/Dashboard';
import SampleManagement from '../pages/lab/SampleManagement';
import TestCatalog from '../pages/lab/TestCatalog';
import LabReports from '../pages/lab/LabReports';

import Settings from '../pages/common/Settings';
import Notifications from '../pages/common/Notifications';

export const publicRoutes = [
  { path: '/', element: Home },
  { path: '/signin', element: SignIn },
  { path: '/signup', element: SignUp },
];

export const protectedRoutes = {
  patient: [
    { path: '/dashboard', element: PatientDashboard },
    { path: '/appointments', element: Appointments },
    { path: '/my-reports', element: MyReports },
    { path: '/profile', element: Profile },
  ],
  admin: [
    { path: '/admin', element: AdminDashboard },
    { path: '/admin/staff', element: StaffManagement },
    { path: '/admin/tests', element: TestManagement },
    { path: '/admin/billing', element: BillingManagement },
  ],
  doctor: [
    { path: '/doctor', element: DoctorDashboard },
    { path: '/doctor/patients', element: PatientManagement },
    { path: '/doctor/reports', element: ReportGeneration },
  ],
  lab: [
    { path: '/lab', element: LabDashboard },
    { path: '/lab/samples', element: SampleManagement },
    { path: '/tests', element: TestCatalog },
    { path: '/lab/reports', element: LabReports },
  ],
  common: [
    { path: '/settings', element: Settings },
    { path: '/notifications', element: Notifications },
  ],
};
