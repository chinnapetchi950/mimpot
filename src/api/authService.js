import apiClient from './apiClient';

export const authService = {
  login: (payload) => {
    return apiClient.post('/user/login', payload);
  },

  register: (payload) => {
    return apiClient.post('/user/register', payload);
  },
  home: () => {
    return apiClient.get('/user/home');
  },
   getprofile: () => {
    return apiClient.get('/user/profile');
  },
  logout:()=>{
    return apiClient.post('/user/logout');
  },
  delete_account:(payload)=>{
    return apiClient.post('/user/delete-account',payload);
  },
  update_profile:(payload)=>{
    return apiClient.post('/user/profile/update',payload);
  },
sendTicket: (payload) => apiClient.post(`/user/tickets`, payload),
getTicket:()=>{
    return apiClient.get('/user/tickets');
  },
  aboutUs:()=>{
    return apiClient.get('/user/page/about-us');
  },
  terms:()=>{
    return apiClient.get('/user/page/terms-conditions');
  },
  privacy:()=>{
    return apiClient.get('/user/page/privacy-policy');
  },
  changepassword:(payload) => apiClient.post(`/user/change-password`, payload),
  updateTicketStatus: async (ticketId, payload) => {
  return apiClient.post(`/user/tickets/${ticketId}/update_status`, payload);
},
getDocumentsByCategory: (categoryId, type,page) => {
  console.log("videodetail------------------->params",categoryId,type,page);
  
  return apiClient.get(`/user/documents/category/${categoryId}?type=${type}&page=${page}`)
},
getDocumentsList: (page = 1, type = "video") => {
  return apiClient.get(`/user/documents?page=${page}&type=${type}`);
},
getNewsList: (page = 1) => {
  return apiClient.get(`/user/news?type=all&page=${page}`);
},
getLegalCategories: (page = 1) => {
  return apiClient.get(`/user/legal-categories?page=${page}`);
},
getDocumentById: (id) => {
  return apiClient.get(`/user/documents/${id}`);
},
getDocumentsByCategory_explore:(categoryId,page,per_page,search) => {
  
  return apiClient.get(`/user/documents/category/${categoryId}?search=${search}&page=${page}&per_page${per_page}`)
},
getUserStatistics: () => {
  return apiClient.get("/user/statistics");
},


};
