import debouce from 'lodash.debounce';
import {Actionsheet, Modal, Spinner, useDisclose} from 'native-base';
import React, {useEffect, useMemo, useState} from 'react';
import {ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {ChevronDownIcon} from 'react-native-heroicons/outline';
import IconSearch from '../../assets/icons/icon-search.svg';
import {primaryColor} from '../../configs/theme';
import {useDarkMode} from '../../hooks/useModeDarkMode';
import {useGridDarkMode} from '../../hooks/useModeDarkMode';
import {useTextDarkMode} from '../../hooks/useModeDarkMode';
import {shortenAddress} from '../../utils/stringsFunction';
import {tw} from '../../utils/tailwind';
import SearchBar from '../../components/SearchBar';
import TextField from '../../components/TextField';
import TokenIcon from '../../components/TokenIcon';

export interface IOption {
  label: string;
  value: string | number | object;
  iconUri?: string;
}
interface SelectOptionProps {
  options: IOption[];
  value: string;
  icon?: JSX.Element;
  iconSize?: string;
  stringStyle?: string;
  style?: string;
  onSetValue(value: string | number | object): void;
  filterType?: 'normal' | 'debounce';
  filterValue?: string;
  debounce?: number;
  handleChange?: (value: string) => void;
  disabledValue?: string;
  loading?: boolean;
  error?: string;
}

const ActionsheetSelectOption = ({
  options,
  value,
  icon,
  style,
  iconSize = 'h-7 w-7',
  stringStyle = 'text-sm',
  onSetValue,
  filterType = 'normal',
  filterValue,
  debounce = 500,
  handleChange = () => {},
  disabledValue,
  loading,
  error,
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

  const debouncedResults = useMemo(() => {
    return debouce(handleChange, debounce);
  }, [debounce, handleChange]);

  useEffect(() => {
    return () => {
      debouncedResults.cancel();
    };
  });

  //text darkmode

  //grid, shadow darkmode

  return (
    <>
      <TouchableOpacity
        onPress={onOpen}
        style={tw`p-2 rounded-3xl max-w-96 ${style}`}>
        <View style={tw`flex-row items-center justify-between`}>
          <View style={tw`flex-row items-center`}>
            <View
              style={tw`rounded-full ${iconSize} mr-2 items-center justify-center`}>
              {icon}
            </View>
            <View style={tw`mr-3`}>
              <Text
                style={tw`${stringStyle} `}
                numberOfLines={1}
                ellipsizeMode="tail">
                {value}
              </Text>
            </View>
          </View>
          <ChevronDownIcon height={26} width={26} color="gray" />
        </View>
      </TouchableOpacity>
      <Actionsheet isOpen={isOpen} onClose={onClose}>
        <Actionsheet.Content
          style={tw`w-full h-4/5 p-6 flex flex-col items-center justify-center rounded-3xl `}>
          {filterType === 'normal' && (
            <SearchBar
              placeholder="Search symbol"
              list={options}
              filterProperty={['label', 'value']}
              onListFiltered={(list: IOption[]) => setFilteredList(list)}
            />
          )}
          {filterType === 'debounce' && (
            <TextField
              icon={<IconSearch style={tw`mr-2`} />}
              value={filterValue}
              placeholder="Search symbol"
              onChangeText={debouncedResults}
            />
          )}
          <ScrollView style={tw`w-full `}>
            {loading && (
              <View style={tw`mt-2`}>
                <Spinner color={primaryColor} />
              </View>
            )}

            {(filteredList?.length < 1 || error) && (
              <Text style={tw`dark:text-white  mt-2`}>{error}</Text>
            )}

            {filteredList?.map((item, index) => {
              const isSelected =
                item.label === value || item.label === disabledValue;
              return (
                <TouchableOpacity
                  activeOpacity={0.6}
                  key={index}
                  disabled={isSelected}
                  onPress={() => handleSelectOption(item)}
                  style={tw`w-full p-2 my-1 items-center flex-row rounded-full 
                    ${isSelected ? 'opacity-40' : ''}
                  `}>
                  {item.iconUri && (
                    <TokenIcon size="w-10 h-10" uri={item.iconUri} />
                  )}
                  <View style={tw`flex-col flex-1 ml-2`}>
                    <Text style={tw`dark:text-white   font-medium text-base`}>
                      {item.label}
                    </Text>
                    <Text style={tw`dark:text-white   text-sm`}>
                      {shortenAddress(item.value as string)}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </Actionsheet.Content>
      </Actionsheet>
    </>
  );
};

export default ActionsheetSelectOption;
