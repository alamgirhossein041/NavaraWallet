import {cloneDeep} from 'lodash';
import React from 'react';
import {View} from 'react-native';
import {useRecoilState} from 'recoil';
import Logo from '../../../assets/logo/logo.svg';
import useDatabase from '../../../data/database/useDatabase';
import {listWalletsState} from '../../../data/globalState/listWallets';
import {encryptAESWithKeychain, getFromKeychain} from '../../../utils/keychain';
import {tw} from '../../../utils/tailwind';
import EnableAppLock from './EnableAppLock';

export default function EnableAppLockOnBoard({navigation, route}) {
  const {walletController} = useDatabase();
  const [listWallets, setListWallets] = useRecoilState(listWalletsState);
  //background Darkmode

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
    <View
      style={tw`relative items-center w-full min-h-full px-3 bg-white dark:bg-[#18191A] `}>
      <View style={tw`mt-10`}>
        <Logo width={120} height={120} />
      </View>
      <EnableAppLock onSuccess={handlePress} />
    </View>
  );
}
