import App from '/src/App.jsx';
import Dashboard from '/src/pages/Dashboard.jsx';
import CrazyNotFoundPage from '/src/pages/CrazyNotFoundPage';
import LoginPage from '/src/pages/LoginPage';
import MultiStepRegistration from '/src/components/MultiStepRegistration';
import SuccessPage from '/src/pages/SuccessPage';
import StatsHeader from '/src/components/ui/StatsHeader';

const routes = [
  {
    path: '/',
    element: <App />,
    errorElement: <CrazyNotFoundPage />,
    children: [
      { path: '/', element: <LoginPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: '/dashboard', element: <Dashboard /> },
      { path: '/register', element: <MultiStepRegistration /> },
      { path: '/success', element: <SuccessPage /> },
      { path: '/stats', element: <StatsHeader /> },
    ],
  },
];

export default routes;