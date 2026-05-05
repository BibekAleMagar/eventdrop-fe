import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { PlusCircle, Users, LayoutGrid, Settings } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Index() {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView className="flex-1 px-6" style={{ paddingTop: insets.top }}>
      {/* Header Section */}
      <View
        style={{ marginTop: 20 }}
        className="flex-row justify-between items-center mb-8"
      >
        <View>
          <Text className="text-slate-400 text-sm font-medium uppercase tracking-widest">
            Welcome to
          </Text>
          <Text className="text-3xl font-black text-slate-900">
            EventDrop<Text className="text-indigo-600">.</Text>
          </Text>
        </View>
        <TouchableOpacity className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100">
          <Settings size={24} color="#64748b" />
        </TouchableOpacity>
      </View>

      {/* Hero Card / Status */}
      <View className="bg-indigo-600 rounded-[32px] p-8 mb-8 shadow-xl shadow-indigo-200 overflow-hidden relative">
        <View className="z-10">
          <Text className="text-indigo-100 text-lg font-medium">
            Ready to share?
          </Text>
          <Text className="text-white text-2xl font-bold mt-1">
            No active event found
          </Text>
          <TouchableOpacity className="bg-white/20 self-start mt-4 px-4 py-2 rounded-full border border-white/30">
            <Text className="text-white font-semibold">How it works</Text>
          </TouchableOpacity>
        </View>
        {/* Decorative background circle */}
        <View className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full" />
      </View>

      {/* Main Actions Container */}
      <View className="flex-row gap-4 mb-8">
        {/* Join Room Card */}
        <TouchableOpacity
          activeOpacity={0.7}
          className="flex-1 bg-white p-6 rounded-[28px] border border-slate-100 shadow-sm items-center"
        >
          <View className="bg-blue-50 p-4 rounded-2xl mb-4">
            <Users size={32} color="#3b82f6" strokeWidth={2.5} />
          </View>
          <Text className="text-slate-900 font-bold text-lg">Join Event</Text>
          <Text className="text-slate-400 text-xs text-center mt-1">
            Enter a 6-digit code
          </Text>
        </TouchableOpacity>

        {/* Create Room Card */}
        <TouchableOpacity
          activeOpacity={0.7}
          className="flex-1 bg-white p-6 rounded-[28px] border border-slate-100 shadow-sm items-center"
        >
          <View className="bg-indigo-50 p-4 rounded-2xl mb-4">
            <PlusCircle size={32} color="#6366f1" strokeWidth={2.5} />
          </View>
          <Text className="text-slate-900 font-bold text-lg">Create</Text>
          <Text className="text-slate-400 text-xs text-center mt-1">
            Launch new session
          </Text>
        </TouchableOpacity>
      </View>

      {/* Recent Events / History Section */}
      <View className="flex-row justify-between items-center mb-4 px-2">
        <Text className="text-slate-900 font-bold text-xl">Recent Events</Text>
        <TouchableOpacity>
          <Text className="text-indigo-600 font-semibold">View All</Text>
        </TouchableOpacity>
      </View>

      {/* Placeholder for History */}
      <View className="bg-white rounded-[24px] p-6 border border-slate-100 border-dashed items-center justify-center">
        <LayoutGrid size={40} color="#cbd5e1" strokeWidth={1.5} />
        <Text className="text-slate-400 mt-3 font-medium">
          Your recent event history will appear here.
        </Text>
      </View>
    </ScrollView>
  );
}
