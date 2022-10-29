import React from 'react';
import {ScrollView, Switch, Text, View} from 'react-native';
import {tw} from '../../utils/tailwind';
import {primaryColor, primaryGray} from '../../configs/theme';
import MenuItem from '../../components/MenuItem';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useDeviceContext} from 'twrnc';
import {useRecoilState, useRecoilValue} from 'recoil';
import {listWalletsState} from '../../data/globalState/listWallets';
import {appLockState} from '../../data/globalState/appLock';
import {useColorMode} from 'native-base';
import IconLanguage from '../../assets/icons/icon-language.svg';
import IconCurrency from '../../assets/icons/icon-currency.svg';
import IconManageWallet from '../../assets/icons/icon-manager-wallet.svg';
import IconLock from '../../assets/icons/icon-lock.svg';
import IconKey from '../../assets/icons/icon-key.svg';
import {BeakerIcon} from 'react-native-heroicons/solid';
import {walletEnvironmentState} from '../../data/globalState/userData';
import {ENVIRONMENT} from '../../global.config';

const Menu = ({navigation}) => {
  const insets = useSafeAreaInsets();
  const [listWallets] = useRecoilState(listWalletsState);
  useDeviceContext(tw, {withDeviceColorScheme: false});
  const [appLock, setAppLock] = useRecoilState(appLockState);
  const shortenAddress = (address: string) => {
    if (address.length > 10) {
      return address.substring(0, 5) + '...';
    } else {
      return address;
    }
  };
  const walletEnvironment = useRecoilValue(walletEnvironmentState);
  const menu = [
    {
      group: 'Wallets',
      items: [
        {
          icon: <IconManageWallet />,
          name: 'Manage wallets',
          onPress: () => {
            navigation.push('ManageWallets');
          },
          value: (
            <View style={tw`flex flex-row items-center`}>
              <View
                style={tw`bg-[${primaryColor}] mx-1 rounded-full px-3 py-1`}>
                <Text style={tw`font-bold text-white dark:text-white`}>
                  {listWallets.length}
                </Text>
              </View>
            </View>
          ),
          next: true,
        },
        {
          icon: <BeakerIcon />,
          name: `${
            walletEnvironment === ENVIRONMENT.DEVELOPMENT
              ? 'Using Testnet'
              : 'Try Testnet'
          } (beta)`,
          onPress: () => {
            navigation.navigate('NetworksEnvironment');
          },
          next: true,
        },
        // {
        //   icon: <UserIcon width="100%" height="100%" fill={primaryColor} />,
        //   name: 'Credentials',
        //   onPress: () => {
        //     navigation.push('ConnectAccounts');
        //   },
        //   value: (
        //      <Text style={tw`text-xs text-red-400 dark:text-white`}>
        //       01 account(s) connected
        //     </Text>
        //   ),
        //   next: true,
        // },
        // {
        //   icon: <TableIcon width="100%" height="100%" fill={primaryColor} />,
        //   name: 'Backup passphrase',
        //   onPress: () => {
        //     navigation.navigate('SelectBackupWallet');
        //   },
        //   value: (
        //     <View style={tw`w-4 h-4 `}>
        //       <ExclamationIcon width="100%" height="100%" fill="#FF6675" />
        //     </View>
        //   ),
        //   next: true,
        // },
      ],
    },
    {
      group: 'App Security',
      items: [
        // {
        //   icon: colorMode === 'light' ? (
        //     <SunIcon width="100%" height="100%" fill="orange" />
        //   ) : (
        //     <MoonIcon width="100%" height="100%" fill="gray" />
        //   ),
        //   name: colorMode === 'light' ? 'Light Mode' : 'Dark Mode',
        //   onPress: () => {
        //     toggleColorMode();
        //   },
        //   value: <></>,
        //   next: false,
        // },
        // DEVELOPMENT OPTIONS
        // {
        //   icon: (
        //     <IconKey width="100%" height="100%" fill={primaryColor} />
        //   ),
        //   name: 'Developer Options',
        //   onPress: () => {
        //     navigation.navigate('NetworksEnvironment');
        //   },
        //   value: '',
        //   next: true,
        // },
        {
          icon: <IconLock />,
          name: 'App Lock',
          onPress: () => {
            navigation.navigate('AppLock');
          },
          value: 'PIN / Biometric',
          next: true,
        },
        {
          icon: <IconKey />,
          name: 'Transaction signing',
          onPress: () => {},
          value: (
            <Switch
              trackColor={{false: primaryGray, true: primaryColor}}
              thumbColor="white"
              onValueChange={value =>
                setAppLock({...appLock, transactionSigning: value})
              }
              value={appLock.transactionSigning}
            />
          ),
          next: false,
        },
      ],
    },

    // {
    //   group: 'General',
    //   items: [
    //     {
    //       icon: <IconLanguage />,
    //       name: 'Language',
    //       onPress: () => {
    //         navigation.navigate('Language');
    //       },
    //       value: '',
    //       next: true,
    //     },
    //     {
    //       icon: <IconCurrency  />,
    //       name: 'Currency',
    //       onPress: () => {
    //         navigation.navigate('Currency');
    //       },
    //       value: '',
    //       next: true,
    //     },

    //   ],
    // },
    // {
    //   group: 'Activities',
    //   items: [
    //     {
    //       icon: <UserAddIcon width="100%" height="100%" fill={primaryColor} />,
    //       name: 'Invite friends',
    //       onPress: () => shareLinkInvite(),
    //       value: <></>,
    //       next: true,
    //     },
    //     // Platform.OS === PlatFormEnum.IOS && {
    //     //   icon: <ShareIcon width="100%" height="100%" fill={primaryColor} />,
    //     //   name: 'Airdrop',
    //     //   onPress: () => {},
    //     //   value: <></>,
    //     //   next: true,
    //     // },
    //   ],
    // },
  ];

  //text darkmode

  //grid, shadow darkmode
  //grid, shadow darkmode

  return (
    <View style={tw`flex flex-col h-full bg-white dark:bg-[#18191A] `}>
      {/* <HeaderScreen title="Settings" /> */}
      <ScrollView style={tw`mb-[${insets.bottom + 60}]`}>
        {menu.map((group, index) => (
          <View
            key={index}
            style={tw`mb-3 border-b border-gray-100 dark:border-gray-600 dark:border-gray-800`}>
            <Text style={tw`px-3 text-base font-semibold dark:text-white`}>
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
