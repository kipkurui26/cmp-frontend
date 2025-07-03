import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { GiCoffeeBeans } from 'react-icons/gi';
import axiosInstance, { fetchCsrfToken } from '../../utils/AxiosInstance'
import { useAuth } from "../../context/AuthContext"; 
import { useToast } from "../../context/ToastContext";
import coffeeImage from '../../assets/coffee.jpg';

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError('');
      await fetchCsrfToken();
      const loginData = {
        login_field: data.login_field,
        password: data.password
      };
      
      const response = await axiosInstance.post('/auth/login/', loginData);
      const user = response.data.user;
      login(user);
      
      if (user.role === "ADMIN") {
        navigate('/admin', { replace: true });
      } else if (user.role === "FARMER") {
        navigate('/', { replace: true });
      }
    } catch (err) {
      let errorMsg = 'An error occurred during login';
      if (err.response?.data?.status === "rejected") {
        errorMsg = err.response.data.error || "Your account is not active. Please contact support if you believe this is an error.";
        showToast(errorMsg, "error");
        setError(errorMsg);
        return;
      }
      if (err.response?.status === 403 && err.response?.data?.redirect === '/activation') {
        errorMsg = 'Your account is pending approval. Please wait for admin verification.';
        showToast(errorMsg, "error");
        setError(errorMsg);
        navigate('/activation', {
          state: {
            email: err.response.data.email,
            firstName: err.response.data.firstName,
            lastName: err.response.data.lastName
          }
        });
      } else if (err.response?.data?.error) {
        errorMsg = err.response.data.error;
        showToast(errorMsg, "error");
        setError(errorMsg);
      } else {
        showToast(errorMsg, "error");
        setError(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-amber-50">

      {/* Left Half Container: Logo, Title, and Login Form */}
      <div className="flex flex-col items-center justify-center w-full md:w-1/2 p-4 sm:p-6">
        {/* Logo and Text - moved inside the left half */}
        <div className="flex items-center mb-6 sm:mb-8">
          <GiCoffeeBeans className="h-8 w-8 text-amber-800 flex-shrink-0" />
          <span className="ml-2 text-xl sm:text-2xl font-bold text-gray-800">Coffee Movement Permit</span>
        </div>

        {/* Login Form Section - now a self-contained card, centered within its half */}
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md w-full max-w-sm sm:max-w-md border border-amber-200">
          <div>
            <p className="text-sm text-gray-700 text-center">Please enter your details</p>
            <h2 className="mt-2 text-xl sm:text-2xl font-bold text-gray-900 text-center">
              Welcome back
            </h2>
          </div>

          <form className="mt-6 space-y-4 sm:space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Error message display */}
            {error && (
              <div className="text-red-600 text-center text-sm mb-2">{error}</div>
            )}
            <div className="space-y-3 sm:space-y-4">
              <div>
                <label htmlFor="login_field" className="sr-only">Email or Phone</label>
                <input
                  id="login_field"
                  type="text"
                  {...register('login_field', {
                    required: 'Email or phone is required',
                    validate: value => {
                      const isEmail = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value);
                      const isPhone = /^[0-9]{10}$/.test(value);
                      return isEmail || isPhone || 'Please enter a valid email or phone number';
                    }
                  })}
                  className="appearance-none relative block w-full px-3 py-2 border border-amber-300 placeholder-gray-800 text-black rounded-md focus:outline-none focus:ring-amber-600 focus:border-amber-600 text-sm"
                  placeholder="Email or Phone Number"
                />
                {errors.login_field && (
                  <p className="mt-1 text-sm text-red-600">{errors.login_field.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="sr-only">Password</label>
                <input
                  id="password"
                  type="password"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 8,
                      message: 'Password must be at least 8 characters'
                    }
                  })}
                  className="appearance-none relative block w-full px-3 py-2 border border-amber-300 placeholder-gray-800 text-black rounded-md focus:outline-none focus:ring-amber-600 focus:border-amber-600 text-sm"
                  placeholder="Password"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <input
                  id="remember_me"
                  type="checkbox"
                  {...register('remember_me')}
                  className="h-4 w-4 text-amber-700 focus:ring-amber-600 border-amber-300 rounded"
                />
                <label htmlFor="remember_me" className="ml-2 block text-stone-700">
                  Remember for 30 days
                </label>
              </div>
              <div className="text-sm">
                <Link to="/forgot-password" className="font-medium text-amber-700 hover:text-amber-600">
                  Forgot password?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-amber-700 hover:bg-amber-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-600 disabled:opacity-50"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>

          <div className="text-center mt-6 text-sm text-gray-700">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-amber-700 hover:text-amber-600">
              Sign up
            </Link>
          </div>
        </div>
      </div>

      {/* Image Section (Right) - now takes full right half. Hidden on small screens. */}
      <div
        className="hidden md:flex md:w-1/2 bg-cover bg-center items-center justify-center p-8 relative"
        style={{ backgroundImage: `url(${coffeeImage})` }}
      >
        <div className="absolute inset-0 bg-black opacity-40"></div> {/* No specific rounded class here */}
        <div className="relative text-white text-center p-4">
          <h3 className="text-3xl font-bold mb-4 drop-shadow-md">Your Coffee Journey Begins Here</h3>
          <p className="text-lg drop-shadow-md">Manage your permits with ease and connect with the coffee community.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;