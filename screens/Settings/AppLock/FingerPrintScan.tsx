import React, {FunctionComponent, useEffect, useMemo, useState} from 'react';
import {Switch, View} from 'react-native';
import {primaryColor, primaryGray} from '../../../configs/theme';
import ReactNativeBiometrics, {BiometryTypes} from 'react-native-biometrics';
import {FingerPrintIcon} from 'react-native-heroicons/solid';
import MenuItem from '../../../components/MenuItem';
import {appLockState} from '../../../data/globalState/appLock';
import {useRecoilState} from 'recoil';
const rnBiometrics = new ReactNativeBiometrics({
  allowDeviceCredentials: false,
});

export const checkStateScanFingerNative = async (): Promise<boolean> => {
  const result = await rnBiometrics.simplePrompt({
    promptMessage: 'Scan your finger',
  });
  return result.success;
};

const FingerPrint: FunctionComponent = () => {
  const [appLock, setAppLock] = useRecoilState(appLockState);
  const [supported, setSupported] = useState<any>({
    available: false,
    biometryType: '',
  });
  const menu = useMemo(() => {
    return {
      onPress: () => handleChangeSwitch(true),
      icon: <FingerPrintIcon width="100%" height="100%" fill={primaryColor} />,
      name: 'Finger print',
      value: (
        <Switch
          trackColor={{false: primaryGray, true: primaryColor}}
          thumbColor="white"
          onValueChange={value => handleChangeSwitch(value)}
          value={appLock.typeBioMetric === BiometryTypes.Biometrics}
        />
      ),

      next: false,
    };
  }, [appLock]);
  useEffect(() => {
    (async () => {
      const {available, biometryType} = await rnBiometrics.isSensorAvailable();
      setSupported({available, biometryType});
    })();
  }, []);

  const handleChangeSwitch = async (value: boolean) => {
    if (await checkStateScanFingerNative()) {
      if (appLock.typeBioMetric !== BiometryTypes.Biometrics) {
        setAppLock({
          ...appLock,
          typeBioMetric: BiometryTypes.Biometrics,
        });
      } else {
        setAppLock({
          ...appLock,
          typeBioMetric: 'none',
        });
      }
    }
  };

  return (
    <View>
      {!!supported.available &&
        (supported.biometryType === BiometryTypes.Biometrics ||
          supported.biometryType === BiometryTypes.TouchID) && (
          <MenuItem {...menu} />
        )}
    </View>
  );
};

export default FingerPrint;
