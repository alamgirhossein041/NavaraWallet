import {View, Text, ScrollView, Platform, SafeAreaView} from 'react-native';
import React from 'react';
import {tw} from '../../../utils/tailwind';
import EnableAppLock from './EnableAppLock';
import Logo from '../../../assets/logo/logo.svg';
import {useDarkMode} from '../../../hooks/useModeDarkMode';
import {useTextDarkMode} from '../../../hooks/useModeDarkMode';
import {useGridDarkMode} from '../../../hooks/useModeDarkMode';
import {useNavigation} from '@react-navigation/native';
import {KeyboardAvoidingView} from 'native-base';
import Button from '../../../components/Button';
import {encryptAESWithKeychain, getFromKeychain} from '../../../utils/keychain';
import useDatabase from '../../../data/database/useDatabase';
import {useRecoilState, useRecoilValue} from 'recoil';
import {listWalletsState} from '../../../data/globalState/listWallets';
import {cloneDeep} from 'lodash';
import CryptoJS from 'crypto-js';

export default function EnableAppLockOnBoard({navigation, route}) {
  const {walletController} = useDatabase();
  const [listWallets, setListWallets] = useRecoilState(listWalletsState);
  //background Darkmode
  const modeColor = useDarkMode();
  //text darkmode
  const textColor = useTextDarkMode();
  //grid, shadow darkmode
  const gridColor = useGridDarkMode();
  const handlePress = async () => {
    const password = await getFromKeychain();

    if (password) {
      const seedPhrase = listWallets[0]?.seedPhrase;
      const encryptedSeedPhrase = await encryptAESWithKeychain(seedPhrase);
      await walletController.updateWallet({
        ...listWallets[0],
        seedPhrase: encryptedSeedPhrase,
      });
      setListWallets(
        cloneDeep(listWallets).map((item, index) => {
          if (index === 0) {
            return {
              ...item,
              seedPhrase: encryptedSeedPhrase,
            };
          }
          return item;
        }),
      );
    }

    navigation.navigate('EnableBiometric');
  };
  return (
    <View style={tw`relative items-center w-full min-h-full px-3 bg-white`}>
      <View style={tw`mt-10`}>
        <Logo width={120} height={120} />
      </View>
      <EnableAppLock onSuccess={handlePress} />
    </View>
  );
}
