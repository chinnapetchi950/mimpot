import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://example.com/api',
  timeout: 10000,
  headers: {'Content-Type':'application/json'}
});

export default apiClient;
