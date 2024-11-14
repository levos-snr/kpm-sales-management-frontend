import axios from 'axios';
import useStore from '../store';

export const getUsers = async (filters = {}) => {
  const queryString = new URLSearchParams(filters).toString();
  const response = await axios.get(`/users${queryString ? `?${queryString}` : ''}`);
  return response.data;
};

export const createUser = async (userData) => {
  const response = await axios.post('/users', userData);
  return response.data;
};

export const updateUser = async (userId, userData) => {
  const response = await axios.patch(`/users/${userId}`, userData);
  return response.data;
};

export const deleteUser = async (userId) => {
  const response = await axios.delete(`/users/${userId}`);
  return response.data;
};

export const getUsersByRole = async (role) => {
  const response = await axios.get(`/users?role=${role}`);
  return response.data;
};

export const getUsersByManager = async (managerId) => {
  const response = await axios.get(`/users?manager_id=${managerId}`);
  return response.data;
};

export const canManageUser = (currentUser, targetUser) => {
  if (!currentUser || !targetUser) return false;

  if (currentUser.role === 'admin') return true;

  if (currentUser.role === 'manager') {
    return targetUser.role === 'sales-rep' && targetUser.manager_id === currentUser.id;
  }

  if (currentUser.role === 'sales-rep') {
    return currentUser.id === targetUser.id;
  }

  return false;
};