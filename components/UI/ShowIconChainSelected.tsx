import React from "react";
import { View } from "react-native";
import { CHAIN_ICONS } from "../../configs/bcNetworks";
import { IChain } from "../../data/types";
import { tw } from "../../utils/tailwind";

export default function ShowIconChainSelected({ chain }: { chain: IChain }) {
  const Icon = CHAIN_ICONS[chain.network];

  return (
    <View>
      <View style={tw`rounded-full `}>
        <Icon height={24} width={24} />
      </View>
      {/* <TouchableOpacity onPress={() => setInVisible(!inVisible)}>
        {inVisible ? (
          <View style={tw`flex-row items-center justify-center mb-4`}>
            <EyeOffIcon fill={'gray'} width={30} height={30} />
          </View>
        ) : (
          <CurrencyFormat
            value={balance * +chain.price}
            style="text-center text-3xl mb-4  font-bold"
          />
        )}
      </TouchableOpacity>
      <View style={tw`flex-row justify-center w-full`}>
        <View
          style={tw`w-full flex-row items-center justify-center mb-4 h-17 w-17 rounded-full bg-white dark:bg-[#18191A]  shadow`}>
          <Icon height={50} width={50} />
        </View>
      </View>
      {!inVisible ? (
         <Text style={tw`mb-4 text-2xl font-bold text-center dark:text-white`}>
          {balance === 0 ? 0 : balance.toFixed(4)} {chain.symbol}
        </Text>
      ) : (
         <Text style={tw`mb-4 text-2xl font-bold text-center dark:text-white`}>
          ••••• {chain.symbol}
        </Text>
      )} */}
    </View>
  );
}
