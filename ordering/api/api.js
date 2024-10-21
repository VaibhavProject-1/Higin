import axios from 'axios';

// Replace this with your backend API URL
export const API_BASE_URL = 'http://192.168.0.156:5000/api';
export const API_BASED_URL = 'http://192.168.0.156:5000';

// Create an Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Function to set the Authorization header if you have a token
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

// Sign Up request
export const signup = async (name, email, password) => {
  try {
    const response = await api.post('/auth/signup', { name, email, password });
    return response.data;
  } catch (error) {
    throw error.response.data.message || 'Error signing up';
  }
};

// Login request
export const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  } catch (error) {
    throw error.response.data.message || 'Error logging in';
  }
};

export default api;
