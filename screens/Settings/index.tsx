import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useEffect } from "react";
import BackButton from "../../components/UI/BackButton";

import { useTranslation } from "react-i18next";
import CreateDomain from "../Domain/CreateDomain";
import DetailDomain from "../Domain/DetailDomain";
import ManageDomains from "../Domain/ManageDomains";
import ManageWallets from "../ManageWallets";
import ShareAddress from "../ReceiveToken/ShareAddress";
import AppLock from "./AppLock/AppLock";
import EnableAppLock from "./AppLock/EnableAppLock";
import ConnectedAccounts from "./ConnectAccounts";
import { Language } from "./Language/Language";
import Menu from "./Menu";

const Settings = ({ navigation, route }) => {
  const Stack = createNativeStackNavigator();
  const rootScreenName = "Menu"; // change the name of the screen which show the tab bar
  useEffect(() => {
    const focused = getFocusedRouteNameFromRoute(route); // get the name of the focused screen
    // ensure that the focused screen name is a string (not undefined)
    if (typeof focused === "string") {
      if (focused !== rootScreenName) {
        // if the focused screen is not the root screen update the tabBarStyle
        navigation.setOptions({
          tabBarStyle: {
            display: "none",
          },
        });
      }
    }
    // reset the tabBarStyle to default
    return () =>
      navigation.setOptions({
        tabBarStyle: {},
      });
  }, [navigation, route]);
  const { t } = useTranslation();

  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleAlign: "center",
        headerShadowVisible: false,
        headerLeft: () => <BackButton />,
      }}
    >
      <Stack.Screen
        name="Menu"
        options={{
          title: `${t("setting.settings")}`,
          headerShown: true,
          headerLeft: () => <></>,
        }}
        component={Menu}
      />
      <Stack.Screen
        name="ManageWallets"
        component={ManageWallets}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ManageDomains"
        options={{
          title: `Domains`,
          headerShown: true,
        }}
        component={ManageDomains}
      />
      <Stack.Screen
        name="DetailDomain"
        options={{
          title: ``,
        }}
        component={DetailDomain}
      />
      <Stack.Screen
        name="CreateDomain"
        component={CreateDomain}
        options={{
          title: `${t("stack_screen.name_service")}`,
        }}
      />
      <Stack.Screen
        name="ConnectAccounts"
        component={ConnectedAccounts}
        options={{
          title: "Connected Accounts",
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="AppLock"
        component={AppLock}
        options={{
          title: `${t("setting.app_lock")}`,
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="EnableAppLock"
        component={EnableAppLock}
        options={{
          title: `${t("setting.networks_environment")}`,
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="ShareAddress"
        component={ShareAddress}
        options={{
          title: "Share Address",
          headerShown: true,
        }}
      />

      <Stack.Screen
        name="Language"
        component={Language}
        options={{
          title: `${t("setting.select_language")}`,
          headerShown: true,
        }}
      />
    </Stack.Navigator>
  );
};

export default Settings;
