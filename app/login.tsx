import React, { useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from "react-native";
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { useAuth } from "@/src/context/AuthContext";
import { useRouter } from "expo-router";
import { apiClient } from "@/src/api/apiClient";
import {
  ShieldCheck,
  X,
  HardDrive,
  Share2,
  BarChart3,
  CheckCircle2,
} from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_WEB_CLIENT_ID,
  forceCodeForRefreshToken: true,
  offlineAccess: true,
  scopes: ["profile", "email", "https://www.googleapis.com/auth/drive.file"],
});

export default function LoginScreen() {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      // 💡 1. Force clear everything cached by the Google SDK on the phone
      try {
        // await GoogleSignin.revokeAccess(); // 👈 This forces Google to forget this device's session
        await GoogleSignin.signOut();
      } catch (e) {
        // Ignore errors if the user wasn't signed in yet
      }

      await GoogleSignin.hasPlayServices();

      // 💡 2. Trigger the fresh sign-in prompt
      const response = await GoogleSignin.signIn();

      const idToken = response.data?.idToken;
      const serverAuthCode = response.data?.serverAuthCode;

      if (!idToken || !serverAuthCode) {
        throw new Error("Missing structural tokens from Google");
      }

      // 💡 3. Post to backend
      const res = await apiClient.post("/auth/google/token", {
        idToken,
        serverAuthCode,
      });

      await login(res.data.accessToken, res.data.user);
      router.replace("/(tabs)");
    } catch (error: any) {
      if (error.code !== statusCodes.SIGN_IN_CANCELLED) {
        Alert.alert("Error", error?.message ?? "Something went wrong");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const perks = [
    { icon: HardDrive, text: "Save directly to your Google Drive" },
    { icon: Share2, text: "Create unique shareable event IDs" },
    { icon: BarChart3, text: "Manage and moderate all uploads" },
  ];

  return (
    <View
      className="bg-slate-50 flex-1 px-8"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      {/* Decorative Background Elements */}
      <View className="absolute -top-20 -right-20 w-64 h-64 bg-primary/5 rounded-full" />
      <View className="absolute top-1/2 -left-20 w-40 h-40 bg-indigo-500/5 rounded-full" />

      {/* Close Button */}
      <TouchableOpacity
        onPress={() => router.back()}
        className="absolute left-8 w-10 h-10 bg-white border border-slate-200 rounded-full items-center justify-center z-10"
        style={{ top: insets.top + 10 }}
      >
        <X size={20} color="#64748b" />
      </TouchableOpacity>

      <View className="flex-1 justify-center">
        {/* Header Section */}
        <View className="items-center mb-12">
          <View className="w-24 h-24 rounded-[32px] bg-primary items-center justify-center mb-6 shadow-xl shadow-indigo-500/40">
            <ShieldCheck size={48} color="white" strokeWidth={1.5} />
          </View>
          <Text className="text-slate-900 text-4xl font-bold tracking-tight mb-2">
            Host Access
          </Text>
          <Text className="text-slate-500 text-base text-center leading-6 px-6">
            Become a host to start collecting high-quality photos from your
            guests.
          </Text>
        </View>

        {/* Feature List (The "Content" that fills the space) */}
        <View className="bg-white border border-slate-100 rounded-3xl p-6 mb-10 shadow-sm">
          <Text className="text-slate-400 text-[10px] font-bold uppercase tracking-[2px] mb-4">
            Host Privileges
          </Text>
          {perks.map((perk, index) => (
            <View
              key={index}
              className={`flex-row items-center py-3 ${index !== perks.length - 1 ? "border-b border-slate-50" : ""}`}
            >
              <View className="w-8 h-8 rounded-full bg-indigo-50 items-center justify-center mr-4">
                <perk.icon size={16} color="#6366f1" />
              </View>
              <Text className="text-slate-700 font-medium flex-1">
                {perk.text}
              </Text>
              <CheckCircle2 size={16} color="#10b981" />
            </View>
          ))}
        </View>

        {/* Action Section */}
        <View className="items-center">
          {isLoading ? (
            <View className="h-[58px] justify-center">
              <ActivityIndicator size="large" color="#6366f1" />
            </View>
          ) : (
            <View className="w-full shadow-md shadow-black/5">
              <GoogleSigninButton
                style={{ width: "100%", height: 58 }}
                size={GoogleSigninButton.Size.Wide}
                color={GoogleSigninButton.Color.Light}
                onPress={handleGoogleSignIn}
                disabled={isLoading}
              />
            </View>
          )}
          <Text className="text-slate-400 text-[11px] text-center mt-6 leading-4">
            By signing in, you agree to our{"\n"}
            <Text className="text-primary font-semibold">
              Terms of Service
            </Text>{" "}
            and{" "}
            <Text className="text-primary font-semibold">Privacy Policy</Text>
          </Text>
        </View>
      </View>
    </View>
  );
}
