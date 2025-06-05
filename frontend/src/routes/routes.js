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
import DoctorManagement from '../pages/admin/DoctorManagement';

import DoctorDashboard from '../pages/doctor/Dashboard';

import ReportGeneration from '../pages/doctor/ReportGeneration';

import LabDashboard from '../pages/lab/Dashboard';
import SampleManagement from '../pages/lab/SampleManagement';
import TestCatalog from '../pages/lab/TestCatalog';
import LabReports from '../pages/lab/LabReports';
import GenerateReport from '../pages/lab/GenerateReport'; // NEW
import IntegratedCaseReport from '../pages/lab/IntegratedCaseReport'; // NEW: Integrated workflow

import Settings from '../pages/common/Settings';
import Notifications from '../pages/common/Notifications';
import PatientManagement from '../pages/admin/PatientManagement';

export const publicRoutes = [
  { path: '/', element: SignIn },
  { path: '/signin', element: SignIn },
  { path: '/signup', element: SignUp },
];

export const protectedRoutes = {
  patient: [
    { path: '/patient/dashboard', element: PatientDashboard },
    { path: '/patient/appointments', element: Appointments },
    { path: '/patient/my-reports', element: MyReports },
    { path: '/patient/profile', element: Profile },
    { path: '/patient/test-bookings', element: TestCatalog },  // NEW
    { path: '/patient/billing-history', element: BillingManagement }, // NEW
  ],
  admin: [
    { path: '/admin/dashboard', element: AdminDashboard },
    { path: '/admin/staff', element: StaffManagement },
    { path: '/admin/patients', element: PatientManagement },
    { path: '/admin/doctors', element: DoctorManagement },
    { path: '/admin/tests', element: TestManagement },
    { path: '/admin/billing', element: BillingManagement },
    { path: '/admin/lab-tests', element: TestCatalog }, // NEW
    { path: '/admin/reports', element: ReportGeneration }, // NEW
  ],
  doctor: [
    { path: '/doctor', element: DoctorDashboard },
    { path: '/doctor/patients', element: PatientManagement },
    { path: '/doctor/reports', element: ReportGeneration },
    { path: '/doctor/appointments', element: Appointments }, // NEW
    { path: '/doctor/prescriptions', element: ReportGeneration }, // Placeholder for prescription writing
  ],
  lab_technician: [
    { path: '/lab', element: LabDashboard },
    // { path: '/lab/samples', element: SampleManagement },
    { path: '/tests', element: TestCatalog },
    { path: '/lab/reports', element: LabReports },
    { path: '/lab/pending-tests', element: SampleManagement }, // NEW
    { path: '/lab/completed-tests', element: LabReports }, // NEW
    { path: '/lab/generate-report', element: GenerateReport }, // NEW
    { path: '/lab/create-case', element: IntegratedCaseReport }, // NEW: Integrated workflow
  ],
  common: [
    { path: '/settings', element: Settings },
    { path: '/notifications', element: Notifications },
  ],
};

