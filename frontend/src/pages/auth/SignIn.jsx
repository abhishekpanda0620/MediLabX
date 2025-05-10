import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import Layout from '../../components/Layout';
import { useAuth } from '../../context/authContext';

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login, user } = useAuth();

  const handleLogin = async (e) => {
    try {
      e.preventDefault();
      const success = await login(email, password);
      if (!success) {
        alert("Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed. Please try again.");
    }
  };

  useEffect(() => {
    console.log("User state updated:", user);
    if (user?.role) {
      console.log("Navigating to dashboard for role:", user.role);
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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Sign In</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="email">Email</label>
            <div className="flex items-center border border-gray-300 rounded-lg">
              <FaEnvelope className="ml-2 text-gray-500" />
              <input type="email" id="email" onChange={(e) => setEmail(e.target.value)} className="w-full outline-none p-2 border-none focus:ring-0" />
            </div>
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2" htmlFor="password">Password</label>
            <div className="flex items-center border border-gray-300 rounded-lg">
              <FaLock className="ml-2 text-gray-500" />
              <input type={showPassword ? "text" : "password"} id="password" onChange={(e) => setPassword(e.target.value)} className="w-full outline-none p-2 border-none focus:ring-0" />
              <button type="button" onClick={togglePasswordVisibility} className="mr-2 text-gray-500 focus:outline-none">
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
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