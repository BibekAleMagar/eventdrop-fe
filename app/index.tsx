import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Camera,
  ChevronRight,
  LayoutDashboard,
  Scan,
  X,
} from "lucide-react-native";
import { Href, useRouter } from "expo-router";
import { useGetEventbyCode } from "@/src/hooks/Event";
import QrScan from "@/src/components/QRScanner";
import { apiClient } from "@/src/api/apiClient";
import { Event } from "@/src/types/Event";

export default function Index() {
  const inset = useSafeAreaInsets();
  const router = useRouter();
  const [eventCode, setEventCode] = React.useState("");
  const [showScanner, setShowScanner] = useState(false);

  // Get hook for fetching event by code
  const getEventbyCodeHook = useGetEventbyCode(eventCode, false);
  const { isFetching, refetch } = getEventbyCodeHook;

  const handleQRScanned = async (data: string) => {
    try {
      // Close scanner immediately
      setShowScanner(false);

      const response = await apiClient.get<Event>(`/events?code=${data}`);

      if (response) {
        // Encode the data safely
        const encodedData = encodeURIComponent(JSON.stringify(response));

        // Navigate to event page
        router.push(
          `/${response.data.eventCode}?code=${data}&eventData=${encodedData}` as Href,
        );
      } else {
        Alert.alert("Invalid Code", "Event not found. Please try again.");
      }
    } catch {
      Alert.alert("Error", "Failed to fetch event. Please try again.");
    }
  };

  const handleJoinEvent = async () => {
    if (!eventCode.trim()) {
      Alert.alert("Required", "Please enter an event code.");
      return;
    }

    try {
      const { data: fetchedData } = await refetch();

      if (fetchedData) {
        // Encode the data safely so special characters or spaces don't break the URL
        const encodedData = encodeURIComponent(JSON.stringify(fetchedData));

        // Pass everything as a single string template literal cast as an Href
        router.push(
          `/${fetchedData.eventCode}?code=${eventCode}&eventData=${encodedData}` as Href,
        );
      } else {
        Alert.alert("Invalid Code", "Invalid event code. Please try again.");
      }
    } catch {
      Alert.alert("Error", "Something went wrong fetching the event.");
    }
  };

  return (
    <View
      style={{
        paddingTop: inset.top,
        paddingBottom: inset.bottom,
      }}
      className="flex-1 px-8 justify-center items-center gap-y-4"
    >
      <View className="mb-8 items-center">
        <View
          className="w-20 h-20 rounded-3xl items-center justify-center mb-6"
          style={{
            backgroundColor: "#6366f1",
            elevation: 10,
            shadowColor: "#6366f1",
            shadowOpacity: 0.5,
            shadowRadius: 20,
          }}
        >
          <Camera size={40} color="white" />
        </View>

        <Text className="text-[#6366f1] text-5xl font-bold tracking-tighter mb-4">
          EventDrop
        </Text>

        <Text className="text-slate-400 text-center text-lg leading-6 px-4">
          Upload event photos directly to the host&apos;s Drive. No account
          needed.
        </Text>
      </View>

      {/* Input Section */}
      <View className="w-full gap-y-4 mb-10">
        <View className="relative">
          <TextInput
            placeholder="Enter Event Code"
            placeholderTextColor={"#6366f1"}
            className="w-full py-5 px-6 rounded-2xl font-semibold text-center tracking-widest border border-primary"
            autoCapitalize="characters"
            value={eventCode}
            onChangeText={setEventCode}
            editable={!isFetching}
          />
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          className="w-full bg-indigo-500 py-5 rounded-2xl flex-row justify-center items-center gap-x-2"
          onPress={handleJoinEvent}
          disabled={isFetching}
        >
          {isFetching ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <Text className="text-white font-bold text-lg">Join Event</Text>
              <ChevronRight size={20} color="white" />
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Divider */}
      <View className="flex-row items-center w-full mb-10">
        <View className="flex-1 h-[1px] bg-slate-800" />
        <Text className="text-slate-500 px-4 text-xs font-bold tracking-widest uppercase">
          Host Mode
        </Text>
        <View className="flex-1 h-[1px] bg-slate-800" />
      </View>

      {/* <QrScan onScan={handleQRScanned} /> */}

      {/* Dashboard Button */}
      <TouchableOpacity
        onPress={() => router.push("/login")}
        activeOpacity={0.7}
        className="w-full  border border-[#6366f1] py-4 rounded-2xl flex-row justify-center items-center gap-x-3"
      >
        <LayoutDashboard size={18} color="#6366f1" />
        <Text className="text-[#6366f1] font-semibold text-base">
          Go to Dashboard
        </Text>
      </TouchableOpacity>

      {/* QR Scanner Modal */}
      {/* <Modal
        visible={showScanner}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={() => setShowScanner(false)}
      >
        <View className="flex-1 bg-slate-900">
          <View
            className="flex-row items-center justify-between px-6 pt-4"
            style={{ paddingTop: inset.top + 16 }}
          >
            <Text className="text-white text-lg font-semibold">
              Scan Event Code
            </Text>
            <TouchableOpacity
              onPress={() => setShowScanner(false)}
              className="bg-slate-800 p-2 rounded-full"
              activeOpacity={0.7}
            >
              <X size={24} color="white" />
            </TouchableOpacity>
          </View>

          <View className="flex-1 mt-4">
            <QrScan onScan={handleQRScanned} />
          </View>
        </View>
      </Modal> */}
    </View>
  );
}
