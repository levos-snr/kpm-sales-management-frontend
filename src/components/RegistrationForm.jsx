import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pencil } from 'lucide-react';
import { FaLongArrowAltLeft, FaGoogle } from "react-icons/fa";
import { IoCloudUploadOutline, IoLogoMicrosoft } from "react-icons/io5";
import { FaLinkedinIn } from "react-icons/fa6";
import supabase from '@/lib/supabase';

const RegistrationForm = () => {
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
          {/* ... (keeping the same left panel UI) ... */}
        </div>

        {/* Right Panel - Form */}
        <div className="lg:w-1/2 p-8 lg:p-12 flex items-center justify-center">
          <div className="w-full max-w-md">
            <StepIndicator currentStep={step} />
            
            {step === 1 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
                  <p className="text-gray-600 mt-2">Join thousands of organizations today</p>
                </div>

                <form className="space-y-4">
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
                    type="button"
                    onClick={() => setStep(2)}
                    disabled={isLoading}
                    className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                  >
                    {isLoading ? 'Processing...' : 'Continue'}
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
            )}

            {step === 2 && (
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
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-gray-900">Company Branding</h2>
                  <p className="text-gray-600 mt-2">Add your company's visual identity</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="flex flex-col items-center space-y-6">
                    <div className="w-40 h-40 rounded-full border-3 border-dashed border-gray-200 flex items-center justify-center bg-gray-50 group hover:bg-gray-100 transition-colors duration-200 cursor-pointer">
                      <div className="text-center">
                        <IoCloudUploadOutline className="w-8 h-8 mx-auto text-gray-400 group-hover:text-gray-500" />
                        <span className="mt-2 block text-sm text-gray-500">Drop your logo here</span>
                      </div>
                    </div>

                    <div className="flex space-x-4">
                      <button type="button" className="flex items-center px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                        <IoCloudUploadOutline className="w-4 h-4 mr-2" />
                        Upload Logo
                      </button>
                      <button type="button" className="flex items-center px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                        <Pencil className="w-4 h-4 mr-2" />
                        Edit Logo
                      </button>
                    </div>

                    <div className="flex justify-between w-full pt-4">
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        className="flex items-center px-6 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-gray-600"
                      >
                        <FaLongArrowAltLeft className="w-4 h-4 mr-2" />
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                      >
                        {isLoading ? 'Creating Account...' : 'Complete Setup'}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;