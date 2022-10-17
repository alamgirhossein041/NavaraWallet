import React from 'react';

import {createStackNavigator} from '@react-navigation/stack';
import VerifyPassPhrase from './VerifyPassPhrase';
import EnableCloudBackup from './EnableCloudBackup';
import BackupWallet from '../Backup/BackupWallet';
import {tw} from '../../utils/tailwind';
import EnableAppLockOnBoard from '../Settings/AppLock/EnableAppLockOnBoard';
import SlideOnBoard from './SlideOnBoard';
import CreateWallet from './CreateWallet';
import ImportWallet from './ImportWallet';
import BackButton from '../../components/BackButton';
import EnableBiometric from './EnableBiometric';
import {View} from 'react-native';
const Stack = createStackNavigator();

const OnBoard = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        headerShadowVisible: false,
        headerLeft: () => (
          <View style={tw`mx-3`}>
            <BackButton />
          </View>
        ),
      }}>
      <Stack.Screen name="SlideOnBoard" component={SlideOnBoard} />
      <Stack.Screen
        name="EnableAppLockOnBoard"
        component={EnableAppLockOnBoard}
      />
      <Stack.Screen
        name="ImportWallet"
        options={{
          headerShown: true,
          title: '',
          // headerLeft: () => <></>,
        }}
        component={ImportWallet}
      />
      <Stack.Screen name="CreateWallet" component={CreateWallet} />
      <Stack.Screen name="VerifyPassPhrase" component={VerifyPassPhrase} />
      <Stack.Screen name="EnableCloudBackup" component={EnableCloudBackup} />
      <Stack.Screen name="EnableBiometric" component={EnableBiometric} />
      <Stack.Screen name="BackupWallet" component={BackupWallet} />
    </Stack.Navigator>
  );
};

export default OnBoard;
