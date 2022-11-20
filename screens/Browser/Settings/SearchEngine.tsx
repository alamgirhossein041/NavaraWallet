import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { CheckCircleIcon } from "react-native-heroicons/solid";
import { useRecoilState } from "recoil";
import { searchDefault } from "../../../configs/browser";
import { primaryColor } from "../../../configs/theme";
import { browserSettingsState } from "../../../data/globalState/browser";
import { tw } from "../../../utils/tailwind";

const SearchEngine = () => {
  const [browserSettings, setBrowserSettings] =
    useRecoilState(browserSettingsState);

  const searchEngines = Object.entries(searchDefault);
  const selected = browserSettings?.searchEngine;

  return (
    <View style={tw`flex-1 bg-white dark:bg-[#18191A] px-2`}>
      {searchEngines.map(([key, value], index) => {
        const Logo = value.logo;
        const hostname = new URL(value.url).hostname;
        return (
          <TouchableOpacity
            key={key}
            style={tw`flex-row items-center p-2`}
            onPress={() => {
              const newBrowserSettings = {
                ...browserSettings,
                searchEngine: key,
              };
              setBrowserSettings(newBrowserSettings);
            }}
          >
            <View
              style={tw`items-center justify-center w-10 h-10 border border-gray-100 rounded-full`}
            >
              <Logo width={30} height={30} />
            </View>
            <View style={tw`flex-1 ml-2`}>
              <Text style={tw`text-lg text-black dark:text-white`}>{key}</Text>

              <Text style={tw`text-gray-500 dark:text-white`}>{hostname}</Text>
            </View>
            <View style={tw`w-5 `}>
              {selected === key && (
                <View style={tw`absolute right-0 bg-white dark:bg-[#18191A]`}>
                  <CheckCircleIcon color={primaryColor} />
                </View>
              )}
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default SearchEngine;
