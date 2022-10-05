import React from "react";
import { Text, View } from "react-native";
import { tw } from "../../utils/tailwind";
import tokens from "./TokenData";

type AmountCardProps = {
  tokenId: string;
  amount: number;
};

const AmountCard = ({ tokenId, amount }: AmountCardProps) => {
  const token = tokens.find((token) => token.id === tokenId);

  return (
    <View style={tw`w-full mb-6`}>
      <Text style={tw`mb-2`}>Amount</Text>
      <View
        style={tw`flex flex-row items-center px-6 py-3 rounded-full justify-between bg-gray-100 dark:bg-gray-800`}
      >
        <View style={tw`flex items-start`}>
          <Text style={tw`text-base`}>{amount}</Text>
          <Text style={tw`text-gray-400`}>${amount * token.exchangeRate}</Text>
        </View>
        <View style={tw`flex items-end`}>
          <Text style={tw`text-base`}>{token.name}</Text>
          <Text style={tw`text-gray-400`}>${token.exchangeRate}</Text>
        </View>
      </View>
    </View>
  );
};

export default AmountCard;
