import { useNavigation } from "@react-navigation/native";
import { Modal } from "native-base";
import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { TouchableOpacity, View } from "react-native";
import { XIcon } from "react-native-heroicons/solid";
import { SafeAreaView } from "react-native-safe-area-context";
import { tw } from "../../utils/tailwind";
import PinCodeInput from "./PinCodeInput";

const SignPinCode = () => {
  const navigation = useNavigation();
  const [isOpen, setIsOpen] = useState(true);

  const onClose = useCallback(() => {
    setIsOpen(false);
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
      <SafeAreaView edges={["top"]} style={tw`w-screen h-screen `}>
        <View style={tw`px-4 mt-10`}>
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={onClose}
            style={tw`items-center justify-center w-8 h-8 p-1 bg-gray-200 rounded-full`}
          >
            <XIcon size={25} color="gray" />
          </TouchableOpacity>
        </View>

        <PinCodeInput
          type="required"
          hide
          onSuccess={() => setIsOpen(false)}
          label={`${t("setting.apps_lock.verify_your_access")}`}
        />
      </SafeAreaView>
    </Modal>
  );
};

export default SignPinCode;
