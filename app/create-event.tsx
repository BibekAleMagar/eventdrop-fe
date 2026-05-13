import { useRouter } from "expo-router";
import { useAuth } from "@/src/context/AuthContext";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Controller, Resolver, useForm } from "react-hook-form";
import { CreateEvent as create, CreateEventOutput } from "@/src/types/Event";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useRef, useState } from "react";
import { AlignLeft, Calendar, Type } from "lucide-react-native";
import { useCreateEvent } from "@/src/hooks/Event";
import DateTimePicker, {
  DateTimePickerAndroid,
} from "@react-native-community/datetimepicker";
import { createEventSchema } from "@/src/validation/event";

export default function CreateEvent() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { mutateAsync, isPending } = useCreateEvent();
  const [showIOSStartPicker, setShowIOSStartPicker] = useState(false);
  const [showIOSEndPicker, setShowIOSEndPicker] = useState(false);
  const pickerOpenRef = useRef(false);

  if (!isAuthenticated) return null;

  useEffect(() => {
    return () => {
      // Clean up on unmount
      if (Platform.OS === "android" && pickerOpenRef.current) {
        try {
          DateTimePickerAndroid.dismiss("date");
        } catch (err) {
          console.warn("Error dismissing picker on unmount:", err);
        }
      }
    };
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated]);

  const { control, handleSubmit, watch, setValue } = useForm<
    CreateEventOutput,
    any,
    CreateEventOutput
  >({
    defaultValues: {
      name: "",
      description: "",
      startingDate: undefined,
      endingDate: undefined,
    },
    resolver: zodResolver(createEventSchema) as Resolver<CreateEventOutput>,
  });

  const startDate = watch("startingDate");
  const endDate = watch("endingDate");

  const handleCreateEvent = async (data: create) => {
    console.log(data);
    try {
      await mutateAsync(data);
      router.replace("/(tabs)");
    } catch (error: any) {
      console.log(error);
    }
  };

  const showStartDatePicker = () => {
    if (Platform.OS === "android") {
      DateTimePickerAndroid.open({
        value: startDate || new Date(),
        onChange: (event, selectedDate) => {
          pickerOpenRef.current = false;
          if (event.type === "set" && selectedDate) {
            setValue("startingDate", selectedDate, { shouldValidate: true });
          }
        },
        // mode: "datetime",
        is24Hour: true,
        minimumDate: new Date(),
      });
      pickerOpenRef.current = true;
    } else {
      setShowIOSStartPicker(true);
    }
  };

  const showEndDatePicker = () => {
    if (Platform.OS === "android") {
      DateTimePickerAndroid.open({
        value: endDate || new Date(),
        onChange: (event, selectedDate) => {
          pickerOpenRef.current = false;
          if (event.type === "set" && selectedDate) {
            setValue("endingDate", selectedDate, { shouldValidate: true });
          }
        },
        // mode: "datetime",
        is24Hour: true,
        minimumDate: new Date(),
      });
      pickerOpenRef.current = true;
    } else {
      setShowIOSEndPicker(true);
    }
  };

  const handleIOSStartDateChange = (event: any, selectedDate?: Date) => {
    if (selectedDate) {
      setValue("startingDate", selectedDate, { shouldValidate: true });
    }
    setShowIOSStartPicker(false);
  };

  const handleIOSEndDateChange = (event: any, selectedDate?: Date) => {
    if (selectedDate) {
      setValue("endingDate", selectedDate, { shouldValidate: true });
    }
    setShowIOSEndPicker(false);
  };

  return (
    <View
      className="flex-1 bg-cream p-8"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      <View className="items-center py-3">
        <View className="w-12 h-1 bg-slate-200 rounded-full" />
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="mb-6">
          <Label icon={<Type size={14} color="#B08968" />} title="Event Name" />
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, value } }) => (
              <TextInput
                className="bg-white/50 p-4 rounded-2xl border border-slate-100 text-midnight mt-2"
                placeholder="Birthday Party"
                value={value}
                onChangeText={onChange}
                placeholderTextColor="#999"
              />
            )}
          />
        </View>

        <View className="mb-6">
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
                placeholderTextColor="#999"
              />
            )}
          />
        </View>

        <View className="mb-6">
          <Label
            icon={<Calendar size={14} color="#B08968" />}
            title="Start Date"
          />
          <TouchableOpacity
            className="py-3 border-b border-slate-200"
            onPress={showStartDatePicker}
          >
            <Text className="text-lg text-midnight">
              {startDate
                ? startDate.toLocaleString()
                : "Select start date & time"}
            </Text>
          </TouchableOpacity>

          {Platform.OS === "ios" && showIOSStartPicker && (
            <DateTimePicker
              value={startDate || new Date()}
              mode="datetime"
              display="spinner"
              onChange={handleIOSStartDateChange}
              minimumDate={new Date()}
            />
          )}
        </View>

        <View className="mb-6">
          <Label
            icon={<Calendar size={14} color="#B08968" />}
            title="End Date"
          />
          <TouchableOpacity
            className="py-3 border-b border-slate-200"
            onPress={showEndDatePicker}
          >
            <Text className="text-lg text-midnight">
              {endDate ? endDate.toLocaleString() : "Select end date & time"}
            </Text>
          </TouchableOpacity>

          {Platform.OS === "ios" && showIOSEndPicker && (
            <DateTimePicker
              value={endDate || new Date()}
              mode="datetime"
              display="spinner"
              onChange={handleIOSEndDateChange}
              minimumDate={new Date()}
            />
          )}
        </View>

        <TouchableOpacity
          onPress={handleSubmit(handleCreateEvent)}
          disabled={isPending}
          className="bg-midnight h-16 rounded-[24px] items-center justify-center mt-6 shadow-lg shadow-midnight/20 mb-8"
        >
          <Text
            className="text-white font-semibold text-lg"
            disabled={isPending}
          >
            {isPending ? "Creating..." : "Launch Event"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const Label = ({ icon, title }: { icon: React.ReactNode; title: string }) => (
  <View className="flex-row items-center mb-2">
    {icon}
    <Text className="text-[10px] font-bold tracking-[2px] text-slate-400 uppercase ml-2">
      {title}
    </Text>
  </View>
);
