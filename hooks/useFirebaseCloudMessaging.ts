import messaging from "@react-native-firebase/messaging";
import { useEffect } from "react";

/**
 * Connect to Firebase Cloud Messaging
 * @returns void
 */
const useFirebaseCloudMessaging = () => {
  useEffect(() => {
    // Assume a message-notification contains a "type" property in the data payload of the screen to open

    messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log(
        "Notification caused app to open from background state:",
        remoteMessage.notification
      );
    });

    // Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          console.log(
            "Notification caused app to open from quit state:",
            remoteMessage.notification
          );
        }
      });
  }, []);
  return;
};

export default useFirebaseCloudMessaging();
