import { Text, View } from "native-base";
import React from "react";
import { TouchableOpacity } from "react-native";
import { bgTab, colorTextTabSelected } from "../configs/theme";
import { tw } from "../utils/tailwind";
const TabCustom = (props) => {
  const {
    tabs,
    icons = false,
    tabSelected,
    onChange,
    borderDefault = "border-white",
  } = props;
  return (
    tabs &&
    tabs.length > 0 && (
      <View
        style={tw`flex flex-row  items-center justify-content-between rounded-t-3xl w-full bg-[${bgTab}] mx-auto `}
      >
        {tabs.map((tab, index) => {
          return (
            <TouchableOpacity activeOpacity={0.6}
              onPress={() => {
                onChange(index);
              }}
              key={index}
              style={tw`text-sm border-b dark:border-dark-700 items-center  font-medium  p-3  
            ${tabSelected === index
                  ? " border-[#11CABE]  w-auto w-1/2"
                  : `${borderDefault}  w-1/2`
                }
          `}
            >
              <Text
                style={tw`font-bold  ${tabSelected === index ? `text-[${colorTextTabSelected}]` : `text-black`
                  }`}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    )
  );
};

export default TabCustom;
