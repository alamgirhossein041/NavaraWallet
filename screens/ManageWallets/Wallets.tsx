import { Actionsheet, useDisclose } from "native-base";
import React from "react";
import { useTranslation } from "react-i18next";
import {
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { PlusIcon } from "react-native-heroicons/outline";
import { DotsHorizontalIcon } from "react-native-heroicons/solid";
import { useRecoilState } from "recoil";
import IconImport from "../../assets/icons/icon-folder-add.svg";
import IconCloudRestore from "../../assets/icons/icon-folder-cloud.svg";
import WalletAdd from "../../assets/icons/icon-wallet-add.svg";
import ActionSheetItem from "../../components/UI/ActionSheetItem";
import { primaryColor } from "../../configs/theme";
import { listWalletsState } from "../../data/globalState/listWallets";
import { tw } from "../../utils/tailwind";
import CardWallet from "../Home/CardWallet";

const Wallets = ({ navigation }) => {
  const { isOpen, onOpen, onClose } = useDisclose();
  navigation.setOptions({
    headerRight: () => (
      <TouchableOpacity onPress={onOpen}>
        <WalletAdd width={30} height={30} />
      </TouchableOpacity>
    ),
  });
  const onWalletPress = (index) => {
    if (listWallets && listWallets.length > 0) {
      navigation.navigate("DetailWallet", {
        index,
        data: listWallets[index],
      });
    }
    // onOpen()
  };

  const [listWallets] = useRecoilState(listWalletsState);

  // const handleOpenCreateWallet=()=>{
  //   isOpen()
  // }
  const { t } = useTranslation();

  const actionSheetCreateWallet = (
    <Actionsheet isOpen={isOpen} onClose={onClose}>
      <Actionsheet.Content style={tw`bg-white text-black  dark:bg-[#18191A]`}>
        <ActionSheetItem
          onPress={() => {
            navigation.navigate("CreateWallet");
            onClose();
          }}
        >
          <View style={tw`flex-row items-center`}>
            <PlusIcon
              width={25}
              height={25}
              stroke={primaryColor}
              style={tw`mr-2`}
            />
            <Text style={tw`dark:text-white text-black    font-bold`}>
              {t("manage_wallets.create_a_new_wallet")}
            </Text>
          </View>
        </ActionSheetItem>
        <ActionSheetItem
          onPress={() => {
            navigation.navigate("ImportWallet");
            onClose();
          }}
        >
          <View style={tw`flex-row items-center`}>
            <IconImport
              width={25}
              height={25}
              stroke={primaryColor}
              style={tw`mr-2`}
            />
            <Text style={tw`dark:text-white text-black   font-bold`}>
              {t("manage_wallets.import_wallet")}
            </Text>
          </View>
        </ActionSheetItem>
        <ActionSheetItem
          onPress={() => {
            navigation.navigate("SelectFile");
            onClose();
          }}
        >
          <View style={tw`flex-row items-center`}>
            <IconCloudRestore
              width={25}
              height={25}
              stroke={primaryColor}
              style={tw`mr-2`}
            />
            <Text style={tw`dark:text-white  text-black   font-bold`}>
              {t("manage_wallets.restore_wallet_from_cloud")}
            </Text>
          </View>
        </ActionSheetItem>
      </Actionsheet.Content>
    </Actionsheet>
  );

  return (
    <ScrollView style={tw`bg-white dark:bg-[#18191A] px-4 py-1`}>
      <View style={tw` flex flex-col justify-between`}>
        <View>
          <View style={tw``}>
            {listWallets &&
              listWallets.map((wallet, index) => (
                //
                <Pressable
                  onPress={() => onWalletPress(index)}
                  key={wallet.id}
                  style={tw`mb-3`}
                >
                  <View
                    style={tw`flex flex-row mx-5 justify-between items-center mb-1`}
                  >
                    <Text style={tw`dark:text-white  font-bold `}>
                      {wallet.name === null
                        ? `Wallet ${index + 1}`
                        : `${wallet.name}`}
                    </Text>
                    <TouchableOpacity onPress={() => onWalletPress(index)}>
                      <DotsHorizontalIcon color="gray" />
                    </TouchableOpacity>
                  </View>

                  <View style={tw``}>
                    <CardWallet wallet={wallet} index={index} />
                  </View>
                </Pressable>
              ))}
          </View>
        </View>
        {/* ActionSheet create walllet */}
        {actionSheetCreateWallet}
      </View>
    </ScrollView>
  );
};

export default Wallets;
