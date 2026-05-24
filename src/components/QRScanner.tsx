import { CameraView, useCameraPermissions } from "expo-camera";
import { View, Text } from "react-native";
import { useState } from "react";

interface QrScanProps {
  onScan?: (data: string) => void;
}

export default function QrScan({ onScan }: QrScanProps) {
  const [permission] = useCameraPermissions();
  const [data, setData] = useState("");

  const handleBarcodeScanned = ({ data: scannedData }: { data: string }) => {
    setData(scannedData);
    if (onScan) {
      onScan(scannedData);
    }
  };

  if (!permission?.granted) {
    return (
      <View className="flex-1 justify-center items-center bg-slate-900">
        <Text className="text-white text-lg font-semibold">
          No camera permission
        </Text>
        <Text className="text-slate-400 text-sm mt-2">
          Please enable camera access in settings
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <CameraView
        className="flex-1"
        onBarcodeScanned={handleBarcodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
      />

      {/* Scanned Data Display */}
      {data && (
        <View className="absolute bottom-10 left-6 right-6 bg-white rounded-2xl p-4 shadow-lg">
          <Text className="text-slate-600 text-xs font-semibold tracking-widest uppercase mb-2">
            Code Detected
          </Text>
          <Text className="text-slate-900 text-base font-mono break-all">
            {data}
          </Text>
        </View>
      )}

      {/* Instructions */}
      {!data && (
        <View className="absolute bottom-10 left-6 right-6 bg-slate-800/80 rounded-2xl p-4 backdrop-blur">
          <Text className="text-white text-sm text-center">
            Point your camera at the QR code
          </Text>
        </View>
      )}

      {/* Scanning Frame */}
      <View className="absolute inset-0 items-center justify-center pointer-events-none">
        <View className="w-60 h-60 border-2 border-indigo-500 rounded-3xl opacity-50" />
      </View>
    </View>
  );
}
