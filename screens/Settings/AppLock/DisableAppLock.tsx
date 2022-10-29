import React, {useState} from 'react';
import {ScrollView, Text, Vibration, View} from 'react-native';

import {useRecoilState} from 'recoil';
import Button from '../../../components/Button';
import PinCodeInput from '../../../components/PinCodeInput';
import {appLockState} from '../../../data/globalState/appLock';
import checkPinCode from '../../../utils/checkPinCode';
import {localStorage, STORAGE_APP_LOCK} from '../../../utils/storage';
import {tw} from '../../../utils/tailwind';

const ONE_SECOND_IN_MS = 100;

const PATTERN = [
  1 * ONE_SECOND_IN_MS,
  2 * ONE_SECOND_IN_MS,
  1 * ONE_SECOND_IN_MS,
];

const DisableAppLock = ({onSuccess}) => {
  const [pinCode, setPinCode] = useState<any>('');
  const [err, setErr] = useState(false);
  const [, setAppLock] = useRecoilState(appLockState);

  const handleDeletePinCode = async () => {
    if (await checkPinCode(pinCode)) {
      await localStorage.remove(STORAGE_APP_LOCK);
      setAppLock({} as any);
      onSuccess();
    } else {
      setErr(true);
      Vibration.vibrate(PATTERN);
    }
  };

  return (
    <ScrollView scrollEnabled={false}>
      <View style={tw`flex-col items-center justify-center p-3 min-h-2/3`}>
        <Text
          style={tw`dark:text-white  mb-3 text-lg font-bold text-center dark:text-white`}>
          Enter Current PIN Code
        </Text>
        <PinCodeInput
          hide
          type="required"
          err={err}
          onChange={(password: number) => {
            setErr(false);
            Vibration.cancel();
            setPinCode(password);
          }}
        />
        <Button disabled={pinCode.length < 6} onPress={handleDeletePinCode}>
          Disable App Lock
        </Button>
      </View>
    </ScrollView>
  );
};

export default DisableAppLock;
