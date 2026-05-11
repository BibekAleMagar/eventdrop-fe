import { Redirect, useRouter } from "expo-router";
import { useAuth } from "@/src/context/AuthContext";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Controller, useForm } from "react-hook-form";
import { CreateEvent } from "@/src/types/Event";
import { CreateEventSchema } from "@/src/validation/event";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { AlignLeft, Calendar, Type } from "lucide-react-native";
import { useCreateEvent } from "@/src/hooks/Event";

export default function CreateEvent() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { mutateAsync, isPending } = useCreateEvent();

  if (!isAuthenticated) return null;

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated]);
  const { control, handleSubmit } = useForm<CreateEvent>({
    defaultValues: {
      title: "",
      description: "",
      startingDate: "",
      endingDate: "",
    },
    resolver: zodResolver(CreateEventSchema),
  });

  const handleCreateEvent = async (data: CreateEvent) => {
    try {
      await mutateAsync(data);
      router.replace("/(tabs)");
    } catch (error: any) {
      console.log(error);
    }
  };
  return (
    <View
      className="flex-1 bg-cream p-8"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      <View className="items-center py-3">
        <View className="w-12 h-1 bg-slate-200 rounded-full" />
      </View>
      <ScrollView>
        <View>
          <Label icon={<Type size={14} color="#B08968" />} title="Event Name" />
          <Controller
            control={control}
            name="title"
            render={({ field: { onChange, value } }) => (
              <TextInput
                placeholder="Birthday Party"
                value={value}
                onChangeText={onChange}
              />
            )}
          />
        </View>
        <View>
          <Label
            icon={<AlignLeft size={14} color="#B08968" />}
            title="Description"
          />
          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, value } }) => (
              <TextInput
                multiline
                className="bg-white/50 p-4 rounded-2xl border border-slate-100 text-midnight mt-2 min-h-[100px]"
                style={{ textAlignVertical: "top" }}
                placeholder="Tell your guests about the vibe..."
                onChangeText={onChange}
                value={value}
              />
            )}
          />
        </View>
        <View>
          <Label
            icon={<Calendar size={14} color="#B08968" />}
            title="Start Date"
          />
          <Controller
            control={control}
            name="startingDate"
            render={({ field: { onChange, value } }) => (
              <TextInput
                className="text-lg py-3 border-b border-slate-200 text-midnight"
                placeholder="YYYY-MM-DD"
                onChangeText={onChange}
                value={value}
              />
            )}
          />
        </View>
        <View>
          <Label
            icon={<Calendar size={14} color="#B08968" />}
            title="End Date"
          />
          <Controller
            control={control}
            name="endingDate"
            render={({ field: { onChange, value } }) => (
              <TextInput
                className="text-lg py-3 border-b border-slate-200 text-midnight"
                placeholder="YYYY-MM-DD"
                onChangeText={onChange}
                value={value}
              />
            )}
          />
        </View>
        <TouchableOpacity
          onPress={handleSubmit(handleCreateEvent)}
          disabled={isPending}
          className="bg-midnight h-16 rounded-[24px] items-center justify-center mt-6 shadow-lg shadow-midnight/20"
        >
          <Text className="text-white font-semibold text-lg">
            {isPending ? "Creating..." : "Launch Event"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const Label = ({ icon, title }: { icon: React.ReactNode; title: string }) => (
  <View className="flex-row items-center mb-1">
    {icon}
    <Text className="text-[10px] font-bold tracking-[2px] text-slate-400 uppercase ml-2">
      {title}
    </Text>
  </View>
);
