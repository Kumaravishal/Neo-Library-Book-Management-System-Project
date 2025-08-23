import axios from "axios";

const API_URL = "http://localhost:8080/api";

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`🔄 API Call: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('❌ API Response Error:', error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

// ✅ Login a user
export const loginUser = async (credentials) => {
  try {
    console.log('🔐 Login attempt:', credentials);
    
    const response = await api.post('/users/login', credentials);
    
    // Store user data in localStorage
    if (response.data.success && response.data.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('role', credentials.role);
      localStorage.setItem('isAuthenticated', 'true');
    }
    
    return response;
  } catch (error) {
    console.error('❌ Login API Error:', error);
    throw error.response?.data || { message: "Login failed. Please check your credentials." };
  }
};

// ✅ Register a new user - UPDATED to check response format
export const registerUser = async (userData) => {
  try {
    console.log('📝 Register attempt:', userData);
    
    const response = await api.post('/users/register', userData);
    
    // Check if registration was successful
    if (response.data && response.data.success) {
      return response.data;
    } else {
      throw new Error(response.data?.message || "Registration failed");
    }
  } catch (error) {
    console.error('❌ Register API Error:', error);
    throw error.response?.data || { message: "Registration failed" };
  }
};

// ✅ Get all users - FIXED method
export const getAllUsers = async () => {
  try {
    const response = await api.get('/users/getAll');
    return response.data;
  } catch (error) {
    console.error('❌ Get Users API Error:', error);
    throw error.response?.data || { message: "Failed to fetch users" };
  }
};

// Test endpoints
export const testConnection = async () => {
  try {
    const response = await api.get('/users/test');
    return response.data;
  } catch (error) {
    throw new Error('Backend server is not reachable');
  }
};