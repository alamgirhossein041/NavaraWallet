import React from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, Switch, Text, View } from "react-native";
import {
  MagnifyingGlassIcon,
  NoSymbolIcon,
} from "react-native-heroicons/outline";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRecoilState } from "recoil";
import MenuItem from "../../../components/UI/MenuItem";
import { primaryColor, primaryGray } from "../../../configs/theme";
import { browserSettingsState } from "../../../data/globalState/browser";
import { capitalizeFirstLetter } from "../../../utils/stringsFunction";
import { tw } from "../../../utils/tailwind";

const SettingsMenu = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [browserSettings, setBrowserSettings] =
    useRecoilState(browserSettingsState);

  const { t } = useTranslation();
  const menu = [
    {
      group: "",
      items: [
        {
          icon: (
            <MagnifyingGlassIcon
              width="100%"
              height="100%"
              stroke={primaryColor}
            />
          ),
          name: `${t("search_bar.search")}`,
          onPress: () => {
            navigation.navigate("SearchEngine");
          },
          value: capitalizeFirstLetter(browserSettings?.searchEngine),
          next: true,
        },
        {
          icon: (
            <NoSymbolIcon width="100%" height="100%" stroke={primaryColor} />
          ),
          name: `Ads Block`,
          onPress: () => {
            navigation.navigate("SearchEngine");
          },
          value: (
            <Switch
              trackColor={{ false: primaryGray, true: primaryColor }}
              thumbColor="white"
              onValueChange={() => {
                const newBrowserSettings = {
                  ...browserSettings,
                  adblock: !browserSettings?.adblock,
                };
                setBrowserSettings(newBrowserSettings);
              }}
              value={browserSettings?.adblock}
            />
          ),
          next: false,
        },
      ],
    },
  ];

  return (
    <View style={tw`flex flex-col h-full `}>
      <ScrollView style={tw`mb-[${insets.bottom + 60}] px-4`}>
        {menu.map((group, index) => (
          <View key={index} style={tw`mb-5`}>
            <Text style={tw`px-3 text-base font-semibold dark:text-white `}>
              {group.group}
            </Text>
            {group.items.map(
              (item, i) =>
                item.name && (
                  <View key={i}>
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
      </ScrollView>
    </View>
  );
};

export default SettingsMenu;
