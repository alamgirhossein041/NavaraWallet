import React from 'react';
import {Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native';
import {primaryColor} from '../configs/theme';
import {tw} from '../utils/tailwind';
const TabBarMenu = ({tabSelected, setTabSelected}) => {
  const itemTabBar = [
    {label: 'Token', value: 'Token'},
    {label: 'NFT', value: 'NFT'},
  ];
  const handleChangeTab = (index: number) => {
    setTabSelected(index);
  };
  return (
    <View style={tw`flex-row items-center justify-center p-4`}>
      <View style={tw`flex flex-row w-full p-1 bg-gray-100 rounded-2xl `}>
        {itemTabBar.map((item, index) => (
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => handleChangeTab(index)}
            disabled={index === tabSelected}
            key={item.value}
            style={[
              tw`${
                tabSelected === index ? 'bg-white' : ''
              } flex-row justify-center w-1/2 p-3 rounded-xl `,
            ]}>
            <Text
              style={tw`text-[${
                tabSelected === index ? `${primaryColor}` : '#8e9bae'
              }] font-bold text-center`}>
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default TabBarMenu;
