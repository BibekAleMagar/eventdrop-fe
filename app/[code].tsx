"use client";

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
  Image,
} from "react-native";
import { Event } from "@/src/types/Event";
import { CameraView, Camera } from "expo-camera";
import { useState, useRef } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useUploadPhoto } from "@/src/hooks/Upload";

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
  const [uploaded, setUploaded] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  const { mutateAsync: uploadPhoto, isPending: isUploading } = useUploadPhoto();
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
        "Camera access is needed to take event photos.",
        [{ text: "OK" }],
      );
    }
  };

  const handleCapture = async () => {
    if (!cameraRef.current) return;
    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.8 });
      if (!photo?.uri) return;
      setCapturedPhoto(photo.uri);
      setUploaded(false);
      setShowCamera(false);
    } catch {
      Alert.alert("Error", "Failed to capture photo. Please try again.");
    }
  };

  const handleUpload = async () => {
    if (!capturedPhoto) return;
    try {
      await uploadPhoto({
        eventCode: code,
        photo: {
          uri: capturedPhoto,
          name: "event_photo.jpg",
          type: "image/jpeg",
        },
      });
      setUploaded(true);
      setCapturedPhoto(null);
      Alert.alert("Success", "Photo uploaded successfully!");
    } catch {
      Alert.alert("Error", "Upload failed. Please try again.");
    }
  };

  const handleRetake = () => {
    setCapturedPhoto(null);
    setUploaded(false);
    setShowCamera(true);
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
        <CameraView ref={cameraRef} facing="back" style={styles.camera} />
        <View style={StyleSheet.absoluteFill}>
          <View
            style={{ paddingTop: insets.top + 8 }}
            className="flex-row items-center justify-between px-5"
          >
            <TouchableOpacity
              onPress={() => setShowCamera(false)}
              className="w-10 h-10 rounded-full bg-black/40 items-center justify-center"
            >
              <Text className="text-white text-lg font-bold">✕</Text>
            </TouchableOpacity>
            <View className="bg-black/40 rounded-full px-4 py-1.5">
              <Text className="text-white text-xs font-semibold tracking-widest uppercase">
                {event?.name ?? "Event"}
              </Text>
            </View>
            <View className="w-10" />
          </View>
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
      <View className="flex-1 items-center justify-center bg-slate-50">
        <View className="w-12 h-12 rounded-full bg-indigo-400 opacity-70 mb-4" />
        <Text className="text-indigo-400 text-base tracking-wide">
          Fetching event details...
        </Text>
      </View>
    );
  }

  // ── Main Screen ──────────────────────────────────────────────────────────────
  return (
    <View className="flex-1 bg-slate-50">
      <StatusBar barStyle="dark-content" />

      {/* Hero Header */}
      <View
        className="bg-white pb-6 px-6 border-b border-slate-100"
        style={{ paddingTop: insets.top }}
      >
        <View className="flex-row items-center self-start bg-indigo-50 border border-indigo-100 rounded-full px-3 py-1 mb-3">
          <Text className="text-indigo-400 text-xs font-bold tracking-widest mr-2">
            EVENT CODE
          </Text>
          <Text className="text-indigo-600 text-sm font-bold tracking-wide">
            {code}
          </Text>
        </View>
        <Text className="text-slate-800 text-3xl font-extrabold leading-tight tracking-tight">
          {event.name}
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="p-5"
        showsVerticalScrollIndicator={false}
      >
        {/* Photo Preview Card */}
        {capturedPhoto ? (
          <View className="mb-4 rounded-2xl overflow-hidden bg-white border border-slate-100 shadow-sm">
            <View className="flex-row items-center px-4 pt-4 pb-2">
              <View
                className={`flex-row items-center rounded-full px-3 py-1 ${uploaded ? "bg-emerald-50" : "bg-indigo-50"}`}
              >
                <Text className="text-base mr-1">{uploaded ? "✅" : "📸"}</Text>
                <Text
                  className={`text-xs font-bold tracking-wide ${uploaded ? "text-emerald-600" : "text-indigo-500"}`}
                >
                  {uploaded ? "Uploaded" : "Photo Ready"}
                </Text>
              </View>
            </View>

            <Image
              source={{ uri: capturedPhoto }}
              className="w-full"
              style={{ height: 220 }}
              resizeMode="cover"
            />

            <View className="flex-row gap-3 p-4">
              <TouchableOpacity
                onPress={handleRetake}
                disabled={isUploading}
                className="flex-1 h-11 rounded-xl border border-indigo-100 items-center justify-center bg-white"
              >
                <Text className="text-indigo-500 text-sm font-bold">
                  🔄 Retake
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleUpload}
                disabled={isUploading || uploaded}
                className={`flex-1 h-11 rounded-xl items-center justify-center ${
                  uploaded
                    ? "bg-emerald-500"
                    : isUploading
                      ? "bg-indigo-300"
                      : "bg-indigo-500"
                }`}
              >
                <Text className="text-white text-sm font-bold">
                  {uploaded
                    ? "✓ Done"
                    : isUploading
                      ? "Uploading..."
                      : "⬆️ Upload"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <TouchableOpacity
            onPress={handleCameraPress}
            className="mb-4 rounded-2xl h-36 bg-white border-2 border-dashed border-indigo-200 items-center justify-center"
          >
            <Text className="text-4xl mb-2">📷</Text>
            <Text className="text-indigo-400 text-sm font-semibold">
              Tap to take a photo
            </Text>
          </TouchableOpacity>
        )}

        {/* Details Card */}
        <View className="bg-white rounded-2xl overflow-hidden border border-slate-100">
          <View className="flex-row items-center gap-3 px-5 py-4">
            <View className="w-8 h-8 rounded-lg bg-indigo-50 items-center justify-center">
              <Text className="text-base">📅</Text>
            </View>
            <View className="flex-1">
              <Text className="text-slate-400 text-xs font-semibold tracking-widest uppercase mb-0.5">
                Starts
              </Text>
              <Text className="text-slate-800 text-base font-semibold">
                {formatDate(event.startingDate)}
              </Text>
            </View>
          </View>

          <View className="h-px bg-slate-50 ml-14" />

          <View className="flex-row items-center gap-3 px-5 py-4">
            <View className="w-8 h-8 rounded-lg bg-indigo-50 items-center justify-center">
              <Text className="text-base">🏁</Text>
            </View>
            <View className="flex-1">
              <Text className="text-slate-400 text-xs font-semibold tracking-widest uppercase mb-0.5">
                Ends
              </Text>
              <Text className="text-slate-800 text-base font-semibold">
                {formatDate(event.endingDate)}
              </Text>
            </View>
          </View>

          <View className="h-px bg-slate-50 ml-14" />

          <View className="flex-row items-center gap-3 px-5 py-4">
            <View className="w-8 h-8 rounded-lg bg-indigo-50 items-center justify-center">
              <Text className="text-base">👤</Text>
            </View>
            <View className="flex-1">
              <Text className="text-slate-400 text-xs font-semibold tracking-widest uppercase mb-0.5">
                Host ID
              </Text>
              <Text className="text-indigo-500 text-sm font-semibold font-mono">
                {event.hostId ?? "—"}
              </Text>
            </View>
          </View>

          {event.description && (
            <>
              <View className="h-px bg-slate-50 ml-14" />
              <View className="px-5 py-4">
                <Text className="text-slate-400 text-xs font-semibold tracking-widest uppercase mb-2">
                  About this event
                </Text>
                <Text className="text-slate-600 text-base leading-relaxed">
                  {event.description}
                </Text>
              </View>
            </>
          )}
        </View>

        <View className="h-28" />
      </ScrollView>

      {/* Floating Camera Button */}
      {!capturedPhoto && (
        <View
          className="absolute self-center items-center"
          style={{ bottom: insets.bottom + 24 }}
        >
          <TouchableOpacity
            onPress={handleCameraPress}
            activeOpacity={0.85}
            className="w-16 h-16 rounded-full items-center justify-center border border-indigo-500 shadow-lg"
          >
            <Text className="text-3xl">📷</Text>
          </TouchableOpacity>
          <Text className="text-indigo-500 text-xs font-bold tracking-wide">
            Open Camera
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  cameraContainer: { flex: 1, backgroundColor: "#000" },
  camera: { width: SCREEN_WIDTH, height: SCREEN_HEIGHT },
});
