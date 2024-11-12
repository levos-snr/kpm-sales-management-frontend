import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pencil } from 'lucide-react';
import { FaLongArrowAltLeft, FaGoogle } from "react-icons/fa";
import { IoCloudUploadOutline, IoLogoMicrosoft } from "react-icons/io5";
import { FaLinkedinIn } from "react-icons/fa6";
import supabase from '@/lib/supabase';

const CompanyDetails = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [session, setSession] = useState(null);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    password: '',
    confirm_password: '',
    role: 'admin',
    designation: '',
    id_number: '',
    company_name: '',
    company_code: '',
    registration_number: '',
    country: '',
    sub_county: '',
    ward: '',
    time_zone: '',
    address: '',
    company_email: '',
    logo_url: '',
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
      // First, register the user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.first_name,
            company_name: formData.company_name,
          }
        }
      });

      if (authError) {
        console.error('Registration error:', authError.message);
        // You might want to add toast notification here
        return;
      }

      // If auth successful, store additional user data in a custom table
      if (authData.user) {
        const { error: profileError } = await supabase
          .from('company_profiles')
          .insert([
            {
              user_id: authData.user.id,
              company_name: formData.company_name,
              company_code: formData.company_code,
              registration_number: formData.registration_number,
              country: formData.country,
              time_zone: formData.time_zone,
              logo_url: formData.logo_url,
            }
          ]);

        if (profileError) {
          console.error('Error saving company profile:', profileError.message);
          // You might want to add toast notification here
        } else {
          navigate('/dashboard');
        }
      }
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

  const StepIndicator = ({ currentStep }) => (
    <div className="flex items-center justify-center space-x-2 mb-8">
      {[1, 2, 3].map((num) => (
        <div
          key={num}
          className={`w-3 h-3 rounded-full transition-all duration-300 ${
            num === currentStep ? 'bg-blue-600 w-6' : 
            num < currentStep ? 'bg-blue-400' : 'bg-gray-300'
          }`}
        />
      ))}
    </div>
  );

  // If user is already logged in, redirect to dashboard
  if (session) {
    navigate('/dashboard');
    return null;
  }


  return (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Panel - Branding */}
      <div className="lg:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-700 p-8 lg:p-12 flex flex-col justify-between relative overflow-hidden">
                <div className="relative z-10">
                  <h1 className="text-4xl font-bold text-white mb-4">FIELDSALE</h1>
                  <p className="text-blue-100 text-xl mb-6">Your Gateway to Effortless Management</p>
                </div>
                
                {/* Decorative Elements */}
                <div className="absolute bottom-0 right-0 transform translate-x-1/4 translate-y-1/4">
                  <div className="w-64 h-64 bg-blue-500 rounded-full opacity-20" />
                </div>
                <div className="absolute top-0 left-0 transform -translate-x-1/4 -translate-y-1/4">
                  <div className="w-96 h-96 bg-indigo-500 rounded-full opacity-20" />
                </div>
                
                <div className="relative z-10">
                  <div className="space-y-6 text-white/90">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold">Seamless Integration</h3>
                        <p className="text-sm text-blue-100">Connect and collaborate effortlessly</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold">Lightning Fast</h3>
                        <p className="text-sm text-blue-100">Optimized for maximum performance</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

      
      
      
      
      <div className="lg:w-1/2 p-8 lg:p-12 flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900">Organization Details</h2>
              <p className="text-gray-600 mt-2">Tell us about your company</p>
            </div>

            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <InputField
                  name="country"
                  placeholder="Country"
                  value={formData.country}
                  onChange={handleChange}
                />
                <InputField
                  name="time_zone"
                  placeholder="Time Zone"
                  value={formData.time_zone}
                  onChange={handleChange}
                />
              </div>

              <InputField
                name="company_name"
                placeholder="Company Name"
                value={formData.company_name}
                onChange={handleChange}
              />
              
              <InputField
                name="company_code"
                placeholder="Company Code"
                value={formData.company_code}
                onChange={handleChange}
              />

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex items-center px-6 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-gray-600"
                >
                  <FaLongArrowAltLeft className="w-4 h-4 mr-2" />
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  Continue
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </div>
  </div>
  );
};

export default CompanyDetails;