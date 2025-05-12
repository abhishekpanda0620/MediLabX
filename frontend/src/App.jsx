import { Route, Routes } from 'react-router-dom';
import { publicRoutes, protectedRoutes } from './routes/routes';
import AuthGuard from './components/AuthGuard';
import { useAuth } from './context/authContext';
import TestPackages from './pages/admin/TestPackages';

function App() {
  // This should come from your auth context/state
  const { user } = useAuth();
  console.log("User in App:", user);
  const userRole = user?.role; // This will be undefined if not logged in
  console.log("UserRole in App:", userRole);

  const getAllowedRoutes = () => {
    console.log("Fetching routes for role:", userRole);
    const roleRoutes = protectedRoutes[userRole] || [];
    console.log("Role-specific routes:", roleRoutes);
    const commonRoutes = protectedRoutes.common || [];
    console.log("Common routes:", commonRoutes);
    const allowedRoutes = [...roleRoutes, ...commonRoutes];
    console.log("Final allowed routes:", allowedRoutes);
    return allowedRoutes;
  };

  return (
    <Routes>
      {/* Public Routes */}
      {publicRoutes.map(({ path, element: Element }) => (
        <Route key={path} path={path} element={<Element />} />
      ))}

      {/* Protected Routes */}
      {getAllowedRoutes().map(({ path, element: Element }) => (
        <Route
          key={path}
          path={path}
          element={
          <AuthGuard allowedRoles={[userRole]}>
            <Element />
          </AuthGuard>
        }
      />
      ))}
      <Route path="/admin/test-packages" element={<TestPackages />} />
    </Routes>
  );
}

export default App;