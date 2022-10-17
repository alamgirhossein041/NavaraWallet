import React, {FunctionComponent, useEffect, useMemo, useState} from 'react';
import {Switch, View} from 'react-native';
import {primaryColor, primaryGray} from '../../../configs/theme';
import ReactNativeBiometrics, {BiometryTypes} from 'react-native-biometrics';
import {FingerPrintIcon, UserIcon} from 'react-native-heroicons/solid';
import MenuItem from '../../../components/MenuItem';
import {appLockState} from '../../../data/globalState/appLock';
import {useRecoilState} from 'recoil';
import {Spinner} from 'native-base';
const rnBiometrics = new ReactNativeBiometrics({
  allowDeviceCredentials: false,
});

export const checkStateScanFingerNative = async (): Promise<boolean> => {
  const result = await rnBiometrics.simplePrompt({
    promptMessage: 'Scan your finger',
  });
  return result.success;
};

const FaceId: FunctionComponent = () => {
  const [loading, setLoading] = useState(false);
  const [appLock, setAppLock] = useRecoilState(appLockState);
  const [supported, setSupported] = useState<any>({
    available: false,
    biometryType: '',
  });
  const menu = {
    onPress: () => handleChangeSwitch(true),
    icon: <UserIcon width="100%" height="100%" fill={primaryColor} />,
    name: 'FaceID',
    value: loading ? (
      <Spinner />
    ) : (
      <Switch
        trackColor={{false: primaryGray, true: primaryColor}}
        thumbColor="white"
        onValueChange={value => handleChangeSwitch(value)}
        value={appLock.typeBioMetric === BiometryTypes.FaceID}
      />
    ),

    next: false,
  };

  useEffect(() => {
    (async () => {
      const {available, biometryType} = await rnBiometrics.isSensorAvailable();
      setSupported({available, biometryType});
    })();
  }, []);

  const handleChangeSwitch = async (value: boolean) => {
    setLoading(true);
    if (await checkStateScanFingerNative()) {
      if (appLock.typeBioMetric !== BiometryTypes.FaceID) {
        setAppLock({
          ...appLock,
          typeBioMetric: BiometryTypes.FaceID,
        });
      } else {
        setAppLock({
          ...appLock,
          typeBioMetric: 'none',
        });
      }
    }
    setLoading(false);
  };

  return (
    <View>
      {!!supported.available &&
        supported.biometryType === BiometryTypes.FaceID && (
          <MenuItem {...menu} />
        )}
    </View>
  );
};

export default FaceId;
