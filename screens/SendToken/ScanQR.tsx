import { Modal, useDisclose } from "native-base";
import React from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  Linking,
  PermissionsAndroid,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { RNCamera } from "react-native-camera";
import { ChevronLeftIcon, QrCodeIcon } from "react-native-heroicons/solid";
import { check, PERMISSIONS, RESULTS } from "react-native-permissions";
import WalletConnectLogo from "../../assets/logo/walletconnect-logo.svg";
import { triggerHapticFeedback } from "../../components/UI/PressableHapticFeedback";
import { primaryColor } from "../../configs/theme";
import { tw } from "../../utils/tailwind";
import QRMask, { rectOfInterest } from "./QRMask";

const ScanQR = ({ onValueScanned }: any) => {
  const { isOpen, onOpen, onClose } = useDisclose();

  const { t } = useTranslation();

  const handleBarCodeScanned = (data: string) => {
    onValueScanned(data);
    onClose();
  };

  const barcodeReceived = (e) => {
    triggerHapticFeedback();
    handleBarCodeScanned(e.data);
  };

  const handlePermission = async () => {
    const permissionResult = await check(
      PERMISSIONS[Platform.OS.toLocaleUpperCase()].CAMERA
    );
    if (permissionResult === RESULTS.BLOCKED) {
      Alert.alert(
        `You need to allow camera permission to use this feature.`,
        `Please go to Settings and allow camera permission for this Navara`,
        [
          {
            text: "Open Settings",
            onPress: () => {
              Linking.openSettings();
            },
          },
        ]
      );
    }
    if (permissionResult === RESULTS.DENIED && Platform.OS === "android") {
      await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
    }
    onOpen();
  };

  return (
    <View>
      <TouchableOpacity
        activeOpacity={0.6}
        onPress={handlePermission}
        style={tw`rounded-lg`}
      >
        <QrCodeIcon color={primaryColor} width={35} height={35} />
      </TouchableOpacity>
      {isOpen && (
        <Modal
          animationPreset={"slide"}
          isOpen={isOpen}
          onClose={onClose}
          style={tw`relative flex-col items-center justify-center flex-1 w-screen h-screen bg-black`}
        >
          <View
            style={tw`absolute z-50 flex-row items-center justify-between w-full px-4 top-10`}
          >
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={onClose}
              style={tw`items-center bg-[#18191A]  h-10 w-10 justify-center p-1 rounded-lg`}
            >
              <ChevronLeftIcon width={40} height={40} color={primaryColor} />
            </TouchableOpacity>
            <Text style={tw`dark:text-white text-white font-bold text-[20px]`}>
              {t("home.qr_scan")}
            </Text>
            <View style={tw`w-10 h-10`} />
          </View>
          <RNCamera
            style={tw`w-full h-full`}
            onBarCodeRead={barcodeReceived}
            autoFocus={"on"}
            captureAudio={false}
            aspect={1}
            barCodeTypes={[RNCamera.Constants.BarCodeType.qr, "qr"]}
            {...rectOfInterest}
          >
            <QRMask />
          </RNCamera>
          <View
            style={tw`absolute z-10 flex-col items-center my-10 bottom-10 `}
          >
            <View style={tw`flex-row w-full`}>
              <WalletConnectLogo style={tw`mx-1`} width={50} height={50} />
            </View>
            <Text style={tw`text-white`}>supported</Text>
          </View>
        </Modal>
      )}
    </View>
  );
};

export default ScanQR;
