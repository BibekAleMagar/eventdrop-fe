import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Image,
} from "react-native";
import { useAuth } from "@/src/context/AuthContext";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDashboard } from "@/src/hooks/dashboard";

export default function Settings() {
  const { logout } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { data, isLoading, isError } = useDashboard();

  const handleLogOut = () => {
    logout();
    router.replace("/login");
  };

  const StorageBar = ({ percent }: { percent: number | null }) => {
    if (percent === null) return null;
    const color =
      percent > 85 ? "#ef4444" : percent > 60 ? "#f59e0b" : "#7c3aed";
    return (
      <View className="mt-3 h-2 rounded-full bg-slate-100 overflow-hidden">
        <View
          style={{ width: `${percent}%`, backgroundColor: color }}
          className="h-full rounded-full"
        />
      </View>
    );
  };

  const Row = ({ label, value }: { label: string; value: string }) => (
    <View className="flex-row justify-between items-center py-3 border-b border-slate-100">
      <Text className="text-slate-500 text-sm">{label}</Text>
      <Text className="text-slate-800 text-sm font-semibold">{value}</Text>
    </View>
  );

  return (
    <View className="flex-1 bg-slate-100">
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View
        className="bg-primary px-6 pb-6"
        style={{ paddingTop: insets.top + 12 }}
      >
        <Text className="text-white text-2xl font-extrabold tracking-tight">
          Settings
        </Text>
        <Text className="text-slate-400 text-sm mt-1">
          Account & storage overview
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="p-5 gap-4"
        showsVerticalScrollIndicator={false}
      >
        {isLoading && (
          <View className="bg-white rounded-2xl p-6 items-center">
            <Text className="text-slate-400 text-sm">
              Loading account data...
            </Text>
          </View>
        )}

        {isError && (
          <View className="bg-red-50 rounded-2xl p-4 border border-red-100">
            <Text className="text-red-500 text-sm font-semibold">
              Failed to load Drive data
            </Text>
          </View>
        )}

        {data && (
          <>
            {/* Profile Card */}
            <View className="bg-white rounded-2xl p-5 shadow-sm shadow-slate-100">
              <View className="flex-row items-center gap-4">
                <View className="w-12 h-12 rounded-full bg-white border border-slate-100 shadow-sm items-center justify-center">
                  <Image
                    source={{
                      uri:
                        data.user?.photoUrl ||
                        "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y",
                    }}
                    className="w-10 h-10 rounded-full"
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-slate-800 text-base font-bold">
                    {data.user.name ?? "—"}
                  </Text>
                  <Text className="text-slate-400 text-sm mt-0.5">
                    {data.user.email ?? "—"}
                  </Text>
                </View>
                <View className="bg-violet-100 rounded-full px-3 py-1">
                  <Text className="text-violet-600 text-xs font-bold">
                    Google
                  </Text>
                </View>
              </View>
            </View>

            {/* Storage Card */}
            <View className="bg-white rounded-2xl p-5 shadow-sm shadow-slate-100">
              <View className="flex-row items-center justify-between mb-1">
                <Text className="text-slate-800 text-base font-bold">
                  Google Drive Storage
                </Text>
                {data.storage.usedPercent !== null && (
                  <Text
                    className="text-xs font-bold"
                    style={{
                      color:
                        data.storage.usedPercent > 85
                          ? "#ef4444"
                          : data.storage.usedPercent > 60
                            ? "#f59e0b"
                            : "#7c3aed",
                    }}
                  >
                    {data.storage.usedPercent}% used
                  </Text>
                )}
              </View>

              <StorageBar percent={data.storage.usedPercent} />

              {/* 2-col stat pills */}
              <View className="flex-row gap-3 mt-4">
                <View className="flex-1 bg-slate-50 rounded-xl p-3">
                  <Text className="text-slate-400 text-xs mb-1">Used</Text>
                  <Text className="text-slate-800 text-base font-bold">
                    {data.storage.used}
                  </Text>
                </View>
                <View className="flex-1 bg-slate-50 rounded-xl p-3">
                  <Text className="text-slate-400 text-xs mb-1">Free</Text>
                  <Text className="text-slate-800 text-base font-bold">
                    {data.storage.free}
                  </Text>
                </View>
              </View>

              <View className="mt-4">
                <Row label="Total capacity" value={data.storage.total} />
                <Row label="In Drive" value={data.storage.usedInDrive} />
                <Row label="In Trash" value={data.storage.usedInTrash} />
              </View>
            </View>

            {/* Raw bytes card */}
            <View className="bg-white rounded-2xl p-5 shadow-sm shadow-slate-100">
              <Text className="text-slate-800 text-base font-bold mb-3">
                Byte breakdown
              </Text>
              <Row
                label="Total"
                value={data.storage.totalBytes.toLocaleString() + " B"}
              />
              <Row
                label="Used"
                value={data.storage.usedBytes.toLocaleString() + " B"}
              />
              <Row
                label="In Drive"
                value={data.storage.usedInDriveBytes.toLocaleString() + " B"}
              />
              <Row
                label="In Trash"
                value={data.storage.usedInTrashBytes.toLocaleString() + " B"}
              />
              {data.storage.freeBytes !== null && (
                <Row
                  label="Free"
                  value={data.storage.freeBytes.toLocaleString() + " B"}
                />
              )}
            </View>
          </>
        )}

        {/* Logout */}
        <View className="bg-white rounded-2xl overflow-hidden shadow-sm shadow-slate-100">
          <TouchableOpacity
            onPress={handleLogOut}
            activeOpacity={0.7}
            className="flex-row items-center px-5 py-4"
          >
            <Text className="text-red-500 text-base font-semibold flex-1">
              Log out
            </Text>
            <Text className="text-red-400 text-lg">→</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: insets.bottom + 24 }} />
      </ScrollView>
    </View>
  );
}
