import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Eye, EyeOff, Mail, Apple, ArrowRight, Check } from 'lucide-react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { FaGithub } from "react-icons/fa6";
import supabase from '@/lib/supabase';

const LoginPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [session, setSession] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });
      
      if (error) {
        console.error('Error logging in:', error.message);
        // You might want to add toast notification here
      } else if (data.session) {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error.message);
        // You might want to add toast notification here
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
        // You might want to add toast notification here
      }
    } catch (error) {
      console.error('Error:', error);
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
  
  // If user is logged in, show logged in state
  if (session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome Back!</h2>
            <p className="text-gray-600 mb-6">You're logged in as {session.user.email}</p>
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
              <h2 className="text-4xl font-bold text-white mb-4">Welcome Back!</h2>
              <p className="text-xl text-white/90">Sign in to continue your journey</p>
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

      {/* Right Section - Login Form */}
      <div className="w-full lg:w-1/2 bg-gray-50">
        <div className="h-full flex flex-col">
          <div className="p-6 flex justify-end space-x-4">
            <Button variant="ghost" size="sm">
                New to our platform?{' '}
            </Button>
            <Button 
              size="sm"
              className="bg-blue-600 text-white hover:bg-blue-700"
              onClick={() => navigate('/register')}
            >
              Sign up
            </Button>
          </div>

          <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
            <Card className="w-full max-w-md border-none shadow-none bg-transparent">
              <CardContent>
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900">Sign In</h2>
                  <p className="text-gray-600 mt-2">Please enter your details</p>
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

                    <div className="relative">
                      <Separator className="my-8" />
                      <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-50 px-4 text-sm text-gray-500">
                        Or continue with
                      </span>
                    </div>

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
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;