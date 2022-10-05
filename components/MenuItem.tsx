import { View } from "native-base";
import React from "react";
import { Text, TouchableOpacity } from "react-native";
import { tw } from "../utils/tailwind";
import ChevronRightIcon from "../assets/icons/icon-chevron-right.svg";
import { WalletType } from "../data/types";

const MenuItem = ({
  icon,
  name,
  value,
  onPress,
  next = true,
  iconPadding = "p-2.5",
  disabled = false,
}: WalletType) => {
  return (
    <TouchableOpacity activeOpacity={0.6}
      style={tw`p-2 my-1 rounded-full h-13 flex flex-row items-center justify-between bg-gray-100 dark:bg-gray-500`}
      onPress={onPress}
    // disabled={disabled}
    >
      <View style={tw` flex flex-row items-center justify-between`}>
        <View style={tw` w-10 h-10 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center ${iconPadding}`}>
          {icon}
        </View>
        <Text style={tw`ml-2 text-gray-400 text-sm dark:text-white`}>{name}</Text>
      </View>
      <View style={tw`flex flex-row items-center mr-2`}>
        {typeof value === "string" ? (
          <Text style={tw`text-xs text-gray-400 dark:text-white`}>{value}</Text>
        ) : (
          value
        )}
        {next && (
          <View style={tw` w-4 h-4 ml-2`}>
            <ChevronRightIcon width="100%" height="100%" />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default MenuItem;
