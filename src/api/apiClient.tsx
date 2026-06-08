import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";

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
  (response) => response.data,
  async (error) => {
    if (!error.response) {
      Toast.show({
        type: "error",
        text1: "Network Error",
        text2: "Check your connection and try again.",
      });
      return Promise.reject("Network error");
    }

    const status = error.response.status;
    const raw = error.response.data?.message;
    const message = Array.isArray(raw)
      ? raw.join(", ")
      : raw || "Something went wrong";

    if (status === 400) {
      Toast.show({
        type: "error",
        text1: message,
      });
    } else {
      Toast.show({
        type: "error",
        text1: getTitle(status),
        text2: message,
      });
    }

    return Promise.reject(message);
  },
);

const getTitle = (status: number): string => {
  switch (status) {
    case 401:
      return "Session Expired";
    case 403:
      return "Access Denied";
    case 404:
      return "Not Found";
    case 500:
      return "Server Error";
    default:
      return "Error";
  }
};
