import {getFocusedRouteNameFromRoute} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useEffect} from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import BackButton from '../../components/BackButton';
import {useDarkMode} from '../../hooks/useModeDarkMode';
import {useGridDarkMode} from '../../hooks/useModeDarkMode';
import {useLocalStorage} from '../../hooks/useLocalStorage';
import {useTextDarkMode} from '../../hooks/useModeDarkMode';
import {COLOR_SCHEME} from '../../utils/storage';
import {tw} from '../../utils/tailwind';
import AddToken from '../AddToken';

import ManageNetworks from '../ManageNetworks';
import ManageWallets from '../ManageWallets';
import {
  default as ReceiveSpecificToken,
  default as ReceiveToken,
} from '../ReceiveToken';
import ShareAddress from '../ReceiveToken/ShareAddress';
import SubInvest from './Invest';
import IconRing from '../../assets/icons/icon-ring.svg';
import {TouchableOpacity, View} from 'react-native';

const Invest = ({navigation, route}) => {
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
        tabBarStyle: {},
      });
  }, [navigation, route]);
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
        name="Invest"
        component={SubInvest}
        options={{
          title: 'Invest',
          headerShown: true,
          headerTitleAlign: 'center',
          headerStyle: tw`ml-2 ${gridColor}`,
          headerTitleStyle: tw`ml-2 ${textColor}`,
          headerRight: () => (
            <TouchableOpacity>
              <IconRing />
            </TouchableOpacity>
          ),
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
    </Stack.Navigator>
  );
};

export default Invest;
