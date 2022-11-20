import Clipboard from "@react-native-clipboard/clipboard";
import React from "react";
import { ScrollView, Text, View } from "react-native";
import PressableAnimated from "../../components/UI/PressableAnimated";
import { CHAIN_ICONS } from "../../configs/bcNetworks";
import { shortenAddress } from "../../utils/stringsFunction";
import { tw } from "../../utils/tailwind";
import toastr from "../../utils/toastr";
export default function CryptoAddressForDomain(props) {
  const { chains } = props;
  delete chains.chainId;
  return (
    <ScrollView>
      <View style={tw`flex-row items-center justify-between mb-3`}>
        <Text style={tw`text-lg font-bold text-gray-500`}>Crypto address</Text>
      </View>
      {Object.keys(chains).map((chain) => {
        const IconChain = CHAIN_ICONS[chain.toUpperCase()];
        return (
          <PressableAnimated
            onPress={() => {
              Clipboard.setString(chains[chain]);
              toastr.info("Save to clipboard");
            }}
            style={tw`flex-row items-center p-3 mb-2 bg-gray-100 rounded-lg`}
          >
            <IconChain />
            <View style={tw`mx-3`}>
              <Text style={tw`font-bold text-black capitalize`}>{chain}</Text>
              <Text style={tw`text-gray-500`}>
                {shortenAddress(chains[chain])}
              </Text>
            </View>
          </PressableAnimated>
        );
      })}
    </ScrollView>
  );
}
