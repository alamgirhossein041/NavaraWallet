import { useRef, useEffect } from "react";
import { AppState, LogBox, View } from "react-native";
import AppIsOffLine from "./AppIsOffLine";
import { PopupResult } from "./PopupResult";
import React from "react"
import UpdateListWallets from "./UpdateListWallets";
import { PinCodeRequired } from "../screens/Settings/AppLock/PinCodeRequired";
import { usePinCodeRequired } from "../hooks/usePinCodeRequired";

const GetAppState = () => {
  const appState = useRef(AppState.currentState);
  const [lock] = usePinCodeRequired()
  useEffect(() => {
    const subscription: any = AppState.addEventListener(
      "change",
      (nextAppState) => {
        if (
          appState.current.match(/inactive|background/) &&
          nextAppState === "active"
        ) {
          console.log("App has come to the foreground!");
          // lock()
        }
        appState.current = nextAppState;

      }
    );

    return () => {
      subscription.remove();
    };
  }, []);
  LogBox.ignoreLogs(["Setting a timer for a long period of time"])
  LogBox.ignoreAllLogs();
  return (
    <View>
      <AppIsOffLine />
      <PopupResult />
      <UpdateListWallets />
      <PinCodeRequired />
    </View>
  );
};

export default GetAppState;
