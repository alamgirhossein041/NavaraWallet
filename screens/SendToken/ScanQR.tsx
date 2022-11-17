import { Modal, useDisclose } from "native-base";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ChevronLeftIcon, QrcodeIcon } from "react-native-heroicons/solid";
import QRCodeScanner from "react-native-qrcode-scanner";
import WalletConnectLogo from "../../assets/logo/walletconnect-logo.svg";
import { primaryColor } from "../../configs/theme";
import { tw } from "../../utils/tailwind";
const ScanQR = ({ onValueScaned }: any) => {
  const { isOpen, onOpen, onClose } = useDisclose();
  const { t } = useTranslation();

  const handleBarCodeScanned = (data: string) => {
    onClose();
    onValueScaned(data);
  };
  const onSuccess = (e: any) => {
    handleBarCodeScanned(e.data);
  };

  // const handlePicture = () => {
  //   Alert.alert('Coming soon');
  // };

  return (
    <View>
      <TouchableOpacity
        activeOpacity={0.6}
        onPress={onOpen}
        style={tw`rounded-lg`}
      >
        <QrcodeIcon color={primaryColor} width={35} height={35} />
      </TouchableOpacity>
      <Modal
        animationPreset={"slide"}
        isOpen={isOpen}
        onClose={onClose}
        style={tw`relative flex-col items-center justify-center w-full h-full backdrop-blur-xl bg-black/90`}
      >
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={onClose}
          style={tw`absolute items-center bg-[#18191A]  h-10 w-10 justify-center p-1 rounded-lg w-left-5 ios:top-10 android:top-10 `}
        >
          <ChevronLeftIcon width={40} height={40} color={primaryColor} />
        </TouchableOpacity>
        <Text
          style={tw`dark:text-white mb-10  text-white font-bold text-[20px]`}
        >
          {t("home.qr_scan")}
        </Text>
        <View style={styles.barcodebox}>
          <QRCodeScanner
            onRead={onSuccess}
            cameraContainerStyle={{ height: 400, width: 400 }}
            topContent={<View></View>}
            bottomContent={<View></View>}
          />
        </View>
        <View style={tw`flex-col items-center my-10`}>
          <View style={tw`flex-row w-full`}>
            <WalletConnectLogo style={tw`mx-1`} width={50} height={50} />
          </View>
          <Text style={tw`text-white`}>supported</Text>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  maintext: {
    fontSize: 16,
    margin: 20,
  },
  barcodebox: {
    alignItems: "center",
    justifyContent: "center",
    height: 300,
    width: 300,
    overflow: "hidden",
    borderRadius: 30,
    backgroundColor: "white",
  },
});

export default ScanQR;
