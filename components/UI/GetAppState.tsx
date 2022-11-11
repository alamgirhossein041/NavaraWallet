import ignoreWarnings from "ignore-warnings";
import React, { useEffect, useState } from "react";
import { AppState, LogBox, Platform, View } from "react-native";
import { useRecoilState, useRecoilValue } from "recoil";
import { appLockState } from "../../data/globalState/appLock";
import { browserApprovedHost } from "../../data/globalState/browser";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { usePinCodeRequired } from "../../hooks/usePinCodeRequired";
import UpdateHistory from "../../screens/Browser/UpdateHistory";
import { PinCodeRequired } from "../../screens/Settings/AppLock/PinCodeRequired";
import { APPROVED_HOSTS } from "../../utils/storage";
import { PopupResult } from "./PopupResult";

const GetAppState = () => {
  const [lock] = usePinCodeRequired();
  const [_, setApprovedHosts] = useRecoilState(browserApprovedHost);
  const applock = useRecoilValue(appLockState);

  const [approvedHostsFromLocalStorage] = useLocalStorage(APPROVED_HOSTS, {});
  const [appIsBlurred, setAppIsBlurred] = useState(false);

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
      //   console.log("focus");
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
      <PopupResult />
      <PinCodeRequired />
      <UpdateHistory />
      {/* <SplashModal appIsBlurred={appIsBlurred && applock?.isLock === false} /> */}
    </View>
  );
};

export default GetAppState;
