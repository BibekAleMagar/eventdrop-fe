import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import "../global.css";
import { QueryProvider } from "@/src/context/QueryClient";
import { AuthProvider } from "@/src/context/AuthContext";

export default function RootLayout() {
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkFirstLaunch = async () => {
      try {
        if (__DEV__) {
          await AsyncStorage.clear();
          setIsFirstLaunch(true);
          return;
        }

        const hasLaunched = await AsyncStorage.getItem("hasLaunched");
        if (hasLaunched === null) {
          await AsyncStorage.setItem("hasLaunched", "true");
          setIsFirstLaunch(true);
        } else {
          setIsFirstLaunch(false);
        }
      } catch (error) {
        setIsFirstLaunch(false);
      }
    };

    checkFirstLaunch();
  }, []);

  useEffect(() => {
    if (isFirstLaunch === null) return;
    if (isFirstLaunch) {
      router.replace("/onBoarding");
    } else {
      router.replace("/");
    }
  }, [isFirstLaunch]);

  if (isFirstLaunch === null) return null;

  return (
    <QueryProvider>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="onBoarding" />
          <Stack.Screen name="index" />
          <Stack.Screen
            name="login"
            options={{
              presentation: "modal",
              animation: "slide_from_bottom",
            }}
          />
        </Stack>
      </AuthProvider>
    </QueryProvider>
  );
}
