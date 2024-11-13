import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Eye, EyeOff, Mail, Apple, ArrowRight, Check } from 'lucide-react';
import { FaGithub } from 'react-icons/fa6';

const RegistrationPage = ({ formData, updateFormData, nextStep }) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    nextStep();
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

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Section - Branding */}
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
                Join Our Platform
              </h2>
              <p className="text-xl text-white/90">
                Create an account to start your journey
              </p>
            </div>

            <div className="space-y-8">
              <Features
                icon={<Check className="w-6 h-6 text-white" />}
                title="Smart Analytics"
                description="Get real-time insights into your business performance"
              />
              <Features
                icon={<Check className="w-6 h-6 text-white" />}
                title="Team Collaboration"
                description="Work seamlessly with your team members"
              />
              <Features
                icon={<Check className="w-6 h-6 text-white" />}
                title="Secure Platform"
                description="Enterprise-grade security for your data"
              />
            </div>
          </div>

          <div className="mt-auto">
            <div className="flex space-x-3">
              <div className="w-8 h-1 rounded-full bg-white/90" />
              <div className="w-2 h-1 rounded-full bg-white/30" />
              <div className="w-2 h-1 rounded-full bg-white/30" />
            </div>
          </div>
        </div>
      </div>

      {/* Right Section - Registration Form */}
      <div className="w-full lg:w-1/2 bg-gray-50">
        <div className="h-full flex flex-col">
          <div className="p-6 flex justify-end space-x-4">
            <Button variant="ghost" size="sm">
              Already have an account?{' '}
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
                    Create Account
                  </h2>
                  <p className="text-gray-600 mt-2">
                    Please enter your details
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="first_name"
                        className="text-sm font-medium"
                      >
                        First Name
                      </Label>
                      <Input
                        id="first_name"
                        name="first_name"
                        type="text"
                        value={formData.first_name}
                        onChange={handleChange}
                        placeholder="John"
                        className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="last_name"
                        className="text-sm font-medium"
                      >
                        Last Name
                      </Label>
                      <Input
                        id="last_name"
                        name="last_name"
                        type="text"
                        value={formData.last_name}
                        onChange={handleChange}
                        placeholder="Doe"
                        className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium">
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-sm font-medium">
                        Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="password"
                          name="password"
                          type={showPassword ? 'text' : 'password'}
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="Enter your password"
                          className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 pr-12"
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-1/2 -translate-y-1/2 hover:bg-transparent"
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
                      <Label
                        htmlFor="phone_number"
                        className="text-sm font-medium"
                      >
                        Phone Number
                      </Label>
                      <Input
                        id="phone_number"
                        name="phone_number"
                        type="tel"
                        value={formData.phone_number}
                        onChange={handleChange}
                        placeholder="+1234567890"
                        className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-12 bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                    >
                      <span className="flex items-center justify-center">
                        Continue
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </span>
                    </Button>
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