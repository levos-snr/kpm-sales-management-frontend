import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Eye, EyeOff, Building2, Users, BarChart3 } from 'lucide-react';
import { registerAdminManager } from '../api/auth';
import { toast } from 'react-toastify';
import useStore from '../store';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import logo from "../assets/logo.png";
import countryToCurrency from 'country-to-currency';

const RegistrationPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  
  const { setUser, setAccessToken, setRefreshToken } = useStore();
  
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    phone_number: '',
    country: '',
    currency: '',
    company_name: '',
    company_code: '',
    registration_number: '',
    role: 'manager',
    designation: '',
    id_number: '',
    location: ''
  });

  const countryOptions = useMemo(() => {
    return Object.keys(countryToCurrency).map(countryCode => ({
      value: countryCode,
      label: `${countryCode} (${countryToCurrency[countryCode]})`
    }));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'country') {
      setFormData(prev => ({
        ...prev,
        currency: countryToCurrency[value] || ''
      }));
    }
  };

  const handlePhoneChange = (value) => {
    setFormData(prev => ({
      ...prev,
      phone_number: value
    }));
  };

  const validateForm = () => {
    const requiredFields = currentStep === 1 
      ? ['first_name', 'last_name', 'email', 'password', 'phone_number', 'country', 'currency']
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
    <div className="flex items-start space-x-4 bg-white/10 p-4 rounded-lg transition-all duration-300 hover:bg-white/20">
      <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div>
        <h3 className="font-semibold text-lg text-white">{title}</h3>
        <p className="text-white/80 text-sm">{description}</p>
      </div>
    </div>
  );

  const renderForm = () => {
    if (currentStep === 1) {
      return (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="first_name" className="text-gray-700">First Name *</Label>
              <Input
                id="first_name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                placeholder="John"
                className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name" className="text-gray-700">Last Name *</Label>
              <Input
                id="last_name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                placeholder="Doe"
                className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-700">Email Address *</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
              className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-700">Password *</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a strong password"
                className="h-12 pr-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
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
            <Label htmlFor="phone_number" className="text-gray-700">Phone Number *</Label>
            <PhoneInput
              international
              countryCallingCodeEditable={false}
              defaultCountry="KE"
              value={formData.phone_number}
              onChange={handlePhoneChange}
              className="h-12 border rounded-md border-gray-300 focus:border-blue-500 p-2"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="country" className="text-gray-700">Country *</Label>
            <Select
              name="country"
              value={formData.country}
              onValueChange={(value) => handleChange({ target: { name: 'country', value } })}
            >
              <SelectTrigger className="w-full h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                <SelectValue placeholder="Select a country" />
              </SelectTrigger>
              <SelectContent>
                {countryOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="currency" className="text-gray-700">Currency *</Label>
            <Input
              id="currency"
              name="currency"
              value={formData.currency}
              readOnly
              className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location" className="text-gray-700">Location</Label>
            <Select
              name="location"
              value={formData.location}
              onValueChange={(value) => handleChange({ target: { name: 'location', value } })}
            >
              <SelectTrigger className="w-full h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                <SelectValue placeholder="Select your location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="South-East">South-East</SelectItem>
                <SelectItem value="North-East">North-East</SelectItem>
                <SelectItem value="Nairobi">Nairobi</SelectItem>
                <SelectItem value="Central">Central</SelectItem>
                <SelectItem value="Coast">Coast</SelectItem>
                <SelectItem value="Nyanza">Nyanza</SelectItem>
                <SelectItem value="Others">Others</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="company_name" className="text-gray-700">Company Name *</Label>
          <Input
            id="company_name"
            name="company_name"
            value={formData.company_name}
            onChange={handleChange}
            placeholder="Your Company Name"
            className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="company_code" className="text-gray-700">Company Code *</Label>
            <Input
              id="company_code"
              name="company_code"
              value={formData.company_code}
              onChange={handleChange}
              placeholder="ABC123"
              className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="registration_number" className="text-gray-700">Registration Number *</Label>
            <Input
              id="registration_number"
              name="registration_number"
              value={formData.registration_number}
              onChange={handleChange}
              placeholder="REG123456"
              className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="designation" className="text-gray-700">Designation</Label>
          <Input
            id="designation"
            name="designation"
            value={formData.designation}
            onChange={handleChange}
            placeholder="CEO, Sales Director, etc."
            className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="id_number" className="text-gray-700">ID Number</Label>
          <Input
            id="id_number"
            name="id_number"
            value={formData.id_number}
            onChange={handleChange}
            placeholder="Government ID Number"
            className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
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
            src="https://media.istockphoto.com/id/1385168396/photo/people-registering-for-the-conference-event.jpg?s=612x612&w=0&k=20&c=ZHMACoGg5zfL-nUzjoXTrXedDXXoj_E7rBZBihaWfBA="
            alt="Abstract background"
            className="object-cover w-full h-full opacity-20"
          />
        </div>

        <div className="relative z-10 h-full p-12 flex flex-col">
          <div className="my-auto space-y-12">
            <div>
              <h2 className="text-5xl font-bold text-white mb-6 leading-tight">
                Transform Your Sales Management
              </h2>
              <p className="text-2xl text-white/90 leading-relaxed">
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
            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
              Already registered?
            </Button>
            <Button
              size="sm"
              className="bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-300"
              onClick={() => navigate('/login')}
            >
              Sign in
            </Button>
          </div>

          <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
            <Card className="w-full max-w-md border-none shadow-xl bg-white rounded-2xl">
              <CardContent className="p-8">
                <div className="flex justify-center mb-8">
                  <img
                    src={logo}
                    alt="FieldSale Logo"
                    width={150}
                    height={50}
                    className="h-24 w-auto"
                  />
                </div>
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    {currentStep === 1 ? 'Create Account' : 'Company Details'}
                  </h2>
                
<p className="text-gray-600">
                    Step {currentStep} of 2 {currentStep === 1 ? '- Personal Information' : '- Company Information'}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                  {renderForm()}

                  <div className="flex space-x-4">
                    {currentStep === 2 && (
                      <Button
                        type="button"
                        className="w-full h-12 bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors duration-300"
                        onClick={() => setCurrentStep(1)}
                      >
                        Back
                      </Button>
                    )}
                    
                    {currentStep === 1 ? (
                      <Button
                        type="button"
                        className="w-full h-12 bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-300"
                        onClick={handleNextStep}
                      >
                        Next Step
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        className="w-full h-12 bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-300"
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


