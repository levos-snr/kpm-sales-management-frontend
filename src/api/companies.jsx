import axios from 'axios';

export const fetchCompanies = async () => {
  const response = await axios.get('/companies');
  return response.data;
};
