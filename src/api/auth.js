import axios from 'axios';
import useStore from '../store';

// Configure axios defaults
const isDev = import.meta.env.MODE === 'development';
axios.defaults.baseURL = isDev
  ? import.meta.env.VITE_API_BASE_URL_DEV
  : import.meta.env.VITE_API_BASE_URL_PROD;
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
  (error) => Promise.reject(error)
);

// Add axios interceptor to handle token refresh
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const store = useStore.getState();
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = store.refreshToken;
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }
        const response = await axios.post('/auth/refresh', {}, {
          headers: { Authorization: `Bearer ${refreshToken}` },
        });

        const { access_token } = response.data;
        store.setAccessToken(access_token);
        originalRequest.headers.Authorization = `Bearer ${access_token}`;

        return axios(originalRequest);
      } catch (error) {
        store.clearAuth();
        window.location.href = '/login';
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const getCurrentUser = async () => {
  const response = await axios.get('/auth/me');
  return response.data;
};

export const registerAdminManager = async (userData) => {
  const response = await axios.post('/auth/register/admin-manager', userData);
  const { user, access_token, refresh_token } = response.data;

  const store = useStore.getState();
  store.setUser(user);
  store.setAccessToken(access_token);
  store.setRefreshToken(refresh_token);

  return response.data;
};

export const registerSalesRep = async (userData) => {
  const response = await axios.post('/auth/register/sales-rep', userData);
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await axios.post('/auth/login', credentials);
  const { user, access_token, refresh_token } = response.data;

  const store = useStore.getState();
  store.setUser(user);
  store.setAccessToken(access_token);
  store.setRefreshToken(refresh_token);

  return response.data;
};

export const logoutUser = async () => {
  const store = useStore.getState();
  try {
    await axios.post('/auth/logout');
  } finally {
    store.clearAuth();
  }
};

// User Management endpoints
export const getUserList = async () => {
  const response = await axios.get('/users');
  return response.data;
};

export const deleteUser = async (userId) => {
  const response = await axios.delete(`/users/${userId}`);
  return response.data;
};

export const updateUser = async (userId, userData) => {
  const response = await axios.patch(`/users/${userId}`, userData);
  return response.data;
};

// Tasks endpoints
export const getTasks = async () => {
  try {
    const response = await axios.get('/tasks');
    return response;  // Return the entire response to match the expected structure
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
};

export const createTask = async (task) => {
  const response = await axios.post('/tasks', task);
  return response.data;
};

export const updateTask = async (id, task) => {
  const response = await axios.patch(`/tasks/${id}`, task);
  return response.data;
};

export const deleteTask = async (id) => {
  const response = await axios.delete(`/tasks/${id}`);
  return response.data;
};

export default {
  getCurrentUser,
  registerAdminManager,
  registerSalesRep,
  loginUser,
  logoutUser,
  getUserList,
  deleteUser,
  updateUser,
  getTasks,
  createTask,
  updateTask,
  deleteTask
};
