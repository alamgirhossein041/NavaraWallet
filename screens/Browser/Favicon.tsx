import {View, Text, Image} from 'react-native';
import React, {useEffect, useMemo} from 'react';
import {tw} from '../../utils/tailwind';
import {GlobeAltIcon} from 'react-native-heroicons/solid';
import {NEW_TAB} from '../../data/globalState/browser';

interface IFavicon {
  url: string;
  size?: number;
}
export default function Favicon({url, size = 10}: IFavicon) {
  return (
    <View
      style={tw`w-${size + 2} h-${
        size + 2
      } items-center justify-center p-1 bg-white dark:bg-[#18191A]  border border-gray-100 dark:border-gray-600 rounded-full`}>
      {url === NEW_TAB || !url ? (
        <GlobeAltIcon width={30} height={30} fill="gray" />
      ) : (
        <Image
          style={tw`w-${size} h-${size} rounded-full`}
          source={{uri: url}}
        />
      )}
    </View>
  );
}
