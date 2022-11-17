import { useNavigation } from "@react-navigation/native";
import { Actionsheet, useDisclose } from "native-base";
import React from "react";
import { useTranslation } from "react-i18next";
import { Text, TouchableOpacity, View } from "react-native";
import DraggableFlatList from "react-native-draggable-flatlist";
import { PlusIcon } from "react-native-heroicons/outline";
import { DotsHorizontalIcon } from "react-native-heroicons/solid";
import { useRecoilState } from "recoil";
import IconImport from "../../assets/icons/icon-folder-add.svg";
import IconCloudRestore from "../../assets/icons/icon-folder-cloud.svg";
import WalletAdd from "../../assets/icons/icon-wallet-add.svg";
import ActionSheetItem from "../../components/UI/ActionSheetItem";
import PressableAnimated from "../../components/UI/PressableAnimated";
import { primaryColor } from "../../configs/theme";
import { listWalletsState } from "../../data/globalState/listWallets";
import useWalletsActions from "../../data/globalState/listWallets/listWallets.actions";
import { shortWalletName } from "../../utils/stringsFunction";
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

  const [listWallets, setListWallets] = useRecoilState(listWalletsState);

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
            <Text style={tw`font-bold text-black dark:text-white`}>
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
            <Text style={tw`font-bold text-black dark:text-white`}>
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
            <Text style={tw`font-bold text-black dark:text-white`}>
              {t("manage_wallets.restore_wallet_from_cloud")}
            </Text>
          </View>
        </ActionSheetItem>
      </Actionsheet.Content>
    </Actionsheet>
  );

  return (
    <View style={tw`flex flex-col justify-between bg-white dark:bg-[#18191A] `}>
      {listWallets && (
        <DraggableFlatList
          data={listWallets}
          renderItem={RenderWallet}
          keyExtractor={(item) => item.id}
          onDragEnd={({ data }) => setListWallets(data)}
        />
      )}
      {/* ActionSheet create walllet */}
      {actionSheetCreateWallet}
    </View>
  );
};

const RenderWallet = ({ item: wallet, drag, isActive }) => {
  const navigation = useNavigation();
  const createdIndex = useWalletsActions().createdIndex(wallet.id);
  const subStringWalletId = shortWalletName(wallet.id);
  const onWalletPress = () => {
    navigation.navigate(
      "DetailWallet" as never,
      {
        index: createdIndex,
        data: wallet,
      } as never
    );
    // onOpen()
  };

  return (
    <PressableAnimated
      onLongPress={drag}
      disabled={isActive}
      onPress={() => onWalletPress()}
      key={wallet.id}
      style={tw`px-4 mb-3`}
    >
      <View style={tw`flex flex-row items-center justify-between mx-5 mb-1`}>
        <Text style={tw`font-bold dark:text-white `}>
          {wallet.name === null
            ? `Wallet #${subStringWalletId}`
            : `${wallet.name}`}
        </Text>
        <TouchableOpacity onPress={() => onWalletPress()}>
          <DotsHorizontalIcon color="gray" />
        </TouchableOpacity>
      </View>
      <CardWallet wallet={wallet} />
    </PressableAnimated>
  );
};

export default Wallets;
