import React, { useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ViewNetworks from "./ViewNetworks";
import AddNetwork from "./AddNetwork";
const ManageNetworks = () => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="ViewNetworks" component={ViewNetworks} />
      <Stack.Screen name="AddNetwork" component={AddNetwork} />
    </Stack.Navigator>
  );
};

export default ManageNetworks;
