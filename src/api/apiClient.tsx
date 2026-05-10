import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },

  (error) => {
    const message = error.response.data.message || "Something went wrong";

    if (error.response.status === 401) {
      AsyncStorage.removeItem("access_token");
    }

    return Promise.reject(message);
  },
);
