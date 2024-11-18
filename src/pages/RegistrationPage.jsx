import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Building2, Users, BarChart3 } from 'lucide-react';
import { registerAdminManager } from '../api/auth';
import { toast } from 'react-toastify';
import useStore from '../store';

const RegistrationPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  
  // Using the store directly
  const { setUser, setAccessToken, setRefreshToken } = useStore();
  
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    phone_number: '',
    company_name: '',
    company_code: '',
    registration_number: '',
    role: 'manager',
    designation: '',
    id_number: ''
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const validateForm = () => {
    const requiredFields = currentStep === 1 
      ? ['first_name', 'last_name', 'email', 'password', 'phone_number']
      : ['company_name', 'company_code', 'registration_number'];
    
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      toast.error(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return false;
    }
    
    if (currentStep === 1 && !formData.email.includes('@')) {
      toast.error('Please enter a valid email address');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await registerAdminManager(formData);
      const { user, access_token, refresh_token } = response;
      
      // Update store with user data and tokens
      setUser(user);
      setAccessToken(access_token);
      setRefreshToken(refresh_token);
      
      toast.success('Registration successful! Welcome to FieldSale.');
      navigate('/dashboard');
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Registration failed. Please try again.';
      toast.error(errorMessage);
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextStep = () => {
    if (validateForm()) {
      setCurrentStep(2);
    }
  };

  const Features = ({ icon, title, description }) => (
    <div className="flex items-start space-x-4">
      <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div>
        <h3 className="font-semibold text-lg text-white">{title}</h3>
        <p className="text-white/70 text-sm">{description}</p>
      </div>
    </div>
  );

  const renderForm = () => {
    if (currentStep === 1) {
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first_name">First Name *</Label>
              <Input
                id="first_name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                placeholder="John"
                className="h-12"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name">Last Name *</Label>
              <Input
                id="last_name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                placeholder="Doe"
                className="h-12"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
              className="h-12"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password *</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a strong password"
                className="h-12 pr-12"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-500" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-500" />
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone_number">Phone Number *</Label>
            <Input
              id="phone_number"
              name="phone_number"
              type="tel"
              value={formData.phone_number}
              onChange={handleChange}
              placeholder="+1234567890"
              className="h-12"
              required
            />
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="company_name">Company Name *</Label>
          <Input
            id="company_name"
            name="company_name"
            value={formData.company_name}
            onChange={handleChange}
            placeholder="Your Company Name"
            className="h-12"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="company_code">Company Code *</Label>
            <Input
              id="company_code"
              name="company_code"
              value={formData.company_code}
              onChange={handleChange}
              placeholder="ABC123"
              className="h-12"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="registration_number">Registration Number *</Label>
            <Input
              id="registration_number"
              name="registration_number"
              value={formData.registration_number}
              onChange={handleChange}
              placeholder="REG123456"
              className="h-12"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="designation">Designation</Label>
          <Input
            id="designation"
            name="designation"
            value={formData.designation}
            onChange={handleChange}
            placeholder="CEO, Sales Director, etc."
            className="h-12"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="id_number">ID Number</Label>
          <Input
            id="id_number"
            name="id_number"
            value={formData.id_number}
            onChange={handleChange}
            placeholder="Government ID Number"
            className="h-12"
          />
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <div className="w-full lg:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-800 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black/20" />
          <img
            src="/api/placeholder/1200/800"
            alt="Abstract background"
            className="object-cover w-full h-full opacity-20"
          />
        </div>

        <div className="relative z-10 h-full p-12 flex flex-col">
          <div className="mb-12">
            <h1 className="text-3xl font-bold text-white">FIELDSALE</h1>
          </div>

          <div className="my-auto space-y-12">
            <div>
              <h2 className="text-4xl font-bold text-white mb-4">
                Transform Your Sales Management
              </h2>
              <p className="text-xl text-white/90">
                Join thousands of businesses managing their sales teams effectively
              </p>
            </div>

            <div className="space-y-8">
              <Features
                icon={<Users className="w-6 h-6 text-white" />}
                title="Team Management"
                description="Manage your sales representatives efficiently"
              />
              <Features
                icon={<BarChart3 className="w-6 h-6 text-white" />}
                title="Performance Analytics"
                description="Track sales performance and team metrics"
              />
              <Features
                icon={<Building2 className="w-6 h-6 text-white" />}
                title="Multi-branch Support"
                description="Manage multiple locations from one platform"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 bg-gray-50">
        <div className="h-full flex flex-col">
          <div className="p-6 flex justify-end space-x-4">
            <Button variant="ghost" size="sm">
              Already registered?
            </Button>
            <Button
              size="sm"
              className="bg-blue-600 text-white hover:bg-blue-700"
              onClick={() => navigate('/login')}
            >
              Sign in
            </Button>
          </div>

          <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
            <Card className="w-full max-w-md border-none shadow-none bg-transparent">
              <CardContent>
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {currentStep === 1 ? 'Create Account' : 'Company Details'}
                  </h2>
                  <p className="text-gray-600 mt-2">
                    Step {currentStep} of 2 {currentStep === 1 ? '- Personal Information' : '- Company Information'}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {renderForm()}

                  <div className="flex space-x-4">
                    {currentStep === 2 && (
                      <Button
                        type="button"
                        className="w-full h-12"
                        variant="outline"
                        onClick={() => setCurrentStep(1)}
                      >
                        Back
                      </Button>
                    )}
                    
                    {currentStep === 1 ? (
                      <Button
                        type="button"
                        className="w-full h-12 bg-blue-600 text-white hover:bg-blue-700"
                        onClick={handleNextStep}
                      >
                        Next Step
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        className="w-full h-12 bg-blue-600 text-white hover:bg-blue-700"
                        disabled={isLoading}
                      >
                        {isLoading ? 'Creating Account...' : 'Create Account'}
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;