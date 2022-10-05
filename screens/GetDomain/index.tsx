// import React, { useState } from "react";
// import { createStackNavigator } from "@react-navigation/stack";
// import { ChevronLeftIcon } from "react-native-heroicons/solid";
// import MintDomain from "./MintDomain";
// import GetYourDomain from "./GetYourDomain";
// import MintingDomain from "./MintingDomain";
// const Stack = createStackNavigator();

// const GetDomain = () => {
//   return (
//     <Stack.Navigator>
//       <Stack.Screen name="GetYourDomain" component={GetYourDomain} />
//       <Stack.Screen
//         name="MintDomain"
//         component={MintDomain}
//         options={({ navigation }) => ({
//           title: "Awesome app",
//           headerLeft: () => (
//             <ChevronLeftIcon onPress={() => navigation.toggleDrawer()} />
//           ),
//         })}
//       />
//       <Stack.Screen name="MintingDomain" component={MintingDomain} />
//     </Stack.Navigator>
//   );
// };

// export default GetDomain;
