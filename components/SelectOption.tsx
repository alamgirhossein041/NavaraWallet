import React, { useEffect, useState } from "react";
import { Text, View, TouchableOpacity, Image, ScrollView } from "react-native";
import { ChevronDownIcon } from "react-native-heroicons/solid";
import { tw } from "../utils/tailwind";
import { primaryColor, primaryGray, secondaryGray } from "../configs/theme";

export interface IOption {
  label: string;
  value: string | number | object;
  iconUri?: string;
}
interface SelectOptionProps {
  options: IOption[];
  value: string | number;
  icon?: JSX.Element;
  iconSize?: string;
  stringStyle?: string;
  style?: string;
  onSetValue(value: string | number | object): void;
  filter?: boolean;
}
import { Actionsheet, CheckCircleIcon, useDisclose } from "native-base";
import InputText from "./InputText";
import TokenIcon from "./TokenIcon";
import SearchBar from "./SearchBar";

const SelectOption = ({
  options,
  value,
  icon,
  style,
  iconSize = "h-7 w-7",
  stringStyle = "text-sm",
  onSetValue,
  filter = false,
}: SelectOptionProps) => {
  const { isOpen, onOpen, onClose } = useDisclose();
  const handleSelectOption = (option: IOption) => {
    onSetValue(option.value);
    onClose();
  };

  const [filteredList, setFilteredList] = useState<IOption[]>(options);
  useEffect(() => {
    setFilteredList(options);
  }, [options]);

  return (
    <TouchableOpacity activeOpacity={0.6}
      onPress={onOpen}
      style={tw`p-2 bg-white shadow my-1 rounded-3xl max-w-96 ${style}`}
    >
      <View style={tw`flex-row items-center justify-between`}>
        <View style={tw`flex-row items-center`}>
          <View
            style={tw`rounded-full ${iconSize} bg-[${primaryColor}] mr-2 items-center justify-center`}
          >
            {icon}
          </View>
          <View>
            <Text
              style={tw`${stringStyle} text-black`}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {value}
            </Text>
          </View>
        </View>

        <ChevronDownIcon height={15} width={15} fill="gray" />
      </View>
      <Actionsheet isOpen={isOpen} onClose={onClose}>
        <Actionsheet.Content>
          <ScrollView style={tw`w-full`}>
            {filter && (
              <SearchBar
                style="mt-4"
                placeholder="Search "
                searchList={options}
                searchProperty={["label"]}
                setSearchList={setFilteredList}
              />
            )}
            {filteredList.map((item, index) => {
              const isSelected = item.value === value;
              return (
                <TouchableOpacity activeOpacity={0.6}
                  onPress={() => handleSelectOption(item)}
                  key={index}
                  style={tw`w-full p-3 items-center flex-row justify-between ${isSelected ? "bg-gray-100" : ""
                    } mb-1 rounded-lg`}
                >
                  {item.iconUri && <TokenIcon uri={item.iconUri} />}
                  <Text
                    style={tw` font-medium text-base  ${isSelected
                      ? `font-bold text-[${primaryColor}]`
                      : "text-black"
                      }`}
                  >
                    {item.value}
                  </Text>
                  {isSelected && <CheckCircleIcon color={primaryColor} />}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </Actionsheet.Content>
      </Actionsheet>
    </TouchableOpacity>
  );
};

export default SelectOption;
