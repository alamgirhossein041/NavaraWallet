import Clipboard from '@react-native-clipboard/clipboard';
import {useNavigation} from '@react-navigation/native';
import {Actionsheet, useDisclose} from 'native-base';
import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {
  ClockIcon,
  CogIcon,
  CollectionIcon,
  RefreshIcon,
  DocumentDuplicateIcon,
  HomeIcon,
} from 'react-native-heroicons/outline';
import {DotsHorizontalIcon, XIcon} from 'react-native-heroicons/solid';
import {
  useDarkMode,
  useGridDarkMode,
  useTextDarkMode,
} from '../../hooks/useModeDarkMode';
import {tw} from '../../utils/tailwind';
import toastr from '../../utils/toastr';
import AddFavorite from './AddFavorite';
import {useTabBrowser} from './useTabBrowser';
interface IMenuBrowser {
  text?: string;
  icon: JSX.Element;
  onPress?: () => void;
}

export default function OptionsBrowser(props) {
  const {closeTabBrowser} = useTabBrowser();
  const {tabId, onReload, gotoHomePage} = props;
  const {isOpen, onOpen, onClose} = useDisclose();
  const navigation = useNavigation();
  const menuItems: IMenuBrowser[] = [
    {
      icon: <CollectionIcon width={30} height={30} color="gray" />,
      text: 'Favorites List',
      onPress: () => {
        navigation.navigate('FavoritesList' as never);
      },
    },
    {
      text: 'Copy link',
      icon: <DocumentDuplicateIcon height={30} width={30} color="gray" />,
      onPress: () => {
        // Clipboard.setString(browser.tabs[browser.currentTabId].nativeUrl);
        toastr.info('Copied');
      },
    },
    {
      icon: <CogIcon height={30} width={30} color="gray" />,
      text: 'Settings',
      onPress: () => {
        navigation.navigate('SettingsBrowser' as never);
      },
    },
    {
      icon: <ClockIcon height={30} width={30} color="gray" />,
      text: 'History',
      onPress: () => {
        navigation.navigate('BrowserHistory' as never);
      },
    },

    {
      icon: <HomeIcon height={30} width={30} color="gray" />,
      text: 'Home',
      onPress: () => gotoHomePage(),
    },
    {
      icon: <RefreshIcon height={30} width={30} color="gray" />,
      text: 'Reload',
      onPress: () => onReload(),
    },
    {
      icon: <XIcon height={30} width={30} color="gray" />,
      text: 'Close tab',
      onPress: () => closeTabBrowser(tabId, false),
    },
  ];
  const textColor = useTextDarkMode();
  //grid, shadow darkmode
  const gridColor = useGridDarkMode();
  const modeColor = useDarkMode();
  return (
    <View style={tw`px-3`}>
      <TouchableOpacity onPress={onOpen}>
        <DotsHorizontalIcon width={30} height={30} fill={'gray'} />
      </TouchableOpacity>
      <Actionsheet isOpen={isOpen} onClose={onClose}>
        <Actionsheet.Content style={tw`${modeColor}`}>
          <View style={tw`flex-row flex-wrap justify-start w-full`}>
            <AddFavorite />
            {menuItems.map(item => {
              const handleOnPress = () => {
                item.onPress && item.onPress();
                onClose();
              };
              return (
                <TouchableOpacity
                  key={item.text}
                  onPress={handleOnPress}
                  style={tw`flex-col items-center w-1/4 mb-3`}>
                  <View style={tw`m-1`}>{item.icon}</View>
                  {item.text && (
                    <Text style={tw`${textColor}`}>{item.text}</Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </Actionsheet.Content>
      </Actionsheet>
    </View>
  );
}
