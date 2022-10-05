import React, { useState } from "react";
import { View, Text, Vibration } from "react-native";

import PinCodeInput from "../../../components/PinCodeInput";
import { tw } from "../../../utils/tailwind";
import Button from "../../../components/Button";
import { localStorage, STORAGE_APP_LOCK } from "../../../utils/storage";
import checkPinCode from "../../../utils/checkPinCode";
import { useRecoilState } from "recoil";
import { appLockState } from "../../../data/globalState/appLock";

const ONE_SECOND_IN_MS = 100;

const PATTERN = [
  1 * ONE_SECOND_IN_MS,
  2 * ONE_SECOND_IN_MS,
  1 * ONE_SECOND_IN_MS,
];

const DisableAppLock = ({ onSuccess }) => {
  const [pinCode, setPinCode] = useState<any>("");
  const [err, setErr] = useState(false);
  const [, setAppLock] = useRecoilState(appLockState)

  const handleDeletePinCode = async () => {
    if (await checkPinCode(pinCode)) {
      await localStorage.remove(STORAGE_APP_LOCK);
      setAppLock({} as any)
      onSuccess();
    } else {
      setErr(true);
      Vibration.vibrate(PATTERN);
    }
  };

  return (
    <View>
      <View style={tw`items-center flex-col justify-center h-2/3 p-3`}>
        <Text style={tw`text-lg text-center mb-3 font-bold dark:text-white`}>
          Enter Current PIN Code
        </Text>
        <PinCodeInput
          hide
          err={err}
          onChange={(pinCode: number) => {
            setErr(false);
            Vibration.cancel()
            setPinCode(pinCode);
          }}
        />
        <Button disabled={pinCode.length < 6} onPress={handleDeletePinCode}>
          Disable App Lock
        </Button>
      </View>
    </View>
  );
};

export default DisableAppLock;
