import axios from 'axios';
import useStore from '../store';

// Configure axios defaults
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Add axios interceptor to add token to requests
axios.interceptors.request.use(
  (config) => {
    const accessToken = useStore.getState().accessToken;
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add axios interceptor to handle token refresh
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = useStore.getState().refreshToken;
        const response = await axios.post('/auth/refresh', {}, {
          headers: { Authorization: `Bearer ${refreshToken}` }
        });
        const { access_token } = response.data;
        useStore.getState().setAccessToken(access_token);
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return axios(originalRequest);
      } catch (error) {
        useStore.getState().clearAuth();
        window.location.href = '/login';
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export const loginUser = async (credentials) => {
  const response = await axios.post('/auth/login', credentials);
  const { user, access_token, refresh_token } = response.data;
  useStore.getState().setUser(user);
  useStore.getState().setAccessToken(access_token);
  useStore.getState().setRefreshToken(refresh_token);
  return response.data;
};

export const registerUser = async (userData) => {
  const response = await axios.post('/auth/register', userData);
  const { user, access_token, refresh_token } = response.data;
  useStore.getState().setUser(user);
  useStore.getState().setAccessToken(access_token);
  useStore.getState().setRefreshToken(refresh_token);
  return response.data;
};

export const logoutUser = async () => {
  try {
    await axios.post('/auth/logout');
    useStore.getState().clearAuth();
  } catch (error) {
    console.error('Logout error:', error);
    // Force clear auth even if logout fails
    useStore.getState().clearAuth();
  }
};

export const getCurrentUser = async () => {
  const response = await axios.get('/auth/profile');
  return response.data.user;
};

export const updateProfile = async (userData) => {
  const response = await axios.put('/auth/profile', userData);
  useStore.getState().setUser(response.data.user);
  return response.data;
};

export const changePassword = async (passwordData) => {
  const response = await axios.post('/auth/change-password', passwordData);
  return response.data;
};

export const registerCompany = async (companyData) => {
  const response = await axios.post('/companies', companyData);
  return response.data;
};