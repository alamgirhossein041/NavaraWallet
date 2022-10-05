import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Menu from './Menu';
import ManageNetworks from '../ManageNetworks';
import ManageWallets from '../ManageWallets';
import ConnectedAccounts from './ConnectAccounts';
import AddToken from '../AddToken';
import ReceiveToken from '../ReceiveToken';
import ReceiveSpecificToken from '../ReceiveToken';
import ShareAddress from '../ReceiveToken/ShareAddress';
import AppLock from './AppLock/AppLock';
import EnableAppLock from './AppLock/EnableAppLock';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BackButton from '../../components/BackButton';
import SelectBackupWallet from '../Backup/SelectBackupWallet';
import BackupWallet from '../Backup/BackupWallet';
import { tw } from '../../utils/tailwind';
import { useDarkMode } from '../../hooks/useDarkMode';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { COLOR_SCHEME } from '../../utils/storage';
import { useTextDarkMode } from '../../hooks/useTextDarkMode';
import { useGridDarkMode } from '../../hooks/useGridDarkMode';

const Settings = ({ navigation, route }) => {
  const Stack = createNativeStackNavigator();

  const insets = useSafeAreaInsets();
  const rootScreenName = 'Menu'; // change the name of the screen which show the tab bar
  useEffect(() => {
    const focused = getFocusedRouteNameFromRoute(route); // get the name of the focused screen
    // ensure that the focused screen name is a string (not undefined)
    if (typeof focused === 'string') {
      if (focused !== rootScreenName) {
        // if the focused screen is not the root screen update the tabBarStyle
        navigation.setOptions({
          tabBarStyle: {
            display: 'none',
          },
        });
      }
    }
    // reset the tabBarStyle to default
    return () =>
      navigation.setOptions({
        tabBarStyle: {
          height: 60 + insets.bottom,
          position: 'absolute',
        },
      });
  }, [navigation, route]);
  const modeColor = useDarkMode();
  //text darkmode
  const textColor = useTextDarkMode();
  //grid, shadow darkmode
  const gridColor = useGridDarkMode();
  const [colorSchemeRecoil, setColorSchemeRecoil] =
    useLocalStorage(COLOR_SCHEME);
  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleAlign: 'center',
        headerShadowVisible: false,
        headerLeft: () => <BackButton />,
      }}>
      <Stack.Screen
        name="Menu"
        options={{
          title: 'Settings',
          headerShown: true,
          headerTitleAlign: 'center',
          headerStyle: tw`${gridColor}`,
          headerTitleStyle: tw`${textColor}`,
          headerLeft: () => <></>,
        }}
        component={Menu}
      />
      <Stack.Screen
        name="ManageNetworks"
        component={ManageNetworks}
        options={{
          title: 'Manage Networks',
          headerShown: true,
          headerTitleAlign: 'center',
          headerStyle: tw`${gridColor}`,
          headerTitleStyle: tw`${textColor}`,
        }}
      />
      <Stack.Screen
        name="ManageWallets"
        component={ManageWallets}
        options={{
          headerShown: false,
          headerTitleAlign: 'center',
          headerStyle: tw`${gridColor}`,
          headerTitleStyle: tw`${textColor}`,
          
        }}
      />
      <Stack.Screen
        name="ConnectAccounts"
        component={ConnectedAccounts}
        options={{
          title: 'Connected Accounts',
          headerShown: true,
          headerTitleAlign: 'center',
          headerStyle: tw`${gridColor}`,
          headerTitleStyle: tw`${textColor}`,
        }}
      />
      <Stack.Screen
        name="AddToken"
        component={AddToken}
        options={{
          title: 'Add Token',
          headerShown: true,
          headerTitleAlign: 'center',
          headerStyle: tw`${gridColor}`,
          headerTitleStyle: tw`${textColor}`,
        }}
      />
      <Stack.Screen
        name="ReceiveToken"
        component={ReceiveToken}
        options={{
          title: 'Receive Token',
          headerShown: true,
          headerTitleAlign: 'center',
          headerStyle: tw`${gridColor}`,
          headerTitleStyle: tw`${textColor}`,
        }}
      />
      <Stack.Screen
        name="ReceiveSpecificToken"
        component={ReceiveSpecificToken}
        options={{
          title: 'Receive SpecificToken',
          headerShown: true,
          headerTitleAlign: 'center',
          headerStyle: tw`${gridColor}`,
          headerTitleStyle: tw`${textColor}`,
        }}
      />
      <Stack.Screen
        name="AppLock"
        component={AppLock}
        options={{
          title: 'AppLock',
          headerShown: true,
          headerTitleAlign: 'center',
          headerStyle: tw`${gridColor}`,
          headerTitleStyle: tw`${textColor}`,
        }}
      />
      <Stack.Screen
        name="EnableAppLock"
        component={EnableAppLock}
        options={{
          title: 'Enable AppLock',
          headerShown: true,
          headerTitleAlign: 'center',
          headerStyle: tw`${gridColor}`,
          headerTitleStyle: tw`${textColor}`,
        }}
      />
      <Stack.Screen
        name="ShareAddress"
        component={ShareAddress}
        options={{
          title: 'Share Address',
          headerShown: true,
          headerTitleAlign: 'center',
          headerStyle: tw`${gridColor}`,
          headerTitleStyle: tw`${textColor}`,
        }}
      />
      <Stack.Screen
        name="SelectBackupWallet"
        component={SelectBackupWallet}
        options={{
          title: 'Enable Cloud Backup',
          headerShown: true,
          headerTitleAlign: 'center',
          headerStyle: tw`${gridColor}`,
          headerTitleStyle: tw`${textColor}`,
        }}
      />
      <Stack.Screen
        name="BackupWallet"
        component={BackupWallet}
        options={{
          title: 'Enable Cloud Backup',
          headerShown: true,
          headerTitleAlign: 'center',
          headerStyle: tw`${gridColor}`,
          headerTitleStyle: tw`${textColor}`,
        }}
      />
    </Stack.Navigator>
  );
};

export default Settings;
