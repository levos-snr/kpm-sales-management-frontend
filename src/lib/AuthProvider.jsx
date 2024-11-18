import React, { createContext, useContext, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getCurrentUser } from '../api/auth';
import useStore from '../store';
import { toast } from 'react-toastify';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const { user, setUser, accessToken, clearAuth } = useStore();
  const [isLoading, setIsLoading] = React.useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      if (accessToken && !user) {
        try {
          const userData = await getCurrentUser();
          setUser(userData);
        } catch (error) {
          console.error('Failed to fetch user data:', error);
          clearAuth();
          toast.error('Session expired. Please login again.');
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, [accessToken, user, setUser, clearAuth]);

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

// protected Route component
export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

// auth Route component (for login/register pages)
export const AuthRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isAuthenticated) {
    return (
      <Navigate to={location.state?.from?.pathname || '/dashboard'} replace />
    );
  }

  return children;
};
