import React, { useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ViewListWallet from "./ViewListWallet";
import SendingToken from "./SendingToken";
import ReceiveSpecificToken from "../ReceiveToken/ReceiveSpecificToken";
import ReceiveToken from "../ReceiveToken";
import AddToken from "../AddToken";
const Stack = createStackNavigator();

const SendToken = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="AddToken"
        options={{ headerShown: false }}
        component={AddToken}
      />
      <Stack.Screen
        name="ViewListWallet"
        component={ViewListWallet}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SendingToken"
        component={SendingToken}
        options={{ title: "Sensad Token", headerStyle: { backgroundColor: "red" } }}
      />

      <Stack.Screen
        name="ReceiveToken"
        component={ReceiveToken}
        options={{ title: "Receive Token" }}
      />

      <Stack.Screen
        name="ReceiveSpecificToken"
        component={ReceiveSpecificToken}
        options={{ title: "Receive Token" }}
      />

    </Stack.Navigator>
  );
};

export default SendToken;
