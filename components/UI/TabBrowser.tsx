import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { tw } from "../../utils/tailwind";
const TabBrowser = ({
  tabSelected,
  setTabSelected,
  itemTabBar,
  styleViewSelected,
  styleTextSelected,
}) => {
  const handleChangeTab = (index: number) => {
    setTabSelected(index);
  };

  return (
    <View style={tw`flex-row justify-center `}>
      <View style={tw`flex flex-row w-full mx-5`}>
        {itemTabBar.map((item, index) => (
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => handleChangeTab(index)}
            disabled={index === tabSelected}
            key={item.value}
            style={[
              tw` ${
                tabSelected === index ? `${styleViewSelected} ` : ""
              }flex-row mr-3  `,
            ]}
          >
            <Text
              style={tw` text-gray-500 ${
                tabSelected === index ? `${styleTextSelected}` : ""
              }] text-[18px] text-center`}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default TabBrowser;
