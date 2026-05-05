import React, { useRef, useState } from "react";
import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import PagerView from "react-native-pager-view";
import { Camera, Users, Zap, Cloud, ArrowRight } from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

const SLIDES = [
  {
    id: "1",
    title: "Launch Event",
    desc: "Start your event instantly. No login barriers for you or your guests.",
    icon: Zap,
    color: "#6366f1", // Indigo
    bgClass: "bg-indigo-50",
    btnClass: "bg-indigo-600",
  },
  {
    id: "2",
    title: "Join by Code",
    desc: "Audience joins via a simple 6-digit code. No app download required.",
    icon: Users,
    color: "#3b82f6", // Blue
    bgClass: "bg-blue-50",
    btnClass: "bg-blue-600",
  },
  {
    id: "3",
    title: "Capture Moments",
    desc: "Everyone's photos appear in one shared gallery in real-time.",
    icon: Camera,
    color: "#a855f7", // Purple
    bgClass: "bg-purple-50",
    btnClass: "bg-purple-600",
  },
  {
    id: "4",
    title: "Google Drive",
    desc: "Auto-save everything to your Google Drive. You own your memories.",
    icon: Cloud,
    color: "#06b6d4", // Cyan
    bgClass: "bg-cyan-50",
    btnClass: "bg-cyan-600",
  },
];

export default function EventDropOnboarding() {
  const pagerRef = useRef<PagerView>(null);
  const [pageIndex, setPageIndex] = useState(0);
  const router = useRouter();
  const inset = useSafeAreaInsets();

  const handleAction = async () => {
    if (pageIndex < SLIDES.length - 1) {
      pagerRef.current?.setPage(pageIndex + 1);
    } else {
      await handleFinishOnboarding();
    }
  };

  const handleFinishOnboarding = async () => {
    try {
      await AsyncStorage.setItem("hasLaunched", "true");
      router.replace("/");
    } catch (e) {
      console.error(e);
    }
  };

  const currentSlide = SLIDES[pageIndex];

  return (
    <View
      className={`flex-1 transition-all duration-500 ${currentSlide.bgClass}`}
    >
      <TouchableOpacity
        onPress={handleFinishOnboarding}
        className="absolute right-8 z-50 p-2"
        style={{ top: inset.top + 10 }}
      >
        <Text className="text-slate-400 font-bold text-base">Skip</Text>
      </TouchableOpacity>

      <PagerView
        ref={pagerRef}
        style={{ flex: 1 }}
        initialPage={0}
        onPageSelected={(e) => setPageIndex(e.nativeEvent.position)}
      >
        {SLIDES.map((slide) => {
          const Icon = slide.icon;
          return (
            <View
              key={slide.id}
              className="items-center justify-center p-10"
              style={{ width: width }}
            >
              {/* Icon with Modern Glow Container */}
              <View
                className="mb-12 p-8 rounded-full bg-white shadow-2xl shadow-slate-200"
                style={{ elevation: 10 }}
              >
                <Icon size={80} color={slide.color} strokeWidth={2.5} />
              </View>

              <Text className="text-4xl font-extrabold text-slate-900 text-center tracking-tight">
                {slide.title}
              </Text>
              <Text className="text-xl text-slate-500 text-center mt-6 leading-7 px-2">
                {slide.desc}
              </Text>
            </View>
          );
        })}
      </PagerView>

      <View className="pb-16 items-center px-10">
        {/* Modern Pill Pagination Dots */}
        <View className="flex-row mb-10 items-center">
          {SLIDES.map((_, i) => (
            <View
              key={i}
              className={`h-2.5 rounded-full mx-1.5 transition-all duration-300 ${
                pageIndex === i
                  ? `w-8 ${currentSlide.btnClass}`
                  : "bg-slate-300 w-2.5"
              }`}
            />
          ))}
        </View>

        {/* Action Button */}
        <TouchableOpacity
          onPress={handleAction}
          activeOpacity={0.9}
          className={`w-full flex-row items-center justify-center py-5 rounded-2xl shadow-xl ${currentSlide.btnClass}`}
          style={{ elevation: 5 }}
        >
          <Text className="text-white text-xl font-bold mr-2 tracking-tight">
            {pageIndex === SLIDES.length - 1 ? "Get Started" : "Continue"}
          </Text>
          <ArrowRight size={22} color="white" strokeWidth={3} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
