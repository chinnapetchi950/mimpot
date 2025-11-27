import apiClient from './apiClient';

export const authService = {
  login: (payload) => {
    return apiClient.post('/user/login', payload);
  },

  register: (payload) => {
    return apiClient.post('/user/register', payload);
  }
};
