import { AUTH_STORAGE_KEYS } from "../constans";


export const tokenUtils = {
  getAccessToken: (): string | null => {
    return localStorage.getItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN);
  },

  getRefreshToken: (): string | null => {
    return localStorage.getItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN);
  },

  setAccessToken: (token: string): void => {
    localStorage.setItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN, token);
  },

  setRefreshToken: (token: string): void => {
    localStorage.setItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN, token);
  },

  clearTokens: (): void => {
    localStorage.removeItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN);
  },

  hasTokens: (): boolean => {
    return !!(
      localStorage.getItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN) &&
      localStorage.getItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN)
    );
  },
};