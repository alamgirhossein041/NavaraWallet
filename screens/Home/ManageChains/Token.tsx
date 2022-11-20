import { Spinner } from "native-base";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { MinusCircleIcon, PlusCircleIcon } from "react-native-heroicons/solid";
import CollapsibleView from "../../../components/UI/CollapsibleView";
import TokenIcon from "../../../components/UI/TokenIcon";
import { dangerColor, primaryColor } from "../../../configs/theme";
import { ITokenMetadata } from "../../../data/types";
import { tw } from "../../../utils/tailwind";
import TokenDetail from "./TokenDetail";

interface ITokenProps {
  token: ITokenMetadata;
  isSelected?: boolean;
  disabled?: boolean;
  onPress?: (token: ITokenMetadata) => void;
  onPressAdd?: (token: ITokenMetadata) => Promise<void>;
  onPressRemove?: (token: ITokenMetadata) => Promise<void>;
}

const Token = ({
  token,
  isSelected = false,
  disabled = false,
  onPress,
  onPressAdd,
  onPressRemove,
}: ITokenProps) => {
  const [loading, setLoading] = useState(false);

  const handleAddToken = async () => {
    if (onPressAdd) {
      setLoading(true);
      await onPressAdd(token);
      setLoading(false);
    }
  };
  const handleRemoveToken = async () => {
    if (onPressRemove) {
      setLoading(true);
      await onPressRemove(token);
      setLoading(false);
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.6}
      disabled={isSelected || disabled}
      onPress={() => onPress?.(token)}
      style={tw`w-full p-2 my-1 items-center justify-between flex-row rounded-xl bg-gray-100 dark:bg-gray-800
      ${isSelected ? "opacity-40" : ""}
    `}
    >
      <TokenIcon size="w-12 h-12" uri={token.logo} />
      <View style={tw`flex-col flex-1 ml-2`}>
        <Text style={tw`text-lg font-semibold dark:text-white`}>
          {token.name}
        </Text>
        <Text style={tw`text-sm font-medium text-[${primaryColor}]`}>
          {token.tokenBalance && +token.tokenBalance}
          {token.symbol && ` ${token.symbol}`}
        </Text>
      </View>
      <View style={tw`flex items-center justify-center w-1/5`}>
        {loading ? (
          <Spinner color={primaryColor} />
        ) : (
          <>
            {onPressAdd && !isSelected && (
              <TouchableOpacity
                style={tw`flex-col items-center justify-center`}
                onPress={handleAddToken}
                disabled={loading}
              >
                <PlusCircleIcon width={24} height={24} color={primaryColor} />
                <Text
                  style={tw`text-base font-semibold text-[${primaryColor}]`}
                >
                  Add
                </Text>
              </TouchableOpacity>
            )}
            {onPressRemove && (
              <TouchableOpacity
                style={tw`flex-col items-center justify-center`}
                onPress={handleRemoveToken}
                disabled={loading}
              >
                <MinusCircleIcon width={24} height={24} color={dangerColor} />
                <Text style={tw`text-base font-semibold text-[${dangerColor}]`}>
                  Remove
                </Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </View>
    </TouchableOpacity>
  );
};

export const TokenCollapsible = ({
  token,
  isSelected = false,
  onPressAdd,
  onPressRemove,
}: ITokenProps) => {
  return (
    <CollapsibleView
      isCollapsed={true}
      header={
        <Token
          disabled
          token={token}
          isSelected={isSelected}
          onPressAdd={onPressAdd}
          onPressRemove={onPressRemove}
        />
      }
    >
      <TokenDetail token={token} />
    </CollapsibleView>
  );
};

export default Token;
