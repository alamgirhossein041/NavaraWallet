import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { result } from 'lodash';
import React, { useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BackButton from '../../components/BackButton';
import { bgGray } from '../../configs/theme';
import { tw } from '../../utils/tailwind';
import AddToken from '../AddToken';
import GetYourDomain from '../GetDomain/GetYourDomain';
import MintDomain from '../GetDomain/MintDomain';
import MintingDomain from '../GetDomain/MintingDomain';
import ImportWalletStack from '../ImportWallet';
import ImportByPhrase from '../ImportWallet/ImportByPhrase';
import ChooseNetwork from '../NewWallet/ChooseNetworks';
import NewYourWallet from '../NewWallet/NewYourWallet';
import PassPhraseNew from '../NewWallet/PassPhraseNew';
import WalletName from '../NewWallet/WalletName';
import Notification from '../Notification/Notification';
import { useDarkMode } from '../../hooks/useDarkMode';
import NextStepWalletID from '../NotUse/NextStepWalletID';
import WalletID from '../NotUse/WalletID';
import ReceiveToken from '../ReceiveToken';
import ReceiveSpecificToken from '../ReceiveToken/ReceiveSpecificToken';
import SendingToken from '../SendToken/SendingToken';
import ViewListWallet from '../SendToken/ViewListWallet';
import SwapScreen from '../Swap/Uniswap';
import {
  default as DetailChain,
  default as DetßailTransaction,
} from './DetailChains';
import WalletDashboard from './WalletDashboard';
import { useTextDarkMode } from '../../hooks/useTextDarkMode';
import { useGridDarkMode } from '../../hooks/useGridDarkMode';
import ManageChains from './ManageChains';

const Home = ({ navigation, route }) => {
  const Stack = createNativeStackNavigator();
  const insets = useSafeAreaInsets();
  const rootScreenName = 'WalletDashboard'; // change the name of the screen which show the tab bar
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
  }, [insets.bottom, navigation, route]);
  //background Darkmode
  const modeColor = useDarkMode();
  //text darkmode
  const textColor = useTextDarkMode();
  //grid, shadow darkmode
  const gridColor = useGridDarkMode();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShadowVisible: false,
        headerTitleAlign: 'center',
        headerStyle: { backgroundColor: bgGray },
        headerLeft: () => <BackButton />,
      }}>
      <Stack.Screen
        name="WalletDashboard"
        options={{
          headerShown: false,
          headerTitleAlign: 'center',
          title: 'Wallet Dashboard',
          headerStyle: tw`${gridColor}`,
          headerTitleStyle: tw`${textColor}`,
        }}
        component={WalletDashboard}
      />

      {/* screen Receive Token */}
      <Stack.Screen
        name="ReceiveToken"
        component={ReceiveToken}
        options={{
          title: 'Receive Token',
          headerStyle: tw`${gridColor}`,
          headerTitleStyle: tw`${textColor}`,
        }}
      />
      <Stack.Screen
        name="DetailChain"
        component={DetailChain}
        options={{
          headerStyle: tw`${gridColor}`,
          headerTitleStyle: tw`${textColor}`,
        }}
      />
      {/* <Stack.Screen name="DetailTransaction" component={DetailTransaction} /> */}
      <Stack.Screen
        name="ReceiveSpecificToken"
        component={ReceiveSpecificToken}
        options={{
          title: '',
          headerStyle: tw`${gridColor}`,
          headerTitleStyle: tw`${textColor}`,
        }}
      />
      {/* screen Receive Token */}

      {/* screen Send Token */}
      <Stack.Screen
        name="ViewListWallet"
        component={ViewListWallet}
        options={{
          title: 'Send Token',
          headerStyle: tw`${gridColor}`,
          headerTitleStyle: tw`${textColor}`,
        }}
      />
      <Stack.Screen
        name="SendingToken"
        component={SendingToken}
        options={{
          title: 'Send Token',
          headerStyle: tw`${gridColor}`,
          headerTitleStyle: tw`${textColor}`,
        }}
      />
      {/* screen Send Token */}

      <Stack.Screen
        name="AddToken"
        component={AddToken}
        options={{
          title: 'Add Token',
          headerStyle: tw`${gridColor}`,
          headerTitleStyle: tw`${textColor}`,
        }}
      />

      <Stack.Screen
        name="GetYourDomain"
        component={GetYourDomain}
        options={{
          title: 'Get Your Domain',
          headerStyle: tw`${gridColor}`,
          headerTitleStyle: tw`${textColor}`,
        }}
      />
      <Stack.Screen
        name="MintDomain"
        component={MintDomain}
        options={{
          title: 'Mint Domain',
          headerStyle: tw`${gridColor}`,
          headerTitleStyle: tw`${textColor}`,
        }}
      />
      <Stack.Screen
        name="MintingDomain"
        component={MintingDomain}
        options={{
          title: 'Minting Domain',
          headerStyle: tw`${gridColor}`,
          headerTitleStyle: tw`${textColor}`,
        }}
      />

      <Stack.Screen
        name="WalletID"
        component={WalletID}
        options={{
          title: 'Wallet ID',
          headerStyle: tw`${gridColor}`,
          headerTitleStyle: tw`${textColor}`,
        }}
      />
      <Stack.Screen
        name="NextStepWalletID"
        component={NextStepWalletID}
        options={{
          title: 'Next Step WalletID',
          headerStyle: tw`${gridColor}`,
          headerTitleStyle: tw`${textColor}`
        }}
      />

      <Stack.Screen
        name="NewWallet"
        component={NewYourWallet}
        options={{
          title: 'New Wallet',
          headerStyle: tw`${gridColor}`,
          headerTitleStyle: tw`${textColor}`
        }}
      />
      <Stack.Screen
        name="WalletName"
        component={WalletName}
        options={{
          title: 'Wallet Name',
          headerStyle: tw`${gridColor}`,
          headerTitleStyle: tw`${textColor}`
        }}
      />
      <Stack.Screen
        name="ChooseNetwork"
        component={ChooseNetwork}
        options={{
          title: 'Choose Network',
          headerStyle: tw`${gridColor}`,
          headerTitleStyle: tw`${textColor}`
        }}
      />
      <Stack.Screen
        name="ImportByPhrase"
        component={ImportByPhrase}
        options={{
          title: 'ImportByPhrase',
          headerStyle: tw`${gridColor}`,
          headerTitleStyle: tw`${textColor}`
        }}
      />
      <Stack.Screen
        name="ImportWalletStack"
        component={ImportWalletStack}
        options={{
          title: 'Import Wallet',
          headerShown: true,
          headerTitleAlign: 'center',
          headerStyle: tw`${gridColor}`,
          headerTitleStyle: tw`${textColor}`
        }}
      />
      {/* Screen Swap */}
      <Stack.Screen
        name="SwapScreen"
        component={SwapScreen}
        options={{
          title: 'Swap Token',
          headerShown: true,
          headerTitleAlign: 'center',
          headerStyle: tw`${gridColor}`,
          headerTitleStyle: tw`${textColor}`
        }}
      />
      <Stack.Screen
        name="PassPhraseNew"
        component={PassPhraseNew}
        options={{
          title: 'Pass Phrase',
          headerStyle: tw`${gridColor}`,
          headerTitleStyle: tw`${textColor}`
        }}
      />
      <Stack.Screen
        name="Notification"
        component={Notification}
        options={{
          title: 'Notification',
          headerStyle: tw`${gridColor}`,
          headerTitleStyle: tw`${textColor}`
        }}
      />
      <Stack.Screen
        name="ManageChains"
        component={ManageChains}
        options={{
          title: 'Manage Chains',
          headerStyle: tw`${gridColor}`,
          headerTitleStyle: tw`${textColor}`
        }}
      />
    </Stack.Navigator>
  );
};

export default Home;
