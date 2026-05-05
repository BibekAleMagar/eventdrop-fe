import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import "../global.css";

export default function RootLayout() {
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    const checkFirstLaunch = async () => {
      try {
        const hasLaunched = await AsyncStorage.getItem("hasLaunched");
        if (hasLaunched === null) {
          // It's the first time
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

    // If it's the first launch, redirect to onboarding
    // We check segments to ensure we don't loop the redirect
    const inOnboarding = segments[0] === "onBoarding";

    if (isFirstLaunch && !inOnboarding) {
      router.replace("/onBoarding");
    } else if (!isFirstLaunch && inOnboarding) {
      router.replace("/");
    }
  }, [isFirstLaunch, segments]);

  // Prevent rendering until we know the launch status
  if (isFirstLaunch === null) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="onBoarding" />
    </Stack>
  );
}
