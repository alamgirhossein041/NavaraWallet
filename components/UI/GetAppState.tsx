import ignoreWarnings from "ignore-warnings";
import React, { useEffect } from "react";
import { AppState, LogBox, View } from "react-native";
import { useRecoilState } from "recoil";
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
  const [approvedHostsFromLocalStorage] = useLocalStorage(APPROVED_HOSTS, {});
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      lock(nextAppState);
    });
    return () => {
      subscription.remove();
    };
  }, [lock]);

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
    </View>
  );
};

export default GetAppState;
