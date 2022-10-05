import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { StatusBar, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import IconSettings from '../assets/icons/icon-settings.svg';
import IconWallet from '../assets/icons/icon-wallet.svg';
import { primaryColor, secondaryGray } from '../configs/theme';
import { useDarkMode } from '../hooks/useDarkMode';
import { useLocalStorage } from '../hooks/useLocalStorage';
import Home from '../screens/Home';
import ImportAlreadyWallet from '../screens/ImportAlreadyWallet/index';
import NotUse from '../screens/NotUse';
import OnBoard from '../screens/OnBoard';
import Settings from '../screens/Settings';
import Splash from '../screens/Splash';
import { COLOR_SCHEME } from '../utils/storage';
import { tw } from '../utils/tailwind';
const RootStack = createStackNavigator();
const Tab = createBottomTabNavigator();
interface ITab {
  name: string;
  label: string;
  component?: any;
}

const tabs: ITab[] = [
  // {
  //   name: "Market",
  //   label: "Market",
  //   component: Home, //Market fake UI to Home
  // },
  {
    name: 'Wallet',
    label: 'Wallet',
    component: Home,
  },
  {
    name: 'Settings',
    label: 'Settings',
    component: Settings,
  },
  // {
  //   name: "Notification",
  //   label: "Notification",
  //   component: Notification,
  // },
];

const getIcon = (name: string, size: number, color: string) => {
  switch (name) {
    // case "Market":
    //   return <IconMarket width={size} height={size} fill={color} />;
    case 'Wallet':
      return <IconWallet width={size} height={size} fill={color} />;
    case 'Settings':
      return <IconSettings width={size} height={size} fill={color} />;
    // case "Notification":
    // return <IconNotification width={size} height={size} fill={color} />;
    default:
      return <></>;
  }
};

const TabsNavigation = () => {
  //get the insets of the safe area
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      initialRouteName="Wallet"
      screenOptions={{
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: primaryColor,
        tabBarInactiveTintColor: secondaryGray,
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          height: 60 + insets.bottom,
          position: 'absolute',
        },
      }}>
      {tabs.map((tab: ITab) => (
        <Tab.Screen
          key={tab.name}
          name={tab.name}
          component={tab.component}
          options={{
            tabBarIcon: ({ color, size }) => ButtonNavBar(tab, size - 2, color),
          }}
        />
      ))}
    </Tab.Navigator>
  );
};

//custom button for tabbar
const ButtonNavBar = (tab: ITab, size: number, color: string) => {
  const modeColor = useDarkMode()
  return (
    <View
      style={tw`w-full h-full flex items-center justify-center ${modeColor}`}>
      <View>{getIcon(tab.name, size, color)}</View>
      <Text style={tw` text-[${color}]`}>{tab.label}</Text>
    </View>
  );
};

const AppRoutes = () => {
  const [colorSchemeRecoil, setColorSchemeRecoil] = useLocalStorage(COLOR_SCHEME);
  return (
    <View style={tw`flex-1 `}>
      {/* Dark mode: barStyle="light-content" */}
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <RootStack.Navigator>
        <RootStack.Screen
          name="Splash"
          options={{ headerShown: false }}
          component={Splash}
        />
        <RootStack.Screen
          name="ImportAlreadyWallet"
          options={{ headerShown: false }}
          component={ImportAlreadyWallet}
        />

        <RootStack.Screen
          name="OnBoard"
          options={{ headerShown: false }}
          component={OnBoard}
        />
        <RootStack.Screen
          name="NotUse"
          options={{ headerShown: false }}
          component={NotUse}
        />
        <RootStack.Screen
          name="TabsNavigation"
          options={{ headerShown: false }}
          component={TabsNavigation}
        />
      </RootStack.Navigator>
    </View>
  );
};

export default AppRoutes;
