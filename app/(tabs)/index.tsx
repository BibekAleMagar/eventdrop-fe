import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Linking,
} from "react-native";
import { useAuth } from "@/src/context/AuthContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Plus,
  ArrowUpRight,
  QrCode,
  FolderOpen,
  CalendarDays,
} from "lucide-react-native";
import { useRouter } from "expo-router";
import { useMyEvents } from "@/src/hooks/Event";
import { Event } from "@/src/types/Event";
import QrCodeModal from "@/src/components/dashboard/QRModal";

const CARD_ACCENTS = [
  {
    badge: "bg-emerald-50",
    badgeBorder: "border-emerald-100",
    badgeText: "text-emerald-600",
    icon: "#10b981",
    dot: "bg-emerald-100",
    btn: "bg-slate-900",
  },
  {
    badge: "bg-amber-50",
    badgeBorder: "border-amber-100",
    badgeText: "text-amber-600",
    icon: "#f59e0b",
    dot: "bg-amber-100",
    btn: "bg-orange-600",
  },
  {
    badge: "bg-blue-50",
    badgeBorder: "border-blue-100",
    badgeText: "text-blue-500",
    icon: "#3b82f6",
    dot: "bg-blue-100",
    btn: "bg-slate-900",
  },
];

export default function Dashboard() {
  const [selectedEvent, setSelectedEvent] = useState<{
    qrCodeUrl: string;
    name: string;
  } | null>(null);
  const { user } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { data, isLoading, error } = useMyEvents();

  const events: Event[] = data ?? [];

  const handleDriveLinkPress = (url: string) => {
    Linking.openURL(url).catch((err) =>
      console.error("Failed to open URL:", err),
    );
  };

  return (
    <View className="flex-1 bg-[#F8FAFC]">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingTop: insets.top + 20,
          paddingBottom: insets.bottom + 40,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ── */}
        <View className="px-8 mb-10 flex-row justify-between items-center">
          <View>
            <Text className="text-slate-900 text-3xl font-light tracking-tight">
              Hello,{" "}
              <Text className="font-semibold">{user?.username || "Host"}</Text>
            </Text>
            <Text className="text-slate-400 font-medium text-[10px] tracking-[3px] uppercase mt-1">
              Your Event Collection
            </Text>
          </View>
          <View className="w-12 h-12 rounded-full bg-white border border-slate-100 shadow-sm items-center justify-center">
            <Image
              source={{
                uri:
                  user?.photoUrl ||
                  "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y",
              }}
              className="w-10 h-10 rounded-full"
            />
          </View>
        </View>

        {/* ── Event Cards ── */}
        <View className="px-6 gap-y-6">
          {isLoading && (
            <View className="items-center py-20">
              <ActivityIndicator size="large" color="#f59e0b" />
            </View>
          )}

          {error && (
            <View className="bg-red-50 rounded-[32px] p-8 border border-red-100 items-center">
              <Text className="text-red-500 text-sm font-medium">
                Failed to load events
              </Text>
            </View>
          )}

          {!isLoading && events.length === 0 && (
            <View className="bg-white rounded-[32px] p-10 border border-slate-100 items-center">
              <CalendarDays size={40} color="#CBD5E1" />
              <Text className="text-slate-400 text-sm mt-4 text-center">
                No events found. Start by creating one.
              </Text>
            </View>
          )}

          {!isLoading &&
            events.map((event, index) => {
              const accent = CARD_ACCENTS[index % CARD_ACCENTS.length];
              return (
                <TouchableOpacity
                  key={event.id}
                  activeOpacity={0.9}
                  onPress={() => router.push(`../event/${event.eventCode}`)}
                >
                  <View className="bg-white rounded-[40px] p-6 border border-slate-100 shadow-sm">
                    {/* Badge & Icon */}
                    <View className="flex-row justify-between items-start mb-8">
                      <View
                        className={`${accent.badge} px-4 py-1.5 rounded-full border ${accent.badgeBorder}`}
                      >
                        <Text
                          className={`${accent.badgeText} text-[10px] font-bold tracking-widest uppercase`}
                        >
                          {event.eventCode}
                        </Text>
                      </View>
                      <ArrowUpRight size={20} color={accent.icon} />
                    </View>

                    {/* Content */}
                    <Text className="text-slate-900 text-2xl font-semibold mb-1">
                      {event.name}
                    </Text>
                    <Text
                      className="text-slate-400 text-sm mb-6"
                      numberOfLines={2}
                    >
                      {event.description}
                    </Text>

                    {/* Action Row */}
                    <View className="flex-row justify-between items-center">
                      <View className="flex-row items-center -space-x-3">
                        {[1, 2, 3].map((i) => (
                          <View
                            key={i}
                            className={`w-10 h-10 rounded-full ${accent.dot} border-2 border-white`}
                          />
                        ))}
                      </View>

                      {/* 🔑 FIXED: Re-activated your button shell to target local hook setters */}
                      <TouchableOpacity
                        className={`${accent.btn} h-12 w-12 rounded-2xl items-center justify-center shadow-lg`}
                        onPress={() =>
                          setSelectedEvent({
                            qrCodeUrl: event.qrCodeUrl,
                            name: event.name,
                          })
                        }
                      >
                        <QrCode size={20} color="white" />
                      </TouchableOpacity>
                    </View>

                    {/* Google Drive Footer */}
                    {event.driveFolderUrl && (
                      <TouchableOpacity
                        className="mt-6 pt-4 border-t border-slate-50 flex-row items-center gap-x-2"
                        onPress={() =>
                          handleDriveLinkPress(event.driveFolderUrl)
                        }
                      >
                        <FolderOpen size={16} color="#94A3B8" />
                        <Text className="text-slate-400 text-xs font-medium">
                          View in Google Drive
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}

          {/* ── Create Button ── */}
          <TouchableOpacity
            className="w-full py-12 border-2 border-dashed border-slate-200 rounded-[32px] items-center justify-center mt-4"
            onPress={() => router.push("../create-event")}
          >
            <View className="bg-slate-100 p-4 rounded-full mb-3">
              <Plus size={24} color="#64748b" />
            </View>
            <Text className="text-slate-500 font-medium">Add New Event</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* ── 💡 FIXED: Mounted cleanly once at the root layout structure level ── */}
      <QrCodeModal
        isVisible={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
        qrCodeUrl={selectedEvent?.qrCodeUrl || ""}
        eventName={selectedEvent?.name || ""}
      />
    </View>
  );
}
