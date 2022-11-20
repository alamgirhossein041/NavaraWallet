import messaging from "@react-native-firebase/messaging";
import { Actionsheet } from "native-base";
import React, { useMemo, useState } from "react";
import { Alert, Linking, Text, View } from "react-native";
import * as Animatable from "react-native-animatable";
import { getUniqueId } from "react-native-device-info";
import { BellAlertIcon, CheckCircleIcon } from "react-native-heroicons/solid";
import Button from "../../components/UI/Button";
import API from "../../data/api";
import useWalletsActions from "../../data/globalState/listWallets/listWallets.actions";
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
  walletId: string;
  hideSuccess?: boolean;
}

export default function EnableNotification({
  isOpen,
  onClose,
  walletId,
  hideSuccess = false,
}: IProps) {
  const [loading, setLoading] = useState(false);
  const walletActions = useWalletsActions();

  const wallet = useMemo(() => {
    return walletActions.getById(walletId);
  }, [walletActions, walletId]);

  const chainsAddress = useMemo(() => {
    const _chainsAddress: ChainsAddress = {} as ChainsAddress;
    wallet?.chains.forEach((chainWallet) => {
      _chainsAddress[chainWallet.network.toLowerCase()] = chainWallet.address;
    });
    return _chainsAddress;
  }, [wallet]);

  const getDeviceToken = async () => {
    const firebaseToken = await messaging().getToken();
    // set token firebase to local storage
    await localStorage.set(TOKEN_FIREBASE, firebaseToken);
    return firebaseToken;
  };

  const registerDevice = async () => {
    try {
      const deviceToken = await getDeviceToken();
      const deviceId = await getUniqueId();
      const params = {
        deviceId,
        deviceToken,
        ...chainsAddress,
      };
      const res = (await API.post("/device/register", params)) as any;
      if (res.success) {
        walletActions.updateSpecificDB(wallet.id, { isEnableNotify: true });
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

  const disableNotification = async () => {
    setLoading(true);
    try {
      const res = (await API.post("/notify/turnOff", {
        address: chainsAddress.ethereum,
      })) as any;
      if (res.success) {
        toastr.success("Disable notification successfully");
        walletActions.updateSpecificDB(wallet.id, { isEnableNotify: false });
      }
    } catch (error) {
      console.warn(error);
      toastr.error("Disable notification failed");
    }
    onClose();
    setLoading(false);
  };

  return (
    <Actionsheet isOpen={isOpen}>
      <View
        style={tw`flex flex-col items-center justify-center w-full p-6 bg-white rounded-t-3xl dark:bg-[#18191A]`}
      >
        {!hideSuccess && (
          <>
            <CheckCircleIcon color="green" size={60} />
            <Text
              style={tw`flex-row w-full p-2 my-2 text-lg font-bold text-center text-green-700 bg-green-100 rounded-lg `}
            >
              Successfully
            </Text>
          </>
        )}
        <Animatable.View animation="swing" iterationCount="infinite">
          <BellAlertIcon color="gray" size={40} />
        </Animatable.View>

        <Text
          style={tw`my-4 font-medium text-center text-gray-700 dark:text-gray-200`}
        >
          Enable notifications to receive important updates and alerts for this
          wallet.
        </Text>
        <View style={tw`flex-row justify-between w-full`}>
          <View style={tw`w-1/2 px-2`}>
            <Button
              variant="secondary"
              disabled={!chainsAddress}
              onPress={onClose}
            >
              Skip
            </Button>
          </View>
          <View style={tw`w-1/2 px-2`}>
            {wallet?.isEnableNotify ? (
              <Button
                loading={loading || !chainsAddress}
                onPress={disableNotification}
                variant="danger"
              >
                Disable
              </Button>
            ) : (
              <Button
                loading={loading || !chainsAddress}
                onPress={enableNotification}
              >
                Allow
              </Button>
            )}
          </View>
        </View>
      </View>
    </Actionsheet>
  );
}
