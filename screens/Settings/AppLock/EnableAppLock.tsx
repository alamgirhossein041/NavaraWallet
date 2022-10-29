import React, {useState} from 'react';
import {View} from 'react-native';
import {useSetRecoilState} from 'recoil';
import Button from '../../../components/Button';
import PinCodeInput from '../../../components/PinCodeInput';
import {Regex} from '../../../configs/defaultValue';
import {appLockState} from '../../../data/globalState/appLock';
import {
  useDarkMode,
  useGridDarkMode,
  useTextDarkMode,
} from '../../../hooks/useModeDarkMode';
import {storeToKeychain} from '../../../utils/keychain';
import {localStorage, STORAGE_APP_LOCK} from '../../../utils/storage';
import {tw} from '../../../utils/tailwind';

const EnableAppLock = ({onSuccess}) => {
  const setAppLock = useSetRecoilState(appLockState);
  // const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const handlePress = async (password: string) => {
    // setErr('');
    // if (!password.match(Regex.password)) {
    //   setErr(
    //     'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character',
    //   );
    //   return;
    // }
    const appLock = {
      updatedAt: new Date(),
      openAt: new Date(),
      isLock: false,
      typeBioMetric: 'none',
      autoLockAfterSeconds: 0,
      transactionSigning: true,
    };

    setAppLock(appLock);
    setLoading(true);
    await localStorage.set(STORAGE_APP_LOCK, appLock);
    await storeToKeychain(password);
    await onSuccess();
    setLoading(false);
  };
  //text darkmode

  //grid, shadow darkmode

  return (
    <View style={tw`items-center flex-1`}>
      <PinCodeInput
        biometric={false}
        type="new"
        label="Set Password"
        hide
        onSuccess={handlePress}
      />
    </View>
  );
};

export default EnableAppLock;
