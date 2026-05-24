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
    // No response = network-level failure (wrong IP, no internet, timeout)
    if (!error.response) {
      console.log("❌ Network Error:", error.message);
      console.log(
        "❌ Tried to reach:",
        error.config?.baseURL,
        error.config?.url,
      );
      return Promise.reject("Network error - check your API URL or connection");
    }

    console.log("❌ Status:", error.response.status);
    console.log("❌ Body:", JSON.stringify(error.response.data, null, 2));

    const message = error.response.data?.message || "Something went wrong";

    if (error.response.status === 401) {
      AsyncStorage.removeItem("access_token");
    }

    return Promise.reject(message);
  },
);
