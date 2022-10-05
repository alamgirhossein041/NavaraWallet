import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { ChevronLeftIcon } from "react-native-heroicons/solid";
import { tw } from "../../utils/tailwind";
import ImportByPhrase from "./ImportByPhrase";

const ImportAlreadyWallet = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator
    //         options={({ navigation }) => ({
    //           title: "Awesome app",
    //           headerLeft: () => (
    //             <ChevronLeftIcon onPress={() => navigation.toggleDrawer()} />
    //           ),
    //         })}
    >
      <Stack.Screen
        options={({ navigation }) => ({
          title: "Import your wallet",
          headerLeft: () => (
            <ChevronLeftIcon
              style={tw`text-black  mr-5`}
              onPress={() => navigation.goBack()}
            />
          ),
        })}
        name="ImportByPhrase"
        component={ImportByPhrase}
      />
    </Stack.Navigator>
  );
};

export default ImportAlreadyWallet;
