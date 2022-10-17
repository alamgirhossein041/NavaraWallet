import {View, Text, Image} from 'react-native';
import React, {useEffect, useMemo} from 'react';
import {tw} from '../../utils/tailwind';
import {GlobeAltIcon} from 'react-native-heroicons/solid';
import {NEW_TAB} from '../../data/globalState/browser';

interface IFavicon {
  domain: string;
  size?: number;
}
export default function Favicon({domain, size = 10}: IFavicon) {
  const urlFavicon = useMemo(() => {
    return `https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://${domain}&size=128`;
  }, [domain]);
  return (
    <View
      style={tw`w-${size + 2} h-${
        size + 2
      } items-center justify-center p-1 bg-white border border-gray-100 rounded-full`}>
      {domain === NEW_TAB ? (
        <GlobeAltIcon width={30} height={30} fill="gray" />
      ) : (
        <Image
          style={tw`w-${size} h-${size} rounded-full`}
          source={{uri: urlFavicon}}
        />
      )}
    </View>
  );
}
