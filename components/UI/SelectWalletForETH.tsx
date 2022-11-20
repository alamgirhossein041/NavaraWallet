import { Actionsheet, useDisclose } from "native-base";
import React from "react";
import { Image, Text, View } from "react-native";
import { CheckCircleIcon, ChevronDownIcon } from "react-native-heroicons/solid";
import { useRecoilValue } from "recoil";
import ActionSheetItem from "../../components/UI/ActionSheetItem";
import PressableAnimated from "../../components/UI/PressableAnimated";
import { primaryColor } from "../../configs/theme";
import { ChainWallet } from "../../data/database/entities/chainWallet";
import { Wallet } from "../../data/database/entities/wallet";
import { listWalletsState } from "../../data/globalState/listWallets";
import { NETWORKS } from "../../enum/bcEnum";
import getAvatar from "../../utils/getAvatar";
import { shortenAddress } from "../../utils/stringsFunction";
import { tw } from "../../utils/tailwind";
const SelectWalletForETH = (props) => {
  const { walletSelected, setWalletSelected, countDomain } = props;
  const { isOpen, onOpen, onClose } = useDisclose();
  const listWallets = useRecoilValue(listWalletsState);
  const getEthAddress = (chains: ChainWallet[]): string => {
    return chains.find(
      (chain: ChainWallet) => chain.network === NETWORKS.ETHEREUM
    ).address;
  };

  const handleChangeWalletSelected = (index) => {
    setWalletSelected(index);
    onClose();
  };

  return (
    <View style={tw`w-full mb-3`}>
      <PressableAnimated
        onPress={onOpen}
        style={tw`w-full p-3 bg-[${primaryColor}] rounded-lg`}
      >
        <View style={tw`flex-row items-center justify-between w-full`}>
          <View style={tw`flex-row items-center`}>
            <Image
              style={tw`w-8 h-8 rounded-full`}
              source={{
                uri: getAvatar(walletSelected),
              }}
            />
            <View style={tw`mx-3`}>
              <Text style={tw`font-bold text-white`}>
                {listWallets[walletSelected].name}
              </Text>
              <Text style={tw`text-xs text-white`}>{countDomain} domains</Text>
            </View>
          </View>
          <View>
            <ChevronDownIcon size={25} color="white" />
          </View>
        </View>
      </PressableAnimated>
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
                {walletSelected === index && (
                  <View style={tw`absolute right-0 `}>
                    <CheckCircleIcon color={primaryColor} />
                  </View>
                )}
              </View>
            </ActionSheetItem>
          ))}
        </Actionsheet.Content>
      </Actionsheet>
    </View>
  );
};

export default SelectWalletForETH;
