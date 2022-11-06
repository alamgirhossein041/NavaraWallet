import React from "react";

import { createStackNavigator } from "@react-navigation/stack";
import { View } from "react-native";
import BackButton from "../../components/UI/BackButton";
import { tw } from "../../utils/tailwind";
import BackupWallet from "../Backup/BackupWallet";
import EnableAppLockOnBoard from "../Settings/AppLock/EnableAppLockOnBoard";
import CreateWallet from "./CreateWallet";
import EnableBiometric from "./EnableBiometric";
import EnableCloudBackup from "./EnableCloudBackup";
import ImportWallet from "./ImportWallet";
import SlideOnBoard from "./SlideOnBoard";
import VerifyPassPhrase from "./VerifyPassPhrase";
const Stack = createStackNavigator();

const OnBoard = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        headerShadowVisible: false,
        headerLeft: () => (
          <View style={tw`mx-3`}>
            <BackButton />
          </View>
        ),
      }}
    >
      <Stack.Screen name="SlideOnBoard" component={SlideOnBoard} />
      <Stack.Screen
        name="EnableAppLockOnBoard"
        component={EnableAppLockOnBoard}
      />
      <Stack.Screen
        name="ImportWallet"
        options={{
          headerShown: true,
          title: "",
          // headerLeft: () => <></>,
        }}
        component={ImportWallet}
      />
      <Stack.Screen name="CreateWallet" component={CreateWallet} />
      <Stack.Screen name="VerifyPassPhrase" component={VerifyPassPhrase} />
      <Stack.Screen name="EnableCloudBackup" component={EnableCloudBackup} />
      <Stack.Screen name="EnableBiometric" component={EnableBiometric} />
      <Stack.Screen name="BackupWallet" component={BackupWallet} />
    </Stack.Navigator>
  );
};

export default OnBoard;
