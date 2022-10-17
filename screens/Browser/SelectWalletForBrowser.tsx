import {View, Text, Image} from 'react-native';
import React, {memo, useCallback} from 'react';
import {backgroundCard} from '../Home/CardWallet';
import PressableAnimated from '../../components/PressableAnimated';
import {tw} from '../../utils/tailwind';
import {useRecoilState, useRecoilValue} from 'recoil';
import {
  idWalletSelected,
  listWalletsState,
} from '../../data/globalState/listWallets';
import {MD5} from 'crypto-js';
import {Actionsheet, useDisclose} from 'native-base';
import {Wallet} from '../../data/database/entities/wallet';
import ActionSheetItem from '../../components/ActionSheetItem';
import {CheckCircleIcon} from 'react-native-heroicons/solid';
import {primaryColor} from '../../configs/theme';
import {ChainWallet} from '../../data/database/entities/chainWallet';
import {NETWORKS} from '../../enum/bcEnum';
import {shortenAddress} from '../../utils/stringsFunction';
const getAvatar = (id: number) => {
  return `https://gravatar.com/avatar/${MD5(id.toString())}?s=400&d=retro`;
};
const SelectWalletForBrowser = memo((props: any) => {
  const {onReload} = props;
  const {isOpen, onOpen, onClose} = useDisclose();
  const listWallets = useRecoilValue(listWalletsState);
  const [indexWalletSeleted, setIndexWalletSeleted] =
    useRecoilState(idWalletSelected);
  const getEthAddress = (chains: ChainWallet[]): string => {
    return chains.find(
      (chain: ChainWallet) => chain.network === NETWORKS.ETHEREUM,
    ).address;
  };

  const handleChangeWalletSelected = index => {
    setIndexWalletSeleted(index);
    onClose();
    onReload();
  };
  return (
    <PressableAnimated onPress={onOpen} style={tw`w-8 h-8 mr-3 roundesd-full`}>
      <Image
        style={tw`w-8 h-8 rounded-full`}
        source={{
          uri: getAvatar(indexWalletSeleted),
        }}
      />
      <Actionsheet isOpen={isOpen} onClose={onClose}>
        <Actionsheet.Content>
          {listWallets.map((wallet: Wallet, index) => (
            <ActionSheetItem onPress={() => handleChangeWalletSelected(index)}>
              <View style={tw`flex-row items-center justify-between`}>
                <View style={tw`flex-row items-center`}>
                  <Image
                    style={tw`w-8 h-8 rounded-full`}
                    source={{
                      uri: getAvatar(index),
                    }}
                  />
                  <Text numberOfLines={1} style={tw`mx-3 font-bold`}>
                    {wallet.name || `Wallet ${index + 1}`}
                  </Text>
                  <Text numberOfLines={1} style={tw`mx-3 font-bold`}>
                    ({shortenAddress(getEthAddress(wallet.chains))})
                  </Text>
                </View>
                {indexWalletSeleted === index && (
                  <CheckCircleIcon color={primaryColor} />
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
