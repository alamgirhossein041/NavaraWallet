import Clipboard from "@react-native-clipboard/clipboard";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { primaryColor } from "../../../configs/theme";
import { ITokenMetadata } from "../../../data/types";
import { shortenAddress } from "../../../utils/stringsFunction";
import { tw } from "../../../utils/tailwind";
import toastr from "../../../utils/toastr";

interface ITokenProps {
  token: ITokenMetadata;
}

const TokenDetail = ({ token }: ITokenProps) => {
  const Section = ({
    title,
    value,
    shorten = false,
  }: {
    title: string;
    value: string;
    shorten?: boolean;
  }) => {
    if (!value) {
      return null;
    }
    return (
      <View style={tw`flex-row items-start justify-between`}>
        <Text
          style={tw`text-sm font-medium text-black dark:text-white`}
        >{`${title}: `}</Text>
        <TouchableOpacity
          onPress={() => {
            Clipboard.setString(value);
            toastr.info("Copied to clipboard");
          }}
        >
          <Text style={tw`text-sm font-bold text-[${primaryColor}]`}>
            {shorten ? shortenAddress(value) : value}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View
      style={tw`flex-row items-center justify-between w-full p-3 bg-gray-100 rounded-xl dark:bg-gray-800`}
    >
      <View style={tw`flex-col flex-1 ml-2`}>
        <Section title="Name" value={token.name} />
        <Section title="Symbol" value={token.symbol} />
        <Section title="Balance" value={token.tokenBalance?.toString()} />
        <Section
          title="Contract Address"
          shorten
          value={token.contractAddress}
        />
      </View>
    </View>
  );
};

export default TokenDetail;
