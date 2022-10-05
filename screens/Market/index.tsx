import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import React, { useEffect } from "react";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Market = ({ navigation, route }) => {
  // const insets = useSafeAreaInsets();
  // const rootScreenName = "Menu"; // change the name of the screen which show the tab bar
  // useEffect(() => {
  //   const focused = getFocusedRouteNameFromRoute(route); // get the name of the focused screen
  //   // ensure that the focused screen name is a string (not undefined)
  //   if (typeof focused === "string")
  //     if (focused !== rootScreenName)
  //       // if the focused screen is not the root screen update the tabBarStyle
  //       navigation.setOptions({
  //         tabBarStyle: {
  //           display: "none",
  //         },
  //       });
  //   // reset the tabBarStyle to default
  //   return () =>
  //     navigation.setOptions({
  //       tabBarStyle: {
  //         height: 60 + insets.bottom,
  //         position: "absolute",
  //       },
  //     });
  // }, [navigation, route]);
  return (
    <View>
      <Text>Market</Text>
    </View>
  );
};

export default Market;
