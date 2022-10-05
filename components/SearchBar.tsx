import {View} from 'native-base';
import React, {useState} from 'react';
import {
  Text,
  TextInput,
  TextInputIOSProps,
  TextInputProps,
  TouchableOpacity,
} from 'react-native';
import {tw} from '../utils/tailwind';
import {primaryColor, primaryGray, secondaryGray} from '../configs/theme';
import IconSearch from '../assets/icons/icon-search.svg';
import {EyeIcon, EyeOffIcon} from 'react-native-heroicons/outline';

interface ISearchBar extends TextInputProps {
  value?: string;
  label?: string;
  labelPosition?: 'left' | 'top';
  labelStyle?: string;
  onChangeText?: (text: string) => void;
  icon?: JSX.Element;
  padding?: string;
  style?: any;
  placeholder?: string;
  searchList?: any[];
  setSearchList?: (value: React.SetStateAction<any[]>) => void;
  searchProperty?: string[];
}
/**
 * @author ThaiND
 * @description SearchBar component
 * @param props: ISearchBar
 * @returns JSX.Element
 * @example
 * <SearchBar
 * placeholder="Search"
 * searchList={options}
 * searchProperty={["label"]}
 * setSearchList={setFilteredList}
 * />
 */
const SearchBar = (props: ISearchBar) => {
  const {
    value,
    label,
    labelPosition = 'top',
    labelStyle,
    onChangeText = () => {},
    icon = <IconSearch style={tw`mr-2`} />,
    padding = 'p-2',
    style,
    placeholder,
    searchList = [], //searchList must be a string have no setState
    setSearchList, //setSearchList must be a function to set the display list
    searchProperty,
  } = props;

  const getFlex = () => {
    if (labelPosition === 'left') {
      return 'flex-row';
    } else {
      return 'flex-col';
    }
  };

  return (
    <View style={tw`${getFlex()}`}>
      {label && (
        <Text
          style={tw`text-base my-2 
          ${labelPosition === 'top' && 'ml-2'}
           ${labelStyle}`}>
          {label}
        </Text>
      )}
      <View
        style={tw`relative w-full flex flex-row items-center bg-white rounded-full border border-[${primaryGray}]
      ${padding} ${style}
      `}>
        {icon}
        <TextInput
          {...props}
          style={tw`w-full p-1`}
          placeholder={placeholder}
          placeholderTextColor={secondaryGray}
          value={value}
          onChangeText={text => {
            let filteredList: typeof searchList;
            // array of objects must have searchProperty
            if (searchProperty) {
              filteredList = searchList.filter(item =>
                searchProperty.reduce((acc, property) => {
                  if (
                    item[property]
                      .toLowerCase()
                      .includes(text.trim().toLowerCase())
                  ) {
                    return true;
                  }
                  return acc;
                }, false),
              );
            } else {
              //if no search property, just filter by text
              filteredList = searchList.filter(item =>
                item.toLowerCase().includes(text.trim().toLowerCase()),
              );
            }
            setSearchList(filteredList);
            onChangeText(text);
          }}
        />
      </View>
    </View>
  );
};

export default SearchBar;
