import axios from 'axios';
// Set up a default config for your Axios requests
const API = axios.create({
  baseURL: 'http://127.0.0.1:4000', // Your backend base URL
  headers: {
    'Content-Type': 'application/json'
  }
});

API.interceptors.request.use(async function (config) {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }, function (error) {
    return Promise.reject(error);
  });

export default API;
