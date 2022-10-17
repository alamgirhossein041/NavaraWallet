import React, {useEffect, useRef, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  Vibration,
  View,
} from 'react-native';
import {BiometryTypes} from 'react-native-biometrics';
import {useRecoilValue} from 'recoil';
import FaceId from '../assets/icons/face-id.svg';
import FingerPrint from '../assets/icons/finger-print.svg';
import {Regex} from '../configs/defaultValue';
import {primaryColor} from '../configs/theme';
import {appLockState} from '../data/globalState/appLock';
import {
  useDarkMode,
  useGridDarkMode,
  useTextDarkMode,
} from '../hooks/useModeDarkMode';
import {checkStateScanFingerNative} from '../screens/Settings/AppLock/FingerPrintScan';
import checkPinCode from '../utils/checkPinCode';
import {tw} from '../utils/tailwind';
import Button from './Button';
import PressableAnimated from './PressableAnimated';
import TextField from './TextField';

const ONE_SECOND_IN_MS = 100;

const PATTERN = [
  1 * ONE_SECOND_IN_MS,
  2 * ONE_SECOND_IN_MS,
  1 * ONE_SECOND_IN_MS,
];

enum PinCodeEnum {
  NEW = 'new',
  REQUIRED = 'required',
}
interface IPinCodeInputProps {
  type: 'new' | 'required';
  hide?: boolean;
  label?: string;
  onSuccess?: (value?: string) => void;
  biometric?: boolean;
  error?: string;
}

const PinCodeInput = ({
  type,
  hide = false,
  onSuccess,
  label = 'Verify your access',
  biometric = true,
  error = '',
}: IPinCodeInputProps) => {
  //text darkmode
  const textColor = useTextDarkMode();
  //grid, shadow darkmode
  const gridColor = useGridDarkMode();
  const modeColor = useDarkMode();
  const appLock = useRecoilValue(appLockState);
  const [err, setErr] = useState(error);
  const focusRef = useRef(null);
  const {control, getValues, setValue} = useForm({
    defaultValues: {
      password: '',
      rePassword: '',
    },
  });

  const handleEndEditing = async () => {
    const {password, rePassword} = getValues();
    if (!password.match(Regex.password) && type === PinCodeEnum.NEW) {
      setErr(
        'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character',
      );
      return;
    }

    if (password === rePassword || type === PinCodeEnum.REQUIRED) {
      if (type === PinCodeEnum.REQUIRED) {
        if (await checkPinCode(password)) {
          onSuccess(password);
          resetValue();
        } else {
          setErr('Incorrect Password');
          Vibration.vibrate(PATTERN);
        }
      } else if (type === PinCodeEnum.NEW) {
        onSuccess(password);
        resetValue();
      }
    } else {
      setErr('Password not match');
    }
  };

  const resetValue = () => {
    setValue('password', '');
    setValue('rePassword', '');
  };
  const checkBioMetric = async () => {
    const scanRsult = await checkStateScanFingerNative();
    if (scanRsult) {
      onSuccess();
      Keyboard.dismiss();
    }
  };

  useEffect(() => {
    if (error) {
      setErr(error);
    }
  }, [error]);

  useEffect(() => {
    (async () => {
      if (
        appLock.typeBioMetric &&
        appLock.typeBioMetric !== 'none' &&
        biometric
      ) {
        checkBioMetric();
      }
    })();
  }, [appLock]);

  return (
    <KeyboardAvoidingView
      ref={focusRef}
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      style={tw`flex flex-col items-center justify-around flex-1 w-full`}>
      <View style={tw`flex-col p-3`}>
        <Text style={tw`mb-5 text-2xl font-bold text-center ${textColor}`}>
          {label}
        </Text>
        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({field: {onChange, value}}) => (
            <TextField
              label="Enter Password"
              type="password"
              value={value.replace(/\s/g, '')}
              onChangeText={onChange}
              autoCompleteType="off"
              autoCapitalize="none"
              err={err.length > 0}
              onTouchStart={() => {
                setErr('');
              }}
            />
          )}
          name="password"
        />
        {type === PinCodeEnum.NEW && (
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({field: {onChange, value}}) => (
              <TextField
                label="Re-enter Password"
                type="password"
                err={err.length > 0}
                value={value.replace(/\s/g, '')}
                onChangeText={onChange}
                autoCompleteType="off"
                autoCapitalize="none"
                onTouchStart={() => {
                  setErr('');
                }}
              />
            )}
            name="rePassword"
          />
        )}
        {!!err && <Text style={tw`text-center text-red-500`}>{err}</Text>}
      </View>
      {biometric && appLock.typeBioMetric === BiometryTypes.Biometrics && (
        <PressableAnimated onPress={checkBioMetric}>
          <FingerPrint fill={primaryColor} height={45} width={45} />
        </PressableAnimated>
      )}
      {biometric && appLock.typeBioMetric === BiometryTypes.FaceID && (
        <PressableAnimated onPress={checkBioMetric}>
          <FaceId fill={primaryColor} height={45} width={45} />
        </PressableAnimated>
      )}

      <View />

      <View style={tw`absolute w-full px-3 bottom-5`}>
        <Button fullWidth onPress={handleEndEditing}>
          Continue
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
};

export default PinCodeInput;
