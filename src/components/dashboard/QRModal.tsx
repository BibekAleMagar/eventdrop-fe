import React from "react";
import { Modal, View, Text, TouchableOpacity, Image } from "react-native";
import { X } from "lucide-react-native";
import QRCode from "react-native-qrcode-svg";

interface QrCodeModalProps {
  isVisible: boolean;
  onClose: () => void;
  qrCodeUrl: string;
  eventName: string;
}

export default function QrCodeModal({
  isVisible,
  onClose,
  qrCodeUrl,
  eventName,
}: QrCodeModalProps) {
  if (!qrCodeUrl) return null;

  // 🛠️ Translates standard Google Drive web page viewer links into raw image source URLs
  // const getDirectImageUrl = (url: string) => {
  //   if (url.includes("drive.google.com")) {
  //     const match = url.match(/\/file\/d\/([^\/]+)/);
  //     if (match && match[1]) {
  //       const fileId = match[1];
  //       // 🔑 Bypass Google's webpage structure and request the raw binary data directly
  //       return `https://lh3.googleusercontent.com/d/${fileId}`;
  //     }
  //   }
  //   return url;
  // };

  // const directUrl = getDirectImageUrl(qrCodeUrl);

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      {/* Backdrop */}
      <View className="flex-1 bg-black/60 items-center justify-center px-6">
        {/* Modal Container */}
        <View className="bg-white w-full max-w-sm rounded-[32px] p-6 items-center shadow-2xl">
          {/* Header */}
          <View className="flex-row w-full justify-between items-center mb-6">
            <View className="flex-1 mr-2">
              <Text className="text-slate-900 text-xl font-bold tracking-tight">
                Event QR Code
              </Text>
              <Text
                numberOfLines={1}
                className="text-slate-500 text-xs mt-0.5 font-medium"
              >
                {eventName}
              </Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              className="w-8 h-8 bg-slate-100 rounded-full items-center justify-center active:bg-slate-200"
            >
              <X size={16} color="#64748b" />
            </TouchableOpacity>
          </View>

          {/* QR Code Frame Wrapper */}
          <View className="bg-slate-50 border border-slate-100 p-4 rounded-[24px] items-center justify-center mb-6 shadow-inner">
            <QRCode value={qrCodeUrl} size={180} color="#64748b" />
          </View>

          {/* Optional Footer Action */}
          <Text className="text-slate-400 text-[11px] text-center leading-4 px-4">
            Scan this code to allow attendees to directly upload photos to your
            event.
          </Text>
        </View>
      </View>
    </Modal>
  );
}
