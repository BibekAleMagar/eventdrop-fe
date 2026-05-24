import { useLocalSearchParams } from "expo-router";
import { View, Text } from "react-native";

export default function PublicEventScreen() {
  const { code, eventData } = useLocalSearchParams<{
    code: string;
    eventData: string;
  }>();

  const event = eventData ? JSON.parse(eventData) : null;

  if (!event) {
    return <Text>Loading event data...</Text>;
  }

  return (
    <View style={{ flex: 1, padding: 20, justifyContent: "center" }}>
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>{event.name}</Text>
      <Text>Code: {code}</Text>
      <Text>Location: {event.location}</Text>
    </View>
  );
}
