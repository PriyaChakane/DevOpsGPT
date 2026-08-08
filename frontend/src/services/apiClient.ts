import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';

/**
 * Central Axios instance for all future Flask REST API calls.
 * Every service module in this folder should import `apiClient` rather than
 * calling axios directly, so auth headers, timeouts, and error handling
 * stay consistent once the real backend is wired up.
 */
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- Request interceptor -----------------------------------------------
// TODO(flask-integration): once JWT auth is implemented on the backend,
// attach the bearer token stored by AuthContext to every outgoing request.
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('devopsgpt_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --- Response interceptor -----------------------------------------------
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    const message =
      error.response?.data?.message ??
      error.message ??
      'Something went wrong while talking to the server.';

    // TODO(flask-integration): handle 401s globally by clearing auth state
    // and redirecting to /login once the real backend returns them.

    return Promise.reject({
      message,
      status: error.response?.status,
      code: error.code,
    });
  }
);
