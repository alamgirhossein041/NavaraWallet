import { View, Text, SafeAreaView, Platform } from "react-native";
import React from "react";
import { StatusBar } from "native-base";
import { tw } from "../utils/tailwind";
import { useNetInfo } from "@react-native-community/netinfo";
import { PlatFormEnum } from "../enum";
const AppIsOffLine = () => {
  const netInfo = useNetInfo();
  const paddingTop = Platform.OS === PlatFormEnum.ANDROID ? "pt-10" : "";
  return (
    netInfo.isConnected === false && (
      <SafeAreaView style={tw`bg-red-500 ${paddingTop}`}>
        <Text style={tw`text-center text-white font-bold`}>No connection</Text>
      </SafeAreaView>
    )
  );
};
export default AppIsOffLine;