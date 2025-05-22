import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import Layout from '../../components/Layout';
import { useAuth } from '../../context/authContext';
import Alert from '../../components/common/Alert';

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [alert, setAlert] = useState(null);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { login, user } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    // Basic validation
    const newErrors = {};
    if (!email) newErrors.email = 'Email is required.';
    if (!password) newErrors.password = 'Password is required.';
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    try {
      const success = await login(email, password);
      if (!success) {
        setAlert({ type: 'error', title: 'Login failed', message: 'Please check your credentials.' });
      }
    } catch (error) {
      console.error("Login error:", error);
      setAlert({ type: 'error', title: 'Login failed', message: 'Please try again.' });
    }
  };

  useEffect(() => {
    if (user?.role) {
      switch (user.role) {
        case "admin":
          navigate("/admin/dashboard", { replace: true });
          break;
        case "doctor":
          navigate("/doctor", { replace: true });
          break;
        case "lab_technician":
          navigate("/lab", { replace: true });
          break;
        case "patient":
          navigate("/patient/dashboard", { replace: true });
          break;
        default:
          navigate("/dashboard", { replace: true });
      }
    }
  }, [user, navigate]);

  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => setAlert(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Sign In</h2>
        {alert && (
          <Alert type={alert.type} title={alert.title} message={alert.message} onDismiss={() => setAlert(null)} />
        )}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="email">Email</label>
            <div className="flex items-center border border-gray-300 rounded-lg">
              <FaEnvelope className="ml-2 text-gray-500" />
              <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full outline-none p-2 border-none focus:ring-0" />
            </div>
            {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email}</p>}
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2" htmlFor="password">Password</label>
            <div className="flex items-center border border-gray-300 rounded-lg">
              <FaLock className="ml-2 text-gray-500" />
              <input type={showPassword ? "text" : "password"} id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full outline-none p-2 border-none focus:ring-0" />
              <button type="button" onClick={togglePasswordVisibility} className="mr-2 text-gray-500 focus:outline-none">
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.password && <p className="text-red-600 text-xs mt-1">{errors.password}</p>}
          </div>
          <button type="submit" className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg shadow-lg hover:bg-indigo-700 cursor-pointer">Sign In</button>
        </form>
        {/* <p className="mt-4 text-center text-gray-700">
          Don't have an account? <Link to="/signup" className="text-blue-600 hover:underline">Sign Up</Link>
        </p> */}
      </div>
    </div>
  );
};

export default SignIn;