import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext"; // Custom hook to check auth

const AuthGuard = ({ children, allowedRoles = [] }) => {
  const { user } = useAuth() || {}; // Prevents destructuring error

  console.log("User in AuthGuard:", user);

  if (!user || !user.role) return <Navigate to="/signin" replace />; // Redirect if not logged in
  if (!allowedRoles.includes(user.role)) return <Navigate to="/unauthorized" replace />;

  return children;
};

export default AuthGuard;
