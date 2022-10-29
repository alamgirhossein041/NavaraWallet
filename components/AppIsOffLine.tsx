import {View, Text, SafeAreaView, Platform} from 'react-native';
import React from 'react';
import {StatusBar} from 'native-base';
import {tw} from '../utils/tailwind';
import {useNetInfo} from '@react-native-community/netinfo';
import {PlatFormEnum} from '../enum';
const AppIsOffLine = () => {
  const netInfo = useNetInfo();
  return (
    netInfo.isConnected === false && (
      <SafeAreaView style={tw`bg-red-500 p-1`}>
        <Text style={tw`dark:text-white  text-center text-white font-bold`}>
          No connection
        </Text>
      </SafeAreaView>
    )
  );
};
export default AppIsOffLine;
