export const createUser = async (userData) => {
  const response = await axios.post('/users', userData);
  return response.data;
};

export const updateUser = async (userId, userData) => {
  const response = await axios.put(`/users/${userId}`, userData);
  return response.data;
};

export const getUsers = async () => {
  const response = await axios.get('/users');
  return response.data;
};

export const getUser = async (userId) => {
  const response = await axios.get(`/users/${userId}`);
  return response.data;
};

export const deleteUser = async (userId) => {
  const response = await axios.delete(`/users/${userId}`);
  return response.data;
};

export const canManageUser = (user, target) => {
  if (user.role === 'admin') {
    return true;
  }

  if (user.role === 'manager') {
    return user.id === target.manager_id;
  }

  return false;
};

export const fetchUsers = async () => {
  const response = await axios.get('/users');
  return response.data;
};

export const fetchUser = async (userId) => {
  const response = await axios.get(`/users/${userId}`);
  return response.data;
};


