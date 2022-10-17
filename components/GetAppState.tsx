import {useRef, useEffect} from 'react';
import {AppState, LogBox, View} from 'react-native';
import AppIsOffLine from './AppIsOffLine';
import {PopupResult} from './PopupResult';
import React from 'react';
import {PinCodeRequired} from '../screens/Settings/AppLock/PinCodeRequired';
import {usePinCodeRequired} from '../hooks/usePinCodeRequired';
import GetBalanceListChains from './GetBalanceListChains';
import UpdateHistory from '../screens/Browser/UpdateHistory';
import ignoreWarnings from 'ignore-warnings';
const GetAppState = () => {
  const appState = useRef(AppState.currentState);
  const [lock] = usePinCodeRequired();
  useEffect(() => {
    const subscription: any = AppState.addEventListener(
      'change',
      nextAppState => {
        if (
          appState.current.match(/inactive|background/) &&
          nextAppState === 'active'
        ) {
          //
          // lock()
        }
        appState.current = nextAppState;
      },
    );

    return () => {
      subscription.remove();
    };
  }, []);
  ignoreWarnings('warn', ['ViewPropTypes', '[react-native-gesture-handler]']);
  LogBox.ignoreLogs([
    'Setting a timer for a long period of time',
    'Cannot update a component',
    'ViewPropTypes will be removed from React Native.',
    "Warning: Can't perform a React state update",
    'unknown or invalid utility',
    "ViewPropTypes will be removed from React Native. Migrate to ViewPropTypes exported from 'deprecated-react-native-prop-types'.",
  ]);
  LogBox.ignoreAllLogs();
  return (
    <View>
      <AppIsOffLine />
      <PopupResult />
      <PinCodeRequired />
      <GetBalanceListChains />
      <UpdateHistory />
    </View>
  );
};

export default GetAppState;
