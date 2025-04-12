import { createContext, useContext, useEffect, useState } from "react";
import { getUserData, loginUser, logoutUser } from "../services/api";
import { Navigate, useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Fixed variable name to lowercase

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const userData = await getUserData();
          setUser(userData);
        } catch (error) {
          console.error("Error getting user data:", error);
          setUser(null);
          localStorage.removeItem("token");
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      const response = await loginUser(email, password);
      console.log("Login API response:", response);
      if (response?.token) {
        localStorage.setItem("token", response.token);
        setUser(response.user); // Set user data from response
        console.log("User state updated:", response.user);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await logoutUser();
      console.log("User logged out");
      navigate("/signin"); 
      localStorage.removeItem("token");
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const value = {
    user,
    login,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
