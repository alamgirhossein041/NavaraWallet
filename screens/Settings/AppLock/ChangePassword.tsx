import React, { useState } from "react";
import { ScrollView, View } from "react-native";

import { useTranslation } from "react-i18next";
import { useRecoilState } from "recoil";
import Button from "../../../components/UI/Button";
import PinCodeInput from "../../../components/UI/PinCodeInput";
import { appLockState } from "../../../data/globalState/appLock";
import { tw } from "../../../utils/tailwind";
const ONE_SECOND_IN_MS = 100;

const PATTERN = [
  1 * ONE_SECOND_IN_MS,
  2 * ONE_SECOND_IN_MS,
  1 * ONE_SECOND_IN_MS,
];

const ChangePassword = ({ onSuccess }) => {
  const [pinCode, setPinCode] = useState<any>("");
  const [appLock, setAppLock] = useRecoilState(appLockState);
  const [step, setStep] = useState(0);

  const handleSettingPinCode = () => {
    try {
      setAppLock({
        ...appLock,
        updatedAt: new Date(),
      });
      setPinCode("");
      onSuccess();
    } catch (e) {}
  };
  const { t } = useTranslation();

  return (
    <ScrollView scrollEnabled={false}>
      <View style={tw`items-center justify-center min-h-full p-3`}>
        {step === 0 && (
          <View style={tw`flex-col items-center justify-center`}>
            <PinCodeInput
              label={`${t("setting.apps_lock.enter_current_password")}`}
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
              label={`${t("setting.apps_lock.enter_new_password")}`}
              type="new"
              onSuccess={(value) => setPinCode(value)}
            />
            <View style={tw`bottom-0 w-full my-5`}>
              <Button
                disabled={pinCode.length < 6}
                onPress={handleSettingPinCode}
              >
                {t("setting.apps_lock.change_password")}
              </Button>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default ChangePassword;
