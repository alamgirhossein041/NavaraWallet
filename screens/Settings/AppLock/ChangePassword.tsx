import React, {useState} from 'react';
import {View, Text, Vibration, ScrollView} from 'react-native';

import PinCodeInput from '../../../components/PinCodeInput';
import {tw} from '../../../utils/tailwind';
import Button from '../../../components/Button';
import checkPinCode from '../../../utils/checkPinCode';
import {useRecoilState} from 'recoil';
import {appLockState} from '../../../data/globalState/appLock';
import * as CryptoJS from 'crypto-js';
const ONE_SECOND_IN_MS = 100;

const PATTERN = [
  1 * ONE_SECOND_IN_MS,
  2 * ONE_SECOND_IN_MS,
  1 * ONE_SECOND_IN_MS,
];

const ChangePassword = ({onSuccess}) => {
  const [pinCode, setPinCode] = useState<any>('');
  const [appLock, setAppLock] = useRecoilState(appLockState);
  const [step, setStep] = useState(0);

  const handleSettingPinCode = () => {
    try {
      setAppLock({
        ...appLock,
        updatedAt: new Date(),
      });
      setPinCode('');
      onSuccess();
    } catch (e) {}
  };
  return (
    <ScrollView scrollEnabled={false}>
      <View style={tw`items-center justify-center min-h-full p-3`}>
        {step === 0 && (
          <View style={tw`flex-col items-center justify-center`}>
            <PinCodeInput
              label=" Enter Current PIN Code"
              type="required"
              biometric={false}
              hide
              onSuccess={() => setStep(1)}
            />
          </View>
        )}
        {step === 1 && (
          <View style={tw`flex-col items-center justify-center`}>
            <PinCodeInput
              biometric={false}
              label=" Enter New PIN Code"
              type="new"
              onSuccess={value => setPinCode(value)}
            />
            <View style={tw`bottom-0 w-full my-5`}>
              <Button
                disabled={pinCode.length < 6}
                onPress={handleSettingPinCode}>
                Change Password
              </Button>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default ChangePassword;
