import React from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { ChevronRightIcon } from "react-native-heroicons/solid";
import { tw } from "../utils/tailwind";
import { primaryColor, primaryGray, selectGray } from "../configs/theme";

export interface IOption {
  label: string;
  value: string | number | object;
}
interface SelectOptionProps {
  options: IOption[];
  value: string | number;
  icon?: JSX.Element;
  onSetValue(value: string | number | object): void;
}
import { Actionsheet, CheckCircleIcon, useDisclose } from "native-base";
const SelectBigSizeOptions = ({
  options,
  value,
  icon,
  onSetValue,
}: SelectOptionProps) => {
  const { isOpen, onOpen, onClose } = useDisclose();
  const handleSelectOption = (option: IOption) => {
    onSetValue(option.value);
    onClose();
  };
  return (
    <TouchableOpacity activeOpacity={0.6}
      onPress={onOpen}
      style={tw`p-4 bg-[${selectGray}] rounded-full text-gray-400 mx-5 `}
    >
      <View style={tw`flex-row items-center justify-between`}>
        <View style={tw`flex-row items-center`}>
          <View
            style={tw`rounded-full h-7 w-7 bg-[${primaryColor}] mr-2 items-center justify-center`}
          >
            {icon}
          </View>
          <View style={tw``}>
            <Text numberOfLines={1} ellipsizeMode="tail">
              {value}
            </Text>
          </View>
        </View>

        <ChevronRightIcon fill="gray" />
      </View>
      <Actionsheet isOpen={isOpen} onClose={onClose}>
        <Actionsheet.Content>
          {options.map((item, index) => {
            const isSelected = item.value === value;
            return (
              <TouchableOpacity activeOpacity={0.6}
                onPress={() => handleSelectOption(item)}
                key={index}
                style={tw`w-full p-3 justify-between items-center flex-row`}
              >
                <Text
                  style={tw`text-[${isSelected ? primaryColor : "#999999"
                    }] text-lg`}
                >
                  {item.label}
                </Text>
                {isSelected && <CheckCircleIcon color={primaryColor} />}
              </TouchableOpacity>
            );
          })}
        </Actionsheet.Content>
      </Actionsheet>
    </TouchableOpacity>
  );
};

export default SelectBigSizeOptions;
