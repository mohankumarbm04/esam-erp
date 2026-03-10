// src/utils/axiosConfig.js
import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Simple in-memory cache for common GETs
const cache = new Map();
const CACHE_TTL_MS = 60 * 1000; // 1 minute

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Attach retry + backoff metadata
    if (!config.__retryCount) {
      config.__retryCount = 0;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor for caching, retry, and auth handling
api.interceptors.response.use(
  (response) => {
    const { config, data, status } = response;

    // Cache only successful GETs for specific endpoints
    if (config.method === "get" && status === 200) {
      const url = config.url || "";
      if (
        url.startsWith("/dashboard/stats") ||
        url.startsWith("/admin/departments") ||
        url.startsWith("/subjects")
      ) {
        cache.set(url + JSON.stringify(config.params || {}), {
          data,
          timestamp: Date.now(),
        });
      }
    }

    return response;
  },
  async (error) => {
    const { config, response, message } = error;

    // Handle unauthorized globally
    if (response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
      window.location.href = "/login";
      return Promise.reject(error);
    }

    // Retry logic for network / 5xx errors (idempotent requests only)
    const shouldRetry =
      (!response && message === "Network Error") ||
      (response && response.status >= 500 && response.status < 600);

    if (shouldRetry && config && config.method !== "post") {
      const maxRetries = 2;
      config.__retryCount = config.__retryCount || 0;

      if (config.__retryCount < maxRetries) {
        config.__retryCount += 1;
        const delay =
          500 * Math.pow(2, config.__retryCount - 1); // 500ms, 1000ms
        await new Promise((res) => setTimeout(res, delay));
        return api(config);
      }
    }

    return Promise.reject(error);
  },
);

// Helper GET with cache support for components to use when needed
export async function getWithCache(url, params) {
  const key = url + JSON.stringify(params || {});
  const entry = cache.get(key);
  if (entry && Date.now() - entry.timestamp < CACHE_TTL_MS) {
    return { data: entry.data, fromCache: true };
  }
  const res = await api.get(url, { params });
  return { data: res.data, fromCache: false };
}

export default api;
