import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BackButton from "../../components/UI/BackButton";

import BackupWallet from "../Backup/BackupWallet";
import RestoreWallet from "../Backup/RestoreWallet";
import SelectFile from "../Backup/SelectFile";
import CreateDomain from "../Domain/CreateDomain";
import { Rewards } from "../Domain/Rewards";
import DetailWallet from "../ManageWallets/DetailWallet";
import PrivacySeedPhrase from "../ManageWallets/PrivacySeedPhrase";
import Notification from "../Notification";
import WalletID from "../OnBoard/CreateWallet";
import ReceiveToken from "../ReceiveToken";
import ReceiveSpecificToken from "../ReceiveToken/ReceiveSpecificToken";
import ConfirmTransaction from "../SendToken/ConfirmTransaction";
import ResultTransaction from "../SendToken/ResultTransaction";
import SendingToken from "../SendToken/SendingToken";
import ViewListWallet from "../SendToken/ViewListWallet";
import ManageSessions from "../Settings/ManageSessions";
import SwapToken from "../Swap";
import SwapScreen from "../Swap/Paraswap";
import { default as DetailChain } from "./DetailChains";
import DetailNews from "./DetailNews";
import DetailPrice from "./DetailPrice";
import HistoryWallets from "./HistoryWallets";
import ManageChains from "./ManageChains";
import AddToken from "./ManageChains/AddToken";
import WalletDashboard from "./WalletDashboard";

const Home = ({ navigation, route }) => {
  const Stack = createNativeStackNavigator();
  const insets = useSafeAreaInsets();
  const rootScreenName = "WalletDashboard"; // change the name of the screen which show the tab bar
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
  }, [insets.bottom, navigation, route]);
  //background Darkmode

  const { t } = useTranslation();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShadowVisible: false,
        headerTitleAlign: "center",
        headerLeft: () => <BackButton />,
      }}
    >
      <Stack.Screen
        name="WalletDashboard"
        options={{
          headerShown: false,
          headerTitleAlign: "center",
          title: `${t("stack_screen.wallet_dashboard")}`,
        }}
        component={WalletDashboard}
      />

      {/* screen Receive Token */}
      <Stack.Screen
        name="ReceiveToken"
        component={ReceiveToken}
        options={{
          title: `${t("stack_screen.receive")}`,
        }}
      />
      <Stack.Screen name="DetailChain" component={DetailChain} options={{}} />
      {/* <Stack.Screen name="DetailTransaction" component={DetailTransaction} /> */}
      <Stack.Screen
        name="ReceiveSpecificToken"
        component={ReceiveSpecificToken}
        options={{
          title: "",
        }}
      />
      {/* screen Receive Token */}

      {/* screen Send Token */}
      <Stack.Screen
        name="ViewListWallet"
        component={ViewListWallet}
        options={{
          title: `${t("stack_screen.send_token")}`,
        }}
      />
      <Stack.Screen
        name="SendingToken"
        component={SendingToken}
        options={{ title: `${t("stack_screen.send_token")}` }}
      />
      <Stack.Screen
        name="ResultTransaction"
        component={ResultTransaction}
        options={{
          headerShown: false,
        }}
      />
      {/* screen Send Token */}

      <Stack.Screen
        name="ConfirmTransaction"
        component={ConfirmTransaction}
        options={{}}
      />

      <Stack.Screen
        name="CreateDomain"
        component={CreateDomain}
        options={{
          title: `${t("stack_screen.name_service")}`,
        }}
      />
      <Stack.Screen
        name="Rewards"
        component={Rewards}
        options={{
          title: `${t("stack_screen.rewards")}`,
        }}
      />
      <Stack.Screen
        name="WalletID"
        component={WalletID}
        options={{
          title: `${t("stack_screen.wallet_id")}`,
        }}
      />
      <Stack.Screen
        name="DetailWallet"
        component={DetailWallet}
        options={{
          title: "",
        }}
      />
      <Stack.Screen
        name="SwapToken"
        component={SwapToken}
        options={{
          title: `${t("stack_screen.swap_token")}`,
          headerShown: true,
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        name="SwapScreen"
        component={SwapScreen}
        options={{
          title: `${t("home.swap")}`,
          headerShown: true,
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        name="Notification"
        component={Notification}
        options={{
          title: `${t("stack_screen.notification")}`,
        }}
      />
      <Stack.Screen
        name="ManageChains"
        component={ManageChains}
        options={{
          title: `${t("stack_screen.manage_chains")}`,
        }}
      />
      <Stack.Screen
        name="HistoryWallets"
        component={HistoryWallets}
        options={{
          title: `${t("stack_screen.history_wallets")}`,
        }}
      />
      <Stack.Screen
        name="DetailNews"
        component={DetailNews}
        options={{
          title: `${t("stack_screen.detail_new")}`,
        }}
      />
      <Stack.Screen
        name="DetailPrice"
        component={DetailPrice}
        options={{
          title: `${t("stack_screen.detail_price")}`,
        }}
      />
      <Stack.Screen
        name="BackupWallet"
        component={BackupWallet}
        options={{
          title: `${t("stack_screen.create_your_backup_file")}`,
        }}
      />

      <Stack.Screen
        name="PrivacySeedPhrase"
        component={PrivacySeedPhrase}
        options={{}}
      />
      <Stack.Screen
        name="SelectFile"
        component={SelectFile}
        options={{
          title: `${t("stack_screen.select_file")}`,
        }}
      />
      <Stack.Screen
        name="RestoreWallet"
        component={RestoreWallet}
        options={{
          title: `${t("stack_screen.restore_wallet")}`,
        }}
      />
      <Stack.Screen
        name="ManageSessions"
        component={ManageSessions}
        options={{
          title: `Sessions`,
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="AddToken"
        component={AddToken}
        options={{
          title: `Sessions`,
          headerShown: true,
        }}
      />
    </Stack.Navigator>
  );
};

export default Home;
