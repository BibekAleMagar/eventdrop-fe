import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from "react-native";
import {
  PlusCircle,
  Users,
  LayoutGrid,
  Settings,
  MapPin,
  ChevronRight,
  Bell,
} from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useAuth } from "@/src/context/AuthContext";
import HowItWorksModal from "@/src/components/home/HowItWorksModal";

export default function Index() {
  const [howItWorksVisible, setHowItWorksVisible] = React.useState(false);
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useAuth();

  return (
    <ScrollView
      className="flex-1 bg-slate-50"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
      showsVerticalScrollIndicator={false}
    >
      <View className="px-6 pb-10">
        {/* Header */}
        <View className="flex-row justify-between items-center mt-6 mb-8">
          <View>
            <Text className="text-slate-400 text-xs font-medium uppercase tracking-widest mb-1">
              Good morning
            </Text>
            <Text className="text-slate-900 text-2xl font-bold tracking-tight">
              {user?.username ?? "Guest"} 👋
            </Text>
          </View>
          <View className="flex-row gap-x-2">
            <TouchableOpacity className="w-10 h-10 bg-white rounded-xl border border-slate-100 items-center justify-center">
              <Bell size={18} color="#94a3b8" />
            </TouchableOpacity>
            <TouchableOpacity className="w-10 h-10 bg-white rounded-xl border border-slate-100 items-center justify-center">
              <Settings size={18} color="#94a3b8" />
            </TouchableOpacity>
          </View>
        </View>
        {/* Hero Card */}
        <View className="bg-indigo-500 rounded-3xl p-6 mb-6 overflow-hidden">
          <View className="absolute -top-6 -right-6 w-32 h-32 bg-indigo-400 rounded-full opacity-40" />
          <View className="absolute -bottom-8 -left-4 w-24 h-24 bg-indigo-600 rounded-full opacity-40" />

          <View className="flex-row items-center gap-x-2 mb-3">
            <View className="bg-white/20 px-3 py-1 rounded-full">
              <Text className="text-white text-xs font-semibold">Live now</Text>
            </View>
          </View>

          <Text className="text-white text-xl font-bold mb-1">
            No active event
          </Text>
          <Text className="text-indigo-100 text-sm leading-5 mb-5">
            Create or join an event to get{"\n"}started with EventDrop.
          </Text>

          <TouchableOpacity
            className="bg-white self-start flex-row items-center gap-x-2 px-4 py-2.5 rounded-xl"
            onPress={() => setHowItWorksVisible(true)}
          >
            <MapPin size={14} color="#6366f1" />
            <Text className="text-indigo-600 text-sm font-semibold">
              How it works
            </Text>
          </TouchableOpacity>

          <HowItWorksModal
            visible={howItWorksVisible}
            onClose={() => setHowItWorksVisible(false)}
          />
        </View>
        {/* Quick Actions */}
        <Text className="text-slate-900 text-base font-semibold mb-3 px-1">
          Quick actions
        </Text>
        setHowItWorksVisible
        <View className="flex-row gap-x-3 mb-8">
          {/* Join Event */}
          <TouchableOpacity
            activeOpacity={0.8}
            className="flex-1 bg-white rounded-2xl p-5 border border-slate-100 items-start"
          >
            <View className="w-10 h-10 bg-blue-50 rounded-xl items-center justify-center mb-4">
              <Users size={20} color="#3b82f6" strokeWidth={2} />
            </View>
            <Text className="text-slate-900 font-semibold text-base">Join</Text>
            <Text className="text-slate-400 text-xs mt-0.5">6-digit code</Text>
          </TouchableOpacity>

          {/* Create Event */}
          <TouchableOpacity
            activeOpacity={0.8}
            className="flex-1 bg-white rounded-2xl p-5 border border-slate-100 items-start"
            onPress={() => router.push("/login")}
          >
            <View className="w-10 h-10 bg-indigo-50 rounded-xl items-center justify-center mb-4">
              <PlusCircle size={20} color="#6366f1" strokeWidth={2} />
            </View>
            <Text className="text-slate-900 font-semibold text-base">
              Create
            </Text>
            <Text className="text-slate-400 text-xs mt-0.5">New event</Text>
          </TouchableOpacity>

          {/* Browse */}
          <TouchableOpacity
            activeOpacity={0.8}
            className="flex-1 bg-white rounded-2xl p-5 border border-slate-100 items-start"
          >
            <View className="w-10 h-10 bg-emerald-50 rounded-xl items-center justify-center mb-4">
              <LayoutGrid size={20} color="#10b981" strokeWidth={2} />
            </View>
            <Text className="text-slate-900 font-semibold text-base">
              Browse
            </Text>
            <Text className="text-slate-400 text-xs mt-0.5">Explore all</Text>
          </TouchableOpacity>
        </View>
        {/* Recent Events */}
        <View className="flex-row justify-between items-center mb-4 px-1">
          <Text className="text-slate-900 text-base font-semibold">
            Recent events
          </Text>
          <TouchableOpacity className="flex-row items-center gap-x-1">
            <Text className="text-indigo-500 text-sm font-medium">
              View all
            </Text>
            <ChevronRight size={14} color="#6366f1" />
          </TouchableOpacity>
        </View>
        {/* Empty State */}
        <View className="bg-white rounded-2xl border border-dashed border-slate-200 py-12 items-center justify-center">
          <View className="w-14 h-14 bg-slate-50 rounded-2xl border border-slate-100 items-center justify-center mb-4">
            <LayoutGrid size={24} color="#cbd5e1" strokeWidth={1.5} />
          </View>
          <Text className="text-slate-700 font-semibold text-base mb-1">
            No events yet
          </Text>
          <Text className="text-slate-400 text-sm text-center leading-5">
            Events you create or join{"\n"}will appear here.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
