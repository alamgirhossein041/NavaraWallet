import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  CardStyleInterpolators,
  createStackNavigator,
} from "@react-navigation/stack";
import React from "react";
import { StatusBar, useColorScheme, View } from "react-native";
import { primaryColor, secondaryGray } from "../configs/theme";
import Browser from "../screens/Browser";
import Home from "../screens/Home";
import { default as NotUse, default as OnBoard } from "../screens/OnBoard";
import Settings from "../screens/Settings";
import Splash from "../screens/Splash";
import { tw } from "../utils/tailwind";
import CustomTabBar from "./CustomTabBar";

const RootStack = createStackNavigator();
const Tab = createBottomTabNavigator();

interface ITab {
  name: string;
  label: string;
  component?: any;
}

const tabs: ITab[] = [
  {
    name: "Home",
    label: "Home",
    component: Home,
  },
  // {
  //   name: 'Browser',
  //   label: 'Browser',
  //   component: () => <View />,
  // },
  {
    name: "Test",
    label: "Test",
    component: Home, //Market fake UI to Home
  },
  // {
  //   name: 'Browser',
  //   label: 'Browser',
  //   component: Browser,
  // },
  // {
  //   name: "More",
  //   label: "More",
  //   component: More, //Market fake UI to Home
  // },
  {
    name: "Profile",
    label: "Profile",
    component: Settings,
  },
];

const TabsNavigation = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      initialRouteName="Wallet"
      screenOptions={{
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: primaryColor,
        tabBarInactiveTintColor: secondaryGray,
        headerShown: false,
        tabBarShowLabel: false,
      }}
    >
      {tabs.map((tab: ITab) => (
        <Tab.Screen key={tab.name} name={tab.name} component={tab.component} />
      ))}
    </Tab.Navigator>
  );
};

const AppRoutes = () => {
  const scheme = useColorScheme();
  return (
    <View style={tw`flex-1`}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={scheme === "light" ? "white" : "#18191A"}
      />
      <RootStack.Navigator
        screenOptions={{
          animationEnabled: false,
        }}
      >
        <RootStack.Screen
          name="Splash"
          options={{ headerShown: false }}
          component={Splash}
        />
        <RootStack.Screen
          name="OnBoard"
          options={{ headerShown: false }}
          component={OnBoard}
        />
        <RootStack.Screen
          name="Browser"
          options={{
            headerShown: false,
            animationEnabled: true,
            gestureEnabled: false,
            cardStyleInterpolator: CardStyleInterpolators.forNoAnimation,
          }}
          component={Browser}
        />
        <RootStack.Screen
          name="NotUse"
          options={{ headerShown: false }}
          component={NotUse}
        />
        <RootStack.Screen
          name="TabsNavigation"
          options={{ headerShown: false }}
          component={TabsNavigation}
        />
      </RootStack.Navigator>
    </View>
  );
};

export default AppRoutes;
