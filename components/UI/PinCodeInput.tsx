import React, { useCallback, useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  Vibration,
  View,
} from "react-native";
import { BiometryTypes } from "react-native-biometrics";
import { useRecoilState } from "recoil";
import FaceId from "../../assets/icons/face-id.svg";
import FingerPrint from "../../assets/icons/finger-print.svg";

import { primaryColor } from "../../configs/theme";
import { appLockState } from "../../data/globalState/appLock";
import { checkStateScanFingerNative } from "../../screens/Settings/AppLock/FingerPrintScan";

import checkPinCode from "../../utils/checkPinCode";
import { validatePassword } from "../../utils/stringsFunction";
import { tw } from "../../utils/tailwind";
import Button from "./Button";
import PressableAnimated from "./PressableAnimated";
import { triggerHapticFeedback } from "./PressableHapticFeedback";
import TextField from "./TextField";

const ONE_SECOND_IN_MS = 100;

const PATTERN = [
  1 * ONE_SECOND_IN_MS,
  2 * ONE_SECOND_IN_MS,
  1 * ONE_SECOND_IN_MS,
];

const DISABLE_SECOND = 60;

enum PinCodeEnum {
  NEW = "new",
  REQUIRED = "required",
}
interface IPinCodeInputProps {
  type: "new" | "required";
  forSign?: boolean;
  hide?: boolean;
  label?: string;
  onSuccess?: (value?: string) => void;
  biometric?: boolean;
  error?: string;
}

const PinCodeInput = ({
  type,
  forSign = false,
  onSuccess,
  label = ``,
  biometric = true,
  error = "",
}: IPinCodeInputProps) => {
  const { t } = useTranslation();
  const [appLock, setAppLock] = useRecoilState(appLockState);
  const [err, setErr] = useState(error);
  const [countWrong, setCountWrong] = useState(0);
  const [timer, setTimer] = useState(0);
  const rePasswordRef = useRef(null);

  const { control, getValues, setValue } = useForm({
    defaultValues: {
      password: "",
      rePassword: "",
    },
  });

  const handleEndEditing = async () => {
    if (timer !== -1) {
      return;
    }
    const { password, rePassword } = getValues();
    const inValid = validatePassword(password);
    if (inValid && type === PinCodeEnum.NEW) {
      setErr(inValid);
      return;
    }

    if (password === rePassword || type === PinCodeEnum.REQUIRED) {
      if (type === PinCodeEnum.REQUIRED) {
        if (await checkPinCode(password)) {
          onSuccess(password);
          setAppLock({ ...appLock, isLock: false });
        } else {
          setErr(`${t("setting.apps_lock.incorrect_password")}`);
          setCountWrong(countWrong + 1);
          if (countWrong >= 4) {
            const disableUntil = Date.now() + 1000 * DISABLE_SECOND;
            setTimer(DISABLE_SECOND);
            setAppLock({ ...appLock, disableUntil });
          }

          Vibration.vibrate(PATTERN);
        }
      } else if (type === PinCodeEnum.NEW) {
        onSuccess(password);
      }
    } else {
      setErr(`${t("setting.apps_lock.password_not_match")}`);
    }
  };

  const checkBioMetric = useCallback(async () => {
    if (
      !appLock?.disableUntil ||
      (appLock?.disableUntil - Date.now() <= 0 && timer === -1)
    ) {
      const scanResult = await checkStateScanFingerNative();
      if (scanResult) {
        setAppLock({ ...appLock, isLock: false });
        Keyboard.dismiss();
        onSuccess();
        triggerHapticFeedback();
      }
    }
  }, [appLock, timer]);

  useEffect(() => {
    if (appLock?.disableUntil && appLock?.disableUntil - Date.now() > 0) {
      const interval = setTimeout(() => {
        setTimer(Math.floor((appLock.disableUntil - Date.now()) / 1000));
      }, 1000);
      return () => clearTimeout(interval);
    } else {
      setCountWrong(0);
      setTimer(-1);
    }
  }, [appLock.disableUntil, timer]);

  useEffect(() => {
    if (error) {
      setErr(error);
    }
  }, [error]);

  useEffect(() => {
    (async () => {
      if (
        appLock.typeBioMetric &&
        appLock.typeBioMetric !== "none" &&
        (appLock?.isLock || forSign) &&
        biometric
      ) {
        await checkBioMetric();
      }
    })();
  }, [appLock.typeBioMetric, biometric, appLock?.isLock]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "padding"}
      style={tw`flex flex-col items-center justify-start flex-1 w-full`}
    >
      <View style={tw`flex-col px-3 py-10`}>
        <Text style={tw`mb-5 text-2xl font-bold text-center dark:text-white`}>
          {label}
        </Text>
        <View style={tw`mb-5`}>
          <Controller
            style={tw`mb-3`}
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, value } }) => (
              <TextField
                label={t("setting.apps_lock.enter_password")}
                type="password"
                value={value.replace(/\s/g, "")}
                onChangeText={onChange}
                autoCapitalize="none"
                err={err.length > 0}
                onTouchStart={() => {
                  setErr("");
                }}
                returnKeyType={type === PinCodeEnum.NEW ? "next" : "default"}
                onSubmitEditing={() => {
                  if (type === PinCodeEnum.NEW) {
                    rePasswordRef?.current?.focus();
                  } else {
                    handleEndEditing();
                  }
                }}
              />
            )}
            name="password"
          />
        </View>
        {type === PinCodeEnum.NEW && (
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, value } }) => (
              <TextField
                ref={rePasswordRef}
                label={t("setting.apps_lock.re_enter_password")}
                type="password"
                editable={timer < 0}
                err={err.length > 0}
                value={value.replace(/\s/g, "")}
                onChangeText={onChange}
                autoCapitalize="none"
                onTouchStart={() => {
                  setErr("");
                }}
                onSubmitEditing={handleEndEditing}
              />
            )}
            name="rePassword"
          />
        )}
        {!!err && (
          <Text style={tw`text-center text-red-500 dark:text-white`}>
            {err}
          </Text>
        )}
      </View>
      {timer >= 0 ? (
        <Text style={tw`text-lg font-semibold text-center dark:text-white`}>
          Try again in {timer}
        </Text>
      ) : (
        <>
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
        </>
      )}

      <View />

      <View style={tw`absolute w-full px-3 bottom-5`}>
        <Button
          hideOnKeyboard={true}
          fullWidth
          onPress={handleEndEditing}
          disabled={timer >= 0}
        >
          {t("setting.apps_lock.continue")}
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
};

export default PinCodeInput;
