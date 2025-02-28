import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PatientDashboardPage from './pages/PatientDashboardPage';
import AppointmentBookingPage from './pages/AppointmentBookingPage';
import AdminPanelPage from './pages/AdminPanelPage';
import DoctorPanelPage from './pages/DoctorPanelPage';
import LabStaffPanelPage from './pages/LabStaffPanelPage';
import SignIn from './pages/auth/Signin';
import SignUp from './pages/auth/Signup';
import Home from './pages/Home';
import AuthGuard from './components/AuthGuard';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Protected Routes */}
        <Route
          path="/patient-dashboard"
          element={
            <AuthGuard>
              <PatientDashboardPage />
            </AuthGuard>
          }
        />
        <Route
          path="/book-appointment"
          element={
            <AuthGuard>
              <AppointmentBookingPage />
            </AuthGuard>
          }
        />
        <Route
          path="/admin-panel"
          element={
            <AuthGuard>
              <AdminPanelPage />
            </AuthGuard>
          }
        />
        <Route
          path="/doctor-panel"
          element={
            <AuthGuard>
              <DoctorPanelPage />
            </AuthGuard>
          }
        />
        <Route
          path="/lab-staff-panel"
          element={
            <AuthGuard>
              <LabStaffPanelPage />
            </AuthGuard>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;