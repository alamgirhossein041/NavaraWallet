import React from "react";
import IconSearch from "../../assets/icons/icon-search.svg";
import { secondaryGray } from "../../configs/theme";
import { tw } from "../../utils/tailwind";
import TextField, { ITextFieldProps } from "./TextField";

interface ISearchBar extends ITextFieldProps {
  /**
   * Array of objects or array of strings, number to filter
   */
  list?: any[];
  /**
   * Function to set filtered list
   * @param list: any[]
   * @returns void
   */
  onListFiltered?: (filteredList: any[]) => void;
  /**
   * Array of strings, property name to filter
   * @example ['name', 'email']
   */
  filterProperty?: string[];
}
/**
 * @author ThaiND
 * @description SearchBar component
 * @param props: ISearchBar
 * @returns JSX.Element
 * @example
 * <SearchBar
 * placeholder="Search"
  list={options}
  filterProperty={['label', 'value']}
  onListFiltered={(list: IOption[]) => {
  setFilteredList(list);
  }}
 * />
 */
const SearchBar = (props: ISearchBar) => {
  const {
    value,
    onChangeText = () => {},
    onListFiltered = () => {},
    icon = <IconSearch style={tw`mr-2`} />,
    style,
    placeholder,
    list = [], //searchList must be a string have no setState
    filterProperty,
  } = props;
  //background Darkmode

  return (
    <TextField
      {...props}
      icon={icon}
      style={style}
      placeholder={placeholder}
      placeholderTextColor={secondaryGray}
      value={value}
      onChangeText={(text) => {
        let filteredList: typeof list;
        // array of objects must have filterProperty
        if (filterProperty) {
          filteredList = list.filter((item) =>
            filterProperty.reduce((acc, property) => {
              if (
                item[property]
                  ?.toLowerCase()
                  .includes(text.trim().toLowerCase())
              ) {
                return true;
              }
              return acc;
            }, false)
          );
        } else {
          //if no search property, just filter by text
          filteredList = list.filter((item) =>
            item.toLowerCase().includes(text.trim().toLowerCase())
          );
        }
        onListFiltered(filteredList);
        onChangeText(text);
      }}
    />
  );
};

export default SearchBar;
