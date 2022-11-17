import ignoreWarnings from "ignore-warnings";
import React, { useEffect, useState } from "react";
import { AppState, LogBox, Platform, View } from "react-native";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { browserApprovedHost } from "../../data/globalState/browser";
import { listWalletsState } from "../../data/globalState/listWallets";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { usePinCodeRequired } from "../../hooks/usePinCodeRequired";
import UpdateHistory from "../../screens/Browser/UpdateHistory";
import { PinCodeRequired } from "../../screens/Settings/AppLock/PinCodeRequired";
import WalletConnect from "../../screens/WalletConnect";
import { APPROVED_HOSTS } from "../../utils/storage";
import ActionSheetConfirmEventListerner from "../ActionSheet/ActionSheetConfirmEventListerner";
import { ActionsheetContainer } from "./Actionsheet";
import Offline from "./Offline";
import { PopupResult } from "./PopupResult";

const GetAppState = () => {
  const { lock } = usePinCodeRequired();
  const setApprovedHosts = useSetRecoilState(browserApprovedHost);
  const [approvedHostsFromLocalStorage] = useLocalStorage(APPROVED_HOSTS, {});
  const [appIsBlurred, setAppIsBlurred] = useState(false);
  const listWallets = useRecoilValue(listWalletsState);

  useEffect(() => {
    if (Platform.OS === "android") {
      let appState = AppState.currentState;
      const blurSubscription = AppState.addEventListener("blur", () => {
        if (!appIsBlurred) {
          appState = "inactive";
          setAppIsBlurred(true);
        }
      });
      // const focusSubscription = AppState.addEventListener("focus", () => {
      //   if (appIsBlurred) {
      //     setAppIsBlurred(false);
      //   }
      // });

      const changeSubscription = AppState.addEventListener(
        "change",
        (nextAppState) => {
          if (appState !== "inactive") {
            lock(nextAppState);
          }
        }
      );

      return () => {
        blurSubscription.remove();
        changeSubscription.remove();
      };
    } else {
      const changeSubscription = AppState.addEventListener(
        "change",
        (nextAppState) => {
          if (nextAppState === "active") {
            setAppIsBlurred(false);
          } else if (nextAppState === "inactive") {
            setAppIsBlurred(true);
          }
          lock(nextAppState);
        }
      );

      return () => {
        changeSubscription.remove();
      };
    }
  }, [appIsBlurred, lock]);

  useEffect(() => {
    if (approvedHostsFromLocalStorage) {
      setApprovedHosts(approvedHostsFromLocalStorage);
    }
  }, [approvedHostsFromLocalStorage, setApprovedHosts]);

  ignoreWarnings("warn", ["ViewPropTypes", "[react-native-gesture-handler]"]);
  LogBox.ignoreLogs([
    "Setting a timer for a long period of time",
    "Cannot update a component",
    "ViewPropTypes will be removed from React Native.",
    "Warning: Can't perform a React state update",
    "unknown or invalid utility",
    "ViewPropTypes will be removed from React Native. Migrate to ViewPropTypes exported from 'deprecated-react-native-prop-types'.",
  ]);
  LogBox.ignoreAllLogs();

  return (
    <View>
      <Offline />
      <PopupResult />
      <UpdateHistory />
      {listWallets?.length > 0 && <WalletConnect />}
      <PinCodeRequired />
      <ActionSheetConfirmEventListerner />
      <ActionsheetContainer />
    </View>
  );
};

export default GetAppState;
