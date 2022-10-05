import React, { useEffect, useState } from "react";
import { Text, View, TouchableOpacity, ScrollView } from "react-native";
import { ChevronDownIcon } from "react-native-heroicons/solid";
import { tw } from "../utils/tailwind";
import { primaryColor } from "../configs/theme";
import { useDisclose } from "native-base";
import InputText from "./InputText";
import TokenIcon from "./TokenIcon";
import { Modal } from "native-base";
import SearchBar from "./SearchBar";

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
  disabledValue?: string;
}

const ModalSelectOption = ({
  options,
  value,
  icon,
  style,
  iconSize = "h-7 w-7",
  stringStyle = "text-sm",
  onSetValue,
  filter = false,
  disabledValue,
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
    <>
      <TouchableOpacity activeOpacity={0.6}
        onPress={onOpen}
        style={tw`p-2 bg-white rounded-3xl max-w-96 ${style}`}
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
                style={tw`${stringStyle}`}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {value}
              </Text>
            </View>
          </View>

          <ChevronDownIcon height={15} width={15} fill="gray" />
        </View>
      </TouchableOpacity>
      <Modal isOpen={isOpen} onClose={onClose}>
        <Modal.Content
          style={tw`w-full h-full p-6 flex flex-col items-center justify-center rounded-3xl bg-white`}
        >
          {filter && (
            <SearchBar
              style="mt-4"
              placeholder="Search symbol or paste address"
              searchList={options}
              searchProperty={["label", "value"]}
              setSearchList={setFilteredList}
            />
          )}
          <ScrollView style={tw`w-full`}>
            {filteredList?.map((item, index) => {
              const isSelected =
                item.label === value || item.label === disabledValue;
              return (
                <TouchableOpacity activeOpacity={0.6}
                  key={index}
                  disabled={isSelected}
                  onPress={() => handleSelectOption(item)}
                  style={tw`w-full p-2 my-1 items-center flex-row rounded-full bg-gray-50
                    ${isSelected ? "opacity-40" : ""}
                  `}
                >
                  {item.iconUri && (
                    <TokenIcon size="w-10 h-10" uri={item.iconUri} />
                  )}
                  <View style={tw`flex-col flex-1 ml-2`}>
                    <Text style={tw`text-black font-medium text-base`}>
                      {item.label}
                    </Text>
                    <Text style={tw`text-gray-600 text-sm`}>
                      {shortenAddress(item.value as string)}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </Modal.Content>
      </Modal>
    </>
  );
};
const shortenAddress = (address: string) => {
  if (address.length > 20) {
    return (
      address.substring(0, 10) + "..." + address.substring(address.length - 10)
    );
  } else {
    return address;
  }
};

export default ModalSelectOption;
