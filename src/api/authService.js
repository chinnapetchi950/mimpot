import apiClient from './apiClient';

export const authService = {
  login: (payload) => {
    // replace with real endpoint; here we simulate by posting
    return apiClient.post('/auth/login', payload).then(res => res).catch(err => { throw err; });
  }
};
