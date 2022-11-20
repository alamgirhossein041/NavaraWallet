import { useNavigation } from "@react-navigation/native";
import { Modal } from "native-base";
import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { TouchableOpacity, View } from "react-native";
import { XMarkIcon } from "react-native-heroicons/solid";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRecoilState } from "recoil";
import { appLockState } from "../../data/globalState/appLock";
import { tw } from "../../utils/tailwind";
import PinCodeInput from "./PinCodeInput";

const SignPinCode = () => {
  const navigation = useNavigation();
  const [isOpen, setIsOpen] = useState(true);
  const [appLock, setAppLock] = useRecoilState(appLockState);

  const onClose = useCallback(() => {
    setIsOpen(false);
    setAppLock({ ...appLock, isLock: false });
    navigation.goBack();
  }, []);

  const { t } = useTranslation();

  return (
    <Modal
      overlayVisible
      animationPreset={"slide"}
      style={tw`flex-row items-start justify-start w-full h-full bg-white dark:bg-[#18191A] `}
      isOpen={isOpen}
    >
      <SafeAreaView edges={["top"]} style={tw`w-screen h-screen`}>
        <View style={tw`px-4 mt-10 mb-20`}>
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={onClose}
            style={tw`items-center justify-center w-8 h-8 p-1 bg-gray-200 rounded-full`}
          >
            <XMarkIcon size={25} color="gray" />
          </TouchableOpacity>
        </View>

        <PinCodeInput
          type="required"
          hide
          forSign
          onSuccess={() => setIsOpen(false)}
          label={`${t("setting.apps_lock.verify_your_access")}`}
        />
      </SafeAreaView>
    </Modal>
  );
};

export default SignPinCode;
