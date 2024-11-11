import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaGoogle, FaLinkedinIn } from "react-icons/fa";
import { IoLogoMicrosoft } from "react-icons/io5";
import supabase from '@/lib/supabase';

const RegistrationForm = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [session, setSession] = useState(null);
  const [formData, setFormData] = useState({
    first_name: '',
    email: '',
    password: '',
    confirm_password: '',
  });

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        navigate('/dashboard');
      }
    });
    
    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        navigate('/dashboard');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Register the user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.first_name,
          }
        }
      });

      if (authError) {
        console.error('Registration error:', authError.message);
        // You might want to add toast notification here
        return;
      }

      navigate('/company-details');
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthSignUp = async (provider) => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });
      
      if (error) {
        console.error(`Error signing up with ${provider}:`, error.message);
        // You might want to add toast notification here
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const InputField = ({ name, type = "text", placeholder, value, onChange }) => (
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-gray-700"
    />
  );

  // If user is already logged in, redirect to dashboard
  if (session) {
    navigate('/dashboard');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
            <p className="text-gray-600 mt-2">Join thousands of organizations today</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <InputField
              name="first_name"
              placeholder="Full Name"
              value={formData.first_name}
              onChange={handleChange}
            />
            <InputField
              name="email"
              type="email"
              placeholder="Work Email"
              value={formData.email}
              onChange={handleChange}
            />
            <InputField
              name="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
            <InputField
              name="confirm_password"
              type="password"
              placeholder="Confirm Password"
              value={formData.confirm_password}
              onChange={handleChange}
            />

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
            >
              {isLoading ? 'Processing...' : 'Create Account'}
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { Icon: FaGoogle, label: 'Google', provider: 'google' },
                { Icon: FaLinkedinIn, label: 'LinkedIn', provider: 'linkedin' },
                { Icon: IoLogoMicrosoft, label: 'Microsoft', provider: 'azure' },
              ].map(({ Icon, label, provider }) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => handleOAuthSignUp(provider)}
                  className="flex items-center justify-center px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  <Icon className="w-5 h-5 text-gray-600" />
                </button>
              ))}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;