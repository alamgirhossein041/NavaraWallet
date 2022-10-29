import {StatusBar, Text} from 'native-base';
import React, {useCallback, useEffect} from 'react';
import {SafeAreaView, View} from 'react-native';
import {useRecoilState, useRecoilValue, useSetRecoilState} from 'recoil';
import Logo from '../../assets/logo/logo-white.svg';
import {primaryColor} from '../../configs/theme';
import useDatabase from '../../data/database/useDatabase';
import {listWalletsState} from '../../data/globalState/listWallets';
import {walletEnvironmentState} from '../../data/globalState/userData';
import {ENVIRONMENT} from '../../global.config';
import {useLocalStorage} from '../../hooks/useLocalStorage';
import {getFromKeychain, resetKeychain} from '../../utils/keychain';
import {localStorage, NETWORKS_ENVIRONMENT} from '../../utils/storage';
import {tw} from '../../utils/tailwind';

const Splash = ({navigation}) => {
  const {walletController, connection, setupConnection} = useDatabase();
  const setListWallets = useSetRecoilState(listWalletsState);
  const setWalletEnvironment = useSetRecoilState(walletEnvironmentState);

  const redirect = route => {
    navigation.replace(route);
  };

  useEffect(() => {
    if (!!connection) {
      (async () => {
        const environment = await localStorage.get(NETWORKS_ENVIRONMENT);
        setWalletEnvironment(environment as ENVIRONMENT);
        const wallets = await walletController.getWallets();
        if (wallets && wallets.length > 0) {
          setListWallets(wallets);
          const password = await getFromKeychain();
          if (!password) {
            navigation.navigate('OnBoard', {screen: 'EnableAppLockOnBoard'});
          } else {
            redirect('TabsNavigation');
          }
        } else {
          await resetKeychain();
          redirect('OnBoard');
        }
      })();
    }
  }, [connection]);

  return (
    <SafeAreaView
      style={tw`items-center justify-center w-full h-full bg-[${primaryColor}]`}>
      <StatusBar barStyle="dark-content" backgroundColor={primaryColor} />
      <Logo width={240} height={240} />
    </SafeAreaView>
  );
};

export default Splash;
