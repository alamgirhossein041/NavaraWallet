import {Actionsheet, CheckCircleIcon, useDisclose} from 'native-base';
import React, {useEffect, useState} from 'react';
import {ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {ChevronDownIcon} from 'react-native-heroicons/outline';
import {primaryColor} from '../configs/theme';
import {useDarkMode} from '../hooks/useModeDarkMode';
import {useGridDarkMode} from '../hooks/useModeDarkMode';
import {useTextDarkMode} from '../hooks/useModeDarkMode';
import {tw} from '../utils/tailwind';
import SearchBar from './SearchBar';
import TokenIcon from './TokenIcon';

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

const SelectOption = ({
  options,
  value,
  icon,
  style,
  iconSize = 'h-7 w-7',
  stringStyle = 'text-sm',
  onSetValue,
  filter = false,
}: SelectOptionProps) => {
  const {isOpen, onOpen, onClose} = useDisclose();
  const handleSelectOption = (option: IOption) => {
    onSetValue(option.value);
    onClose();
  };

  const [filteredList, setFilteredList] = useState<IOption[]>(options);
  useEffect(() => {
    setFilteredList(options);
  }, [options]);

  //grid, shadow darkmode

  return (
    <TouchableOpacity
      activeOpacity={0.6}
      onPress={onOpen}
      style={tw`px-2 flex-row items-center justify-between bg-blue-500/50 h-10  rounded-3xl max-w-96 ${style}`}>
      <View style={tw`flex-row items-center justify-between`}>
        <View
          style={tw`rounded-full ${iconSize} bg-white dark:bg-[#18191A]  mr-2 items-center justify-center`}>
          {icon}
        </View>
        <View>
          <Text
            style={tw`${stringStyle} text-white`}
            numberOfLines={1}
            ellipsizeMode="tail">
            {value}
          </Text>
        </View>
        <ChevronDownIcon height={15} width={15} fill="white" />
      </View>
      <Actionsheet isOpen={isOpen} onClose={onClose}>
        <Actionsheet.Content style={tw``}>
          <ScrollView style={tw`w-full`}>
            {filter && (
              <SearchBar
                placeholder="Search "
                list={options}
                filterProperty={['label']}
                onListFiltered={(list: IOption[]) => setFilteredList(list)}
              />
            )}
            {filteredList.map((item, index) => {
              const isSelected = item.value === value;
              return (
                <TouchableOpacity
                  activeOpacity={0.6}
                  onPress={() => handleSelectOption(item)}
                  key={index}
                  style={tw`w-full p-3 items-center flex-row justify-between ${
                    isSelected ? 'bg-' : ''
                  } mb-1 rounded-lg`}>
                  {item.iconUri && <TokenIcon uri={item.iconUri} />}
                  <Text
                    style={tw` font-medium text-base  ${
                      isSelected ? `font-bold text-[${primaryColor}]` : ``
                    }`}>
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
