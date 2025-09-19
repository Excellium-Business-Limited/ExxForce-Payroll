// lib/api.ts
import axios from 'axios';
import { getAccessToken, performTokenRefresh } from "./auth";

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
  async (error) => {
    const original = error.config || {};
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      const refreshed = await performTokenRefresh();
      if (refreshed) {
        original.headers = original.headers || {};
        original.headers.Authorization = `Bearer ${refreshed}`;
        return apiClient(original);
      }
      // broadcast expiration; UI should show modal and then redirect
      window.dispatchEvent(new CustomEvent('session:expired'));
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
  const baseURL = `https://${tenant}.exxforce.com`;

  if (!token) {
    throw new Error("No access token found");
  }

  const apiUrl = `${baseURL}/tenant/employee/list`;

  const res = await axios.get(apiUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data; // Assuming it returns an array of employees
}

// ------------------------------
// Employees cache (in-memory + localStorage)
// ------------------------------
type EmployeesCacheEntry = {
  ts: number;
  data: any[];
};

const memEmployeesCache = new Map<string, EmployeesCacheEntry>();
const memInFlight = new Map<string, Promise<any[]>>();

function cacheKeyForEmployees(tenant: string, token?: string) {
  // Include a short token suffix to avoid cross-user cache collisions in the same tenant
  const tkn = token || getAccessToken() || '';
  const suffix = tkn ? ':' + (tkn.slice(0, 8) || 'anon') : ':anon';
  return `employees:${tenant}${suffix}`;
}

export function invalidateEmployeesCache(tenant: string) {
  const key = cacheKeyForEmployees(tenant);
  memEmployeesCache.delete(key);
  try {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(key);
    }
  } catch {}
}

export function peekEmployeesCache(tenant: string, ttlMs = 60_000): any[] | null {
  const key = cacheKeyForEmployees(tenant);
  const now = Date.now();

  // Check memory first
  const mem = memEmployeesCache.get(key);
  if (mem && now - mem.ts < ttlMs) return mem.data;

  // Fallback to localStorage
  try {
    if (typeof window !== 'undefined') {
      const raw = localStorage.getItem(key);
      if (raw) {
        const entry = JSON.parse(raw) as EmployeesCacheEntry;
        if (entry && now - entry.ts < ttlMs) {
          memEmployeesCache.set(key, entry);
          return entry.data;
        }
      }
    }
  } catch {}
  return null;
}

export async function fetchEmployeesCached(
  tenant: string,
  opts?: { ttlMs?: number; force?: boolean }
): Promise<any[]> {
  const ttlMs = opts?.ttlMs ?? 60_000; // default 60s
  const force = opts?.force ?? false;
  const token = getAccessToken() || undefined;
  const key = cacheKeyForEmployees(tenant, token);
  const now = Date.now();

  // Return memory cache if fresh and not forcing
  const mem = memEmployeesCache.get(key);
  if (!force && mem && now - mem.ts < ttlMs) return mem.data;

  // Return localStorage cache if fresh and not forcing
  if (!force) {
    try {
      if (typeof window !== 'undefined') {
        const raw = localStorage.getItem(key);
        if (raw) {
          const entry = JSON.parse(raw) as EmployeesCacheEntry;
          if (entry && now - entry.ts < ttlMs) {
            memEmployeesCache.set(key, entry);
            return entry.data;
          }
        }
      }
    } catch {}
  }

  // Deduplicate in-flight network requests
  const existing = memInFlight.get(key);
  if (existing) return existing;

  const promise = (async () => {
    const data = await fetchEmployees(tenant);
    const entry: EmployeesCacheEntry = { ts: Date.now(), data };
    memEmployeesCache.set(key, entry);
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(key, JSON.stringify(entry));
      }
    } catch {}
    return data;
  })();

  memInFlight.set(key, promise);
  try {
    const data = await promise;
    return data;
  } finally {
    memInFlight.delete(key);
  }
}

// Export the axios instance for other API calls
export default apiClient;