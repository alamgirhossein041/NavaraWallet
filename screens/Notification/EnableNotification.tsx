import messaging from "@react-native-firebase/messaging";
import { Actionsheet } from "native-base";
import React, { useState } from "react";
import { Alert, Linking, Text, View } from "react-native";
import { getUniqueId } from "react-native-device-info";
import { BellIcon } from "react-native-heroicons/solid";
import Button from "../../components/UI/Button";
import API from "../../data/api";
import { localStorage } from "../../utils/storage";
import { tw } from "../../utils/tailwind";
import toastr from "../../utils/toastr";

const TOKEN_FIREBASE = "TOKEN_FIREBASE";

// DOCS: https://rnfirebase.io/messaging/ios-permissions#reading-current-status
export const checkApplicationPermission = async () => {
  const authorizationStatus = await messaging().requestPermission();
  return authorizationStatus;
};

export interface ChainsAddress {
  ethereum: string;
  near: string;
  polkadot: string;
  solana: string;
}

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  chainsAddress: ChainsAddress;
}

export default function EnableNotification({
  isOpen,
  onClose,
  chainsAddress,
}: IProps) {
  const [loading, setLoading] = useState(false);

  const getDeviceToken = async () => {
    const firebaseToken = await messaging().getToken();
    // set token firebase to local storage
    await localStorage.set(TOKEN_FIREBASE, firebaseToken);
    return firebaseToken;
  };

  const registerDevice = async () => {
    try {
      const deviceToken = await getDeviceToken();
      const deviceId = getUniqueId();
      const params = {
        deviceId,
        deviceToken,
        ...chainsAddress,
      };

      const res = (await API.post("/device/register", params)) as any;
      if (res.success) {
        toastr.success("Register notification successfully");
      }
    } catch (error) {
      console.warn(error);
      toastr.error("Register notification failed");
    }
  };

  const enableNotification = async () => {
    setLoading(true);
    try {
      const authorizationStatus = await checkApplicationPermission();
      if (
        authorizationStatus === messaging.AuthorizationStatus.NOT_DETERMINED
      ) {
        const newAuthorizationStatus = await messaging().requestPermission();
        if (
          newAuthorizationStatus === messaging.AuthorizationStatus.AUTHORIZED
        ) {
          await registerDevice();
        }
      } else if (authorizationStatus === messaging.AuthorizationStatus.DENIED) {
        Alert.alert(
          `You've rejected notifications.`,
          ` You can fix this by going to your settings and enabling notifications.`,
          [
            {
              text: "Open Settings",
              onPress: () => {
                Linking.openSettings();
              },
            },
            {
              test: "Cancel",
              style: "cancel",
              onPress: () => {},
            },
          ]
        );
      } else if (
        authorizationStatus === messaging.AuthorizationStatus.AUTHORIZED
      ) {
        await registerDevice();
      }
    } catch (error) {
      console.warn("Enable notification error:", error);
    }
    onClose();
    setLoading(false);
  };

  return (
    <Actionsheet isOpen={isOpen} onClose={onClose}>
      <View
        style={tw`flex flex-col items-center justify-center w-full p-6 bg-white rounded-t-3xl dark:bg-[#18191A]`}
      >
        <BellIcon color="gray" size={30} />
        <Text
          style={tw`my-4 text-lg font-medium text-center text-gray-700 dark:text-gray-200`}
        >
          Enable notifications to receive important updates and alerts for this
          wallet.
        </Text>
        <Button loading={loading} onPress={enableNotification}>
          Enable Notification
        </Button>
      </View>
    </Actionsheet>
  );
}
