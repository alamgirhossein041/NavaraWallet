import { Modal, useDisclose } from "native-base";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRecoilState } from "recoil";
import Logo from "../../../assets/logo/logo.svg";
import PinCodeInput from "../../../components/UI/PinCodeInput";
import { appLockState } from "../../../data/globalState/appLock";
import { getFromKeychain } from "../../../utils/keychain";
import { localStorage, STORAGE_APP_LOCK } from "../../../utils/storage";
import { tw } from "../../../utils/tailwind";

const PinCodeRequired = () => {
  const [appLock, setAppLock] = useRecoilState(appLockState);
  const { isOpen, onOpen, onClose } = useDisclose();
  const { t } = useTranslation();
  // always update state appLock to localStorage
  useEffect(() => {
    if (appLock?.typeBioMetric) {
      localStorage.set(STORAGE_APP_LOCK, appLock);
    }
  }, [appLock]);

  useEffect(() => {
    (async () => {
      const password = await getFromKeychain();
      if (password) {
        onOpen();
        setAppLock({ ...appLock, isLock: true });
      }
    })();
  }, []);

  const onSuccess = () => {
    setAppLock({ ...appLock, isLock: false });
    onClose();
  };

  return (
    <Modal
      style={tw`w-full h-full bg-white dark:bg-[#18191A] `}
      isOpen={appLock.isLock || isOpen}
    >
      <SafeAreaView
        edges={["top"]}
        style={tw`flex items-center justify-center w-full min-h-full`}
      >
        <Logo width={120} height={120} />
        <PinCodeInput
          label={`${t("setting.apps_lock.unlock_wallet")}`}
          type="required"
          hide
          onSuccess={onSuccess}
        />
      </SafeAreaView>
    </Modal>
  );
};
export { PinCodeRequired };
