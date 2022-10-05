import { ScrollView, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { View } from "react-native";
import Button from "../../components/Button";
import InputIcon from "../../components/InputIcon";
import TabCustom from "../../components/TabProfile";
import { tw } from "../../utils/tailwind";
import IconScanSeedPhrase from "../../assets/icons/icon-scan-seedphrase.svg";
import InputText from "../../components/InputText";
import { primaryGray } from "../../configs/theme";
import ImportByPhrase from "./ImportByPhrase";
import ImportByPrivateKey from "./ImportByPrivateKey";
import { Stack } from "native-base";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ImportWallet from "./ImportWallet";
const ImportWalletStack = () => {
  const [tabSelected, setTabselected] = useState(0);
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
       {/* <Stack.Screen name="ImportWallet" component={ImportWallet} /> */}
      <Stack.Screen name="ImportByPhrase" component={ImportByPhrase} />
      <Stack.Screen name="ImportByPrivateKey" component={ImportByPrivateKey} />
    </Stack.Navigator>
  );
};

export default ImportWalletStack;
