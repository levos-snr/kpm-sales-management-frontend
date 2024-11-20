import axios from 'axios';

const isDev = import.meta.env.MODE === 'development';
axios.defaults.baseURL = isDev
  ? import.meta.env.VITE_API_BASE_URL_DEV
  : import.meta.env.VITE_API_BASE_URL_PROD;
axios.defaults.headers.common['Content-Type'] = 'application/json';


export const getProducts = async () => {
  const response = await axios.get('/products');
  return response.data;
};

export const getProduct = async (id) => {
  const response = await axios.get(`/products/${id}`);
  return response.data;
};

export const createProduct = async (product) => {
  const response = await axios.post('/products', product);
  return response.data;
};

export const updateProduct = async (id, product) => {
  const response = await axios.patch(`/products/${id}`, product);
  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await axios.delete(`/products/${id}`);
  return response.data;
};


