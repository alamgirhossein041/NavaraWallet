import messaging, {
  FirebaseMessagingTypes,
} from "@react-native-firebase/messaging";
import React, { useEffect } from "react";
import { Text, View } from "react-native";
import { BellIcon } from "react-native-heroicons/solid";
import { localStorage } from "../../utils/storage";
import { tw } from "../../utils/tailwind";

const TOKEN_FIREBASE = "TOKEN_FIREBASE";

export const requestUserPermission = async () => {
  try {
    const authorizationStatus = await checkApplicationPermission();

    if (authorizationStatus === messaging.AuthorizationStatus.NOT_DETERMINED) {
      await messaging().requestPermission();
    } else if (authorizationStatus === messaging.AuthorizationStatus.DENIED) {
      // TODO navigate to setting
    }
  } catch (error) {
    console.warn(error);
  }
};
// DOCS: https://rnfirebase.io/messaging/ios-permissions#reading-current-status
export const checkApplicationPermission = async () => {
  const authorizationStatus = await messaging().requestPermission();
  return authorizationStatus;
};

export default function GetNotification() {
  const handleRegisterDeviceID = () => {
    (async () => {
      const firebaseToken = await messaging().getToken();
      // set token firebase to local storage
      await localStorage.set(TOKEN_FIREBASE, firebaseToken);
    })();
  };

  /**
   *
   * @param cloudMessage
   */
  const handleRemoteMessage = (
    cloudMessage: FirebaseMessagingTypes.RemoteMessage
  ) => {
    console.info(cloudMessage);
  };

  useEffect(() => {
    (async () => {
      await requestUserPermission();
    })();
  }, []);

  // Listen event push notification from firebase cloud messaging
  useEffect(() => {
    handleRegisterDeviceID();
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      handleRemoteMessage(remoteMessage);
    });

    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      handleRemoteMessage(remoteMessage);
    });

    return unsubscribe;
  }, []);
  return (
    <View style={tw`relative`}>
      <BellIcon color="gray" size={30} />
      {/* <BadgeIcon count={0} /> */}
    </View>
  );
}

interface IBadgeProps {
  count: number;
}
const BadgeIcon = ({ count }: IBadgeProps) => (
  <View
    style={tw`absolute items-center justify-center w-4 h-4 bg-red-500 rounded-full -top-1 -right-1`}
  >
    <Text style={tw`text-xs text-white`}>{count}</Text>
  </View>
);
