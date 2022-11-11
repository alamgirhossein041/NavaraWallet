import { Modal, StatusBar } from "native-base";
import React from "react";
import { SafeAreaView } from "react-native";
import Logo from "../../assets/logo/logo-white.svg";
import { primaryColor } from "../../configs/theme";
import { tw } from "../../utils/tailwind";

const SplashScreen = () => {
  return (
    <SafeAreaView
      style={tw`items-center justify-center w-full h-full bg-[${primaryColor}]`}
    >
      <StatusBar barStyle="dark-content" backgroundColor={primaryColor} />
      <Logo width={240} height={240} />
    </SafeAreaView>
  );
};

export const SplashModal = ({ appIsBlurred }: { appIsBlurred: boolean }) => {
  return (
    <Modal isOpen={appIsBlurred}>
      <SplashScreen />
    </Modal>
  );
};

export default SplashScreen;
