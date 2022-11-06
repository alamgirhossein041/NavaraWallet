import React from "react";
import { Text, View } from "react-native";
import { ExclamationCircleIcon } from "react-native-heroicons/solid";
import { tw } from "../../utils/tailwind";

export default function Offline() {
  return (
    <View
      style={tw`flex-col items-center justify-center h-full bg-white dark:bg-black`}
    >
      <ExclamationCircleIcon color="red" size={60} style={tw`mb-5`} />
      <Text style={tw`text-xl font-bold text-red-500`}>
        No network connection
      </Text>
    </View>
  );
}
