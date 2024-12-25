import axios, { AxiosError, AxiosRequestConfig } from 'axios';
// import { BACKEND_URL } from '../constans';
import { tokenUtils } from '../until';

// Define extended request config type
interface ExtendedAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

const NEXT_PUBLIC_BACKEND_URL= "https://dehype.api.openverse.tech/api/v1"


const axiosInstance = axios.create({
  baseURL: NEXT_PUBLIC_BACKEND_URL,
  headers: {
    Accept: '*/*',
  },
  timeout: 5000,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const isPublic = (config as any).isPublic || false;

    if (!isPublic) {
      const token = tokenUtils.getAccessToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    if (config.data instanceof FormData) {
      config.headers['Content-Type'] = 'multipart/form-data';
    } else {
      config.headers['Content-Type'] = 'application/json';
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(
      new Error(error.message || 'An error occurred during the request')
    );
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as ExtendedAxiosRequestConfig;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = tokenUtils.getRefreshToken();
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        const response = await axios.get(`${NEXT_PUBLIC_BACKEND_URL}/auth/refresh`, {
          headers: {
            Authorization: `Bearer ${refreshToken}`,
          },
        });

        const { access_token } = response.data;
        tokenUtils.setAccessToken(access_token);

        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        tokenUtils.clearTokens();
        if (refreshError instanceof Error) {
          return Promise.reject(refreshError);
        }
        return Promise.reject(
          new Error('Failed to refresh token: ' + (refreshError)?.message || 'Unknown error')
        );
      }
    }

    const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
    return Promise.reject(new Error(errorMessage));
  }
);

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export default axiosInstance;