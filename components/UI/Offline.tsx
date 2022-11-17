import { useNetInfo } from "@react-native-community/netinfo";
import React from "react";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { tw } from "../../utils/tailwind";

export default function Offline() {
  const netInfo = useNetInfo();

  if (netInfo.isConnected !== true) {
    return (
      <SafeAreaView
        edges={["top"]}
        style={tw`flex-row items-center justify-center bg-red-500`}
      >
        <Text style={tw`text-xl font-semibold text-white `}>
          No network connection
        </Text>
      </SafeAreaView>
    );
  }
  return null;
}
