import { View, Modal, Text } from "react-native";
import { useCreateEvent } from "@/src/hooks/Event";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function CreateEvent() {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}>
      <Text>Create</Text>
    </View>
  );
}
