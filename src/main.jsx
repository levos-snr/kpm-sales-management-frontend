import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ToastContainer } from 'react-toastify';
import axios from 'axios';
import './index.css';
import 'react-toastify/dist/ReactToastify.css';
import routes from './routes';
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: 'https://21bd041ce6905a9e923ce312defb708d@o4508283672461312.ingest.de.sentry.io/4508283676721232',
  integrations: [],
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

const isDev = import.meta.env.MODE === 'development';
axios.defaults.baseURL = isDev
  ? import.meta.env.VITE_API_BASE_URL_DEV
  : import.meta.env.VITE_API_BASE_URL_PROD;

const router = createBrowserRouter(routes);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ToastContainer position="top-right" autoClose={3000} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>
);