import React from 'react';
import {StatusBar, Text, View, TouchableOpacity, Platform} from 'react-native';
import {ArrowLeftIcon} from 'react-native-heroicons/solid';
import {tw} from '../utils/tailwind';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {PlatFormEnum} from '../enum';

interface IHeaderScreenProps {
  title: string; // show text title center header screen
  showBack?: boolean; // show back button
  right?: JSX.Element; // icon or text
  titleIcon?: JSX.Element; // icon on the left of title
}

const HeaderScreen = ({
  title,
  showBack,
  right,
  titleIcon,
}: IHeaderScreenProps) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const paddingTop = insets.top;

  return (
    <View
      style={tw`w-full mt-[${paddingTop}] flex-row items-center p-3 justify-between mb-3`}>
      <View>
        {showBack && (
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => navigation.goBack()}
            style={tw`p-2 rounded-full`}>
            <ArrowLeftIcon width={25} height={25} fill="black" />
          </TouchableOpacity>
        )}
      </View>
      <View style={tw`flex-row items-center`}>
        {titleIcon && titleIcon}
        <Text style={tw`dark:text-white  text-lg font-medium text-center `}>
          {title}
        </Text>
      </View>
      <View>{right}</View>
    </View>
  );
};

export default HeaderScreen;
