import _ from "lodash";
import React from "react";
import { Image, View } from "react-native";
import { BanIcon } from "react-native-heroicons/outline";
import { SvgUri } from "react-native-svg";
import ModalSelectOption, { IOption } from "../../components/ModalSelectOption";
import TokenIcon from "../../components/TokenIcon";
import { primaryColor } from "../../configs/theme";
import { tw } from "../../utils/tailwind";

type SelectNetworkProps = {
  value: string | number;
  onSetValue?: (value: any) => void;
  iconUri?: string;
  options: IOption[];
  disabledValue?: string;
};

const SelectToken = ({
  value,
  onSetValue = () => {},
  iconUri,
  options,
  disabledValue,
}: SelectNetworkProps) => {
  return (
    <ModalSelectOption
      icon={<TokenIcon uri={iconUri} />}
      iconSize="w-8 h-8"
      style={`shadow`}
      stringStyle="font-semibold text-base"
      value={value === "" ? "Select" : value}
      disabledValue={disabledValue}
      options={options}
      onSetValue={(value: any) => {
        onSetValue(value);
      }}
      filter
    />
  );
};

export default SelectToken;
