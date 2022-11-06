import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, Switch, Text, View } from "react-native";
import { getReadableVersion } from "react-native-device-info";
import { BeakerIcon } from "react-native-heroicons/solid";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRecoilState } from "recoil";
import { useDeviceContext } from "twrnc";
import IconLanguage from "../../assets/icons/icon-language.svg";
import IconLock from "../../assets/icons/icon-lock.svg";
import IconManageWallet from "../../assets/icons/icon-manager-wallet.svg";
import MenuItem from "../../components/UI/MenuItem";
import { primaryColor, primaryGray } from "../../configs/theme";
import { listWalletsState } from "../../data/globalState/listWallets";
import { walletEnvironmentState } from "../../data/globalState/userData";
import { ENVIRONMENT } from "../../global.config";
import { localStorage, NETWORKS_ENVIRONMENT } from "../../utils/storage";
import { tw } from "../../utils/tailwind";
import toastr from "../../utils/toastr";

const Menu = ({ navigation }) => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const [listWallets] = useRecoilState(listWalletsState);
  useDeviceContext(tw, { withDeviceColorScheme: false });
  const [walletEnvironment, setWalletEnvironment] = useRecoilState(
    walletEnvironmentState
  );

  /**
   * Hanlde swtich testnet / mainnet
   */
  const [isLoading, setIsLoading] = useState(false);
  const handelChangeTestNet = async (isTestnet: boolean) => {
    setIsLoading(true);
    try {
      const newEnvironment = isTestnet
        ? ENVIRONMENT.DEVELOPMENT
        : ENVIRONMENT.PRODUCTION;
      setWalletEnvironment(newEnvironment);
      await localStorage.set(NETWORKS_ENVIRONMENT, newEnvironment);
    } catch (error) {
      toastr.error("Error");
    }
    setIsLoading(false);
  };

  const menu = [
    {
      group: `${t("setting.wallets")}`,
      items: [
        {
          icon: <IconManageWallet />,
          name: `${t("setting.manage_wallets")}`,

          onPress: () => {
            navigation.push("ManageWallets");
          },
          value: (
            <View style={tw`flex flex-row items-center`}>
              <View
                style={tw`bg-[${primaryColor}] mx-1 rounded-full px-3 py-1`}
              >
                <Text style={tw`font-bold text-white dark:text-white`}>
                  {listWallets.length}
                </Text>
              </View>
            </View>
          ),
          next: true,
        },
        {
          icon: <BeakerIcon color={primaryColor} />,
          name: `${
            walletEnvironment === ENVIRONMENT.DEVELOPMENT
              ? `${t("setting.using_testnet")}`
              : `${t("setting.try_testnet")}`
          } `,
          value: (
            <Switch
              trackColor={{ false: primaryGray, true: primaryColor }}
              thumbColor="white"
              onValueChange={handelChangeTestNet}
              value={walletEnvironment === ENVIRONMENT.DEVELOPMENT}
              disabled={isLoading}
            />
          ),
          next: false,
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
      group: `${t("setting.app_security")}`,
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
          name: `${t("setting.app_lock")}`,

          onPress: () => {
            navigation.navigate("AppLock");
          },
          value: "Password / Biometric",
          next: true,
        },
        // {
        //   icon: <IconKey />,
        //   name: `${t('setting.transaction_signing')}`,

        //   onPress: () => {},
        //   value: (
        //     <Switch
        //       trackColor={{false: primaryGray, true: primaryColor}}
        //       thumbColor="white"
        //       onValueChange={value =>
        //         setAppLock({...appLock, transactionSigning: value})
        //       }
        //       value={appLock.transactionSigning}
        //     />
        //   ),
        //   next: false,
        // },
      ],
    },

    {
      group: `${t("setting.general")}`,
      items: [
        {
          icon: <IconLanguage />,
          name: `${t("setting.language")}`,
          onPress: () => {
            navigation.navigate("Language");
          },
          value: "",
          next: true,
        },
        // {
        //   icon: <IconCurrency  />,
        //   name: `${t("setting.currency")}`,
        //   onPress: () => {
        //     navigation.navigate('Currency');
        //   },
        //   value: '',
        //   next: true,
        // },
      ],
    },
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
    //   ],
    // },
  ];

  return (
    <View style={tw`flex flex-col h-full bg-white dark:bg-[#18191A] `}>
      <ScrollView style={tw`mb-[${insets.bottom + 60}]`}>
        {menu.map((group, index) => (
          <View
            key={index}
            style={tw`mb-3 border-b border-gray-100 dark:border-gray-800`}
          >
            <Text
              style={tw`px-3 text-base font-semibold text-black dark:text-white`}
            >
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
                )
            )}
          </View>
        ))}
        <Text
          style={tw`w-full mt-10 text-center text-gray-400 dark:text-gray-100`}
        >
          Version: {getReadableVersion()}
        </Text>
      </ScrollView>
    </View>
  );
};

export default Menu;
