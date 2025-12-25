import apiClient from './apiClient';
import ReactNativeBlobUtil from 'react-native-blob-util';
import { Platform,PermissionsAndroid,Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { BASE_URL } from '../helper/ApiConstant';
export const imageUrl='http://testlink2.pillersofttechnologies.com/storage/'
export const BASE_URL='http://testlink2.pillersofttechnologies.com/api'

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
 home_search: (search) => {
  return apiClient.get(`/user/home_search?search=${search}`);
},
taxlawlist:(pageNumber)=>{
  return apiClient.get(`/user/documents/category/2?type=article&page=${pageNumber}`)
},
taxlawdetail:(id)=>{
  return apiClient.get(`/user/documents/${id}`)
},
newsdetail:(id)=>{
  return apiClient.get(`/user/news/${id}`)
},
bookmarked:()=>{
  return apiClient.get('/user/bookmarks')
},
downloads:()=>{
  return apiClient.get('/user/document_downloads')
},
recent_viewed:()=>{
  return apiClient.get('/user/views/recent')
},
globalsearch_suggestion:(search)=>{
  return apiClient.get(`/user/search_suggestions?query=${search}`)
},
toggleBookmark: async (id) => {
  return await apiClient.post(`/user/bookmarks/toggle/${id}`);
},
news_bookmarks: async (id) => {
  return await apiClient.post(`/user/news_bookmarks/toggle/${id}`);
},
newsBookmarklist:async()=>{
  return await apiClient.get('/user/news_bookmarks')
},
 googleLogin: async(formData) =>{
    return await apiClient.post('/user/auth/google',formData)
 },
 rattingDocument:async(categoryId,formData)=>{
  return await apiClient.post(`/user/documents/${categoryId}/ratings`,formData)
 },
 rattinglist:async(categoryId,pageNo)=>{
  return await apiClient.get(`/user/documents/${categoryId}/ratings?page=${pageNo}`)
},
rattingDelete:async(categoryId,formData)=>{
  return await apiClient.post(`/user/documents/${categoryId}/ratings`,formData)
},
commentList:async(documentId,pageNo)=>{
  return await apiClient.get(`/user/documents/${documentId}/comments?page=${pageNo}`)
},
commentCreate:async(documentId,formData)=>{
  return await apiClient.post(`/user/documents/${documentId}/comments`,formData)
},
commentDelete: async (documentId, commentId,formData) => {
  return await apiClient.post(
    `/user/documents/${documentId}/comments/${commentId}`,formData
  );
}, 
subscribtionList:async()=>{
  return await apiClient.get(`/user/subscriptions`)
},
getSubscriptionDetail:async(id)=>{
  return await apiClient.get(`/user/subscriptions/${id}`)
},
getCurrentSubscription: () => apiClient.get('user/user_subscription/current'),
userSubscription:async(formData)=>{
  return await apiClient.post(`/user/user_subscription/subscribe`,formData)
},
subscriptionCancel:async()=>{
  return await apiClient.post(`/user/user_subscription/cancel`)
},
getmanageSubscription: () => apiClient.get('user/user_subscription/plans'),
subscriptionRenew:async()=>{
  return await apiClient.post(`/user/user_subscription/renew`)
},
forgotPassword:async( data) =>{
   return await apiClient.post('user/forgot-password', data)},


// downloadDocument: async (documentId) => {
//   try {
//     const token = await AsyncStorage.getItem('token');
//     const { fs } = ReactNativeBlobUtil;

//     const appFolder = 'Mimpot';
//     const fileName = `document_${documentId}.pdf`;

//     // 📂 Public Downloads path
//     const dirPath = `/storage/emulated/0/Download/${appFolder}`;
//     const filePath = `${dirPath}/${fileName}`;

//     // ✅ Storage permission
//     if (Platform.OS === 'android' && Platform.Version >= 23) {
//       const granted = await PermissionsAndroid.request(
//         PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
//         {
//           title: 'Storage Permission',
//           message: 'App needs access to your storage to download documents.',
//           buttonPositive: 'Allow',
//           buttonNegative: 'Deny',
//         }
//       );
//       if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
//         return { status: false, error: 'Storage permission denied' };
//       }
//     }

//     // ✅ Create folder if not exists
//     const dirExists = await fs.exists(dirPath);
//     if (!dirExists) {
//       await fs.mkdir(dirPath);
//     }

//     // 🔍 CHECK IF FILE ALREADY EXISTS
//     const fileExists = await fs.exists(filePath);
//     if (fileExists) {
//       return new Promise((resolve) => {
//         Alert.alert(
//           'File already downloaded',
//           'Do you want to download again?',
//           [
//             { text: 'No', style: 'cancel', onPress: () => resolve({ status: false, alreadyDownloaded: true }) },
//             {
//               text: 'Yes',
//               onPress: async () => {
//                 try {
//                   const res = await ReactNativeBlobUtil.config({ fileCache: true })
//                     .fetch('GET', `${BASE_URL}/user/documents/${documentId}/download`, {
//                       Authorization: `Bearer ${token}`,
//                     });

//                   // 🔹 Print API response
//                   const contentType = res.respInfo.headers['Content-Type'] || res.respInfo.headers['content-type'];
//                   if (contentType.includes('application/json')) {
//                     const json = await res.json();
//                     console.log('Download API Response:', json);
//                     resolve({ status: false, message: json.message || 'Download not allowed' });
//                     return;
//                   }

//                   // Save file
//                   const base64Data = await res.base64();
//                   await fs.writeFile(filePath, base64Data, 'base64');

//                   resolve({ status: true, data: { path: filePath, fileName } });
//                 } catch (e) {
//                   resolve({ status: false, error: e });
//                 }
//               },
//             },
//           ]
//         );
//       });
//     }

//     // ⬇️ NORMAL DOWNLOAD (IF FILE NOT EXISTS)
//     const res = await ReactNativeBlobUtil.config({ fileCache: true })
//       .fetch('GET', `${BASE_URL}/user/documents/${documentId}/download`, {
//         Authorization: `Bearer ${token}`,
//       });

//     // 🔹 Print API response
//     const contentType = res.respInfo.headers['Content-Type'] || res.respInfo.headers['content-type'];
//     if (contentType.includes('application/json')) {
//       const json = await res.json();
//       console.log('Download API Response:', json);
//                           Alert.alert('Download Info', json.message || 'Download not allowed');

//       return { status: false, message: json.message || 'Download not allowed' };
//     }

//     // Save file
//     const base64Data = await res.base64();
//     await fs.writeFile(filePath, base64Data, 'base64');

//     return { status: true, data: { path: filePath, fileName } };
//   } catch (error) {
//     console.log('Download Service Error:', error);
//     return { status: false, error };
//   }
// },
downloadDocument: async (documentId) => {
  try {
    const token = await AsyncStorage.getItem("token");
    const { fs, config } = ReactNativeBlobUtil;

    const appFolder = "Mimpot";
    const fileName = `document_${documentId}.pdf`;

    // ✅ SAFE public download directory
    const dirPath = `${fs.dirs.DownloadDir}/${appFolder}`;
    const filePath = `${dirPath}/${fileName}`;

    // ✅ Ensure folder exists
    const dirExists = await fs.exists(dirPath);
    if (!dirExists) {
      await fs.mkdir(dirPath);
    }

    // 🔍 CHECK IF FILE EXISTS
    const fileExists = await fs.exists(filePath);
    if (fileExists) {
      return new Promise((resolve) => {
        Alert.alert(
          "File already downloaded",
          "Do you want to download again?",
          [
            {
              text: "No",
              style: "cancel",
              onPress: () =>
                resolve({
                  status: false,
                  alreadyDownloaded: true,
                  path: filePath,
                }),
            },
            {
              text: "Yes",
              onPress: async () => {
                try {
                  const res = await config({
                    addAndroidDownloads: {
                      useDownloadManager: true,
                      notification: true,
                      path: filePath,
                      title: fileName,
                      mime: "application/pdf",
                      mediaScannable: true,
                    },
                  }).fetch(
                    "GET",
                    `${BASE_URL}/user/documents/${documentId}/download`,
                    {
                      Authorization: `Bearer ${token}`,
                    }
                  );

                  resolve({
                    status: true,
                    data: { path: res.path(), fileName },
                  });
                } catch (e) {
                  resolve({ status: false, error: e });
                }
              },
            },
          ]
        );
      });
    }

    // ⬇️ NORMAL DOWNLOAD (FILE NOT EXISTS)
    const res = await config({
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        path: filePath,
        title: fileName,
        mime: "application/pdf",
        mediaScannable: true,
      },
    }).fetch(
      "GET",
      `${BASE_URL}/user/documents/${documentId}/download`,
      {
        Authorization: `Bearer ${token}`,
      }
    );

    return {
      status: true,
      data: { path: res.path(), fileName },
    };
  } catch (error) {
    console.log("Download Service Error:", error);
    return { status: false, error };
  }
},


// downloadDocument: async (documentId) => {
//   try {
//     const token = await AsyncStorage.getItem('token');
//     const { fs } = ReactNativeBlobUtil;

//     const appFolder = 'Mimpot';
//     const fileName = `document_${documentId}.pdf`;

//     // 📂 Public Downloads path
//     const dirPath = `/storage/emulated/0/Download/${appFolder}`;
//     const filePath = `${dirPath}/${fileName}`;

//     // ✅ Storage permission
//     if (Platform.OS === 'android' && Platform.Version >= 23) {
//       const granted = await PermissionsAndroid.request(
//         PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
//         {
//           title: 'Storage Permission',
//           message: 'App needs access to your storage to download documents.',
//           buttonPositive: 'Allow',
//           buttonNegative: 'Deny',
//         }
//       );

//       if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
//         return { status: false, error: 'Storage permission denied' };
//       }
//     }

//     // ✅ Create folder if not exists
//     const dirExists = await fs.exists(dirPath);
//     if (!dirExists) {
//       await fs.mkdir(dirPath);
//     }

//     // 🔍 CHECK IF FILE ALREADY EXISTS
//     const fileExists = await fs.exists(filePath);

//     if (fileExists) {
//       return new Promise((resolve) => {
//         Alert.alert(
//           'File already downloaded',
//           'Do you want to download again?',
//           [
//             {
//               text: 'No',
//               style: 'cancel',
//               onPress: () =>
//                 resolve({ status: false, alreadyDownloaded: true }),
//             },
//             {
//               text: 'Yes',
//               onPress: async () => {
//                 try {
//                   // 🗑️ Delete old file
//                   //await fs.unlink(filePath);

//                   // ⬇️ Re-download file
//                   await ReactNativeBlobUtil.config({
//                     addAndroidDownloads: {
//                       useDownloadManager: true,
//                       notification: true,
//                       title: fileName,
//                       description: 'Downloading document',
//                       mime: 'application/pdf',
//                       mediaScannable: true,
//                       path: filePath,
//                     },
//                   }).fetch(
//                     'GET',
//                     `${BASE_URL}/user/documents/${documentId}/download`,
//                     {
//                       Authorization: `Bearer ${token}`,
//                     }
//                   );

//                   resolve({
//                     status: true,
//                     data: { path: filePath, fileName },
//                   });
//                 } catch (e) {
//                   resolve({ status: false, error: e });
//                 }
//               },
//             },
//           ]
//         );
//       });
//     }

//     // ⬇️ NORMAL DOWNLOAD (IF FILE NOT EXISTS)
//     await ReactNativeBlobUtil.config({
//       addAndroidDownloads: {
//         useDownloadManager: true,
//         notification: true,
//         title: fileName,
//         description: 'Downloading document',
//         mime: 'application/pdf',
//         mediaScannable: true,
//         path: filePath,
//       },
//     }).fetch(
//       'GET',
//       `${BASE_URL}/user/documents/${documentId}/download`,
//       {
//         Authorization: `Bearer ${token}`,
//       }
//     );

//     return {
//       status: true,
//       data: {
//         path: filePath,
//         fileName,
//       },
//     };
//   } catch (error) {
//     console.log('Download Service Error:', error);
//     return {
//       status: false,
//       error,
//     };
//   }
// },


};
