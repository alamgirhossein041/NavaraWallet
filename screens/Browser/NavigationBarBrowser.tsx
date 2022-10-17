/* eslint-disable react-native/no-inline-styles */
import {View, Text, TouchableOpacity, Animated} from 'react-native';
import React, {memo, useEffect, useRef} from 'react';
import {tw} from '../../utils/tailwind';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ShareIcon,
} from 'react-native-heroicons/solid';
import OptionsBrowser from './OptionsBrowser';
import {useRecoilValue} from 'recoil';
import {browserState, NEW_TAB} from '../../data/globalState/browser';
import Share from 'react-native-share';
import {useTabBrowser} from './useTabBrowser';
interface INavigationBarBrowserProps {
  isShow?: boolean;
  goBack?: () => void;
  goNext?: () => void;
  gotoHomePage?: () => void;
  onReload?: () => void;
  openManageTabs?: () => void;
  tabId: number;
  url: string;
}
const NavigationBarBrowser = memo((props: INavigationBarBrowserProps) => {
  const {goBack, goNext, openManageTabs, isShow, url} = props;
  const {createTabBrowser} = useTabBrowser();
  const browser = useRecoilValue(browserState);
  const handleShareUrl = async () => {
    if (url === NEW_TAB) {
      return;
    }
    await Share.open({
      url,
      message: 'Send via Navara browser',
    });
  };
  const navbarItems = [
    {
      icon: <ChevronLeftIcon fill="gray" width={35} height={35} />,
      onPress: () => {
        goBack();
      },
    },

    {
      icon: <ChevronRightIcon fill="gray" width={35} height={35} />,
      onPress: () => {
        goNext();
      },
    },

    {
      icon: (
        <View
          onPress={openManageTabs}
          style={[
            tw`items-center justify-center h-6 px-1 mx-2 border-2 rounded-lg w-7`,
            {
              borderColor: 'gray',
            },
          ]}>
          <Text style={tw`text-gray-500`}>
            {browser.length <= 99 ? browser.length : `${99}+`}
          </Text>
        </View>
      ),
      onPress: () => openManageTabs(),
    },
    {
      icon: <ShareIcon fill="gray" width={25} height={25} />,
      onPress: () => handleShareUrl(),
    },
    {
      icon: <OptionsBrowser {...props} />,
    },
  ];
  const animationValues = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isShow) {
      Animated.timing(animationValues, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(animationValues, {
        toValue: 200,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isShow]);

  return (
    <Animated.View
      style={[
        tw`absolute bottom-0 left-0 right-0 flex-row items-center justify-between p-2 bg-white shadow ios:pb-7`,
        {
          transform: [
            {
              translateY: animationValues,
            },
          ],
        },
      ]}>
      {navbarItems.map((item, index) => {
        return (
          <TouchableOpacity
            key={index}
            {...item}
            style={tw`flex-row justify-center w-10 `}>
            {item.icon}
          </TouchableOpacity>
        );
      })}
    </Animated.View>
  );
});

export default NavigationBarBrowser;
