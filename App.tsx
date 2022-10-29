import React from 'react';
import 'react-native-gesture-handler';
import 'react-native-url-polyfill/auto';
import 'intl';
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from '@react-navigation/native';
import {extendTheme, NativeBaseProvider} from 'native-base';
import 'react-native-gesture-handler';
import {QueryClient, QueryClientProvider} from 'react-query';
import {RecoilRoot} from 'recoil';
import GetAppState from './components/GetAppState';
import AppRoutes from './navigation';
import * as Sentry from '@sentry/react-native';
import {useDeviceContext, useAppColorScheme} from 'twrnc';
import {tw} from './utils/tailwind';
import {Text, TouchableOpacity, useColorScheme} from 'react-native';
import {primaryColor} from './configs/theme';

function App() {
  //connect to sentry
  Sentry.init({
    dsn: 'https://b8791cf0a397459a8c7ec639bd8aa1f0@o462495.ingest.sentry.io/6509089',
    tracesSampleRate: 1.0,
    enableNative: false,
    enabled: !__DEV__,
  });
  const queryClient = new QueryClient();
  useDeviceContext(tw);
  const scheme = useColorScheme();
  const DarkThemeCustom = {
    dark: true,
    colors: {
      primary: primaryColor,
      background: '#18191A',
      card: '#18191A',
      text: 'white',
      border: 'rgb(199, 199, 204)',
      notification: 'rgb(255, 69, 58)',
    },
  };
  const LightThemeCustom = {
    dark: false,
    colors: {
      primary: primaryColor,
      background: 'white',
      card: 'white',
      text: 'black',
      border: 'rgb(199, 199, 204)',
      notification: 'rgb(255, 69, 58)',
    },
  };
  const config = {
    useSystemColorMode: scheme === 'dark',
    initialColorMode: 'light',
  };
  const customTheme = extendTheme({config});
  return (
    <QueryClientProvider client={queryClient}>
      <RecoilRoot>
        <NavigationContainer
          theme={scheme === 'dark' ? DarkThemeCustom : LightThemeCustom}>
          <NativeBaseProvider theme={customTheme}>
            <GetAppState />
            <AppRoutes />
          </NativeBaseProvider>
        </NavigationContainer>
      </RecoilRoot>
    </QueryClientProvider>
  );
}

export default Sentry.wrap(App, {});
