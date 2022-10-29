import React from 'react';
import {ScrollView, Text, View} from 'react-native';
import {SearchIcon} from 'react-native-heroicons/outline';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import MenuItem from '../../../components/MenuItem';
import {defaultSettings} from '../../../configs/browser';
import {primaryColor} from '../../../configs/theme';
import {useLocalStorage} from '../../../hooks/useLocalStorage';
import {useDarkMode} from '../../../hooks/useModeDarkMode';
import {useTextDarkMode} from '../../../hooks/useModeDarkMode';
import {BROWSER_SETTINGS} from '../../../utils/storage';
import {capitalizeFirstLetter} from '../../../utils/stringsFunction';
import {tw} from '../../../utils/tailwind';

const SettingsMenu = ({navigation}) => {
  const insets = useSafeAreaInsets();
  const [browserSettings] = useLocalStorage(BROWSER_SETTINGS, defaultSettings);

  const menu = [
    {
      group: '',
      items: [
        {
          icon: <SearchIcon width="100%" height="100%" stroke={primaryColor} />,
          name: 'Search engine',
          onPress: () => {
            navigation.navigate('SearchEngine');
          },
          value: capitalizeFirstLetter(browserSettings?.searchEngine),
          next: true,
        },
      ],
    },
  ];

  //text darkmode

  return (
    <View style={tw`h-full  flex flex-col `}>
      <ScrollView style={tw`mb-[${insets.bottom + 60}] px-4`}>
        {menu.map((group, index) => (
          <View key={index} style={tw`mb-5`}>
            <Text style={tw`dark:text-white  text-base font-semibold px-3 `}>
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
                ),
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default SettingsMenu;
