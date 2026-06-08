import React from "react";
import { Tabs } from "expo-router";
import {
  LayoutGrid,
  PlusCircle,
  Settings,
  Calendar,
  TextSearch,
  LayoutDashboard,
  QrCode,
} from "lucide-react-native";
import { useAuth } from "@/src/context/AuthContext";
import { Redirect } from "expo-router";
import { Text } from "react-native";
import Dashboard from ".";

export default function DashboardLayout() {
  const { isAuthenticated } = useAuth();

  // Protect the route: If not logged in, kick them back to landing/login
  if (!isAuthenticated) {
    return <Text>You are nit authenticated </Text>;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#6366f1",
        tabBarInactiveTintColor: "#94a3b8",
        headerShown: false,
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: "#f1f5f9",
          height: 60,
          paddingBottom: 10,
        },
        headerStyle: {
          backgroundColor: "#fff",
        },
        headerTitleStyle: {
          fontWeight: "bold",
          color: "#0f172a",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color }) => (
            <LayoutDashboard size={24} color={color} />
          ),
          tabBarLabel: "Dashboard",
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          tabBarIcon: ({ color }) => <Settings size={24} color={color} />,
          tabBarLabel: "Settings",
        }}
      />
      <Tabs.Screen
        name="create-event"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
