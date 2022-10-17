import React from 'react';
import {Text, View} from 'react-native';
import {CheckIcon} from 'react-native-heroicons/solid';
import PressableAnimated from '../../../components/PressableAnimated';
import {searchDefault} from '../../../configs/browser';
import {primaryColor} from '../../../configs/theme';
import {useLocalStorage} from '../../../hooks/useLocalStorage';
import {BROWSER_SETTINGS} from '../../../utils/storage';
import {tw} from '../../../utils/tailwind';
import Favicon from '../Favicon';

const SearchEngine = () => {
  const [browserSettings, setBrowserSettings] =
    useLocalStorage(BROWSER_SETTINGS);

  const searchEngines = Object.entries(searchDefault);
  const selected = browserSettings?.searchEngine;

  return (
    <View style={tw`flex-1 bg-white`}>
      <View style={tw`m-4 bg-gray-100 rounded-lg`}>
        {searchEngines.map(([key, value], index) => {
          const hostname = new URL(value.url).hostname;
          return (
            <View
              key={index}
              style={tw`${index > 0 && 'border-t border-gray-400'}`}>
              <PressableAnimated
                style={tw`flex-row items-center p-2`}
                onPress={() => {
                  const newBrowserSettings = {
                    ...browserSettings,
                    searchEngine: key,
                  };
                  setBrowserSettings(newBrowserSettings);
                }}>
                <Favicon domain={hostname} />
                <View style={tw`flex-1 ml-2`}>
                  <Text>{key}</Text>
                  <Text style={tw`text-gray-500`}>{hostname}</Text>
                </View>
                <View style={tw`w-5 `}>
                  {selected === key && (
                    <CheckIcon width="100%" color={primaryColor} />
                  )}
                </View>
              </PressableAnimated>
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default SearchEngine;
