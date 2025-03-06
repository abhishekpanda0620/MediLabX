import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { publicRoutes, protectedRoutes } from './routes/routes';
import AuthGuard from './components/AuthGuard';

function App() {
  // This should come from your auth context/state
  const userRole = 'lab'; // Could be 'admin', 'doctor', 'lab', 'patient'

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
              <AuthGuard>
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