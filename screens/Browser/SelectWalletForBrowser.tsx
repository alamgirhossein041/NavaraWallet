import { Actionsheet, useDisclose } from "native-base";
import React, { memo, useEffect, useState } from "react";
import { Image, Text, View } from "react-native";
import { CheckCircleIcon } from "react-native-heroicons/solid";
import { useRecoilState, useRecoilValue } from "recoil";
import ActionSheetItem from "../../components/UI/ActionSheetItem";
import PressableAnimated from "../../components/UI/PressableAnimated";
import { primaryColor } from "../../configs/theme";
import WalletController from "../../data/database/controllers/wallet.controller";
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
  const [listWalletDatabase, setListWalletDatabase] = useState([]);
  const walletController = new WalletController();

  const [indexWalletSelected, setIndexWalletSelected] =
    useRecoilState(idWalletSelected);
  const getEthAddress = (chains: ChainWallet[]): string => {
    return chains.find(
      (chain: ChainWallet) => chain.network === NETWORKS.ETHEREUM
    ).address;
  };

  useEffect(() => {
    (async () => {
      const wallets = await walletController.getWallets();
      setListWalletDatabase(wallets);
    })();
  }, [listWallets]);

  const handleChangeWalletSelected = (index) => {
    setIndexWalletSelected(index);
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
          {listWalletDatabase.map((wallet: Wallet, index) => (
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
                  <View style={tw`absolute right-0 `}>
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
