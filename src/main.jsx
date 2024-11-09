import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import axios from 'axios';
import './index.css';

import routes from './routes'; 

// Set axios default baseURL based on the environment
const isDev = import.meta.env.MODE === 'development';
axios.defaults.baseURL = isDev 
  ? import.meta.env.VITE_API_BASE_URL_DEV 
  : import.meta.env.VITE_API_BASE_URL_PROD;


// Create the router using createBrowserRouter
const router = createBrowserRouter(routes);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);