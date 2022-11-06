import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { useTranslation } from "react-i18next";
import BackButton from "../../components/UI/BackButton";
import { tw } from "../../utils/tailwind";
import BackupWallet from "../Backup/BackupWallet";
import RestoreWallet from "../Backup/RestoreWallet";
import SelectFile from "../Backup/SelectFile";
import CreateWallet from "../OnBoard/CreateWallet";
import ImportWallet from "../OnBoard/ImportWallet";
import DetailWallet from "./DetailWallet";
import PrivacySeedPhrase from "./privacySeedPhrase";
import Wallets from "./Wallets";

const ManageWallets = () => {
  const Stack = createNativeStackNavigator();
  //

  const { t } = useTranslation();

  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleAlign: "center",
        headerStyle: tw`bg-white dark:bg-[#18191A] `,
        headerShadowVisible: false,
        headerLeft: () => <BackButton />,
      }}
    >
      <Stack.Screen
        name="Wallets"
        component={Wallets}
        options={{
          title: `${t("stack_screen.manage_wallets")}`,
        }}
      />
      <Stack.Screen
        name="CreateWallet"
        component={CreateWallet}
        options={{ title: "" }}
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
      <Stack.Screen
        name="DetailWallet"
        component={DetailWallet}
        options={{
          title: "",
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
    </Stack.Navigator>
  );
};

export default ManageWallets;
