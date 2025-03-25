import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { publicRoutes, protectedRoutes } from './routes/routes';
import AuthGuard from './components/AuthGuard';
import { useAuth } from './context/authContext';

function App() {
  // This should come from your auth context/state
  const { user } = useAuth();
  console.log("User in App:", user);
  const userRole = user?.role; // This will be undefined if not logged in
  console.log("UserRole in App:", userRole);

  const getAllowedRoutes = () => {
    const roleRoutes = protectedRoutes[userRole] || [];
    const commonRoutes = protectedRoutes.common || [];
    return [...roleRoutes, ...commonRoutes];
  };

  return (
    <Router>
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
      </Routes>
    </Router>
  );
}

export default App;