import React from "react";
import { View, Text, TouchableOpacity, Modal, Pressable } from "react-native";
import { X, MapPin, Users, Zap, Bell } from "lucide-react-native";

const steps = [
  {
    icon: MapPin,
    title: "Create an event",
    desc: "Drop a pin anywhere and set up your event in seconds.",
  },
  {
    icon: Users,
    title: "Invite people",
    desc: "Share a 6-digit code with friends or make it public.",
  },
  {
    icon: Bell,
    title: "Get notified",
    desc: "Receive real-time updates when people join your event.",
  },
  {
    icon: Zap,
    title: "Meet up",
    desc: "Connect with people around you and enjoy the event.",
  },
];

type Props = {
  visible: boolean;
  onClose: () => void;
};

export default function HowItWorksModal({ visible, onClose }: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable className="flex-1 bg-black/40" onPress={onClose} />

      <View className="bg-white rounded-t-3xl px-6 pt-6 pb-10">
        <View className="w-10 h-1 bg-slate-200 rounded-full self-center mb-6" />

        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-slate-900 text-xl font-bold">How it works</Text>
          <TouchableOpacity
            className="w-8 h-8 bg-slate-100 rounded-full items-center justify-center"
            onPress={onClose}
          >
            <X size={16} color="#64748b" />
          </TouchableOpacity>
        </View>

        {/* steps */}
        {steps.map(({ icon: Icon, title, desc }, i) => (
          <View key={title} className="flex-row gap-x-4 mb-6">
            <View className="items-center">
              <View className="w-10 h-10 bg-indigo-50 rounded-xl items-center justify-center">
                <Icon size={18} color="#6366f1" />
              </View>
              {i < steps.length - 1 && (
                <View className="w-0.5 flex-1 bg-slate-100 mt-2" />
              )}
            </View>
            <View className="flex-1 pb-2">
              <Text className="text-slate-900 font-semibold text-base mb-1">
                {title}
              </Text>
              <Text className="text-slate-400 text-sm leading-5">{desc}</Text>
            </View>
          </View>
        ))}
      </View>
    </Modal>
  );
}
