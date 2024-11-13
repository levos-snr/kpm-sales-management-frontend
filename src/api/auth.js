import axios from 'axios';

export const loginUser = async (credentials) => {
  const response = await axios.post('/login', credentials);
  return response.data;
};

export const registerUser = async (userData) => {
  const response = await axios.post('/register', userData);
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await axios.get('/me');
  return response.data;
};
