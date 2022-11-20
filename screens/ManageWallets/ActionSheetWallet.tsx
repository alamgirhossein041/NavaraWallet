import { Actionsheet, useDisclose } from "native-base";
import React from "react";
import { useTranslation } from "react-i18next";
import { Text, TouchableOpacity, View } from "react-native";
import { Cog6ToothIcon } from "react-native-heroicons/outline";
import { EyeIcon, PencilSquareIcon } from "react-native-heroicons/solid";
import IconBackupCloud from "../../assets/icons/icon-backup-cloud.svg";
import ActionSheetItem from "../../components/UI/ActionSheetItem";
import { primaryColor } from "../../configs/theme";
import { tw } from "../../utils/tailwind";
import RemoveWallet from "./RemoveWallet";
const ActionSheetWallet = (props) => {
  const { navigation, route, backupWallet, onOpenChangeName } = props;
  const { data } = route.params;
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclose();
  return (
    <>
      <TouchableOpacity onPress={onOpen}>
        <Cog6ToothIcon width={30} height={30} color={primaryColor} />
      </TouchableOpacity>
      <Actionsheet isOpen={isOpen} onClose={onClose}>
        <Actionsheet.Content style={tw`bg-white text-black  dark:bg-[#18191A]`}>
          <ActionSheetItem
            onPress={() => {
              onOpenChangeName();
              onClose();
            }}
          >
            <View style={tw`flex-row items-center`}>
              <PencilSquareIcon fill={primaryColor} />
              <Text style={tw`mx-2 font-bold text-black dark:text-white`}>
                {t("manage_wallets.wallet_dislay_name")}
              </Text>
            </View>
          </ActionSheetItem>
          <ActionSheetItem
            onPress={() => {
              backupWallet();
              onClose();
            }}
          >
            <View style={tw`flex-row items-center`}>
              <IconBackupCloud fill={primaryColor} width={25} />
              <Text style={tw`mx-2 font-bold text-black dark:text-white`}>
                {t("manage_wallets.backup_seedphrase")}
              </Text>
            </View>
          </ActionSheetItem>
          <ActionSheetItem
            onPress={() => {
              navigation.navigate("PrivacySeedPhrase", data.seedPhrase);
              onClose();
            }}
          >
            <View style={tw`flex-row items-center`}>
              <EyeIcon fill={primaryColor} />
              <Text style={tw`mx-2 font-bold text-black dark:text-white`}>
                {t("manage_wallets.show_seedphrase")}
              </Text>
            </View>
          </ActionSheetItem>
          <RemoveWallet id={data.id} item={data} />
        </Actionsheet.Content>
      </Actionsheet>
    </>
  );
};

export default ActionSheetWallet;
