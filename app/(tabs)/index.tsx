import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useAuth } from "@/src/context/AuthContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Plus,
  Sparkles,
  ArrowUpRight,
  Image as ImageIcon,
} from "lucide-react-native";
import { router } from "expo-router";

export default function Dashboard() {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      className="flex-1 bg-surface" // Using our new Bone/Parchment color
      contentContainerStyle={{
        paddingTop: insets.top + 20,
        paddingBottom: insets.bottom + 40,
      }}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Minimalist Header ── */}
      <View className="px-8 mb-10 flex-row justify-between items-center">
        <View>
          <Text className="text-midnight text-3xl font-light tracking-tight">
            Hello,{" "}
            <Text className="font-semibold">{user?.username || "Host"}</Text>
          </Text>
          <Text className="text-clay font-medium text-[10px] tracking-[3px] uppercase mt-1">
            Your Event Collection
          </Text>
        </View>
        <View className="w-12 h-12 rounded-full bg-white border border-sand/30 shadow-sm items-center justify-center">
          <Sparkles size={20} color="#B08968" />
        </View>
      </View>

      {/* ── Event Cards with Curated Colors ── */}
      <View className="px-6 gap-y-8">
        {/* Card 1: Sage & Cream (Professional/Organic) */}
        <TouchableOpacity activeOpacity={0.9} className="relative">
          <View className="bg-white rounded-[40px] p-6 border border-slate-100 shadow-sm">
            <View className="flex-row justify-between items-start mb-10">
              <View className="bg-accent-sage/10 px-4 py-1.5 rounded-full border border-accent-sage/20">
                <Text className="text-accent-sage text-[10px] font-bold tracking-widest uppercase">
                  Garden Party
                </Text>
              </View>
              <ArrowUpRight size={20} color="#86A789" />
            </View>

            <Text className="text-midnight text-2xl font-medium mb-1">
              Summer Solstice
            </Text>
            <Text className="text-slate-400 text-sm mb-6">
              July 12 • 58 Moments
            </Text>

            <View className="flex-row justify-between items-center">
              <View className="flex-row items-center -space-x-3">
                {[1, 2, 3].map((i) => (
                  <View
                    key={i}
                    className="w-10 h-10 rounded-full bg-accent-sage/20 border-2 border-white"
                  />
                ))}
              </View>
              <View className="bg-midnight h-12 w-12 rounded-2xl items-center justify-center">
                <ImageIcon size={20} color="white" />
              </View>
            </View>
          </View>
        </TouchableOpacity>

        {/* Card 2: Clay & Sand (Warm/Premium) */}
        <TouchableOpacity activeOpacity={0.9}>
          <View className="bg-white rounded-[40px] p-6 border border-slate-100 shadow-sm">
            <View className="flex-row justify-between items-start mb-10">
              <View className="bg-accent-clay/10 px-4 py-1.5 rounded-full border border-accent-clay/20">
                <Text className="text-accent-clay text-[10px] font-bold tracking-widest uppercase">
                  Wedding
                </Text>
              </View>
              <ArrowUpRight size={20} color="#B08968" />
            </View>

            <Text className="text-midnight text-2xl font-medium mb-1">
              The Sullivan Wedding
            </Text>
            <Text className="text-slate-400 text-sm mb-6">
              June 15 • 142 Moments
            </Text>

            <View className="flex-row justify-between items-center">
              <View className="flex-row items-center -space-x-3">
                {[1, 2, 3].map((i) => (
                  <View
                    key={i}
                    className="w-10 h-10 rounded-full bg-accent-sand/30 border-2 border-white"
                  />
                ))}
              </View>
              <View className="bg-primary h-12 w-12 rounded-2xl items-center justify-center">
                <Plus size={20} color="white" />
              </View>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          className="w-full h-48 border-2 border-dashed border-slate-800 rounded-[32px] items-center justify-center mt-2"
          activeOpacity={0.7}
          onPress={() => router.push("../create-event")}
        >
          <View className="w-14 h-14 rounded-full border-2 border-dashed border-slate-800  items-center justify-center mb-4">
            <Plus size={30} color="#64748b" />
          </View>
          <Text className="text-slate-400 font-semibold">Create New Event</Text>
        </TouchableOpacity>
      </View>

      <View className="mt-6 px-10">
        <Text className="text-center text-slate-400 text-xs leading-5">
          Events are synced directly to your Google Drive.{"\n"}
          <Text className="text-clay font-semibold">Manage Permissions</Text>
        </Text>
      </View>
    </ScrollView>
  );
}
