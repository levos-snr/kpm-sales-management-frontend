import axios from 'axios';
import useStore from '../store';

export const loginUser = async (credentials) => {
  const response = await axios.post('/login', credentials);
  const { user, access_token, refresh_token } = response.data;
  useStore.getState().setUser(user);
  useStore.getState().setAccessToken(access_token);
  useStore.getState().setRefreshToken(refresh_token);
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