import { useLocalSearchParams } from "expo-router";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  StatusBar,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Event } from "@/src/types/Event";
import { CameraView, Camera } from "expo-camera";
import { useState, useRef } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function PublicEventScreen() {
  const insets = useSafeAreaInsets();
  const { code, eventData } = useLocalSearchParams<{
    code: string;
    eventData: string;
  }>();

  const [cameraPermission, setCameraPermission] = useState<boolean | null>(
    null,
  );
  const [showCamera, setShowCamera] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const cameraRef = useRef<CameraView>(null);

  const event: Event = eventData ? JSON.parse(eventData) : null;

  const handleCameraPress = async () => {
    if (cameraPermission === true) {
      setShowCamera(true);
      return;
    }
    const { status } = await Camera.requestCameraPermissionsAsync();
    if (status === "granted") {
      setCameraPermission(true);
      setShowCamera(true);
    } else {
      setCameraPermission(false);
      Alert.alert(
        "Permission Required",
        "Camera access is needed to scan QR codes or take event photos.",
        [{ text: "OK" }],
      );
    }
  };

  const handleCapture = async () => {
    if (!cameraRef.current) return;
    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.8 });
      setCapturedPhoto(photo?.uri ?? null);
      setShowCamera(false);
    } catch {
      Alert.alert("Error", "Failed to capture photo. Please try again.");
    }
  };

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  // ── Camera View ──────────────────────────────────────────────────────────────
  if (showCamera) {
    return (
      <View style={styles.cameraContainer}>
        <StatusBar barStyle="light-content" />

        {/* Explicit pixel dimensions fix the black screen */}
        <CameraView ref={cameraRef} facing="back" style={styles.camera} />

        {/* Overlay — sibling, not child */}
        <View style={StyleSheet.absoluteFill}>
          {/* Top Bar */}
          <View
            style={{ paddingTop: insets.top + 8 }}
            className="flex-row items-center justify-between px-5"
          >
            <TouchableOpacity
              onPress={() => setShowCamera(false)}
              className="w-10 h-10 rounded-full bg-black/50 items-center justify-center"
            >
              <Text className="text-white text-lg font-bold">✕</Text>
            </TouchableOpacity>

            <View className="bg-black/50 rounded-full px-4 py-1.5">
              <Text className="text-white text-xs font-semibold tracking-widest uppercase">
                {event?.name ?? "Event"}
              </Text>
            </View>

            <View className="w-10" />
          </View>

          {/* Shutter */}
          <View
            className="absolute left-0 right-0 items-center"
            style={{ bottom: insets.bottom + 24 }}
          >
            <TouchableOpacity
              onPress={handleCapture}
              activeOpacity={0.8}
              className="w-20 h-20 rounded-full border-4 border-white items-center justify-center"
            >
              <View className="w-14 h-14 rounded-full bg-white" />
            </TouchableOpacity>
            <Text className="text-white/60 text-xs mt-3 tracking-widest uppercase">
              Tap to capture
            </Text>
          </View>
        </View>
      </View>
    );
  }

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (!event) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-900">
        <View className="w-12 h-12 rounded-full bg-violet-500 opacity-70 mb-4" />
        <Text className="text-violet-300 text-base tracking-wide">
          Fetching event details...
        </Text>
      </View>
    );
  }

  // ── Main Screen ──────────────────────────────────────────────────────────────
  return (
    <View className="flex-1 bg-slate-100">
      <StatusBar barStyle="light-content" />

      {/* Hero Header */}
      <View
        className="bg-slate-900 pb-6 px-6"
        style={{ paddingTop: insets.top }}
      >
        <View className="flex-row items-center self-start bg-violet-500/20 border border-violet-400/30 rounded-full px-3 py-1 mb-3">
          <Text className="text-violet-400 text-xs font-bold tracking-widest mr-2">
            EVENT CODE
          </Text>
          <Text className="text-violet-100 text-sm font-bold tracking-wide">
            {code}
          </Text>
        </View>
        <Text className="text-white text-3xl font-extrabold leading-tight tracking-tight">
          {event.name}
        </Text>
        <View className="mt-5 h-px bg-violet-500/20" />
      </View>

      {/* Details Card */}
      <ScrollView
        className="flex-1"
        contentContainerClassName="p-5"
        showsVerticalScrollIndicator={false}
      >
        {capturedPhoto && (
          <TouchableOpacity
            onPress={() => setShowCamera(true)}
            className="mb-4 rounded-2xl overflow-hidden h-48 bg-slate-800 items-center justify-center border-2 border-violet-400"
          >
            <Text className="text-white text-sm font-semibold">
              📸 Photo captured — tap to retake
            </Text>
          </TouchableOpacity>
        )}

        <View className="bg-white rounded-2xl overflow-hidden shadow-sm shadow-violet-200">
          <View className="flex-row items-center gap-3 px-5 py-4">
            <Text className="text-2xl w-8 text-center">📅</Text>
            <View className="flex-1">
              <Text className="text-gray-400 text-xs font-semibold tracking-widest uppercase mb-0.5">
                Starts
              </Text>
              <Text className="text-slate-800 text-base font-semibold">
                {formatDate(event.startingDate)}
              </Text>
            </View>
          </View>

          <View className="h-px bg-violet-50 ml-14" />

          <View className="flex-row items-center gap-3 px-5 py-4">
            <Text className="text-2xl w-8 text-center">🏁</Text>
            <View className="flex-1">
              <Text className="text-gray-400 text-xs font-semibold tracking-widest uppercase mb-0.5">
                Ends
              </Text>
              <Text className="text-slate-800 text-base font-semibold">
                {formatDate(event.endingDate)}
              </Text>
            </View>
          </View>

          <View className="h-px bg-violet-50 ml-14" />

          <View className="flex-row items-center gap-3 px-5 py-4">
            <Text className="text-2xl w-8 text-center">👤</Text>
            <View className="flex-1">
              <Text className="text-gray-400 text-xs font-semibold tracking-widest uppercase mb-0.5">
                Host ID
              </Text>
              <Text className="text-violet-600 text-sm font-semibold font-mono">
                {event.hostId ?? "—"}
              </Text>
            </View>
          </View>

          {event.description && (
            <>
              <View className="h-px bg-violet-50 ml-14" />
              <View className="px-5 py-4">
                <Text className="text-gray-400 text-xs font-semibold tracking-widest uppercase mb-2">
                  About this event
                </Text>
                <Text className="text-gray-600 text-base leading-relaxed">
                  {event.description}
                </Text>
              </View>
            </>
          )}
        </View>

        <View className="h-28" />
      </ScrollView>

      {/* Floating Camera Button */}
      <View
        className="absolute self-center items-center"
        style={{ bottom: insets.bottom + 24 }}
      >
        <TouchableOpacity
          onPress={handleCameraPress}
          activeOpacity={0.85}
          className="w-16 h-16 rounded-full bg-violet-600 items-center justify-center shadow-lg shadow-violet-500"
        >
          <Text className="text-3xl">{capturedPhoto ? "🔄" : "📷"}</Text>
        </TouchableOpacity>
        <Text className="text-violet-600 text-xs font-bold tracking-wide mt-1.5">
          {capturedPhoto ? "Retake Photo" : "Open Camera"}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cameraContainer: {
    flex: 1,
    backgroundColor: "#000",
  },
  camera: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
});
