import React from 'react'
import { useState,useEffect } from 'react'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLock, FaSolarPanel, FaSpinner } from 'react-icons/fa';
import { loginUser } from '../api/authApi';
function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token")
  
  useEffect(()=>{
    if(token){
      navigate("/dashboard")
    }
  },[])
  async function handleSubmit(e) {
    e.preventDefault();
    
    // Validation
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
        password
      });
      
      const token = data.token;
      if (data.success) {
        localStorage.setItem("token", token);
        toast.success("Login successful! Redirecting...");
        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);
      } else {
        toast.error(data.message || "Login failed. Please try again.");
      }
    } catch(error) {   
      console.log(error);
      if (error.response) {
        toast.error(error.response.data.message || "Invalid credentials. Please try again.");
      } else if (error.request) {
        toast.error("Network error. Please check your connection.");
      } else {
        toast.error("An error occurred. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4'>
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      
      <div className='w-full max-w-md'>
        {/* Logo/Brand Section */}
        <div className='text-center mb-8 animate-fade-in'>
          <div className='inline-flex items-center justify-center bg-gradient-to-r from-amber-500 to-orange-500 p-3 rounded-2xl shadow-lg mb-4'>
            <FaSolarPanel className='text-white text-3xl' />
          </div>
          <h1 className='text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent'>
            Solar Sense Technologies
          </h1>
          <p className='text-gray-600 mt-2'>Inventory Management System</p>
        </div>

        {/* Login Form Card */}
        <div className='bg-white rounded-2xl shadow-2xl p-6 md:p-8 transform transition-all duration-300 hover:shadow-3xl'>
          <div className='text-center mb-6'>
            <h2 className='text-2xl font-semibold text-gray-800'>Welcome Back</h2>
            <p className='text-gray-500 text-sm mt-1'>Please login to your account</p>
          </div>

          <form onSubmit={handleSubmit} className='space-y-5'>
            {/* Username Field */}
            <div className='space-y-2'>
              <label className='block text-sm font-medium text-gray-700'>
                Username
              </label>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <FaUser className='text-gray-400 text-sm' />
                </div>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  type="text"
                  placeholder="Enter your username"
                  className='w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200'
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className='space-y-2'>
              <label className='block text-sm font-medium text-gray-700'>
                Password
              </label>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <FaLock className='text-gray-400 text-sm' />
                </div>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  placeholder="Enter your password"
                  className='w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200'
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Login Button */}
            <button
              type='submit'
              disabled={isLoading}
              className='w-full bg-gradient-to-r cursor-pointer from-amber-500 to-orange-500 text-white font-semibold py-2.5 rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center space-x-2 shadow-md'
            >
              {isLoading ? (
                <>
                  <FaSpinner className='animate-spin' />
                  <span>Logging in...</span>
                </>
              ) : (
                <span>Login</span>
              )}
            </button>
          </form>

          {/* Footer */}
        </div>

         <div className='mt-10 pt-4 border-t border-gray-200 text-center'>
            <p className='text-xs text-gray-500'>
              © 2026 Solar Sense Technologies. All rights reserved.
            </p>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
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
  )
}

export default Login