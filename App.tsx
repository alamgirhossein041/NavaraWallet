import React from 'react';
import 'react-native-gesture-handler';
import 'react-native-url-polyfill/auto';
import 'intl';
import {NavigationContainer} from '@react-navigation/native';
import {NativeBaseProvider} from 'native-base';
import 'react-native-gesture-handler';
import {QueryClient, QueryClientProvider} from 'react-query';
import {RecoilRoot} from 'recoil';
import GetAppState from './components/GetAppState';
import AppRoutes from './navigation';
import * as Sentry from '@sentry/react-native';

function App() {
  //connect to sentry
  Sentry.init({
    dsn: 'https://b8791cf0a397459a8c7ec639bd8aa1f0@o462495.ingest.sentry.io/6509089',
    tracesSampleRate: 1.0,
    enableNative: false,
    enabled: !__DEV__,
  });
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <RecoilRoot>
        <NavigationContainer>
          <NativeBaseProvider>
            <GetAppState />
            <AppRoutes />
          </NativeBaseProvider>
        </NavigationContainer>
      </RecoilRoot>
    </QueryClientProvider>
  );
}

export default Sentry.wrap(App, {});
