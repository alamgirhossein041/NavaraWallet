import { Actionsheet, useDisclose } from "native-base";
import React, { memo } from "react";
import { Image, Text, View } from "react-native";
import { CheckCircleIcon } from "react-native-heroicons/solid";
import { useRecoilState, useRecoilValue } from "recoil";
import ActionSheetItem from "../../components/UI/ActionSheetItem";
import PressableAnimated from "../../components/UI/PressableAnimated";
import { primaryColor } from "../../configs/theme";
import { ChainWallet } from "../../data/database/entities/chainWallet";
import { Wallet } from "../../data/database/entities/wallet";
import {
  idWalletSelected,
  listWalletsState,
} from "../../data/globalState/listWallets";
import { NETWORKS } from "../../enum/bcEnum";
import getAvatar from "../../utils/getAvatar";
import { shortenAddress } from "../../utils/stringsFunction";
import { tw } from "../../utils/tailwind";
const SelectWalletForBrowser = memo((props: any) => {
  const { isOpen, onOpen, onClose } = useDisclose();
  const listWallets = useRecoilValue(listWalletsState);
  const [indexWalletSelected, setIndexWalletSeleted] =
    useRecoilState(idWalletSelected);
  const getEthAddress = (chains: ChainWallet[]): string => {
    return chains.find(
      (chain: ChainWallet) => chain.network === NETWORKS.ETHEREUM
    ).address;
  };

  const handleChangeWalletSelected = (index) => {
    setIndexWalletSeleted(index);
    onClose();
  };
  return (
    <PressableAnimated onPress={onOpen} style={tw`w-8 h-8 mr-3 roundesd-full`}>
      <Image
        style={tw`w-8 h-8 rounded-full`}
        source={{
          uri: getAvatar(indexWalletSelected),
        }}
      />
      <Actionsheet isOpen={isOpen} onClose={onClose}>
        <Actionsheet.Content style={tw`bg-white dark:bg-[#18191A]`}>
          {listWallets.map((wallet: Wallet, index) => (
            <ActionSheetItem onPress={() => handleChangeWalletSelected(index)}>
              <View style={tw`flex-row items-center justify-between w-full`}>
                <View style={tw`flex-row items-center flex-1`}>
                  <Image
                    style={tw`w-8 h-8 rounded-full`}
                    source={{
                      uri: getAvatar(index),
                    }}
                  />
                  <Text
                    numberOfLines={1}
                    style={tw`mx-3 font-bold text-black dark:text-white`}
                  >
                    {wallet.name || `Wallet ${index + 1} `}(
                    {shortenAddress(getEthAddress(wallet.chains))})
                  </Text>
                </View>
                {indexWalletSelected === index && (
                  <View style={tw`absolute right-0 bg-white dark:bg-[#18191A]`}>
                    <CheckCircleIcon color={primaryColor} />
                  </View>
                )}
              </View>
            </ActionSheetItem>
          ))}
        </Actionsheet.Content>
      </Actionsheet>
    </PressableAnimated>
  );
});

export default SelectWalletForBrowser;
