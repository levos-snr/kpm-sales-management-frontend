import { useState } from 'react';
import axios from 'axios';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/login', {
        email,
        password,
      });

      localStorage.setItem('access_token', response.data.access_token);
      localStorage.setItem('refresh_token', response.data.refresh_token);

      console.log('Login successful');
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred');
      console.error('Login failed:', err.response?.data?.error || err.message);
    }
  };

  return (
    <div className="flex min-h-screen font-sans">
      {/* Left Side: Login Form */}
      <div className="w-1/3 flex items-center justify-center bg-white px-10">
        <div className="w-full max-w-md p-10 rounded-2xl">
          <h1 className="text-4xl font-semibold mb-8">Welcome Back!</h1>

          {error && <div className="text-red-500 text-center mb-6">{error}</div>}

          <form onSubmit={handleLogin} className="flex flex-col gap-6">
            <div>
              <label htmlFor="email" className="sr-only">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
                className="w-full px-5 py-3 mt-2 border border-gray-300 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all duration-200 ease-in-out hover:scale-105 hover:shadow-md"
              />
            </div>

            <div className="relative">
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                className="w-full px-5 py-3 mt-2 border border-gray-300 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all duration-200 ease-in-out hover:scale-105 hover:shadow-md"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 focus:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5c4.418 0 8.167 2.613 10 6a10.05 10.05 0 01-2.125 3.14M15.875 18.825A10.05 10.05 0 0112 19c-4.418 0-8.167-2.613-10-6a10.05 10.05 0 012.125-3.14M9.88 9.88A3.001 3.001 0 0012 15a3.001 3.001 0 002.12-5.12M9.88 9.88l4.24-4.24" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5c4.418 0 8.167 2.613 10 6a10.05 10.05 0 01-2.125 3.14M15.875 18.825A10.05 10.05 0 0112 19c-4.418 0-8.167-2.613-10-6a10.05 10.05 0 012.125-3.14M9.88 9.88A3.001 3.001 0 0012 15a3.001 3.001 0 002.12-5.12M9.88 9.88l4.24-4.24" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.24 7.76l-8.48 8.48" className="text-red-600" strokeWidth="3" />
                  </svg>
                )}
              </button>
            </div>

            <div className="text-right">
              <a href="#" className="text-sm text-gray-600 hover:text-gray-800">
                Forgot password?
              </a>
            </div>

            <button type="submit" className="w-full py-3 mt-4 bg-black text-white font-medium rounded-xl text-lg hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 transition-all duration-200 ease-in-out hover:scale-105 hover:shadow-md">
              Sign in
            </button>

            <div className="flex items-center justify-center mt-4">
              <button type="button" className="flex items-center gap-2 py-3 px-6 border border-gray-300 rounded-xl hover:bg-gray-100 text-lg transition-all duration-200 ease-in-out hover:scale-105 hover:shadow-md">
                <span>Sign in with</span>
                <span className="text-black font-semibold">G</span>
              </button>
            </div>
          </form>

          <div className="text-center mt-6">
            <span className="text-sm text-gray-600">Don’t have an account?</span>
            <a href="#" className="text-sm font-medium text-gray-800 hover:underline ml-1">
              Create account
            </a>
          </div>
        </div>
      </div>

      {/* Right Side: Image or Design Element */}
      <div className="w-2/3 bg-gray-100 flex items-center justify-center">
        <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: "url('https://via.placeholder.com/600')" }}>
          <div className="w-full h-full bg-black opacity-30"></div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;

