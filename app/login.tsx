import React, { useState } from "react";
import { View, Text, ActivityIndicator, Alert, StatusBar } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import {
  GoogleSignin,
  statusCodes,
  GoogleSigninButton,
} from "@react-native-google-signin/google-signin";
import { useAuth } from "@/src/context/AuthContext";
import { useRouter } from "expo-router";
import { apiClient } from "@/src/api/apiClient";
import { MapPin, Compass, Users, Bell } from "lucide-react-native";

const WEB_CLIENT_ID = process.env.EXPO_PUBLIC_WEB_CLIENT_ID;

GoogleSignin.configure({
  webClientId: WEB_CLIENT_ID,
  offlineAccess: true,
  scopes: ["profile", "email"],
});

export default function LoginScreen() {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();

      const idToken = response.data?.idToken;
      if (!idToken) throw new Error("No ID Token received from Google");

      const data = await apiClient.post("/auth/google/token", { idToken });

      await login(data.data.accessToken, data.data.user);
      router.replace("/");
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log("User cancelled");
      } else {
        Alert.alert("Error", error?.message ?? "Something went wrong");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    { icon: Compass, label: "Explore nearby" },
    { icon: Users, label: "Meet locals" },
    { icon: Bell, label: "Get notified" },
  ];

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <View className="absolute top-0 right-0 w-64 h-64 rounded-full bg-indigo-100 -translate-y-16 translate-x-16" />
      <View className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-indigo-50 translate-y-10 -translate-x-10" />

      <View className="flex-1 justify-center px-6 gap-y-8">
        <View className="items-center gap-y-4">
          <View className="w-20 h-20 rounded-full border border-indigo-100 bg-white items-center justify-center">
            <View className="w-14 h-14 rounded-full bg-indigo-50 items-center justify-center">
              <MapPin size={32} color="#6366f1" />
            </View>
          </View>
          <Text className="text-slate-900 text-4xl font-bold tracking-tight">
            EventDrop
          </Text>
          <Text className="text-slate-400 text-base text-center leading-6">
            Discover events happening{"\n"}right around you
          </Text>
        </View>

        {/* features */}
        <View className="flex-row gap-x-3">
          {features.map(({ icon: Icon, label }) => (
            <View
              key={label}
              className="flex-1 items-center gap-y-2 bg-white rounded-2xl py-4 border border-slate-100"
            >
              <View className="w-10 h-10 rounded-full bg-indigo-50 items-center justify-center">
                <Icon size={18} color="#6366f1" />
              </View>
              <Text className="text-slate-500 text-xs text-center">
                {label}
              </Text>
            </View>
          ))}
        </View>

        {/* card */}
        <View className="bg-white rounded-3xl p-6 border border-slate-100 gap-y-4">
          <Text className="text-slate-900 text-xl font-semibold">Welcome</Text>
          <Text className="text-slate-400 text-sm leading-5">
            Sign in to start discovering events near you
          </Text>

          {isLoading ? (
            <View className="items-center py-3">
              <ActivityIndicator color="#6366f1" />
            </View>
          ) : (
            <View className="items-center">
              <GoogleSigninButton
                size={GoogleSigninButton.Size.Wide}
                color={GoogleSigninButton.Color.Light}
                onPress={handleGoogleSignIn}
                disabled={isLoading}
              />
            </View>
          )}

          <Text className="text-slate-400 text-xs text-center leading-5">
            By continuing you agree to our{" "}
            <Text className="text-indigo-500">Terms</Text> &{" "}
            <Text className="text-indigo-500">Privacy Policy</Text>
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
