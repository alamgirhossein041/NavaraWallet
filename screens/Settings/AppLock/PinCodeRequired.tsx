import {KeyboardAvoidingView, Modal, useDisclose} from 'native-base';
import React, {useEffect, useState} from 'react';
import {Platform, ScrollView, Text, Vibration, View} from 'react-native';
import {useRecoilState} from 'recoil';
import PinCodeInput from '../../../components/PinCodeInput';
import {appLockState} from '../../../data/globalState/appLock';
import {IAppLockState} from '../../../data/types';
import checkPinCode from '../../../utils/checkPinCode';
import {localStorage, STORAGE_APP_LOCK} from '../../../utils/storage';
import {tw} from '../../../utils/tailwind';
import Logo from '../../../assets/logo/logo.svg';
import {listWalletsState} from '../../../data/globalState/listWallets';
import {useTextDarkMode} from '../../../hooks/useModeDarkMode';
import {useGridDarkMode} from '../../../hooks/useModeDarkMode';
import {useDarkMode} from '../../../hooks/useModeDarkMode';
import {SafeAreaView} from 'react-native';
import {getFromKeychain} from '../../../utils/keychain';
import {useNavigation} from '@react-navigation/native';
const ONE_SECOND_IN_MS = 100;

const PATTERN = [
  1 * ONE_SECOND_IN_MS,
  2 * ONE_SECOND_IN_MS,
  1 * ONE_SECOND_IN_MS,
];

const PinCodeRequired = () => {
  const [appLock, setAppLock] = useRecoilState(appLockState);
  const {isOpen, onOpen, onClose} = useDisclose();
  const navigation = useNavigation();
  // always update state appLock to localStorage
  useEffect(() => {
    if (appLock?.typeBioMetric) {
      localStorage.set(STORAGE_APP_LOCK, appLock);
    }
  }, [appLock]);

  useEffect(() => {
    (async () => {
      // update appLock state from localStorage when open app first time
      const res: IAppLockState | any = await localStorage.get(STORAGE_APP_LOCK);
      if (!!res) {
        const password = await getFromKeychain();
        if (!__DEV__ && password) {
          onOpen();
        }
        setAppLock({...res});
      }
    })();
  }, []);
  //text darkmode
  const textColor = useTextDarkMode();
  //grid, shadow darkmode
  const gridColor = useGridDarkMode();
  const modeColor = useDarkMode();
  return (
    <Modal style={tw`w-full h-full bg-white`} isOpen={isOpen}>
      <SafeAreaView
        style={tw`flex items-center justify-center w-full min-h-full`}>
        <Logo width={120} height={120} />
        <PinCodeInput
          label="Enter Current PIN Code"
          type="required"
          hide
          onSuccess={onClose}
        />
      </SafeAreaView>
    </Modal>
  );
};
export {PinCodeRequired};
