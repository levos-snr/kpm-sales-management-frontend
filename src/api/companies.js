export const fetchCompanies = async (companyId) => {
  const response = await axios.get(`/companies/${companyId}`);
  return response.data;
};