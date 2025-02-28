import { Navigate } from 'react-router-dom';

const AuthGuard = ({ children }) => {
  // Check if user is authenticated (you can modify this based on your auth implementation)
  const isAuthenticated = localStorage.getItem('token');

  if (!isAuthenticated) {
    // Redirect to signin if not authenticated
    return <Navigate to="/signin" replace />;
  }

  return children;
};

export default AuthGuard;