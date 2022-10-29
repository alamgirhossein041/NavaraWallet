import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Wallets from './Wallets';
import DetailWallet from './DetailWallet';
// import ImportWallet from '../ImportWallet';
import BackButton from '../../components/BackButton';
import {tw} from '../../utils/tailwind';
// import {useDarkMode} from '../../hooks/useModeDarkMode';
import {useTextDarkMode} from '../../hooks/useModeDarkMode';
import {useGridDarkMode} from '../../hooks/useModeDarkMode';
import BackupWallet from '../Backup/BackupWallet';
import PrivacySeedPhrase from './privacySeedPhrase';
import SelectFile from '../Backup/SelectFile';
import RestoreWallet from '../Backup/RestoreWallet';
import CreateWallet from '../OnBoard/CreateWallet';
import ImportWallet from '../OnBoard/ImportWallet';

const ManageWallets = () => {
  const Stack = createNativeStackNavigator();
  //
  //text darkmode

  //grid, shadow darkmode

  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleAlign: 'center',
        headerStyle: tw`bg-white dark:bg-[#18191A] `,
        headerShadowVisible: false,
        headerLeft: () => <BackButton />,
      }}>
      <Stack.Screen
        name="Wallets"
        component={Wallets}
        options={{
          title: 'Manage Wallets',
        }}
      />
      <Stack.Screen
        name="CreateWallet"
        component={CreateWallet}
        options={{title: ''}}
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
      <Stack.Screen
        name="DetailWallet"
        component={DetailWallet}
        options={{
          title: '',
        }}
      />
      <Stack.Screen
        name="BackupWallet"
        component={BackupWallet}
        options={{
          title: 'Create Your Backup File',
        }}
      />

      <Stack.Screen
        name="PrivacySeedPhrase"
        component={PrivacySeedPhrase}
        options={{}}
      />
      <Stack.Screen
        name="SelectFile"
        component={SelectFile}
        options={{
          title: 'Select File',
        }}
      />
      <Stack.Screen
        name="RestoreWallet"
        component={RestoreWallet}
        options={{
          title: 'Restore Wallet',
        }}
      />
    </Stack.Navigator>
  );
};

export default ManageWallets;
