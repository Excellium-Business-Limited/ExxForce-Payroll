// lib/api.ts
import axios from 'axios';
import { getAccessToken, getTenant } from "./auth";

// Get the API URL from environment variables
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth tokens
apiClient.interceptors.request.use(
  (config) => {
    // Get token from localStorage if it exists
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Login function
export const login = async (email: string, password: string) => {
  try {
    const response = await apiClient.post('/api/token/pair', { // Updated endpoint
      email,
      password,
    });
    
    // Log the response for debugging
    console.log('Login response:', response.data);
    
    return response.data;
  } catch (error: any) {
    console.error('Login error:', error);
    
    if (error.response) {
      // Server responded with error status
      throw new Error(error.response.data.detail || error.response.data.message || 'Login failed');
    } else if (error.request) {
      // Network error
      throw new Error('Cannot connect to server. Please check your connection.');
    } else {
      // Other error
      throw new Error('An unexpected error occurred');
    }
  }
};

// 🔽 ADD THIS: Fetch employees from tenant schema
export async function fetchEmployees(tenant: string) {
  const token = getAccessToken();

  if (!token) {
    throw new Error("No access token found");
  }

  const apiUrl = `http://${tenant}.${API_BASE_URL.replace('http://', '').replace('https://', '')}/tenant/employee/list`;

  const res = await axios.get(apiUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data; // Assuming it returns an array of employees
}

// Export the axios instance for other API calls
export default apiClient;