import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import { ArrowPathIcon } from "react-native-heroicons/solid";
import PressableAnimatedSpin from "../../components/UI/PressableAnimatedSpin";
import TokenIcon from "../../components/UI/TokenIcon";
import { primaryColor } from "../../configs/theme";
import { IToken } from "../../data/types";
import { tw } from "../../utils/tailwind";
import ActionsheetSelectOption from "./ActionsheetSelectOption";

type SelectNetworkProps = {
  value: string;
  onSetValue?: (value: IToken) => void;
  iconUri?: string;
  disabledValue?: string;
  listTokens?: IToken[];
  isLoading?: boolean;
  isError?: boolean;
  refetch?: () => void;
  searchValue?: string;
  setSearchValue?: (value: string) => void;
};

const SelectToken = ({
  value,
  onSetValue = () => {},
  iconUri,
  disabledValue,
  listTokens,
  isLoading,
  isError,
  refetch,
  searchValue,
  setSearchValue,
}: SelectNetworkProps) => {
  const { t } = useTranslation();

  const options = useMemo(() => {
    if (listTokens) {
      const _options = listTokens.map((token: IToken) => {
        return {
          name: token.symbol,
          contractAddress: token.address,
          logo: token.img,
        };
      });
      return _options;
    } else {
      return [];
    }
  }, [listTokens]);

  if (isError) {
    return (
      <View style={tw`flex-row items-center justify-between py-2`}>
        <Text>Get list tokens failed</Text>
        <PressableAnimatedSpin onPress={refetch}>
          <ArrowPathIcon color={primaryColor} />
        </PressableAnimatedSpin>
      </View>
    );
  }

  return (
    <ActionsheetSelectOption
      icon={<TokenIcon uri={iconUri} />}
      loading={isLoading}
      error={isError ? `${t("swap.cannot_load")}` : undefined}
      iconSize="w-10 h-10"
      filterType="debounce"
      searchValue={searchValue}
      handleChange={(text) => {
        setSearchValue(text);
      }}
      stringStyle="font-semibold text-base dark:text-white"
      value={value === "" ? `${t("swap.select")}` : value}
      disabledValue={disabledValue}
      options={options}
      onSetValue={(address) => {
        const selectedToken = listTokens.find(
          (token) => token.address === address
        );
        onSetValue(selectedToken);
      }}
    />
  );
};

export default SelectToken;
