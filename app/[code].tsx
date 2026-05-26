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
import { set } from "zod";

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
        "Camera access is needed to scan QR codes or take event photos.",
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
      setUploaded(false); // reset upload state on new capture
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
      setCapturedPhoto(null); // Clear the photo after successful upload
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
    <View className="flex-1 bg-primary">
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

      <ScrollView
        className="flex-1"
        contentContainerClassName="p-5"
        showsVerticalScrollIndicator={false}
      >
        {/* ── Photo Preview Card ── */}
        {capturedPhoto ? (
          <View className="mb-4 rounded-2xl overflow-hidden bg-white shadow-sm shadow-violet-200">
            {/* Badge */}
            <View className="flex-row items-center px-4 pt-4 pb-2">
              <View
                className={`flex-row items-center rounded-full px-3 py-1 ${uploaded ? "bg-emerald-100" : "bg-violet-100"}`}
              >
                <Text className="text-base mr-1">{uploaded ? "✅" : "📸"}</Text>
                <Text
                  className={`text-xs font-bold tracking-wide ${uploaded ? "text-emerald-600" : "text-violet-600"}`}
                >
                  {uploaded ? "Uploaded" : "Photo Ready"}
                </Text>
              </View>
            </View>

            {/* Photo */}
            <Image
              source={{ uri: capturedPhoto }}
              className="w-full"
              style={{ height: 220 }}
              resizeMode="cover"
            />

            {/* Retake / Upload buttons */}
            <View className="flex-row gap-3 p-4">
              <TouchableOpacity
                onPress={handleRetake}
                disabled={isUploading}
                className="flex-1 h-11 rounded-xl border border-violet-300 items-center justify-center"
              >
                <Text className="text-violet-600 text-sm font-bold">
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
                      ? "bg-violet-400"
                      : "bg-violet-600"
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
          /* ── Placeholder when no photo yet ── */
          <TouchableOpacity
            onPress={handleCameraPress}
            className="mb-4 rounded-2xl h-36 bg-white border-2 border-dashed border-violet-300 items-center justify-center shadow-sm shadow-violet-100"
          >
            <Text className="text-4xl mb-2">📷</Text>
            <Text className="text-violet-500 text-sm font-semibold">
              Tap to take a photo
            </Text>
          </TouchableOpacity>
        )}

        {/* Details Card */}
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

      {/* Floating Camera Button — hidden when photo is captured */}
      {!capturedPhoto && (
        <View
          className="absolute self-center items-center"
          style={{ bottom: insets.bottom + 24 }}
        >
          <TouchableOpacity
            onPress={handleCameraPress}
            activeOpacity={0.85}
            className="w-16 h-16 rounded-full bg-violet-600 items-center justify-center shadow-lg shadow-violet-500"
          >
            <Text className="text-3xl">📷</Text>
          </TouchableOpacity>
          <Text className="text-violet-600 text-xs font-bold tracking-wide mt-1.5">
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
