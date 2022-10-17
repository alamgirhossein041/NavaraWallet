import {getFocusedRouteNameFromRoute} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useEffect} from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import BackButton from '../../components/BackButton';
import {bgGray} from '../../configs/theme';
import {tw} from '../../utils/tailwind';
import AddToken from '../AddToken';
import GetYourDomain from '../Domain/CreateDomain';
import Notification from '../Notification/Notification';
import {useDarkMode} from '../../hooks/useModeDarkMode';
import WalletID from '../OnBoard/CreateWallet';
import ReceiveToken from '../ReceiveToken';
import ReceiveSpecificToken from '../ReceiveToken/ReceiveSpecificToken';
import SendingToken from '../SendToken/SendingToken';
import ViewListWallet from '../SendToken/ViewListWallet';
import SwapScreen from '../Swap/Paraswap';
import {default as DetailChain} from './DetailChains';
import WalletDashboard from './WalletDashboard';
import {useTextDarkMode} from '../../hooks/useModeDarkMode';
import {useGridDarkMode} from '../../hooks/useModeDarkMode';
import ManageChains from './ManageChains';
import ConfirmTransaction from '../SendToken/ConfirmTransaction';
import ResultTransaction from '../SendToken/ResultTransaction';
import SwapToken from '../Swap';
import HistoryWallets from './HistoryWallets';
import News from './News';
import DetailNews from './DetailNews';
import DetailPrice from './DetailPrice';
import {Rewards} from '../Domain/Rewards';
import DetailWallet from '../ManageWallets/DetailWallet';
import BackupWallet from '../Backup/BackupWallet';
import PrivacySeedPhrase from '../ManageWallets/privacySeedPhrase';
import SelectFile from '../Backup/SelectFile';
import RestoreWallet from '../Backup/RestoreWallet';

const Home = ({navigation, route}) => {
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
        tabBarStyle: {},
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
        headerStyle: {backgroundColor: 'white'},
        headerLeft: () => <BackButton />,
      }}>
      <Stack.Screen
        name="WalletDashboard"
        options={{
          headerShown: false,
          headerTitleAlign: 'center',
          title: 'Wallet Dashboard',
        }}
        component={WalletDashboard}
      />

      {/* screen Receive Token */}
      <Stack.Screen
        name="ReceiveToken"
        component={ReceiveToken}
        options={{
          title: 'Receive',
        }}
      />
      <Stack.Screen name="DetailChain" component={DetailChain} options={{}} />
      {/* <Stack.Screen name="DetailTransaction" component={DetailTransaction} /> */}
      <Stack.Screen
        name="ReceiveSpecificToken"
        component={ReceiveSpecificToken}
        options={{
          title: '',
        }}
      />
      {/* screen Receive Token */}

      {/* screen Send Token */}
      <Stack.Screen
        name="ViewListWallet"
        component={ViewListWallet}
        options={{
          title: 'Send Token',
        }}
      />
      <Stack.Screen
        name="SendingToken"
        component={SendingToken}
        options={{
          title: 'Send Token',
        }}
      />
      <Stack.Screen
        name="ResultTransaction"
        component={ResultTransaction}
        options={{
          headerShown: false,
        }}
      />
      {/* screen Send Token */}

      <Stack.Screen
        name="AddToken"
        component={AddToken}
        options={{
          title: 'Add Token',
        }}
      />

      <Stack.Screen
        name="ConfirmTransaction"
        component={ConfirmTransaction}
        options={{}}
      />

      <Stack.Screen
        name="GetYourDomain"
        component={GetYourDomain}
        options={{
          title: 'Name Service',
        }}
      />
      <Stack.Screen
        name="Rewards"
        component={Rewards}
        options={{
          title: 'Rewards',
        }}
      />
      <Stack.Screen
        name="WalletID"
        component={WalletID}
        options={{
          title: 'Wallet ID',
        }}
      />
      <Stack.Screen
        name="DetailWallet"
        component={DetailWallet}
        options={{
          title: '',
        }}
      />
      <Stack.Screen
        name="SwapToken"
        component={SwapToken}
        options={{
          title: 'Swap Token',
          headerShown: true,
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        name="SwapScreen"
        component={SwapScreen}
        options={{
          title: 'Swap',
          headerShown: true,
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        name="Notification"
        component={Notification}
        options={{
          title: 'Notification',
        }}
      />
      <Stack.Screen
        name="ManageChains"
        component={ManageChains}
        options={{
          title: 'Manage Chains',
        }}
      />
      <Stack.Screen
        name="HistoryWallets"
        component={HistoryWallets}
        options={{
          title: 'History Wallets',
        }}
      />
      <Stack.Screen
        name="DetailNews"
        component={DetailNews}
        options={{
          title: 'Detail New',
        }}
      />
      <Stack.Screen
        name="DetailPrice"
        component={DetailPrice}
        options={{
          title: 'Detail Price',
        }}
      />
      <Stack.Screen
        name="News"
        component={News}
        options={{
          title: 'News',
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

export default Home;
