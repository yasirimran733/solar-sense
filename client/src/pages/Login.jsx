import React from "react";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import { FaUser, FaLock, FaSolarPanel, FaSpinner } from "react-icons/fa";
import { loginUser } from "../api/authApi";
import { useAuth } from "../context/AuthContext";
import { getApiErrorMessage } from "../utils/apiError";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, login } = useAuth();

  const from = location.state?.from || "/dashboard";

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, from, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!username.trim()) {
      toast.error("Please enter your username");
      return;
    }
    if (!password.trim()) {
      toast.error("Please enter your password");
      return;
    }

    setIsLoading(true);

    try {
      const data = await loginUser({
        username,
        password,
      });

      if (data.success && data.token) {
        login(data.token, data.user);
        toast.success("Login successful! Redirecting...");
        navigate(from, { replace: true });
      } else {
        toast.error(data.message || "Login failed. Please try again.");
      }
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Invalid credentials. Please try again."));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 animate-fade-in text-center">
          <div className="mb-4 inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 p-3 shadow-lg">
            <FaSolarPanel className="text-3xl text-white" />
          </div>
          <h1 className="bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-3xl font-bold text-transparent md:text-4xl">
            Solar Sense Technologies
          </h1>
          <p className="mt-2 text-gray-600">Inventory Management System</p>
        </div>

        <div className="transform rounded-2xl bg-white p-6 shadow-2xl transition-all duration-300 hover:shadow-3xl md:p-8">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-semibold text-gray-800">Welcome Back</h2>
            <p className="mt-1 text-sm text-gray-500">Please login to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <FaUser className="text-sm text-gray-400" />
                </div>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  type="text"
                  placeholder="Enter your username"
                  className="w-full rounded-lg border border-gray-300 py-2.5 pr-3 pl-10 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  disabled={isLoading}
                  autoComplete="username"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <FaLock className="text-sm text-gray-400" />
                </div>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  placeholder="Enter your password"
                  className="w-full rounded-lg border border-gray-300 py-2.5 pr-3 pl-10 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  disabled={isLoading}
                  autoComplete="current-password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full transform cursor-pointer items-center justify-center space-x-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 py-2.5 font-semibold text-white shadow-md transition-all duration-200 hover:scale-[1.02] hover:from-amber-600 hover:to-orange-600 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
            >
              {isLoading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  <span>Logging in...</span>
                </>
              ) : (
                <span>Login</span>
              )}
            </button>
          </form>
        </div>

        <div className="mt-10 border-t border-gray-200 pt-4 text-center">
          <p className="text-xs text-gray-500">© 2026 Solar Sense Technologies. All rights reserved.</p>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}

export default Login;
