import { GoogleSignin } from "@react-native-google-signin/google-signin";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import Figure from "../../assets/enable-cloud-backup.svg";
import Button from "../../components/UI/Button";
import { primaryGray } from "../../configs/theme";
import { useWalletSelected } from "../../hooks/useWalletSelected";
import { tw } from "../../utils/tailwind";
import LoginToCloudModal from "../Backup/LoginToCloudModal";

const EnableCloudBackup = ({ navigation }) => {
  const [isOpenLoginModal, setIsOpenModal] = useState(false);
  const walletSelected = useWalletSelected();
  const { t } = useTranslation();

  const navigateToBackupWallet = async () => {
    try {
      if (await GoogleSignin.isSignedIn()) {
        navigation.navigate("BackupWallet", {
          indexSelected: walletSelected.index,
        });
        // await GoogleSignin.signOut();
      } else {
        setIsOpenModal(true);
      }
    } catch (error) {}
  };

  useEffect(() => {
    if (walletSelected?.data?.isBackedUp === true) {
      navigation.replace("TabsNavigation");
    }
  });

  return (
    <View
      style={tw`h-full flex-col  items-center android:py-2 ios:py-3 px-3 bg-white dark:bg-[#18191A] `}
    >
      <View style={tw`pt-10`}>
        <Text style={tw`text-center text-3xl font-semibold py-3   `}>
          {t("cloud_backup.cloud_backup_title")}
        </Text>
        <View style={tw``}>
          <Figure width="100%" />
        </View>
        <View>
          {/* <Text style={tw`w-full text-center text-base font-semibold py-3 `}>
          {t('cloud_backup.question')}
          </Text> */}
          <Text style={tw`dark:text-white   text-left py-5 `}>
            {t("cloud_backup.cloud_backup_description")}
          </Text>
        </View>
      </View>
      <View style={tw`absolute w-full bottom-5`}>
        <Button
          variant="text"
          buttonStyle={"mt-3"}
          buttonColor={primaryGray}
          stringStyle="text-center text-lg font-medium text-white"
          onPress={() => {
            navigation.replace("TabsNavigation");
          }}
        >
          Backup later
        </Button>
        <Button
          fullWidth
          stringStyle="text-center text-lg font-medium text-white"
          onPress={navigateToBackupWallet}
        >
          Continue
        </Button>
      </View>
      <LoginToCloudModal
        isOpenModal={isOpenLoginModal}
        onClose={async () => {
          await navigateToBackupWallet();
          setIsOpenModal(false);
        }}
      />
    </View>
  );
};

export default EnableCloudBackup;
