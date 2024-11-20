import axios from 'axios';

const isDev = import.meta.env.MODE === 'development';
axios.defaults.baseURL = isDev
  ? import.meta.env.VITE_API_BASE_URL_DEV
  : import.meta.env.VITE_API_BASE_URL_PROD;
axios.defaults.headers.common['Content-Type'] = 'application/json';

export const getTasks = async () => {
  const response = await axios.get('/tasks');
  return response.data;
};

export const getTask = async (id) => {
  const response = await axios.get(`/tasks/${id}`);
  return response.data;
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
