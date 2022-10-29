import {getFocusedRouteNameFromRoute} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useEffect} from 'react';
import BackButton from '../../components/BackButton';

import ManageNetworks from '../ManageNetworks';
import ManageWallets from '../ManageWallets';
import ShareAddress from '../ReceiveToken/ShareAddress';
import AppLock from './AppLock/AppLock';
import EnableAppLock from './AppLock/EnableAppLock';
import ConnectedAccounts from './ConnectAccounts';
import {Currency} from './Currency/Currency';
import NetworksEnvironment from './NetworksEnvironment';
import {Language} from './Language/Language';
import Menu from './Menu';

const Settings = ({navigation, route}) => {
  const Stack = createNativeStackNavigator();
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
        tabBarStyle: {},
      });
  }, [navigation, route]);

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
        }}
      />
      <Stack.Screen
        name="ManageWallets"
        component={ManageWallets}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ConnectAccounts"
        component={ConnectedAccounts}
        options={{
          title: 'Connected Accounts',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="AppLock"
        component={AppLock}
        options={{
          title: 'App lock',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="EnableAppLock"
        component={EnableAppLock}
        options={{
          title: 'Enable App lock',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="ShareAddress"
        component={ShareAddress}
        options={{
          title: 'Share Address',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="NetworksEnvironment"
        component={NetworksEnvironment}
        options={{
          title: 'Networks Environment',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="Currency"
        component={Currency}
        options={{
          title: 'Currency',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="Language"
        component={Language}
        options={{
          title: 'Select Language',
          headerShown: true,
        }}
      />
    </Stack.Navigator>
  );
};

export default Settings;
