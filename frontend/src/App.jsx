import { Route, Routes } from 'react-router-dom';
import { publicRoutes, protectedRoutes } from './routes/routes';
import AuthGuard from './components/AuthGuard';
import { useAuth } from './context/authContext';
import TestPackages from './pages/admin/TestPackages';
import NotFound from './pages/common/NotFound';

function App() {
  // This should come from your auth context/state
  const { user } = useAuth();
  const userRole = user?.role; // This will be undefined if not logged in

  const getAllowedRoutes = () => {
    const roleRoutes = protectedRoutes[userRole] || [];
    const commonRoutes = protectedRoutes.common || [];
    const allowedRoutes = [...roleRoutes, ...commonRoutes];
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
      {/* 404 for  routes Not found */}
      {
        <Route path="*" element={<NotFound />} />
      }
    </Routes>
  );
}

export default App;