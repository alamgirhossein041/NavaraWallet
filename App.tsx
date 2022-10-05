import React from "react"
import "react-native-get-random-values"
import "@ethersproject/shims"
import "react-native-gesture-handler";
import 'react-native-url-polyfill/auto'
import '@ethersproject/shims';
import {NavigationContainer} from '@react-navigation/native';
import {NativeBaseProvider} from 'native-base';
import 'react-native-gesture-handler';
import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';
import {QueryClient, QueryClientProvider} from 'react-query';
import {RecoilRoot} from 'recoil';
import GetAppState from './components/GetAppState';
import AppRoutes from './navigation';

export default function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <NativeBaseProvider>
          <RecoilRoot>
            <GetAppState />
            <AppRoutes />
          </RecoilRoot>
        </NativeBaseProvider>
      </NavigationContainer>
    </QueryClientProvider>
  );
}
