
import axios, { AxiosRequestConfig } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const api = axios.create({
  // baseURL: "https://dehype.api.dehype.fun/api/v1", // Thay bằng baseURL API của bạn
  baseURL: "https://dehype.api.openverse.tech/api/v1", // Thay bằng baseURL API của bạn
});

const getAccessToken = async () => {
  const tmp = await AsyncStorage.getItem("accessToken");
  console.log("access token in device : ",tmp) ;
  return tmp ;
};

const getRefreshToken = async () => {
  return await AsyncStorage.getItem("refreshToken");
};

const setAccessToken = async (token: string) => {
  await AsyncStorage.setItem("accessToken", token);
};

api.interceptors.request.use(
  async (config) => {
    const isPublic = (config as any).isPublic || false;

    if (!isPublic) {
      const token = await getAccessToken();
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    }

    if (config.data instanceof FormData) {
      config.headers["Content-Type"] = "multipart/form-data";
    } else {
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => {
    console.error(
      `Error: ${error.response.status} - ${error.response.data?.message}`
    );
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    console.log(error.response.data?.message);
    if (error.response) {
      if (
        error.response.status === 401 &&
        error.response.data?.message === "Invalid access token" &&
        !originalRequest._retry
      ) {
        originalRequest._retry = true;
        const refreshToken = await getRefreshToken();
        console.log(`get new access token`);
        try {
          const response = await axios.get(
            "https://dehype.api.dehype.fun/api/v1/auth/refresh/",
            {
              headers: {
                Authorization: `Bearer ${refreshToken}`,
              },
            }
          );

          const newAccessToken = response.data?.access_token;
          await setAccessToken(newAccessToken);

          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        } catch (error: any) {
          console.error(
            `Error: ${error.response.status} - ${error.response.data?.message}`
          );
        }
      }
    } else {
      console.error("Network error or server not reachable");
    }
    console.error(
      `Error: ${error.response.status} - ${error.response.data?.message}`
    );
  }
);

export default api;
