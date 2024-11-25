import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Eye, EyeOff, Mail, Apple, ArrowRight, Check, Users, BarChart3, Building2 } from 'lucide-react';
import { FaGithub } from 'react-icons/fa6';
import supabase from '@/lib/supabase';
import useLogin from '@/hooks/useLogin';
import logo from "../assets/logo.png";

const LoginPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [session, setSession] = useState(null);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const { login, isLoading } = useLogin();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        navigate('/dashboard');
      }
    });

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

  const handleSubmit = (e) => {
    e.preventDefault();
    login(formData);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error.message);
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleOAuthLogin = async (provider) => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) {
        console.error(`Error signing in with ${provider}:`, error.message);
      }
    } catch (error) {
      console.error('Error:', error);
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

  if (session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Welcome Back!
            </h2>
            <p className="text-gray-600 mb-6">
              You're logged in as {session.user.email}
            </p>
            <Button
              onClick={handleSignOut}
              className="w-full h-12 bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              Sign out
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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
                Welcome Back to FieldSale
              </h2>
              <p className="text-2xl text-white/90 leading-relaxed">
                Sign in to continue managing your sales teams effectively
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
              New to our platform?
            </Button>
            <Button
              size="sm"
              className="bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-300"
              onClick={() => navigate('/register')}
            >
              Sign up
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
                    Sign In
                  </h2>
                  <p className="text-gray-600">
                    Please enter your details to access your account
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium">
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="name@company.com"
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
                          onChange={handleInputChange}
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

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="remember" />
                        <Label
                          htmlFor="remember"
                          className="text-sm text-gray-600 font-normal"
                        >
                          Remember me
                        </Label>
                      </div>
                      <Button
                        type="button"
                        variant="link"
                        className="text-sm text-blue-600 hover:text-blue-700 font-semibold p-0"
                        onClick={() => handleOAuthLogin('resetPassword')}
                      >
                        Forgot password?
                      </Button>
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-12 bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        'Signing in...'
                      ) : (
                        <span className="flex items-center justify-center">
                          Sign in
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </span>
                      )}
                    </Button>
                  </div>
                </form>

                <div className="mt-6">
                  <Separator className="my-4" />
                  <p className="text-center text-sm text-gray-500 my-4">Or continue with</p>
                  <div className="grid grid-cols-3 gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      className="h-12 border-gray-200 hover:bg-gray-50"
                      onClick={() => handleOAuthLogin('google')}
                    >
                      <Mail className="w-5 h-5 mr-2" />
                      Google
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="h-12 border-gray-200 hover:bg-gray-50"
                      onClick={() => handleOAuthLogin('apple')}
                    >
                      <Apple className="w-5 h-5 mr-2" />
                      Apple
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="h-12 border-gray-200 hover:bg-gray-50"
                      onClick={() => handleOAuthLogin('github')}
                    >
                      <FaGithub className="w-5 h-5 mr-2" />
                      GitHub
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
