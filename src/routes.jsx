import { lazy, Suspense } from 'react';
import App from '/src/App.jsx';
import { AuthProvider, ProtectedRoute, AuthRoute } from './lib/AuthProvider';

// Lazy load
const Dashboard = lazy(() => import('/src/pages/Dashboard'));
const LoginPage = lazy(() => import('/src/pages/LoginPage'));
const CrazyNotFoundPage = lazy(() => import('/src/pages/CrazyNotFoundPage'));
const RegistrationPage = lazy(() => import('/src/pages/RegistrationPage'));
const SuccessPage = lazy(() => import('/src/pages/SuccessPage'));
const StatsHeader = lazy(() => import('/src/components/StatsHeader'));
const LoadingSpinner = lazy(() => import('/src/components/LoadingSpinner'));
const Profile = lazy(() => import('/src/pages/Profile'));

const routes = [
  {
    path: '/',
    element: (
      <AuthProvider>
        <App />
      </AuthProvider>
    ),
    errorElement: <CrazyNotFoundPage />,
    children: [
      {
        path: '/',
        element: (
          <AuthRoute>
            <Suspense fallback={<LoadingSpinner />}>
              <LoginPage />
            </Suspense>
          </AuthRoute>
        ),
      },
      {
        path: 'login',
        element: (
          <AuthRoute>
            <Suspense fallback={<LoadingSpinner />}>
              <LoginPage />
            </Suspense>
          </AuthRoute>
        ),
      },
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute>
            <Suspense fallback={<LoadingSpinner />}>
              <Dashboard />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: 'register',
        element: (
          <AuthRoute>
            <Suspense fallback={<LoadingSpinner />}>
              <RegistrationPage />
            </Suspense>
          </AuthRoute>
        ),
      },
      {
        path: 'success',
        element: (
          <ProtectedRoute>
            <Suspense fallback={<LoadingSpinner />}>
              <SuccessPage />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: 'stats',
        element: (
          <ProtectedRoute>
            <Suspense fallback={<LoadingSpinner />}>
              <StatsHeader />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: 'profile',
        element: (
          <ProtectedRoute>
            <Suspense fallback={<LoadingSpinner />}>
              <Profile />
            </Suspense>
          </ProtectedRoute>
        ),
      },
    ],
  },
];

export default routes;
