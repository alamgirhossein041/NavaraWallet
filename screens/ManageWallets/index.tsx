import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Wallets from './Wallets';
import ManageSpecificWallet from './ManageSpecificWallet';
import ImportWallet from '../ImportWallet';
import BackButton from '../../components/BackButton';
import { tw } from '../../utils/tailwind';
import { useDarkMode } from '../../hooks/useDarkMode';
import { useTextDarkMode } from '../../hooks/useTextDarkMode';
import { useGridDarkMode } from '../../hooks/useGridDarkMode';

const ManageWallets = () => {
  const Stack = createNativeStackNavigator();
  const modeColor = useDarkMode();
  //text darkmode
  const textColor = useTextDarkMode();
  //grid, shadow darkmode
  const gridColor = useGridDarkMode();
  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleAlign: 'center',
        headerShadowVisible: false,
        headerLeft: () => <BackButton />,
      }}>
      <Stack.Screen
        name="Wallets"
        component={Wallets}
        options={{
          title: 'Manage wallets',
          headerStyle: tw`${gridColor}`,
          headerTitleStyle: tw`${textColor}`,
        }}
      />
      <Stack.Screen
        name="ManageSpecificWallet"
        component={ManageSpecificWallet}
        options={{
          headerStyle: tw`${gridColor}`,
          headerTitleStyle: tw`${textColor}`,
        }}
      />
    </Stack.Navigator>
  );
};

export default ManageWallets;
