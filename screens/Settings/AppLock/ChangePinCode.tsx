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

const ChangePinCode = ({ onSuccess }) => {
  const [pinCode, setPinCode] = useState<any>("");
  const [, setAppLock] = useRecoilState(appLockState)
  const [step, setStep] = useState(0);
  const [err, setErr] = useState(false);

  const handleChangeInput = async (pinCodeInput) => {
    setErr(false);
    if (pinCodeInput.length === 6) {
      if (await checkPinCode(pinCodeInput)) {
        setStep(1);
      } else {
        setErr(true);
        Vibration.vibrate(PATTERN);
      }
    }
  };

  const handleSettingPinCode = () => {
    try {
      setAppLock({
        updatedAt: new Date(),
        openAt: new Date(),
        pinCode,
        isLock: false,
        typeBioMetric: "none",
        autoLockAfterSeconds: 0
      })
      setPinCode("")
      onSuccess()
    }
    catch (e) { }
  }
  return (
    <View>
      <View style={tw` h-2/3 p-3`}>
        {step === 0 && (
          <View style={tw`items-center flex-col justify-center`}>
            <Text style={tw`text-lg text-center mb-3 font-bold dark:text-white`}>
              Enter Current PIN Code
            </Text>

            <PinCodeInput
              hide
              err={err}
              onChange={(pinCode: number) => handleChangeInput(pinCode)}
            />
          </View>
        )}
        {step === 1 && (
          <View style={tw`items-center flex-col justify-center`}>
            <Text style={tw`text-lg text-center mb-3 font-bold`}>
              Enter New PIN Code
            </Text>

            <PinCodeInput
              err={err}
              onChange={(pinCode: number) => setPinCode(pinCode)}
            />
            <Button disabled={pinCode.length < 6} onPress={handleSettingPinCode}>Change Pin Code</Button>
          </View>
        )}
      </View>
    </View>
  );
};

export default ChangePinCode;
