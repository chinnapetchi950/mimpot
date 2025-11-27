import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://testlink2.pillersofttechnologies.com/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
});
export default apiClient;
