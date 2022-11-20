import debouce from "lodash.debounce";
import { Actionsheet, Spinner, useDisclose } from "native-base";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { ChevronDownIcon } from "react-native-heroicons/outline";
import SearchBar from "../../components/UI/SearchBar";
import TextField from "../../components/UI/TextField";
import { primaryColor } from "../../configs/theme";
import { ITokenMetadata } from "../../data/types";
import { tw } from "../../utils/tailwind";
import Token from "../Home/ManageChains/Token";

export interface IOption {
  label: string;
  value: string | number | object;
  iconUri?: string;
}
interface SelectOptionProps {
  options: ITokenMetadata[];
  value: string;
  icon?: JSX.Element;
  iconSize?: string;
  stringStyle?: string;
  style?: string;
  onSetValue(value: string | number | object): void;
  filterType?: "normal" | "debounce";
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
  iconSize = "h-7 w-7",
  stringStyle = "text-sm",
  onSetValue,
  filterType = "normal",
  filterValue,
  debounce = 500,
  handleChange = () => {},
  disabledValue,
  loading,
  error,
}: SelectOptionProps) => {
  const { isOpen, onOpen, onClose } = useDisclose();
  const handleSelectOption = (option: ITokenMetadata) => {
    onSetValue(option.contractAddress);
    onClose();
  };

  const [filteredList, setFilteredList] = useState<ITokenMetadata[]>(options);
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

  const { t } = useTranslation();

  return (
    <>
      <TouchableOpacity
        onPress={onOpen}
        style={tw`p-2 rounded-3xl max-w-96 ${style}`}
      >
        <View style={tw`flex-row items-center justify-between`}>
          <View style={tw`flex-row items-center`}>
            <View
              style={tw`rounded-full ${iconSize} mr-2 items-center justify-center`}
            >
              {icon}
            </View>
            <View style={tw`mr-3`}>
              <Text
                style={tw`${stringStyle} `}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {value}
              </Text>
            </View>
          </View>
          <ChevronDownIcon height={26} width={26} color="gray" />
        </View>
      </TouchableOpacity>
      <Actionsheet isOpen={isOpen} onClose={onClose}>
        <View
          style={tw`flex flex-col items-center justify-center w-full p-6 h-4/5 rounded-t-3xl bg-white dark:bg-[#18191A]`}
        >
          {filterType === "normal" && (
            <SearchBar
              style={tw` dark:text-white`}
              placeholder={t("swap.search_symbol")}
              list={options}
              filterProperty={["label", "value"]}
              onListFiltered={(list: ITokenMetadata[]) => setFilteredList(list)}
            />
          )}
          {filterType === "debounce" && (
            <TextField
              type={"search"}
              value={filterValue}
              placeholder={t("search_bar.search_symbol")}
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
              <Text style={tw`mt-2 dark:text-white`}>{error}</Text>
            )}

            {filteredList?.map((item, index) => {
              const isSelected =
                item.name === value || item.name === disabledValue;
              return (
                <View key={index}>
                  <Token
                    token={item}
                    isSelected={isSelected}
                    onPress={() => handleSelectOption(item)}
                  />
                </View>
              );
            })}
          </ScrollView>
        </View>
      </Actionsheet>
    </>
  );
};

export default ActionsheetSelectOption;
