import React, { useCallback } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { tw } from '../../utils/tailwind';
import WalletIcon from '../../assets/icons/icon-solid-wallet.svg';
import SettingIcon from '../../assets/icons/icon-settings.svg';
import { primaryColor } from '../../configs/theme';
import MenuItem from '../../components/MenuItem';
import Button from '../../components/Button';
import HeaderScreen from '../../components/HeaderScreen';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { LIST_WALLETS } from '../../utils/storage';
import { useDarkMode } from '../../hooks/useDarkMode';
import { useTextDarkMode } from '../../hooks/useTextDarkMode';
import { useGridDarkMode } from '../../hooks/useGridDarkMode';
import { useRecoilState } from 'recoil';
import { listWalletsState } from '../../data/globalState/listWallets';
import { CreditCardIcon } from 'react-native-heroicons/solid';

const Wallets = ({ navigation }) => {
  type walletType = {
    name: string;
    color: string;
  };
  const [listWallets] = useRecoilState(listWalletsState);
  let fakeWalletList: walletType[] = [
    {
      name: 'thisismyfirstwallet',
      color: primaryColor,
    },
  ];
  const onWalletPress = useCallback(
    (index: number) => {
      if (listWallets && listWallets.length > 0) {
        navigation.push('ManageSpecificWallet', {
          index,
          data: listWallets[index],
        });
      }
    },
    [listWallets],
  );
  const modeColor = useDarkMode();
  //text darkmode
  const textColor = useTextDarkMode();
  //grid, shadow darkmode
  const gridColor = useGridDarkMode();
  return (
    <View
      style={tw`h-full px-4 flex flex-col justify-between ${modeColor}`}>
      <View>
        {/* <HeaderScreen title="Manage Wallets" showBack /> */}
        {/* <Text style={tw`text-base mt-10`}>Choose network (${enabledNetwork.length}/${networks.length})</Text> */}
        <View style={tw``}>
          {listWallets &&
            listWallets.map((wallet, index) => (
              <View key={index}>
                <MenuItem
                  icon={
                    <View
                      style={tw` w-9 h-9 p-2 rounded-full bg-white`}>
                      <CreditCardIcon width="100%" height="100%" fill={primaryColor} />
                    </View>
                  }
                  iconPadding={''}
                  name={wallet.label}
                  onPress={() => onWalletPress(index)}
                  // value={
                  //   <TouchableOpacity activeOpacity={0.6}
                  //     style={tw` w-10 h-10 p-2 rounded-full bg-white`}
                  //     onPress={() => onWalletPress(wallet)}
                  //   >
                  //     <SettingIcon width="100%" height="100%" fill="black" />
                  //   </TouchableOpacity>
                  // }
                  next={true}
                  disabled
                />
              </View>
            ))}
        </View>
      </View>
      <View style={tw`flex items-center w-full mb-3`}>
        <Button
          buttonStyle="my-2"
          stringStyle="text-lg"
          onPress={() => navigation.navigate('ImportWalletStack')}>
          Import Wallet
        </Button>
        <Button
          stringStyle="text-lg"
          onPress={() => navigation.navigate('WalletName')}>
          Add new Wallet
        </Button>
      </View>
    </View>
  );
};

export default Wallets;
