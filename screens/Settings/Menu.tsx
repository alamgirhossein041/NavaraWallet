import React, { useEffect, useState } from 'react';
import {
  Appearance,
  Platform,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { tw } from '../../utils/tailwind';
import WalletIcon from '../../assets/icons/icon-wallet.svg';
import ExclamationIcon from '../../assets/icons/icon-exclamation.svg';
import { primaryColor, primaryGray } from '../../configs/theme';
import MenuItem from '../../components/MenuItem';
import {
  CashIcon,
  CreditCardIcon,
  GlobeAltIcon,
  KeyIcon,
  LocationMarkerIcon,
  LockClosedIcon,
  MoonIcon,
  ShareIcon,
  SunIcon,
  TableIcon,
  UserAddIcon,
  UserIcon,
} from 'react-native-heroicons/solid';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { shareLinkInvite } from '../../utils/generatelinkInvite';
import { PlatFormEnum } from '../../enum';
import { COLOR_SCHEME, LIST_WALLETS } from '../../utils/storage';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useDeviceContext, useAppColorScheme } from 'twrnc';
import { useDarkMode } from '../../hooks/useDarkMode';
import { useTextDarkMode } from '../../hooks/useTextDarkMode';
import { useGridDarkMode } from '../../hooks/useGridDarkMode';
import { useRecoilState } from 'recoil';
import { listWalletsState } from '../../data/globalState/listWallets';

const Menu = ({ navigation }) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const insets = useSafeAreaInsets();
  const [listWallets] = useRecoilState(listWalletsState);
  useDeviceContext(tw, { withDeviceColorScheme: false });
  const [colorSchemeLocalStorage, setColorSchemeLocalStorage] =
    useLocalStorage(COLOR_SCHEME);
  const [colorScheme, toggleColorScheme, setColorScheme] =
    useAppColorScheme(tw);





  const menu = [
    {
      group: 'Wallets',
      items: [
        {
          icon: <CreditCardIcon width="100%" height="100%" fill={primaryColor} />,
          name: 'Manage wallets',
          onPress: () => {
            navigation.push('ManageWallets');
          },
          value:
            listWallets &&
            listWallets.filter(wallet => wallet.isSelected)[0].value,
          next: true,
        },
        {
          icon: <UserIcon width="100%" height="100%" fill={primaryColor} />,
          name: 'Credentials',
          onPress: () => {
            navigation.push('ConnectAccounts');
          },
          value: (
            <Text style={tw`text-xs text-red-400`}>
              01 account(s) connected
            </Text>
          ),
          next: true,
        },
        {
          icon: <TableIcon width="100%" height="100%" fill={primaryColor} />,
          name: 'Backup passphrase',
          onPress: () => {
            navigation.navigate('SelectBackupWallet');
          },
          value: (
            <View style={tw` w-4 h-4`}>
              <ExclamationIcon width="100%" height="100%" fill="#FF6675" />
            </View>
          ),
          next: true,
        },
      ],
    },
    {
      group: 'App Security',
      items: [
        {
          icon: (
            <LockClosedIcon width="100%" height="100%" fill={primaryColor} />
          ),
          name: 'App Lock',
          onPress: () => {
            navigation.navigate('AppLock');
          },
          value: 'PIN / Biometric',
          next: true,
        },
        {
          icon: <KeyIcon width="100%" height="100%" fill={primaryColor} />,
          name: 'Transaction signing',
          onPress: () => { },
          value: (
            <Switch
              trackColor={{ false: primaryGray, true: primaryColor }}
              thumbColor="white"
              onValueChange={value => setIsEnabled(value)}
              value={isEnabled}
            />
          ),
          next: false,
        },
      ],
    },
    {
      group: 'General',
      items: [
        {
          icon: <GlobeAltIcon width="100%" height="100%" fill={primaryColor} />,
          name: 'Language',
          onPress: () => { },
          value: 'English',
          next: true,
        },
        {
          icon: <CashIcon width="100%" height="100%" fill={primaryColor} />,
          name: 'Currency',
          onPress: () => { },
          value: 'USD',
          next: true,
        },
        {
          icon: (
            <LocationMarkerIcon
              width="100%"
              height="100%"
              fill={primaryColor}
            />
          ),
          name: 'Address book',
          onPress: () => { },
          value: '',
          next: true,
        },

      ],
    },
    {
      group: 'Activities',
      items: [
        {
          icon: <UserAddIcon width="100%" height="100%" fill={primaryColor} />,
          name: 'Invite friends',
          onPress: () => shareLinkInvite(),
          value: <></>,
          next: true,
        },
        Platform.OS === PlatFormEnum.IOS && {
          icon: <ShareIcon width="100%" height="100%" fill={primaryColor} />,
          name: 'Airdrop',
          onPress: () => { },
          value: <></>,
          next: true,
        },
      ],
    },
  ];
  const modeColor = useDarkMode();
  //text darkmode
  const textColor = useTextDarkMode();
  //grid, shadow darkmode
  const gridColor = useGridDarkMode();
  return (
    <View style={tw`h-full flex flex-col ${modeColor}`}>
      {/* <HeaderScreen title="Settings" /> */}
      <ScrollView style={tw`mb-[${insets.bottom + 60}] px-4`}>
        {menu.map((group, index) => (
          <View key={index} style={tw`mb-5`}>
            <Text style={tw`text-base font-semibold px-3 ${textColor}`}>
              {group.group}
            </Text>
            {group.items.map(
              (item, index) =>
                item.name && (
                  <View key={index}>
                    <MenuItem
                      icon={item.icon}
                      name={item.name}
                      onPress={item.onPress}
                      value={item.value}
                      next={item.next}
                      disabled={!item.next}
                    />
                  </View>
                ),
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default Menu;
