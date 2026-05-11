import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Camera, ChevronRight, LayoutDashboard } from "lucide-react-native";
import { useRouter } from "expo-router";

export default function Index() {
  const inset = useSafeAreaInsets();
  const router = useRouter();

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
          Upload event photos directly to the host's Drive. No account needed.
        </Text>
      </View>

      {/* Input Section */}
      <View className="w-full gap-y-4 mb-10">
        <TextInput
          placeholder="Enter Event Code"
          placeholderTextColor={"#6366f1"}
          className="w-full py-5 px-6 rounded-2xl font-semibold text-center tracking-widest border border-primary"
          autoCapitalize="characters"
        />

        <TouchableOpacity
          activeOpacity={0.8}
          className="w-full bg-indigo-500 py-5 rounded-2xl flex-row justify-center items-center gap-x-2"
        >
          <Text className="text-white font-bold text-lg">Join Event</Text>
          <ChevronRight size={20} color="white" />
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
    </View>
  );
}
