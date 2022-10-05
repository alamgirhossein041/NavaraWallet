import React, { useState } from 'react';

import { createStackNavigator } from '@react-navigation/stack';
import WalletID from './WalletID';
import NextStepWalletID from './NextStepWalletID';
import PassPhrase from './PassPhrase';
import VerifyPassPhrase from './VerifyPassPhrase';
import EnableCloudBackup from './EnableCloudBackup';
import SelectBackupWallet from '../Backup/SelectBackupWallet';
import BackupWallet from '../Backup/BackupWallet';
import {tw} from '../../utils/tailwind';
import { useDarkMode } from '../../hooks/useDarkMode';
import { useTextDarkMode } from '../../hooks/useTextDarkMode';
import { useGridDarkMode } from '../../hooks/useGridDarkMode';
import EnableAppLockOnBoard from '../Settings/AppLock/EnableAppLockOnBoard';

const Stack = createStackNavigator();

const NotUse = () => {
  const modeColor = useDarkMode();
  //text darkmode
  const textColor = useTextDarkMode();
  //grid, shadow darkmode
  const gridColor = useGridDarkMode();
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="EnableAppLockOnBoard"
        component={EnableAppLockOnBoard}
        options={{
          headerShown: false,
          headerTitleAlign: 'center',
          headerStyle: tw`dark:bg-gray-800 bg-white`,
          headerTitleStyle: tw`dark:text-white`
        }}
      />
      <Stack.Screen
        name="WalletID"
        component={WalletID}
        options={{
          headerShown: false,
          headerTitleAlign: 'center',
          title: 'Wallet ID',
          headerStyle: tw`${gridColor}`,
          headerTitleStyle: tw`${textColor}`
        }}
      />

      <Stack.Screen
        name="NextStepWalletID"
        component={NextStepWalletID}
        options={{
          headerShown: false,
          headerStyle: tw`${gridColor}`,
          headerTitleStyle: tw`${textColor}`,
          headerTitleAlign: 'center',
          title: 'Next Step WalletID',
        }}
      />
      <Stack.Screen
        name="PassPhrase"
        component={PassPhrase}
        options={{
          headerShown: false,
          headerTitleAlign: 'center',
          title: 'PassPhrase',
          headerStyle: tw`${gridColor}`,
          headerTitleStyle: tw`${textColor}`,
        }}
      />
      <Stack.Screen
        name="VerifyPassPhrase"
        component={VerifyPassPhrase}
        options={{
          headerShown: false,
          headerTitleAlign: 'center',
          title: 'Verify PassPhrase',
          headerStyle: tw`${gridColor}`,
          headerTitleStyle: tw`${textColor}`,
        }}
      />

      <Stack.Screen
        name="EnableCloudBackup"
        component={EnableCloudBackup}
        options={{
          headerShown: false,
          headerTitleAlign: 'center',
          title: '',
          headerStyle: tw`${gridColor}`,
          headerTitleStyle: tw`${textColor}`,
        }}
      />
      <Stack.Screen
        name="SelectBackupWallet"
        component={SelectBackupWallet}
        options={{
          title: 'Enable Cloud Backup',
          headerShown: false,
          headerTitleAlign: 'center',
          headerStyle: tw`${gridColor}`,
          headerTitleStyle: tw`${textColor}`
        }}
      />
      <Stack.Screen
        name="BackupWallet"
        component={BackupWallet}
        options={{
          title: 'Enable Cloud Backup',
          headerShown: false,
          headerTitleAlign: 'center',
          headerStyle: tw`${gridColor}`,
          headerTitleStyle: tw`${textColor}`
        }}
      />
    </Stack.Navigator>
  );
};

export default NotUse;
