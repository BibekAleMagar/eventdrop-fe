import { View, Text, Button } from "react-native";
import { TouchableOpacity } from "react-native";
import { useAuth } from "@/src/context/AuthContext";
import { useRouter } from "expo-router";

export default function Settings() {
  const { logout } = useAuth();
  const router = useRouter();
  const handleLogOut = () => {
    logout();
    router.replace("/login");
  };
  return (
    <View>
      <Text>Settings</Text>
      <Button onPress={handleLogOut} title="Logout" />
    </View>
  );
}
